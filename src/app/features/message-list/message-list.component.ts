import {Component, computed, effect, ElementRef, inject, input, signal, untracked, viewChild} from '@angular/core';
import {MessageService} from "../../core/services/message.service";
import {Message} from "../../core/models/message.models";
import {MessageComponent} from "../message/message.component";
import {BotService} from "../../core/services/bot.service";
import {MatIconModule} from "@angular/material/icon";
import {map, timer} from "rxjs";

@Component({
    selector: 'app-message-list',
    imports: [
        MessageComponent,
        MatIconModule,
    ],
    providers: [BotService],
    templateUrl: './message-list.component.html',
    styleUrl: './message-list.component.scss',
})
export class MessageListComponent {
    private messages = signal<Message[]>([]);
    private sendingMessage = signal<SendingMessage | undefined>(undefined);
    private placeholderMessage = signal<Message | undefined>(undefined);
    private placeholderSeq = computed(() => this.placeholderMessage()?.sequenceNumber)

    cancellable = computed(() => this.placeholderMessage() || this.sendingMessage()?.status === 'sending')

    private messagesArea = viewChild<ElementRef<HTMLElement>>('messagesArea');
    private isAtBottom = true;

    docId = input<string>();

    displayMessages = computed(() => {
        let messages = this.messages();
        const sending = this.sendingMessage();
        const reply = this.placeholderMessage();
        if (sending && sending.status === 'sending') {
            messages = messages.concat(sending);
        }
        if (reply) {
            messages = messages.concat(reply);
        }
        return messages;
    });

    loading = computed(() => this.loadingTrigger() && !this.end());
    private loadingTrigger = signal(false);
    private end = signal(false);
    message = signal('');

    private messageService = inject(MessageService);
    private botService = inject(BotService);

    constructor() {
        effect(() => {
            this.docId();
            untracked(() => {
                this.messages.set([]);
                this.sendingMessage.set(undefined);
                this.placeholderMessage.set(undefined);
                this.end.set(false);
                this.loadingTrigger.set(true);
            });
        });

        effect((onCleanup) => {
            if (this.loading()) {
                const snapshot = this.messages();
                const first = snapshot.at(0);
                const docId = this.docId();
                const sub = this.messageService.list(first, docId)
                    .pipe(map(messages => messages.reverse()))
                    .subscribe({
                        next: messages => {
                            this.messages.set(messages.concat(snapshot));
                            if (messages.length === 0) this.end.set(true)
                            if (snapshot.length === 0) this.scrollToBottom()
                        },
                        error: (err) => {
                            console.error(err)
                            this.loadingTrigger.set(false)
                            this.end.set(true)
                        },
                        complete: () => {
                            this.loadingTrigger.set(false);
                        },
                    });
                onCleanup(() => sub.unsubscribe());
            }
        });

        effect((onCleanup) => {
            const placeholderSeq = this.placeholderSeq();
            if (placeholderSeq) {
                const sub = this.botService.fill(placeholderSeq)
                    .subscribe({
                        next: (chunk) => {
                            const placeholder = this.placeholderMessage()!;
                            const aggregated = (placeholder?.content ?? '') + chunk;
                            this.placeholderMessage.set({...placeholder, content: aggregated});
                        },
                        complete: () => {
                            const reply = this.placeholderMessage()!

                            this.placeholderMessage.set(undefined);
                            this.prepend(reply)
                        },
                        error: (err) => {
                            console.error(err)
                        }
                    });
                onCleanup(() => sub.unsubscribe());
            }
        });

        effect(() => {
            const sending = this.sendingMessage();
            if (sending?.status === 'sending') {
                this.scrollToBottom()
            }
        });

        // Auto-scroll to bottom on new messages if already at bottom
        effect(() => {
            this.displayMessages(); // track
            if (this.isAtBottom) {
                this.scrollToBottom();
            }
        });

        effect((onCleanup) => {
            const sending = this.sendingMessage();
            if (sending?.status === 'sending') {
                const message = sending.content
                const docId = this.docId();
                const sub = this.messageService.send(message, docId)
                    .subscribe({
                        next: (res) => {
                            const sent = res.userMessage
                            this.prepend(sent)

                            this.sendingMessage.set(undefined);
                            this.placeholderMessage.set(res.placeHolderMessage)
                        },
                        error: (err) => {
                            console.error(err)
                            this.sendingMessage.set({...sending, status: 'error'});
                        },
                    });
                onCleanup(() => sub.unsubscribe())
            }
        });
    }

    private prepend(message: Message) {
        this.messages.update(messages => messages.concat([message]))
    }

    scrollToBottom() {
        timer(1).subscribe(() => {
            const el = this.messagesArea()?.nativeElement;
            if (el) el.scrollTop = el.scrollHeight;
        });
    }

    isSendingMessage(msg: Message): msg is SendingMessage {
        return 'status' in msg;
    }

    onMessagesScroll(event: Event) {
        const el = event.target as HTMLElement;
        const threshold = 40; // px from bottom
        this.isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
        if (el.scrollTop === 0) {
            this.onScrollChangeToFirstElement();
        }
    }

    onScrollChangeToFirstElement() {
        if (!this.loading()) {
            this.loadingTrigger.set(true);
        }
    }

    onRetryErrorMessage() {
        this.onSendClicked();
    }

    private doSend(message: string) {
        const sending: SendingMessage = {
            content: message,
            status: 'sending',
            createdAt: Date.now().toString(),
            mine: true,
            sequenceNumber: Number.MAX_SAFE_INTEGER,
        };
        this.sendingMessage.set(sending);
    }

    onSendClicked() {
        const message = this.message();
        const sending = this.sendingMessage();
        if (sending?.status !== 'sending') {
            this.doSend(message);
            this.message.set('');
        }
    }

    onCancelClicked() {
        const sending = this.sendingMessage();
        if (sending?.status === 'sending') {
            const canceled: Message = {
                sequenceNumber: Number.MAX_SAFE_INTEGER,
                content: sending.content,
                createdAt: Date.now().toString(),
                mine: true
            }
            this.prepend(canceled)

            this.sendingMessage.set(undefined)
        } else {
            const placeholder = this.placeholderMessage()
            if (placeholder) {
                const canceled: Message = {
                    sequenceNumber: Number.MAX_SAFE_INTEGER,
                    content: placeholder.content ?? '',
                    createdAt: Date.now().toString(),
                    mine: true
                }
                this.prepend(canceled)

                this.placeholderMessage.set(undefined)
            }
        }
    }
}

export interface SendingMessage extends Message {
    readonly status: 'sending' | 'error';
}

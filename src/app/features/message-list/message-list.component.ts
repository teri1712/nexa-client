import {Component, computed, effect, ElementRef, inject, OnInit, signal, viewChild} from '@angular/core';
import {MessageService} from "../../core/services/message.service";
import {Message} from "../../core/models/message.models";
import {MessageComponent} from "../message/message.component";
import {BotService} from "../../core/services/bot.service";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {timer} from "rxjs";

@Component({
    selector: 'app-message-list',
    imports: [
        MessageComponent,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        CdkTextareaAutosize,
    ],
    providers: [BotService],
    templateUrl: './message-list.component.html',
    styleUrl: './message-list.component.scss',
})
export class MessageListComponent implements OnInit {
    private messages = signal<Message[]>([]);
    private sendingMessage = signal<SendingMessage | undefined>(undefined);

    private placeholderMessage = signal<Message | undefined>(undefined);
    private replyMessage = signal<Message | undefined>(undefined);

    private messagesArea = viewChild<ElementRef>('messagesArea');

    displayMessages = computed(() => {
        let messages = this.messages();
        const sending = this.sendingMessage();
        const reply = this.replyMessage()
        if (sending && sending.status === 'sending') {
            messages = messages.concat(sending)
        }
        if (reply) {
            messages = messages.concat(reply)
        }
        return messages;
    })

    loading = signal(false);
    message = signal('')

    private messageService = inject(MessageService);
    private botService = inject(BotService);

    constructor() {
        effect((onCleanup) => {
            if (this.loading()) {
                const snapshot = this.messages();
                const first = snapshot.at(0);
                const sub = this.messageService.list(first)
                    .subscribe({
                        next: messages => {
                            this.messages.set(snapshot.concat(messages));
                        },
                        complete: () => {
                            this.loading.set(false);
                        },
                    })
                onCleanup(() => sub.unsubscribe())
            }
        })
        effect((onCleanup) => {
            const placeholder = this.placeholderMessage();
            if (placeholder) {
                const sub = this.botService.fill(placeholder)
                    .subscribe({
                        next: (message) => {
                            const aggregated = (this.replyMessage()?.content ?? '') + message
                            this.replyMessage.set({
                                content: aggregated,
                                createdAt: placeholder.createdAt,
                                mine: placeholder.mine,
                                sequenceNumber: placeholder.sequenceNumber
                            })
                        },
                        complete: () => {
                            this.placeholderMessage.set(undefined)
                        }
                    })
                onCleanup(() => sub.unsubscribe())
            }
        });

        effect(() => {
            // Auto-scroll to bottom when messages change
            const sending = this.sendingMessage();
            if (sending?.status === 'sending') {
                timer(200)
                    .subscribe({
                        next: value => {
                            const el = this.messagesArea()?.nativeElement;
                            if (el) el.scrollTop = el.scrollHeight;
                        }
                    })
            }
        });
    }

    ngOnInit() {
        this.loading.set(true);
    }

    isSendingMessage(msg: Message): msg is SendingMessage {
        return 'status' in msg;
    }

    onScrollChangeToFirstElement() {
        if (!this.loading()) {
            this.loading.set(true);
        }
    }

    onRetryErrorMessage() {
        this.onSendClicked()
    }

    private doSend(message: string) {
        const sending: SendingMessage = {
            content: message,
            status: 'sending',
            createdAt: Date.now().toString(),
            mine: true,
            sequenceNumber: Number.MAX_SAFE_INTEGER
        }
        this.sendingMessage.set(sending);
        this.messageService.send(message).subscribe({
            next: (res) => {
                this.messages.update(messages =>
                    messages.concat([res.userMessage]));
                this.sendingMessage.set({
                    ...sending,
                    status: "sent"
                });
                this.placeholderMessage.set(res.placeholderMessage)
            },
            error: () => {
                this.sendingMessage.set({
                    ...sending,
                    status: "error"
                })
            }
        })
    }

    onSendClicked() {
        const message = this.message();
        const sending = this.sendingMessage()
        if (message && sending?.status !== 'sending') {
            this.doSend(message);
            this.message.set('');
        }
    }
}

export interface SendingMessage extends Message {
    readonly status: 'sending' | 'error' | 'sent';
}

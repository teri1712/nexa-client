import {Component, inject, input, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {rxResource} from '@angular/core/rxjs-interop';
import {of} from "rxjs";
import {DocService} from '../../../core/services/doc.service';
import {FileService} from '../../../core/services/file.service';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {DatePipe} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {BotBubbleComponent} from "../../agent-bubble/bot-bubble.component";
import {MatSidenavModule} from "@angular/material/sidenav";
import {RouterOutlet} from "@angular/router";

@Component({
    selector: 'app-document',
    standalone: true,
    imports: [MatCardModule, MatChipsModule, DatePipe, MatButtonModule, RouterLink, MatProgressSpinner, MatIconModule, MatDividerModule, BotBubbleComponent, MatSidenavModule, RouterOutlet],
    templateUrl: './document.component.html',
    styleUrl: './document.component.scss',
})
export class DocumentComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly docService = inject(DocService);
    private readonly fileService = inject(FileService);

    docId = input<string>();
    downloading = signal(false);
    protected readonly chatOpen = signal(false);

    doc = rxResource({
        params: () => ({id: this.docId()}),
        stream: (request) => {
            const id = request.params.id;
            if (!id) return of(undefined);
            return this.docService.find(id);
        },
    });

    onDownload() {
        const d = this.doc.value();
        if (!d?.fileKey || this.downloading()) return;
        this.downloading.set(true);
        this.fileService.download(d.fileKey).subscribe({
            next: (res) => {
                console.log(res)
                window.open(res.presignedDownloadUrl, '_blank');
            },
            error: (err) => console.error(err),
            complete: () => this.downloading.set(false),
        });
    }
}

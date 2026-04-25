import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {rxResource} from '@angular/core/rxjs-interop';
import {DocService} from '../../../core/services/doc.service';
import {FileService} from '../../../core/services/file.service';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {DatePipe} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';

@Component({
    selector: 'app-document',
    standalone: true,
    imports: [MatCardModule, MatChipsModule, DatePipe, MatButtonModule, RouterLink, MatProgressSpinner, MatIconModule, MatDividerModule],
    templateUrl: './document.component.html',
    styleUrl: './document.component.scss',
})
export class DocumentComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly docService = inject(DocService);
    private readonly fileService = inject(FileService);

    readonly id = signal<string>('');
    downloading = signal(false);

    doc = rxResource({
        params: () => ({id: this.id()}),
        stream: (request) => this.docService.find(request.params.id),
    });

    constructor() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) this.id.set(id);
        });
    }

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

import {Component, effect, inject, OnInit, signal, untracked} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {IndexKnowledgeService} from '../../../core/services/index-knowledge.service';
import {IndexLogResponse, LogStatus, Page} from '../../../core/models/index-knowledge.models';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {catchError, interval, of, startWith} from 'rxjs';
import {rxResource, toSignal} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-knowledge-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatTableModule,
        MatIconModule,
        MatProgressSpinnerModule,
        DatePipe
    ],
    templateUrl: './knowledge-dashboard.component.html',
    styleUrl: './knowledge-dashboard.component.scss'
})
export class KnowledgeDashboardComponent implements OnInit {
    private indexService = inject(IndexKnowledgeService);

    protected logs = signal<Page<IndexLogResponse> | null>(null);
    protected currentPage = signal(0);
    protected isLoading = signal(false);
    protected isTriggering = signal(false);
    private timer = toSignal(interval(2000).pipe(startWith(0)), {initialValue: 0});

    protected todayLogResource = rxResource({
        params: () => ({
            timer: this.timer(),
            isTriggering: this.isTriggering()
        }),
        stream: () => {
            const today = new Date().toLocaleDateString('en-CA');
            return this.indexService.getIndexLogByDate(today).pipe(
                catchError(() => of(null))
            );
        }
    });

    protected todayLog = signal<IndexLogResponse | null>(null);

    protected readonly LogStatus = LogStatus;
    protected displayedColumns: string[] = ['date', 'status', 'message'];

    constructor() {
        effect(() => {
            const log = this.todayLogResource.value()
            if (log) {
                untracked(() => {
                    this.todayLog.set(log)
                })
            }
        });
    }

    ngOnInit() {
        this.loadLogs(this.currentPage());
    }

    loadLogs(page: number) {
        this.isLoading.set(true);
        this.indexService.getIndexLogs(page).subscribe({
            next: (data) => {
                this.logs.set(data);
                this.currentPage.set(page);
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });
    }

    triggerIndexing() {
        this.isTriggering.set(true);
        this.indexService.triggerIndexing().subscribe({
            next: () => {
                this.isTriggering.set(false);
                if (this.currentPage() === 0) {
                    this.loadLogs(0);
                }
            },
            error: () => this.isTriggering.set(false)
        });
    }

    getPages(): number[] {
        const totalPages = this.logs()?.totalPages || 0;
        return Array.from({length: totalPages}, (_, i) => i);
    }
}

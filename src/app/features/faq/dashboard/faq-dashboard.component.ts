import {Component, effect, inject, OnInit, signal, untracked} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FaqService} from '../../../core/services/faq.service';
import {ClusterLogResponse, LogStatus, Page} from '../../../core/models/faq.models';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {catchError, interval, of, startWith} from 'rxjs';
import {rxResource, toSignal} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-faq-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatTableModule,
        MatIconModule,
        MatProgressSpinnerModule,
        DatePipe
    ],
    templateUrl: './faq-dashboard.component.html',
    styleUrl: './faq-dashboard.component.scss'
})
export class FaqDashboardComponent implements OnInit {
    private faqService = inject(FaqService);

    protected logs = signal<Page<ClusterLogResponse> | null>(null);
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
            return this.faqService.getClusterLogByDate(today).pipe(
                catchError(() => of(null))
            );
        }
    });

    protected todayLog = signal<ClusterLogResponse | null>(null);

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
        this.faqService.getClusterLogs(page).subscribe({
            next: (data) => {
                this.logs.set(data);
                this.currentPage.set(page);
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });
    }

    triggerCluster() {
        this.isTriggering.set(true);
        this.faqService.triggerCluster().subscribe({
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

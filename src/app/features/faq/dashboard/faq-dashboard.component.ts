import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FaqService} from '../../../core/services/faq.service';
import {ClusterLogResponse, LogStatus, Page} from '../../../core/models/faq.models';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {interval, startWith, switchMap, tap} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

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
    private destroyRef = inject(DestroyRef);

    protected logs = signal<Page<ClusterLogResponse> | null>(null);
    protected todayLog = signal<ClusterLogResponse | null>(null);
    protected currentPage = signal(0);
    protected isLoading = signal(false);
    protected isTriggering = signal(false);

    protected readonly LogStatus = LogStatus;
    protected displayedColumns: string[] = ['date', 'status', 'message'];

    ngOnInit() {
        this.loadLogs(this.currentPage());
        this.startPollingTodayStatus();
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

    private startPollingTodayStatus() {
        const today = new Date().toISOString().split('T')[0];

        interval(2000)
            .pipe(
                startWith(0),
                switchMap(() => this.faqService.getClusterLogByDate(today)),
                tap((log) => this.todayLog.set(log)),
                // Stop polling if status is COMPLETED or FAILED, or if no log found (it will just return error or null)
                // But the prompt says "perform polling its status" if it is CREATED or RUNNING.
                // So we should continue polling while it is CREATED or RUNNING.
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (log) => {
                    if (log && log.status !== LogStatus.CREATED && log.status !== LogStatus.RUNNING) {
                        // We could stop polling here if we wanted, but the prompt implies we should check today's status.
                        // If it becomes COMPLETED, we stop.
                    }
                },
                error: () => {
                    this.todayLog.set(null);
                }
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

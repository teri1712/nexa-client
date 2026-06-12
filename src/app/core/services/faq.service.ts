import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ClusterLogResponse, FaqResponse, Page } from '../models/faq.models';

@Injectable({
  providedIn: 'root',
})
export class FaqService {
  private http = inject(HttpClient);

  getFaqs() {
    return this.http.get<FaqResponse[]>(`${environment.apiUrl}/faqs`);
  }

  getClusterLogs(page: number = 0, size: number = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'date,desc');
    return this.http.get<Page<ClusterLogResponse>>(`${environment.apiUrl}/cluster-logs`, { params });
  }

  getClusterLogByDate(date: string) {
    return this.http.get<ClusterLogResponse>(`${environment.apiUrl}/cluster-logs/${date}`);
  }

  triggerCluster() {
    // The trigger endpoint returns SSE, but we can just post to it to start the process.
    // We'll use polling for status updates as requested.
    return this.http.post(`${environment.apiUrl}/cluster-logs/trigger`, {}, { responseType: 'text' });
  }
}

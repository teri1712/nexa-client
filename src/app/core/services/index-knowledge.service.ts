import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IndexLogResponse, Page } from '../models/index-knowledge.models';

@Injectable({
  providedIn: 'root',
})
export class IndexKnowledgeService {
  private http = inject(HttpClient);

  getIndexLogs(page: number = 0, size: number = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'date,desc');
    return this.http.get<Page<IndexLogResponse>>(`${environment.apiUrl}/index-logs`, { params });
  }

  getIndexLogByDate(date: string) {
    return this.http.get<IndexLogResponse>(`${environment.apiUrl}/index-logs/${date}`);
  }

  triggerIndexing() {
    return this.http.post(`${environment.apiUrl}/index-logs/trigger`, {}, { 
      observe: 'response',
      responseType: 'text' 
    });
  }
}

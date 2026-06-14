import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FaqResponse } from '../models/faq.models';

@Injectable({
  providedIn: 'root',
})
export class FaqService {
  private http = inject(HttpClient);

  getFaqs() {
    return this.http.get<FaqResponse[]>(`${environment.apiUrl}/faqs`);
  }
}

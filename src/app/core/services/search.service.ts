import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DocFilter, DocPage} from '../models/doc.models';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SearchService {

  http = inject(HttpClient);

  search(query: string, filter: DocFilter): Observable<DocPage> {
    let params = new HttpParams();

    if (filter.start) params = params.set('start', filter.start.toISOString());
    if (filter.end) params = params.set('end', filter.end.toISOString());
    if (filter.last) params = params.set('lastDocId', filter.last.id);
    if (filter.last) params = params.set('lastDocScore', filter.last.score);
    params = params.set('type', filter.type);
    params = params.set('query', query);
    return this.http.get<DocPage>(environment.apiUrl + `/docs`, {params});
  }
}

import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root',
})
export class SuggestService {
    private httpClient = inject(HttpClient);

    suggest(ask: string): Observable<string> {
        return this.httpClient.post<string>(environment.apiUrl + '/knowledge/ask?query=' + encodeURIComponent(ask), {}, {
            observe: 'body'
        })
    }
}

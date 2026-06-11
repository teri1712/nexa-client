import {inject, Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root',
})
export class SuggestService {
    private httpClient = inject(HttpClient);

    suggest(ask: string): Observable<string> {
        return this.httpClient.post(environment.apiUrl + '/knowledge/ask?query=' + encodeURIComponent(ask), {}, {
            responseType: 'text'
        }).pipe(
            map(res => {
                try {
                    // Try to parse if it's a JSON string (e.g. "quoted string")
                    return JSON.parse(res);
                } catch {
                    // Otherwise return as is
                    return res;
                }
            })
        )
    }
}

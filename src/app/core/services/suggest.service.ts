import {inject, Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ITokenStore} from '../models/token-store.interface';

@Injectable({
  providedIn: 'root',
})
export class SuggestService {
  http = inject(HttpClient);
  tokenStore = inject(ITokenStore);

  suggest(ask: string): Observable<string> {
    const subject = new Subject<string>();
    const token = this.tokenStore.getAccessToken();
    const body = new URLSearchParams({
      query: ask,
    });
    fetch(environment.apiUrl + '/docs/suggest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    }).then(async res => {
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const {done, value} = await reader.read();
        if (done) {
          subject.complete();
          break;
        }

        const chunk = decoder.decode(value);
        subject.next(chunk);
      }
    })
      .catch(err => {
        console.error(err);
        subject.complete()
      });
    return subject.asObservable();
  }
}

import {inject, Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {environment} from "../../../environments/environment";
import {ITokenStore} from "../models/token-store.interface";

@Injectable()
export class BotService {
    private tokenStore = inject(ITokenStore);

    fill(placeholderSeq: number) {
        const subject = new Subject<string>();
        const token = this.tokenStore.getAccessToken();
        const body = new URLSearchParams({placeholderSequence: placeholderSeq.toString()});

        fetch(environment.apiUrl + '/bot/fill', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body.toString()
        }).then(async res => {
            // If body is not a ReadableStream (e.g. Cypress mock), fallback to res.text()
            if (!res.body || typeof res.body.getReader !== 'function') {
                const text = await res.text();
                subject.next(text);
                subject.complete();
                return;
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            while (true) {
                const {done, value} = await reader.read();
                if (done) {
                    break
                }
                const chunk = decoder.decode(value, {stream: true});
                subject.next(chunk);
            }
            subject.complete();
        }).catch(err => {
            console.error(err);
            subject.error(err);
            subject.complete();
        });

        return subject.asObservable();
    }
}

import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Message} from "../models/message.models";
import {environment} from "../../../environments/environment";


export interface MessageAccepted {
    userMessage: Message;
    placeHolderMessage: Message;
}

@Injectable()
export class MessageService {
    private readonly http = inject(HttpClient);

    send(message: string, docId?: string) {
        let params = new HttpParams().set('message', message);
        if (docId) params = params.set('docId', docId);
        return this.http.post<MessageAccepted>(environment.apiUrl + `/messages`, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }

    list(anchor?: Message, docId?: string) {
        let params = new HttpParams().set('anchorSeq', anchor?.sequenceNumber ?? Number.MAX_SAFE_INTEGER);
        if (docId) params = params.set('docId', docId);
        return this.http.get<Message[]>(environment.apiUrl + `/messages`, {params});
    }
}

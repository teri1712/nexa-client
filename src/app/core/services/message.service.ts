import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Message} from "../models/message.models";


export interface MessageAccepted {
      userMessage: Message;
      placeholderMessage: Message;
}

@Injectable()
export class MessageService {
      private readonly http = inject(HttpClient);

      send(message: string) {
            return this.http.post<MessageAccepted>(`/messages`, {message: message});
      }

      list(anchor?: Message) {
            return this.http.get<Message[]>(`/messages?anchorSeq=${anchor?.sequenceNumber}`);
      }
}

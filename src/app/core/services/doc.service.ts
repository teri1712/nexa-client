import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Doc, DocType} from '../models/doc.models';
import {Observable} from 'rxjs';
import {environment} from "../../../environments/environment";

export interface CreateDocumentRequest {
      filename: string;
      eTag: string;
      fileKey: string;
      title: string;
      description: string;
      type: DocType;
}

@Injectable()
export class DocService {
      http = inject(HttpClient);

      add(data: CreateDocumentRequest) {
            return this.http.post(environment.apiUrl + '/docs', data);
      }

      find(id: string): Observable<Doc> {
            return this.http.get<Doc>(environment.apiUrl + `/docs/${id}`);
      }
}

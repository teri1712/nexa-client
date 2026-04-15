import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Doc, DocType} from '../models/doc.models';
import {Observable} from 'rxjs';

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
    return this.http.post('/docs', data);
  }

  find(id: string): Observable<Doc> {
    return this.http.get<Doc>(`/docs/${id}`);
  }
}

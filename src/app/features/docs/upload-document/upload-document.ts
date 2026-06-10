import {Component} from '@angular/core';
import {AddDocument} from '../add-document/add-document';

@Component({
      selector: 'app-upload-document',
      imports: [AddDocument],
      templateUrl: './upload-document.html',
      styleUrl: './upload-document.scss',
})
export class UploadDocument {
}

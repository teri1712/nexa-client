import {Component} from '@angular/core';
import {DocService} from "../../../core/services/doc.service";
import {UploadService} from "../../../core/services/upload.service";
import {RouterOutlet} from "@angular/router";

@Component({
      selector: 'app-dashboard',
      imports: [
            RouterOutlet
      ],
      providers: [DocService, UploadService],
      templateUrl: './doc-dashboard.component.html',
      styleUrl: './doc-dashboard.component.scss',
})
export class DocDashboardComponent {
}

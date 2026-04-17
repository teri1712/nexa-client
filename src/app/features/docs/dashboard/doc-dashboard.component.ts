import {Component} from '@angular/core';
import {DocService} from "../../../core/services/doc.service";
import {FileService} from "../../../core/services/file.service";
import {RouterOutlet} from "@angular/router";

@Component({
      selector: 'app-dashboard',
      imports: [
            RouterOutlet
      ],
      providers: [DocService, FileService],
      templateUrl: './doc-dashboard.component.html',
      styleUrl: './doc-dashboard.component.scss',
})
export class DocDashboardComponent {
}

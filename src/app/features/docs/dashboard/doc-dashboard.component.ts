import {Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
      selector: 'app-dashboard',
      imports: [
            RouterOutlet
      ],
      templateUrl: './doc-dashboard.component.html',
      styleUrl: './doc-dashboard.component.scss',
})
export class DocDashboardComponent {
}

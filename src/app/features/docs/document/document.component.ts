import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {rxResource} from '@angular/core/rxjs-interop';
import {DocService} from '../../../core/services/doc.service';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {DatePipe} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-document',
  imports: [MatCardModule, MatChipsModule, DatePipe, MatButtonModule, RouterLink],
  templateUrl: './document.component.html',
  styleUrl: './document.component.scss',
})
export class DocumentComponent {
  route = inject(ActivatedRoute)
  docService = inject(DocService)

  id = signal<string>('')
  doc = rxResource(
    {
      params: () => ({id: this.id()}),
      stream: (request) => {
        const id = request.params.id
        return this.docService.find(id)
      }
    }
  )

  constructor() {
    this.route.paramMap.subscribe(params => {
        const id = params.get('id')
        if (id) this.id.set(id)
      }
    )
  }
}

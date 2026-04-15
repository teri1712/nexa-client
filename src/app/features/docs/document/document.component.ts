import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {rxResource} from '@angular/core/rxjs-interop';
import {DocService} from '../../../core/services/doc.service';

@Component({
  selector: 'app-document',
  imports: [],
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

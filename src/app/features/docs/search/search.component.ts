import {Component, computed, inject, OnInit, signal, untracked} from '@angular/core';
import {DocItem, DocType} from '../../../core/models/doc.models';
import {SearchService} from '../../../core/services/search.service';
import {SuggestService} from '../../../core/services/suggest.service';
import {rxResource} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {

  queryString = signal<string>('')

  private pageIndex = signal<DocItem | undefined>(undefined)
  private query = signal<string>('')
  type = signal<DocType>(DocType.PDF)
  start = signal<Date>(new Date(2026, 0, 1))
  end = signal<Date>(new Date())

  searchService = inject(SearchService)
  results = rxResource(
    {
      params: () => ({
        query: this.query(),
        start: untracked(this.start),
        end: untracked(this.end),
        type: untracked(this.type),
        last: this.pageIndex(),
      }),
      stream: (request) => {
        const params = request.params
        const query = params.query

        return this.searchService.search(query, {
          start: params.start,
          end: params.end,
          type: params.type,
          last: params.last,
        })
      }
    }
  )

  totalPages = computed(() => {
    return this.results.value()?.totalPages
  })

  suggestions = rxResource(
    {
      params: () => ({
        query: this.query()
      }),
      stream: (request) => {
        const params = request.params
        return this.suggestService.suggest(params.query)
      }
    }
  )

  suggestService = inject(SuggestService)

  constructor() {
  }

  ngOnInit(): void {
  }


  onQueryChange(query: string) {
    this.queryString.set(query)
  }

  onQueryButtonClick() {
    this.query.set(this.queryString())
  }

  onNextPage() {
    const docPage = this.results.value()
    if (docPage) {
      this.pageIndex.set(docPage.docs.at(-1))
    }
  }
}

import {Component, inject, signal, untracked} from '@angular/core';
import {DocItem, DocType} from '../../../core/models/doc.models';
import {SearchService} from '../../../core/services/search.service';
import {SuggestService} from '../../../core/services/suggest.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {DatePipe} from '@angular/common';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatListModule} from '@angular/material/list';
import {MatRippleModule} from '@angular/material/core';

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [
        FormsModule, ReactiveFormsModule, RouterLink,
        MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule,
        MatCardModule, MatIconModule, MatChipsModule, DatePipe,
        MatProgressBarModule, MatListModule, MatRippleModule,
    ],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
})
export class SearchComponent {

    queryString = new FormControl('', Validators.required);

    private readonly pageIndex = signal<DocItem | undefined>(undefined);
    private readonly query = signal<string>('');
    type = signal<DocType>(DocType.PDF);
    start = signal<Date>(new Date(2026, 0, 1));
    end = signal<Date>(new Date());

    searchService = inject(SearchService);
    results = rxResource({
        params: () => {
            const query = this.query();
            if (query)
                return ({
                    query: this.query(),
                    start: untracked(this.start),
                    end: untracked(this.end),
                    type: untracked(this.type),
                    last: this.pageIndex(),
                })
            return undefined
        },
        stream: (request) => {
            const params = request.params;
            return this.searchService.search(params.query, {
                start: params.start,
                end: params.end,
                type: params.type,
                last: params.last,
            });
        },
    });

    suggestService = inject(SuggestService);
    suggestions = rxResource({
        params: () => {
            const q = this.query();
            return q ? {query: q} : undefined;
        },
        stream: (request) => this.suggestService.suggest(request.params.query),
    });

    onQueryButtonClick() {
        if (this.queryString.invalid) {
            this.queryString.markAsTouched();
            return;
        }
        this.query.set(this.queryString.value ?? '');
    }

    onNextPage() {
        const docPage = this.results.value();
        if (docPage) {
            this.pageIndex.set(docPage.docs.at(-1));
        }
    }

    protected readonly window = window;
}

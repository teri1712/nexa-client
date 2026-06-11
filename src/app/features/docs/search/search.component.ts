import {Component, computed, inject, signal} from '@angular/core';
import {DocItem, DocType} from '../../../core/models/doc.models';
import {SearchService} from '../../../core/services/search.service';
import {SuggestService} from '../../../core/services/suggest.service';
import {FaqService} from '../../../core/services/faq.service';
import {rxResource, toObservable, toSignal} from '@angular/core/rxjs-interop';
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
import {IProfileStore} from '../../../core/models/token-store.interface';
import {catchError, map, of, startWith, switchMap} from "rxjs";
import {parseSuggestion} from "./suggestion-parser";

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatCardModule,
        MatIconModule,
        MatChipsModule,
        DatePipe,
        MatProgressBarModule,
        MatListModule,
        MatRippleModule,
    ],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
})
export class SearchComponent {
    queryString = new FormControl('', Validators.required);

    private readonly pageIndex = signal<DocItem | undefined>(undefined);
    query = signal<string>('');
    type = signal<DocType>(DocType.PDF);
    start = signal<Date>(new Date(2024, 0, 1));
    end = signal<Date>(new Date());

    searchService = inject(SearchService);

    private resultsState = toSignal(
        toObservable(computed(() => {
            const q = this.query();
            if (!q) return null;
            return {
                query: q,
                type: this.type(),
                start: this.start(),
                end: this.end(),
                last: this.pageIndex()
            };
        })).pipe(
            switchMap(params => {
                if (!params) return of({value: undefined, isLoading: false, error: null});
                return this.searchService.search(params.query, params).pipe(
                    map(value => ({value, isLoading: false, error: null})),
                    startWith({value: undefined, isLoading: true, error: null}),
                    catchError(error => {
                        return of({value: undefined, isLoading: false, error});
                    })
                );
            })
        ),
        {initialValue: {value: undefined, isLoading: false, error: null}}
    );

    results = {
        value: () => this.resultsState().value,
        isLoading: () => this.resultsState().isLoading,
        error: () => this.resultsState().error
    };

    suggestService = inject(SuggestService);

    private suggestionsState = toSignal(
        toObservable(computed(() => this.query())).pipe(
            switchMap(q => {
                if (!q) return of({value: undefined, isLoading: false, error: null});
                return this.suggestService.suggest(q).pipe(
                    map(value => ({value, isLoading: false, error: null})),
                    startWith({value: undefined, isLoading: true, error: null}),
                    catchError(error => {
                        return of({value: undefined, isLoading: false, error});
                    })
                );
            })
        ),
        {initialValue: {value: undefined, isLoading: false, error: null}}
    );

    suggestions = {
        value: () => this.suggestionsState().value,
        isLoading: () => this.suggestionsState().isLoading,
        error: () => this.suggestionsState().error
    };

    formattedSuggestion = computed(() => {
        const val = this.suggestions.value();
        return val ? parseSuggestion(val) : [];
    });

    faqService = inject(FaqService);
    protected readonly profileStore = inject(IProfileStore);
    faqs = rxResource({
        stream: () => this.faqService.getFaqs(),
    });

    onQueryButtonClick() {
        if (this.queryString.invalid) {
            this.queryString.markAsTouched();
            return;
        }
        this.pageIndex.set(undefined);
        this.query.set(this.queryString.value ?? '');
    }

    onNextPage() {
        const docPage = this.results.value();
        if (docPage) {
            this.pageIndex.set(docPage.docs.at(-1));
        }
    }

    onFaqClick(question: string) {
        this.queryString.setValue(question);
        this.onQueryButtonClick();
    }


    protected readonly window = window;
}

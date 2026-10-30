import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TuiTable } from '@taiga-ui/addon-table/components/table';
import { TuiPagination } from '@taiga-ui/kit';
import { RouterLink } from '@angular/router';
import { CountryApiService } from '../../../features/country/services/country.api.service';
import { TuiLoader, TuiIcon } from '@taiga-ui/core';
import { LanguageService } from '../../../core/services/language';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';


@Component({
  selector: 'app-countries',
  imports: [TuiTable, TuiPagination, TuiIcon, RouterLink, TuiLoader, TranslatePipe],
  templateUrl: './countries.html',
  styleUrl: './countries.scss',
})
export class Countries {
  protected columns: string[] = ['wikiDataId', 'actions', 'name', 'code', 'currencyCodes'];

  private countryApi = inject(CountryApiService);

  private search = signal('');

  protected pageSize = signal(10);
  protected pageIndex = signal(0);
  protected languageService = inject(LanguageService);

  protected countriesResource = rxResource({
    params: () => ({
      limit: this.pageSize(),
      offset: this.pageIndex() * this.pageSize(),
      namePrefix: this.search() || undefined,
      sort: this.sortKey()
        ? this.sortDirection() === 'desc'
          ? `-${this.sortKey()}`
          : this.sortKey()!
        : undefined,
      languageCode: this.languageService.current(),
    }),
    stream: ({ params }) => this.countryApi.getCountries(params),
  });

  protected countries = signal<NonNullable<ReturnType<typeof this.getInitialCountries>>>([]);

  protected totalCount = signal(0);

  constructor() {
    effect(() => {
      const response = this.countriesResource.value();

      if (response) {
        this.countries.set(response.data);
        this.totalCount.set(response.metadata.totalCount);
      }
    });
  }

  private getInitialCountries() {
    return this.countriesResource.value()?.data;
  }

  protected totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalCount() / this.pageSize())),
  );

  protected applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.search.set(value);
    this.pageIndex.set(0);
  }

  protected onPageIndexChange(index: number) {
    this.pageIndex.set(index);
  }

  protected sortKey = signal<string | null>(null);
  protected sortDirection = signal<'asc' | 'desc'>('asc');
  protected toggleSort(key: string) {
    if (this.sortKey() === key) {
      this.sortDirection.update((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortKey.set(key);
      this.sortDirection.set('asc');
    }
    this.pageIndex.set(0);
  }
}

import { Component, computed, inject, signal, effect } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { TuiTable } from '@taiga-ui/addon-table/components/table';
import { TuiPagination } from '@taiga-ui/kit';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { TuiLoader, TuiIcon, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { CityApiService } from '../services/city.api.service';
import { CountryApiService } from '../../../features/country/services/country.api.service';
import { CityViewDialog } from '../../../pages/cities/components/city-view-dialog/city-view-dialog';
import { CityEditDialog } from '../../../pages/cities/components/city-edit-dialog/city-edit-dialog';
import { City } from '../../../pages/cities/models/city.model';
import { LanguageService } from '../../../core/services/language';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-cities',
  imports: [TuiTable, TuiPagination, TuiIcon, TuiLoader,TranslatePipe],
  templateUrl: './cities.html',
  styleUrl: './cities.scss',
})
export class Cities {
  protected columns: string[] = ['country', 'name', 'region', 'population', 'actions'];

  private route = inject(ActivatedRoute);
  private cityApi = inject(CityApiService);
  private countryApi = inject(CountryApiService);
  private dialogs = inject(TuiDialogService);
  protected languageService = inject(LanguageService);

  private initialCountryFromUrl = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('country'))),
    { initialValue: null },
  );

  private search = signal('');
  protected countryFilter = signal('');

  protected pageSize = signal(10);
  protected pageIndex = signal(0);

  protected sortKey = signal<string | null>(null);
  protected sortDirection = signal<'asc' | 'desc'>('asc');

  protected regionSortDirection = signal<'asc' | 'desc'>('asc');
  protected regionSortActive = signal(false);

  protected cities = signal<City[]>([]);
  protected totalCount = signal(0);

  protected totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalCount() / this.pageSize())),
  );

  constructor() {
    effect(() => {
      const fromUrl = this.initialCountryFromUrl();

      this.countryFilter.set(fromUrl ?? '');
      this.pageIndex.set(0);
    });

    effect(() => {
      const response = this.citiesResource.value();

      if (response) {
        this.cities.set(response.data);
        this.totalCount.set(response.metadata.totalCount);
      }
    });
  }

  protected citiesResource = rxResource({
    params: () => ({
      limit: this.pageSize(),
      offset: this.pageIndex() * this.pageSize(),
      namePrefix: this.search() || undefined,
      countryIds: this.countryFilter() || undefined,

      sort: this.sortKey()
        ? this.sortDirection() === 'desc'
          ? `-${this.sortKey()}`
          : this.sortKey()!
        : undefined,
      languageCode: this.languageService.current(),
    }),

    stream: ({ params }) => this.cityApi.getCities(params),
  });

  protected countriesForFilter = rxResource({
    params: () => this.languageService.current(),
    stream: ({ params }) => this.countryApi.getAllCountries(params),
  });

  protected applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.search.set(value);
    this.pageIndex.set(0);
  }

  protected onCountryFilterChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    this.countryFilter.set(value);
    this.pageIndex.set(0);
  }

  protected onPageIndexChange(index: number) {
    this.pageIndex.set(index);
  }

  protected toggleRegionSort() {
    this.regionSortActive.set(true);

    this.regionSortDirection.update((direction) => (direction === 'asc' ? 'desc' : 'asc'));

    this.cities.update((cities) =>
      [...cities].sort((a, b) => {
        const regionA = a.region?.toLowerCase() ?? '';
        const regionB = b.region?.toLowerCase() ?? '';

        const result = regionA.localeCompare(regionB);

        return this.regionSortDirection() === 'asc' ? result : -result;
      }),
    );
  }

  protected toggleSort(key: string) {
    const allowedSortFields = ['name', 'population', 'countryCode'];

    if (!allowedSortFields.includes(key)) {
      return;
    }

    if (this.sortKey() === key) {
      this.sortDirection.update((direction) => (direction === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortKey.set(key);
      this.sortDirection.set('asc');
    }

    this.pageIndex.set(0);
  }

  protected openView(city: City) {
    this.dialogs
      .open(new PolymorpheusComponent(CityViewDialog), {
        data: city,
        dismissible: true,
      })
      .subscribe();
  }

  protected openEdit(city: City) {
    this.dialogs
      .open<City | null>(new PolymorpheusComponent(CityEditDialog), {
        data: city,
        dismissible: true,
      })
      .subscribe((result) => {
        if (result) {
          this.cities.update((list) =>
            list.map((cityItem) => (cityItem.id === result.id ? result : cityItem)),
          );
        }
      });
  }
}

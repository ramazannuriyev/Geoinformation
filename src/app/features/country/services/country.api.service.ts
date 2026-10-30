import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/constants/api';
import { PagedResponse } from '../../../core/models/paged-response.model';
import { Country } from '../models/country.model';
import { forkJoin, map, switchMap } from 'rxjs';

export interface CountryQuery {
  limit: number;
  offset: number;
  namePrefix?: string;
  sort?: string;
}

@Injectable({ providedIn: 'root' })
export class CountryApiService {
  private http = inject(HttpClient);

  getCountries(
    query: CountryQuery & { languageCode?: string },
  ): Observable<PagedResponse<Country>> {
    let params = new HttpParams().set('limit', query.limit).set('offset', query.offset);
    if (query.namePrefix) {
      params = params.set('namePrefix', query.namePrefix);
    }
    if (query.sort) {
      params = params.set('sort', query.sort);
    }
    if (query.languageCode) {
      params = params.set('languageCode', query.languageCode);
    }
    return this.http.get<PagedResponse<Country>>(`${API_BASE_URL}/countries`, { params });
  }

  getAllCountries(languageCode?: string): Observable<Country[]> {
    const base = new HttpParams().set('limit', 10).set('offset', 0).set('sort', 'name');
    const firstParams = languageCode ? base.set('languageCode', languageCode) : base;

    return this.http
      .get<PagedResponse<Country>>(`${API_BASE_URL}/countries`, { params: firstParams })
      .pipe(
        switchMap((first) => {
          const total = first.metadata.totalCount;
          const remainingOffsets: number[] = [];
          for (let offset = 10; offset < total; offset += 10) {
            remainingOffsets.push(offset);
          }

          const remainingRequests = remainingOffsets.map((offset) => {
            let params = new HttpParams()
              .set('limit', 10)
              .set('offset', offset)
              .set('sort', 'name');
            if (languageCode) {
              params = params.set('languageCode', languageCode);
            }
            return this.http.get<PagedResponse<Country>>(`${API_BASE_URL}/countries`, { params });
          });

          if (remainingRequests.length === 0) {
            return new Observable<Country[]>((subscriber) => {
              subscriber.next(first.data);
              subscriber.complete();
            });
          }

          return forkJoin(remainingRequests).pipe(
            map((pages) => [...first.data, ...pages.flatMap((page) => page.data)]),
          );
        }),
      );
  }
}

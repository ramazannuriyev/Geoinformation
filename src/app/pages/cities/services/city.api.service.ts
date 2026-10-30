import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/constants/api';
import { PagedResponse } from '../../../core/models/paged-response.model';
import { City } from '../models/city.model';

export interface CityQuery {
  limit: number;
  offset: number;
  namePrefix?: string;
  countryIds?: string;
  sort?: string;
   languageCode?: string;
}

@Injectable({ providedIn: 'root' })
export class CityApiService {
  private http = inject(HttpClient);

 getCities(query: CityQuery): Observable<PagedResponse<City>> {
  let params = new HttpParams().set('limit', query.limit).set('offset', query.offset);
  if (query.namePrefix) {
    params = params.set('namePrefix', query.namePrefix);
  }
  if (query.countryIds) {
    params = params.set('countryIds', query.countryIds);
  }
  if (query.sort) {
    params = params.set('sort', query.sort);
  }
  if (query.languageCode) {
    params = params.set('languageCode', query.languageCode);
  }
  return this.http.get<PagedResponse<City>>(`${API_BASE_URL}/cities`, { params });
}
}
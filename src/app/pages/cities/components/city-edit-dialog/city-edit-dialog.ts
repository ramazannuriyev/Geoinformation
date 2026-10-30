import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { TuiDay } from '@taiga-ui/cdk';
import { TuiDialogContext, TuiTextfield, TuiCalendar } from '@taiga-ui/core';
import { TuiInputDate } from '@taiga-ui/kit';
import { TuiDropdown,TuiIcon } from '@taiga-ui/core';

import { LanguageService } from '../../../../core/services/language';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import { City } from '../../models/city.model';

function inRange(min: number, max: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === '' || value === undefined) {
      return null;
    }

    return value < min || value > max ? { outOfRange: { min, max } } : null;
  };
}

@Component({
  selector: 'app-city-edit-dialog',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    TuiTextfield,
    TuiInputDate,
    TuiCalendar,
    TuiDropdown,
    TuiIcon
  ],
  templateUrl: './city-edit-dialog.html',
  styleUrl: './city-edit-dialog.scss',
})
export class CityEditDialog {
  protected readonly context = inject<TuiDialogContext<City | null, City>>(POLYMORPHEUS_CONTEXT);

  private fb = inject(FormBuilder);

  protected languageService = inject(LanguageService);

  protected city = this.context.data;

  private parseDate(value: string | null | undefined): TuiDay | null {
    if (!value) {
      return null;
    }

    const match = value.slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (!match) {
      return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);

    try {
      return new TuiDay(year, month, day);
    } catch {
      return null;
    }
  }

  private formatDate(value: TuiDay | null | undefined): string | null {
    if (!value) {
      return null;
    }

    const month = String(value.month + 1).padStart(2, '0');
    const day = String(value.day).padStart(2, '0');

    return `${value.year}-${month}-${day}`;
  }

  protected editForm = this.fb.group({
    region: [this.city.region, Validators.required],
    population: [this.city.population, [Validators.required, Validators.min(0)]],
    foundedDate: [this.parseDate(this.city.foundedDate)],
    longitude: [this.city.longitude, [Validators.required, inRange(-180, 180)]],
    latitude: [this.city.latitude, [Validators.required, inRange(-90, 90)]],
  });

  protected save() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const value = this.editForm.getRawValue();

    const updated: City = {
      ...this.city,
      region: value.region ?? this.city.region,
      population: value.population ?? this.city.population,
      longitude: value.longitude ?? this.city.longitude,
      latitude: value.latitude ?? this.city.latitude,
      foundedDate: this.formatDate(value.foundedDate),
    };

    this.context.completeWith(updated);
  }

  protected cancel() {
    this.context.completeWith(null);
  }
}

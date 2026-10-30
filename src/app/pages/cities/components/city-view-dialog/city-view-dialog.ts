import { Component, inject } from '@angular/core';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import { City } from '../../models/city.model';
import { LanguageService } from '../../../../core/services/language';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-city-view-dialog',
  imports: [TranslatePipe],
  templateUrl: './city-view-dialog.html',
  styleUrl: './city-view-dialog.scss',
})
export class CityViewDialog {
  protected readonly context = inject<TuiDialogContext<void, City>>(POLYMORPHEUS_CONTEXT);
  protected languageService = inject(LanguageService);

  protected get city(): City {
    return this.context.data;
  }

  protected close() {
    this.context.completeWith(undefined);
  }
}

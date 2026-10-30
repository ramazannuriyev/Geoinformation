
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  inject,
  computed,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideTaiga } from '@taiga-ui/core';
import {
  TUI_LANGUAGE,
  TUI_ENGLISH_LANGUAGE,
  TUI_RUSSIAN_LANGUAGE,
} from '@taiga-ui/i18n';

import { routes } from './app.routes';
import { LanguageService } from './core/services/language';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideTaiga(),
    provideHttpClient(),

    {
      provide: TUI_LANGUAGE,
      useFactory: () => {
        const languageService = inject(LanguageService);

        return computed(() =>
          languageService.current() === 'ru'
            ? TUI_RUSSIAN_LANGUAGE
            : TUI_ENGLISH_LANGUAGE,
        );
      },
    },
  ],
};

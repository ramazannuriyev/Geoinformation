import { Injectable, signal } from '@angular/core';

export type Lang = 'ru' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly current = signal<Lang>('ru');

  setLanguage(lang: Lang) {
    this.current.set(lang);
  }
}
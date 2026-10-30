import { Pipe, PipeTransform } from '@angular/core';
import { Lang } from '../services/language';
import { TRANSLATIONS } from './translations';

@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {
  transform(key: string, lang: Lang): string {
    return TRANSLATIONS[lang]?.[key] ?? key;
  }
}
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import uk from './locales/uk/translation.json';
import en from './locales/en/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      uk: { translation: uk },
      en: { translation: en },
    },

    // Supported languages — щоб додати нову: просто вписати код сюди + створити locales/xx/translation.json
    supportedLngs: ['uk', 'en'],

    // Fallback: якщо мова не підтримується — англійська
    fallbackLng: 'en',

    // Детектор: порядок пошуку мови (зліва — вищий пріоритет)
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      // Берем тільки перший сегмент локалі: 'uk-UA' → 'uk'
      convertDetectedLanguage: (lng) => lng.split('-')[0],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React вже екранує XSS
    },
  });

export default i18n;

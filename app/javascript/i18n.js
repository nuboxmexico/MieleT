import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import Spanish from 'locales/es.json'
import Portuguese from 'locales/pt.json'

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'es',
    supportedLngs: ['es', 'pt'],
    debug: true,
    resources: {
      es: Spanish,
      pt: Portuguese
    },
  });

export default i18n

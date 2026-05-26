import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ms from "./locales/ms.json";

export const LANGUAGE_STORAGE_KEY = "tic-tac-toe-language";

export const SUPPORTED_LANGUAGES = ["en", "ms"] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const isAppLanguage = (value: string): value is AppLanguage =>
  (SUPPORTED_LANGUAGES as readonly string[]).includes(value);

export const getInitialLanguage = (): AppLanguage => {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored !== null && isAppLanguage(stored)) return stored;
  } catch {
    // ignore storage access errors
  }
  if (typeof navigator !== "undefined") {
    const code = navigator.language.toLowerCase();
    if (code.startsWith("ms")) return "ms";
  }
  return "en";
};

export const persistLanguage = (language: AppLanguage): void => {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // ignore storage access errors
  }
};

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ms: { translation: ms },
  },
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  if (isAppLanguage(lng)) persistLanguage(lng);
  document.documentElement.lang = lng;
});

document.documentElement.lang = i18n.language;

export default i18n;

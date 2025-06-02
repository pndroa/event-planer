// utils/loadLocale.ts
import { Locale, enUS } from 'date-fns/locale'

const localeImportMap: Record<string, () => Promise<Locale>> = {
  de: async () => (await import('date-fns/locale/de')).de,
  enUs: async () => (await import('date-fns/locale/en-US')).enUS,
  fr: async () => (await import('date-fns/locale/fr')).fr,
  es: async () => (await import('date-fns/locale/es')).es,
  it: async () => (await import('date-fns/locale/it')).it,
  nl: async () => (await import('date-fns/locale/nl')).nl,
  pl: async () => (await import('date-fns/locale/pl')).pl,
  tr: async () => (await import('date-fns/locale/tr')).tr,
  ja: async () => (await import('date-fns/locale/ja')).ja,
  zh: async () => (await import('date-fns/locale/zh-CN')).zhCN,
  ru: async () => (await import('date-fns/locale/ru')).ru,
  ar: async () => (await import('date-fns/locale/ar-SA')).arSA,
  enGB: async () => (await import('date-fns/locale/en-GB')).enGB,
}

export const loadLocale = async (lang: string): Promise<Locale> => {
  const short = lang.split('-')[0]
  const importer = localeImportMap[short]
  if (!importer) return enUS

  try {
    return await importer()
  } catch (e) {
    console.warn(`[loadLocale] Fehler beim Laden von "${short}", fallback auf enUS. ${e}`)
    return enUS
  }
}

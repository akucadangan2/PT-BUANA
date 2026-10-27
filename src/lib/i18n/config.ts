export type Lang = 'en' | 'th'

export const LANG_COOKIE = 'lang'

export function isLang(value: unknown): value is Lang {
  return value === 'en' || value === 'th'
}

export const dateLocales: Record<Lang, string> = {
  en: 'en-AU',
  th: 'th-TH-u-ca-gregory',
}

export const storeBadges: Record<Lang, { play: string; apple: string }> = {
  en: {
    play: 'https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png',
    apple: 'https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us',
  },
  th: {
    play: 'https://play.google.com/intl/en_us/badges/static/images/badges/th_badge_web_generic.png',
    apple: 'https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/th-th',
  },
}
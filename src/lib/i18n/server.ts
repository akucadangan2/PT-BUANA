import { cookies, headers } from 'next/headers'
import { en } from './en'
import type { Dict } from './en'
import { th } from './th'
import { LANG_COOKIE, isLang } from './config'
import type { Lang } from './config'

const dictionaries: Record<Lang, Dict> = { en, th }

export async function getLang(): Promise<Lang> {
  const saved = (await cookies()).get(LANG_COOKIE)?.value
  if (isLang(saved)) return saved

  // First visit: use Thai if the browser is set to Thai
  const accept = (await headers()).get('accept-language') ?? ''
  return accept.toLowerCase().startsWith('th') ? 'th' : 'en'
}

export async function getDict(): Promise<{ lang: Lang; t: Dict }> {
  const lang = await getLang()
  return { lang, t: dictionaries[lang] }
}
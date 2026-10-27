'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { LANG_COOKIE, isLang } from './config'

export async function setLanguage(lang: string) {
  if (!isLang(lang)) return

  const store = await cookies()
  store.set(LANG_COOKIE, lang, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })

  revalidatePath('/', 'layout')
}
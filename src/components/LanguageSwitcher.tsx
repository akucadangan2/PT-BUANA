import { setLanguage } from '@/lib/i18n/actions'
import type { Lang } from '@/lib/i18n/config'

const options: { value: Lang; label: string; name: string }[] = [
  { value: 'en', label: 'EN', name: 'English' },
  { value: 'th', label: 'ไทย', name: 'ภาษาไทย' },
]

export default function LanguageSwitcher({ lang }: { lang: Lang }) {
  return (
    <form className="inline-flex items-center rounded-xl border border-[#d8dfd5] bg-white p-0.5 text-xs font-bold">
      {options.map((o) => (
        <button
          key={o.value}
          type="submit"
          formAction={setLanguage.bind(null, o.value)}
          aria-label={o.name}
          aria-pressed={lang === o.value}
          className={`rounded-[10px] px-2.5 py-1.5 transition ${
            lang === o.value
              ? 'bg-[#244c28] text-white'
              : 'text-[#536055] hover:bg-[#f1f4ef]'
          }`}
        >
          {o.label}
        </button>
      ))}
    </form>
  )
}
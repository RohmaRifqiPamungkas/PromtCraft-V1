"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { translations, type Locale, type Translations } from "./translations"

interface LanguageContextValue {
  lang: Locale
  setLang: (l: Locale) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Locale>("en")

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Locale | null
    if (saved === "en" || saved === "id") setLangState(saved)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  function setLang(l: Locale) {
    setLangState(l)
    localStorage.setItem("lang", l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

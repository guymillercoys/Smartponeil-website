import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // שמירת השפה ב-localStorage
    const saved = localStorage.getItem('language')
    return saved || 'th' // ברירת מחדל: תאילנדית
  })

  useEffect(() => {
    localStorage.setItem('language', language)
    // עדכון כיוון הטקסט
    const dir = language === 'he' ? 'rtl' : 'ltr'
    document.documentElement.dir = dir
    document.documentElement.lang = language
    document.body.dir = dir
  }, [language])

  const changeLanguage = (lang) => {
    setLanguage(lang)
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}


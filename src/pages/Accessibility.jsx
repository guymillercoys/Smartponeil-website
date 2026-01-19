import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import './Accessibility.css'

function Accessibility() {
  const { language } = useLanguage()
  const t = translations[language]
  const isRTL = language === 'he'

  return (
    <div className="legal-page" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container">
        <h1 className="page-title">{t.accessibility.title} – HGR SMARTPHONE LTD ({language === 'he' ? 'איץ גי אר סמארטפון בע"מ' : 'HGR SMARTPHONE LTD'})</h1>
        
        <div className="legal-content">
          <p className="last-updated">{t.accessibility.lastUpdated}: 2026</p>

          <section>
            <p>{t.accessibility.intro}</p>
          </section>

          <section>
            <h2>{t.accessibility.efforts.title}</h2>
            <p>{t.accessibility.efforts.description}</p>
            <ul>
              {t.accessibility.efforts.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>{t.accessibility.thirdParty.title}</h2>
            <p>{t.accessibility.thirdParty.description}</p>
            <ul>
              {t.accessibility.thirdParty.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p>{t.accessibility.thirdParty.note}</p>
          </section>

          <section>
            <h2>{t.accessibility.contact.title}</h2>
            <p>{t.accessibility.contact.description}</p>
            <ul>
              <li>{t.accessibility.contact.whatsapp}</li>
              <li>{t.accessibility.contact.phone}</li>
            </ul>
            <p>{t.accessibility.contact.note}</p>
            <ul>
              {t.accessibility.contact.noteItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Accessibility


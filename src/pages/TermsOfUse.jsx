import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import './TermsOfUse.css'

function TermsOfUse() {
  const { language } = useLanguage()
  const t = translations[language]
  const isRTL = language === 'he'

  return (
    <div className="legal-page" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container">
        <h1 className="page-title">{t.termsOfUse.title} – HGR SMARTPHONE LTD ({language === 'he' ? 'איץ גי אר סמארטפון בע"מ' : language === 'en' ? 'HGR SMARTPHONE LTD' : 'HGR SMARTPHONE LTD'})</h1>
        
        <div className="legal-content">
          <p className="last-updated">{t.termsOfUse.lastUpdated}: ***/***/2026</p>

          <section>
            <h2>{t.termsOfUse.general.title}</h2>
            <p>{t.termsOfUse.general.welcome}</p>
            <p>{t.termsOfUse.general.agreement}</p>
          </section>

          <section>
            <h2>{t.termsOfUse.service.title}</h2>
            <p>{t.termsOfUse.service.description}</p>
          </section>

          <section>
            <h2>{t.termsOfUse.userResponsibility.title}</h2>
            <p>{t.termsOfUse.userResponsibility.description}</p>
          </section>

          <section>
            <h2>{t.termsOfUse.payment.title}</h2>
            <ul>
              <li>{t.termsOfUse.payment.point1}</li>
              <li>{t.termsOfUse.payment.point2}</li>
              <li>{t.termsOfUse.payment.point3}</li>
            </ul>
          </section>

          <section>
            <h2>{t.termsOfUse.whatsapp.title}</h2>
            <p>{t.termsOfUse.whatsapp.description}</p>
          </section>

          <section>
            <h2>{t.termsOfUse.availability.title}</h2>
            <p>{t.termsOfUse.availability.description}</p>
          </section>

          <section>
            <h2>{t.termsOfUse.intellectualProperty.title}</h2>
            <p>{t.termsOfUse.intellectualProperty.description}</p>
          </section>

          <section>
            <h2>{t.termsOfUse.liability.title}</h2>
            <p>{t.termsOfUse.liability.description}</p>
          </section>

          <section>
            <h2>{t.termsOfUse.jurisdiction.title}</h2>
            <p>{t.termsOfUse.jurisdiction.description}</p>
          </section>

          <section>
            <h2>{t.termsOfUse.contact.title}</h2>
            <ul>
              <li>{t.termsOfUse.contact.whatsapp}</li>
              <li>{t.termsOfUse.contact.phone}</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TermsOfUse


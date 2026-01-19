import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import './PrivacyPolicy.css'

function PrivacyPolicy() {
  const { language } = useLanguage()
  const t = translations[language]
  const isRTL = language === 'he'

  return (
    <div className="legal-page" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container">
        <h1 className="page-title">{t.privacyPolicy.title} – HGR SMARTPHONE LTD ({language === 'he' ? 'איץ גי אר סמארטפון בע"מ' : 'HGR SMARTPHONE LTD'})</h1>
        
        <div className="legal-content">
          <p className="last-updated">{t.privacyPolicy.lastUpdated}: 2026</p>

          <section>
            <h2>{t.privacyPolicy.whoWeAre.title}</h2>
            <p>{t.privacyPolicy.whoWeAre.description}</p>
          </section>

          <section>
            <h2>{t.privacyPolicy.whatThisCovers.title}</h2>
            <p>{t.privacyPolicy.whatThisCovers.description}</p>
          </section>

          <section>
            <h2>{t.privacyPolicy.whatWeCollect.title}</h2>
            
            <h3>{t.privacyPolicy.whatWeCollect.directInfo.title}</h3>
            <ul>
              {t.privacyPolicy.whatWeCollect.directInfo.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3>{t.privacyPolicy.whatWeCollect.technicalInfo.title}</h3>
            <p>{t.privacyPolicy.whatWeCollect.technicalInfo.description}</p>
            <p>{t.privacyPolicy.whatWeCollect.technicalInfo.additional}</p>

            <h3>{t.privacyPolicy.whatWeCollect.paymentInfo.title}</h3>
            <ul>
              <li>{t.privacyPolicy.whatWeCollect.paymentInfo.point1}</li>
              <li>{t.privacyPolicy.whatWeCollect.paymentInfo.point2}</li>
            </ul>
          </section>

          <section>
            <h2>{t.privacyPolicy.whyWeUse.title}</h2>
            <p>{t.privacyPolicy.whyWeUse.description}</p>
            <ul>
              {t.privacyPolicy.whyWeUse.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>{t.privacyPolicy.whatsapp.title}</h2>
            <p>{t.privacyPolicy.whatsapp.description}</p>
          </section>

          <section>
            <h2>{t.privacyPolicy.sharing.title}</h2>
            <p>{t.privacyPolicy.sharing.description}</p>
            <ul>
              {t.privacyPolicy.sharing.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p><strong>{t.privacyPolicy.sharing.note}</strong></p>
          </section>

          <section>
            <h2>{t.privacyPolicy.retention.title}</h2>
            <p>{t.privacyPolicy.retention.description}</p>
          </section>

          <section>
            <h2>{t.privacyPolicy.security.title}</h2>
            <p>{t.privacyPolicy.security.description}</p>
          </section>

          <section>
            <h2>{t.privacyPolicy.transfer.title}</h2>
            <p>{t.privacyPolicy.transfer.description}</p>
          </section>

          <section>
            <h2>{t.privacyPolicy.rights.title}</h2>
            <p>{t.privacyPolicy.rights.description}</p>
          </section>

          <section>
            <h2>{t.privacyPolicy.contact.title}</h2>
            <p>{t.privacyPolicy.contact.description}</p>
            <ul>
              <li>{t.privacyPolicy.contact.whatsapp}</li>
              <li>{t.privacyPolicy.contact.phone}</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy


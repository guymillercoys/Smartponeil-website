import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import './Contact.css'

function Contact() {
  const { language } = useLanguage()
  const t = translations[language]

  const phoneNumber = '054-4449109'
  // הסרת מקפים והסרת 0 ראשונה, הוספת קוד מדינה 972
  const phoneNumberClean = '972544449109' // פורמט מלא: 972 + 544449109
  const facebookUrl = 'https://www.facebook.com/share/1MWPwdeQiK/?mibextid=wwXIfr'
  
  const whatsappUrl = `https://wa.me/${phoneNumberClean}?text=${encodeURIComponent(
    language === 'he' 
      ? 'היי, אני מעוניין לקבל מידע נוסף'
      : language === 'en'
      ? 'Hi, I would like to get more information'
      : 'สวัสดี ฉันต้องการข้อมูลเพิ่มเติม'
  )}`

  return (
    <div className="contact-page">
      <div className="container">
        <h1 className="page-title">{t.contact.title}</h1>
        
        <div className="contact-simple">
          <div className="contact-card">
            <div className="contact-icon">📞</div>
            <h2>{t.contact.phone}</h2>
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="contact-link whatsapp-link"
            >
              <span className="whatsapp-icon">💬</span>
              {phoneNumber}
            </a>
            <p className="contact-note">{t.contact.clickToWhatsApp}</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon">📘</div>
            <h2>{t.contact.facebook}</h2>
            <a 
              href={facebookUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="contact-link facebook-link"
            >
              <span className="facebook-icon">📘</span>
              {t.contact.visitFacebook}
            </a>
            <p className="contact-note">{t.contact.followUs}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact

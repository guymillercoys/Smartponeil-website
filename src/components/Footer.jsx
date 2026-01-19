import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import './Footer.css'

function Footer() {
  const { language } = useLanguage()
  const t = translations[language]
  const isRTL = language === 'he'

  return (
    <footer className="site-footer" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>{t.footer.companyName}</h3>
            <p className="footer-company-en">{t.footer.companyNameEn}</p>
            <p className="footer-detail">{t.footer.companyNumber}</p>
            <p className="footer-detail">{t.footer.address}</p>
          </div>
          
          <div className="footer-section">
            <h3>{t.footer.links}</h3>
            <nav className="footer-links">
              <Link to="/privacy">{t.footer.privacy}</Link>
              <span className="footer-separator">|</span>
              <Link to="/terms">{t.footer.terms}</Link>
              <span className="footer-separator">|</span>
              <Link to="/accessibility">{t.footer.accessibility}</Link>
            </nav>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {t.footer.companyName}. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer


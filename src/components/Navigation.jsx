import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import './Navigation.css'

function Navigation() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { language, changeLanguage } = useLanguage()
  const t = translations[language]

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLanguageChange = (lang) => {
    changeLanguage(lang)
    setIsMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className={`nav-container ${language === 'he' ? 'rtl' : 'ltr'}`}>
        <Link to="/" className="nav-logo">
          <img src="/logo-placeholder.png" alt="Smartpone Logo" className="logo-img" onError={(e) => { e.target.style.display = 'none' }} />
          <span className="logo-text">Smartpone</span>
        </Link>
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              {t.nav.home}
            </Link>
          </li>
          <li>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
              {t.nav.about}
            </Link>
          </li>
          <li>
            <Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>
              {t.nav.products}
            </Link>
          </li>
          <li>
            <Link to="/gallery" className={location.pathname === '/gallery' ? 'active' : ''}>
              {t.nav.gallery}
            </Link>
          </li>
          <li>
            <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
              {t.nav.contact}
            </Link>
          </li>
        </ul>
        <div className="nav-actions">
          <div className="language-selector">
            <div className="language-dropdown">
              <button className="language-btn" aria-label="Language">
                <span className="language-icon">🌐</span>
                <span className="language-text">{language === 'he' ? 'עברית' : language === 'en' ? 'English' : 'ไทย'}</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              <div className="language-options">
                <button 
                  onClick={() => handleLanguageChange('he')}
                  className={language === 'he' ? 'active' : ''}
                >
                  עברית
                </button>
                <button 
                  onClick={() => handleLanguageChange('en')}
                  className={language === 'en' ? 'active' : ''}
                >
                  English
                </button>
                <button 
                  onClick={() => handleLanguageChange('th')}
                  className={language === 'th' ? 'active' : ''}
                >
                  ไทย
                </button>
              </div>
            </div>
          </div>
          <button className="nav-toggle" aria-label="תפריט" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navigation


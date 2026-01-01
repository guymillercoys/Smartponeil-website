import ImageCarousel from '../components/ImageCarousel'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import './Home.css'

function Home() {
  const { language } = useLanguage()
  const t = translations[language]

  const carouselImages = [
    {
      src: '/images/הירו.webp',
      alt: language === 'he' ? 'הירו' : language === 'en' ? 'Hero' : 'ฮีโร่',
      caption: t.home.service1
    },
    {
      src: '/images/הירו 1.webp',
      alt: language === 'he' ? 'הירו 1' : language === 'en' ? 'Hero 1' : 'ฮีโร่ 1',
      caption: t.home.feature1Desc
    }
  ]

  return (
    <div className="home-page">
      <section className="hero-section">
        <ImageCarousel images={carouselImages} interval={5000} />
      </section>

      <section className="about-section">
        <div className="container">
          <h1 className="section-title">{t.home.welcome}</h1>
          <div className="about-content">
            <div className="about-text">
              <h2>{t.home.whoWeAre}</h2>
              <p>{t.home.whoWeAreText1}</p>
              <p>{t.home.whoWeAreText2}</p>
              <h2>{t.home.whatWeOffer}</h2>
              <ul className="services-list">
                <li>{t.home.service1}</li>
                <li>{t.home.service2}</li>
                <li>{t.home.service3}</li>
                <li>{t.home.service4}</li>
              </ul>
            </div>
            <div className="about-image">
              <img 
                src="/images/לוגו לתמונה.webp" 
                alt={t.home.whoWeAre}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect fill="%23e5e7eb" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="20"%3EPlaceholder%3C/text%3E%3C/svg%3E'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">{t.home.whyChooseUs}</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>{t.home.feature1}</h3>
              <p>{t.home.feature1Desc}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>{t.home.feature2}</h3>
              <p>{t.home.feature2Desc}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>{t.home.feature3}</h3>
              <p>{t.home.feature3Desc}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛒</div>
              <h3>{t.home.feature4}</h3>
              <p>{t.home.feature4Desc}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home


import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import './About.css'

function About() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <div className="about-page">
      <div className="container">
        <h1 className="page-title">{t.about.title}</h1>
        
        <section className="about-hero">
          <div className="about-hero-content">
            <h2>{t.about.heroTitle}</h2>
            <p className="lead-text">{t.about.heroText}</p>
          </div>
        </section>

        <section className="about-mission">
          <div className="mission-grid">
            <div className="mission-card">
              <h3>{t.about.mission}</h3>
              <p>{t.about.missionText}</p>
            </div>
            <div className="mission-card">
              <h3>{t.about.vision}</h3>
              <p>{t.about.visionText}</p>
            </div>
            <div className="mission-card">
              <h3>{t.about.values}</h3>
              <ul>
                <li>{t.about.value1}</li>
                <li>{t.about.value2}</li>
                <li>{t.about.value3}</li>
                <li>{t.about.value4}</li>
                <li>{t.about.value5}</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="about-history">
          <h2>{t.about.story}</h2>
          <div className="history-content">
            <p>{t.about.storyText1}</p>
            <p>{t.about.storyText2}</p>
            <p>{t.about.storyText3}</p>
          </div>
        </section>

        <section className="about-team">
          <h2>{t.about.whyChoose}</h2>
          <div className="team-features">
            <div className="team-feature">
              <div className="feature-icon">🌍</div>
              <h3>{t.about.support}</h3>
              <p>{t.about.supportDesc}</p>
            </div>
            <div className="team-feature">
              <div className="feature-icon">⏰</div>
              <h3>{t.about.availability}</h3>
              <p>{t.about.availabilityDesc}</p>
            </div>
            <div className="team-feature">
              <div className="feature-icon">💡</div>
              <h3>{t.about.experience}</h3>
              <p>{t.about.experienceDesc}</p>
            </div>
            <div className="team-feature">
              <div className="feature-icon">🤝</div>
              <h3>{t.about.personal}</h3>
              <p>{t.about.personalDesc}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About







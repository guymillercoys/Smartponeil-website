import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import './Contact.css'

function Contact() {
  const { language } = useLanguage()
  const t = translations[language]

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(t.contact.success)
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })
  }

  return (
    <div className="contact-page">
      <div className="container">
        <h1 className="page-title">{t.contact.title}</h1>
        
        <div className="contact-wrapper">
          <div className="contact-info">
            <h2>{t.contact.contactInfo}</h2>
            <div className="info-item">
              <div className="info-icon">📞</div>
              <div>
                <h3>{t.contact.phone}</h3>
                <p>03-1234567</p>
                <p>050-1234567</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">✉️</div>
              <div>
                <h3>{t.contact.email}</h3>
                <p>info@smartpone.co.il</p>
                <p>support@smartpone.co.il</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">📍</div>
              <div>
                <h3>{t.contact.address}</h3>
                <p>{language === 'he' ? 'רחוב דוגמה 123, תל אביב' : language === 'en' ? 'Example Street 123, Tel Aviv' : 'ถนนตัวอย่าง 123 เทลอาวีฟ'}</p>
                <p>{language === 'he' ? 'ישראל' : language === 'en' ? 'Israel' : 'อิสราเอล'}</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">🕐</div>
              <div>
                <h3>{t.contact.hours}</h3>
                <p>{t.contact.workingHours}</p>
                <p>{t.contact.friday}</p>
                <p>{t.contact.emergency}</p>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <h2>{t.contact.sendMessage}</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">{t.contact.fullName}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={t.contact.placeholderName}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">{t.contact.emailLabel}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={t.contact.placeholderEmail}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">{t.contact.phoneLabel}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t.contact.placeholderPhone}
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">{t.contact.subject}</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t.contact.selectSubject}</option>
                  <option value="service">{t.contact.customerService}</option>
                  <option value="product">{t.contact.productsServices}</option>
                  <option value="technical">{t.contact.technical}</option>
                  <option value="billing">{t.contact.billing}</option>
                  <option value="other">{t.contact.other}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">{t.contact.message}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder={t.contact.placeholderMessage}
                />
              </div>

              <button type="submit" className="submit-btn">
                {t.contact.send}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact







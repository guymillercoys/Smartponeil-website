import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import './ServicePayment.css'

function ServicePayment() {
  const { language } = useLanguage()
  const t = translations[language]
  const [formData, setFormData] = useState({
    fullName: '',
    passportNumber: '',
    phoneNumber: '',
    workplace: ''
  })
  const [errors, setErrors] = useState({})
  const [showPaymentStep, setShowPaymentStep] = useState(false)
  const [loading, setLoading] = useState(false)
  const [whatsappLoading, setWhatsappLoading] = useState(false)
  const [paymentError, setPaymentError] = useState(null)
  const [whatsappError, setWhatsappError] = useState(null)
  const [checkoutUrl, setCheckoutUrl] = useState(null)
  const [orderId, setOrderId] = useState(null)
  const [amount, setAmount] = useState(null)
  const [currency, setCurrency] = useState(null)

  // Clean phone: remove spaces, dashes, parentheses - keep digits only
  const cleanPhone = (phone) => {
    if (!phone || typeof phone !== 'string') {
      return ''
    }
    return phone.replace(/[\s\-()]/g, '').replace(/\D/g, '')
  }

  // Validate Israeli phone format: must be exactly 10 digits starting with 0
  const validatePhone = (phone) => {
    const cleaned = cleanPhone(phone)
    
      // Check for invalid formats
      if (cleaned.includes('+') || cleaned.startsWith('972')) {
        return {
          valid: false,
          error: t.servicePayment.phoneError
        }
      }
      
      // Must match exactly 10 digits starting with 0
      if (!/^0\d{9}$/.test(cleaned)) {
        return {
          valid: false,
          error: t.servicePayment.phoneError
        }
      }
    
    return { valid: true }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = t.servicePayment.requiredField
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t.servicePayment.requiredField
    } else {
      const validation = validatePhone(formData.phoneNumber)
      if (!validation.valid) {
        newErrors.phoneNumber = validation.error
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Check if form is valid (all required fields filled and phone valid)
  const isFormValid = () => {
    if (!formData.fullName.trim()) return false
    if (!formData.phoneNumber.trim()) return false
    
    // Validate phone
    const phoneValidation = validatePhone(formData.phoneNumber)
    if (!phoneValidation.valid) return false
    
    return true
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // For phone number, strip spaces, dashes, parentheses - keep digits only
    let processedValue = value
    if (name === 'phoneNumber') {
      // Remove spaces, dashes, parentheses, and any non-digit characters
      processedValue = value.replace(/[\s\-()]/g, '').replace(/\D/g, '')
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handlePaymentClick = async () => {
    // Prevent double submission if iframe is already shown
    if (showPaymentStep && checkoutUrl) {
      return
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setPaymentError(null)

    try {
      // Clean phone before sending
      const cleanedPhone = cleanPhone(formData.phoneNumber)
      
      // Prepare request body - only send non-empty optional fields
      const requestBody = {
        fullName: formData.fullName.trim(),
        phone: cleanedPhone,
        passportNumber: formData.passportNumber?.trim() || '',
        workplace: formData.workplace?.trim() || ''
      }
      
      console.log('Sending payment request:', { ...requestBody, phone: '***' }) // Don't log full phone
      
      const response = await fetch('/.netlify/functions/create-service-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || 'שגיאה ביצירת תשלום'
        
        // Log error for debugging
        console.error('Payment error:', errorMessage, errorData)
        
        // If pricing not found, suggest WhatsApp
        if (errorMessage.includes('pricing') || errorMessage.includes('No pricing')) {
          throw new Error(t.servicePayment.errorPricing)
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setCheckoutUrl(data.url)
      setOrderId(data.orderId)
      setAmount(data.amount)
      setCurrency(data.currency)
      setShowPaymentStep(true)
    } catch (err) {
      setPaymentError(err.message || t.servicePayment.errorGeneral)
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppClick = async () => {
    if (!isFormValid()) {
      validateForm()
      return
    }

    setWhatsappLoading(true)
    setWhatsappError(null)

    try {
      // Clean phone before sending
      const cleanedPhone = cleanPhone(formData.phoneNumber)
      
      // Prepare message template
      const messageTemplate = language === 'he' 
        ? 'היי, אני אשמח לשלם על הסים שלי'
        : language === 'en'
        ? 'Hi, I would like to pay for my visa'
        : 'สวัสดี ฉันต้องการชำระเงินสำหรับวีซ่าของฉัน'

      // First, save the lead
      const response = await fetch('/.netlify/functions/create-whatsapp-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          passportNumber: formData.passportNumber?.trim() || '',
          phone: cleanedPhone,
          workplace: formData.workplace?.trim() || '',
          messageTemplate: messageTemplate
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || t.servicePayment.errorGeneral)
      }

      // If success, redirect to WhatsApp
      const whatsappUrl = `https://wa.me/972544449109?text=${encodeURIComponent(messageTemplate)}`
      window.open(whatsappUrl, '_blank')
    } catch (err) {
      setWhatsappError(err.message || t.servicePayment.errorGeneral)
    } finally {
      setWhatsappLoading(false)
    }
  }

  return (
    <div className="service-payment-page" dir="rtl">
      <div className="container">
        <h1 className="page-title">{t.servicePayment.title}</h1>
        <p className="page-subtitle">{t.servicePayment.subtitle}</p>

        {!showPaymentStep ? (
          <div className="payment-form-wrapper">
            <form className="payment-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="fullName">{t.servicePayment.fullName}</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={errors.fullName ? 'error' : ''}
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="passportNumber">{t.servicePayment.passportNumber}</label>
                <input
                  type="text"
                  id="passportNumber"
                  name="passportNumber"
                  value={formData.passportNumber}
                  onChange={handleInputChange}
                  className={errors.passportNumber ? 'error' : ''}
                />
                {errors.passportNumber && <span className="error-message">{errors.passportNumber}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">{t.servicePayment.phoneNumber}</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={errors.phoneNumber ? 'error' : ''}
                  placeholder={t.servicePayment.phonePlaceholder}
                />
                {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="workplace">{t.servicePayment.workplace}</label>
                <input
                  type="text"
                  id="workplace"
                  name="workplace"
                  value={formData.workplace}
                  onChange={handleInputChange}
                />
              </div>

              <div className="payment-branch">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handlePaymentClick}
                  disabled={!isFormValid() || loading || (showPaymentStep && checkoutUrl)}
                >
                  {loading ? t.servicePayment.loading : t.servicePayment.continuePayment}
                </button>
                {paymentError && (
                  <div className="error-box">
                    <p>{paymentError}</p>
                  </div>
                )}
              </div>

              <div className="whatsapp-branch">
                <p className="whatsapp-note">
                  {t.servicePayment.whatsappNote}
                </p>
                <button
                  type="button"
                  className="btn-whatsapp"
                  onClick={handleWhatsAppClick}
                  disabled={!isFormValid() || whatsappLoading}
                >
                  {whatsappLoading ? t.servicePayment.loading : t.servicePayment.whatsappButton}
                </button>
                {whatsappError && (
                  <div className="error-box">
                    <p>{whatsappError}</p>
                  </div>
                )}
              </div>
            </form>
          </div>
        ) : (
          <div className="payment-step">
            <div className="summary-card">
              <h2>{t.servicePayment.summary}</h2>
              <div className="summary-details">
                <div className="summary-item">
                  <strong>{t.servicePayment.name}:</strong> {formData.fullName}
                </div>
                <div className="summary-item">
                  <strong>{t.servicePayment.phone}:</strong> {formData.phoneNumber}
                </div>
                {formData.passportNumber && (
                  <div className="summary-item">
                    <strong>{t.servicePayment.passportNumber}:</strong> {formData.passportNumber}
                  </div>
                )}
                {formData.workplace && (
                  <div className="summary-item">
                    <strong>{t.servicePayment.workplace}:</strong> {formData.workplace}
                  </div>
                )}
                {orderId && (
                  <div className="summary-item">
                    <strong>{t.servicePayment.orderId}:</strong> {orderId}
                  </div>
                )}
                {amount && (
                  <div className="summary-item">
                    <strong>{t.servicePayment.amount}:</strong> ₪{amount.toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {checkoutUrl && (
              <div className="payment-iframe-container">
                <iframe
                  title={t.servicePayment.continuePayment}
                  src={checkoutUrl}
                  className="payment-iframe"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ServicePayment


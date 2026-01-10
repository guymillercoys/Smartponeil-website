import { useState } from 'react'
import './ServicePayment.css'

function ServicePayment() {
  const [formData, setFormData] = useState({
    fullName: '',
    passportNumber: '',
    phoneNumber: '',
    arrivalDate: '',
    workplace: ''
  })
  const [errors, setErrors] = useState({})
  const [showPaymentStep, setShowPaymentStep] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paymentError, setPaymentError] = useState(null)
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
        error: 'נא להזין מספר בפורמט ישראלי שמתחיל ב-0 (לדוגמה: 0501234567)'
      }
    }
    
    // Must match exactly 10 digits starting with 0
    if (!/^0\d{9}$/.test(cleaned)) {
      return {
        valid: false,
        error: 'נא להזין מספר בפורמט ישראלי שמתחיל ב-0 (לדוגמה: 0501234567)'
      }
    }
    
    return { valid: true }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'שדה חובה'
    }

    if (!formData.passportNumber.trim()) {
      newErrors.passportNumber = 'שדה חובה'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'שדה חובה'
    } else {
      const validation = validatePhone(formData.phoneNumber)
      if (!validation.valid) {
        newErrors.phoneNumber = validation.error
      }
    }

    if (!formData.arrivalDate) {
      newErrors.arrivalDate = 'שדה חובה'
    }

    if (!formData.workplace.trim()) {
      newErrors.workplace = 'שדה חובה'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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
      
      const response = await fetch('/.netlify/functions/create-service-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          passportNumber: formData.passportNumber.trim(),
          phone: cleanedPhone,
          arrivalDate: formData.arrivalDate,
          workplace: formData.workplace.trim()
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || 'שגיאה ביצירת תשלום'
        
        // If pricing not found, suggest WhatsApp
        if (errorMessage.includes('pricing') || errorMessage.includes('No pricing')) {
          throw new Error('לא נמצא מחיר למספר טלפון זה. אנא פנה אלינו בוואטסאפ להשלמת התשלום.')
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
      setPaymentError(err.message || 'אירעה שגיאה. אנא נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppClick = () => {
    // WhatsApp button works even if form is empty
    const message = 'היי, אני אשמח לשלם על הסים שלי'
    window.open(`https://wa.me/972544449109?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="service-payment-page" dir="rtl">
      <div className="container">
        <h1 className="page-title">תשלום עבור השירות</h1>
        <p className="page-subtitle">מלא את הפרטים ולאחר מכן תוכל לבצע תשלום.</p>

        {!showPaymentStep ? (
          <div className="payment-form-wrapper">
            <form className="payment-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="fullName">שם מלא *</label>
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
                <label htmlFor="passportNumber">מספר דרכון *</label>
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
                <label htmlFor="phoneNumber">מספר טלפון *</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={errors.phoneNumber ? 'error' : ''}
                  placeholder="0501234567"
                />
                {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="arrivalDate">תאריך הגעה לישראל *</label>
                <input
                  type="date"
                  id="arrivalDate"
                  name="arrivalDate"
                  value={formData.arrivalDate}
                  onChange={handleInputChange}
                  className={errors.arrivalDate ? 'error' : ''}
                />
                {errors.arrivalDate && <span className="error-message">{errors.arrivalDate}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="workplace">מקום עבודה *</label>
                <input
                  type="text"
                  id="workplace"
                  name="workplace"
                  value={formData.workplace}
                  onChange={handleInputChange}
                  className={errors.workplace ? 'error' : ''}
                />
                {errors.workplace && <span className="error-message">{errors.workplace}</span>}
              </div>

              <div className="payment-branch">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handlePaymentClick}
                  disabled={loading || (showPaymentStep && checkoutUrl)}
                >
                  {loading ? 'טוען...' : 'המשך לתשלום'}
                </button>
                {paymentError && (
                  <div className="error-box">
                    <p>{paymentError}</p>
                  </div>
                )}
              </div>

              <div className="whatsapp-branch">
                <button
                  type="button"
                  className="btn-whatsapp"
                  onClick={handleWhatsAppClick}
                >
                  💬 דברו איתנו בוואטסאפ לתשלום
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="payment-step">
            <div className="summary-card">
              <h2>סיכום פרטים</h2>
              <div className="summary-details">
                <div className="summary-item">
                  <strong>שם:</strong> {formData.fullName}
                </div>
                <div className="summary-item">
                  <strong>טלפון:</strong> {formData.phoneNumber}
                </div>
                <div className="summary-item">
                  <strong>תאריך הגעה:</strong> {formData.arrivalDate}
                </div>
                <div className="summary-item">
                  <strong>מקום עבודה:</strong> {formData.workplace}
                </div>
                {orderId && (
                  <div className="summary-item">
                    <strong>מספר הזמנה:</strong> {orderId}
                  </div>
                )}
                {amount && (
                  <div className="summary-item">
                    <strong>סכום:</strong> ₪{amount.toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {checkoutUrl && (
              <div className="payment-iframe-container">
                <iframe
                  title="תשלום"
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


import { useSearchParams, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import './PaymentResult.css'

function PaymentSuccess() {
  const { language } = useLanguage()
  const t = translations[language]
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order')

  return (
    <div className="payment-result-page">
      <div className="container">
        <div className="payment-result-content">
          <div className="payment-result-icon success">✓</div>
          <h1 className="page-title">{t.payment.success}</h1>
          <p className="payment-result-text">{t.payment.successText}</p>
          {orderId && (
            <p className="payment-order-id">
              {t.payment.order}: <strong>{orderId}</strong>
            </p>
          )}
          <div className="payment-result-actions">
            <Link to="/" className="btn-primary">
              {t.payment.backToHome}
            </Link>
            <Link to="/products" className="btn-secondary">
              {t.payment.backToProducts}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess


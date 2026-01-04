/**
 * Checkout Page
 * 
 * Usage: /checkout?product=<SKU>
 * Example: /checkout?product=iphone-001
 * 
 * Fetches checkout URL from Netlify function and displays Tranzila iframe
 */
import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import './Checkout.css'

function Checkout() {
  const { language } = useLanguage()
  const t = translations[language]
  const [searchParams] = useSearchParams()
  const productSku = searchParams.get('product')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [checkoutData, setCheckoutData] = useState(null)

  useEffect(() => {
    if (!productSku) {
      setLoading(false)
      return
    }

    const fetchCheckout = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(
          `/.netlify/functions/create-checkout?product=${encodeURIComponent(productSku)}`
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setCheckoutData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCheckout()
  }, [productSku])

  if (!productSku) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="checkout-error">
            <h2>{t.payment.missingProduct}</h2>
            <p>{t.payment.missingProductText}</p>
            <Link to="/products" className="btn-primary">
              {t.payment.backToProducts}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="checkout-loading">
            <p>{t.payment.loading}</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="checkout-error">
            <h2>{t.payment.error}</h2>
            <p>{t.payment.errorText}</p>
            <p className="error-details">{error}</p>
            <Link to="/products" className="btn-primary">
              {t.payment.backToProducts}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!checkoutData || !checkoutData.url) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="checkout-error">
            <h2>{t.payment.error}</h2>
            <p>{t.payment.errorText}</p>
            <Link to="/products" className="btn-primary">
              {t.payment.backToProducts}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">{t.payment.checkout}</h1>
        {checkoutData.product && (
          <div className="checkout-product-info">
            <p>
              <strong>{checkoutData.product.name}</strong>
            </p>
            <p>
              {t.payment.order}: {checkoutData.orderId}
            </p>
          </div>
        )}
        <div className="checkout-iframe-container">
          <iframe
            title="Payment"
            src={checkoutData.url}
            style={{
              border: 0,
              width: '100%',
              maxWidth: 420,
              height: 650,
              display: 'block',
              margin: '0 auto'
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Checkout


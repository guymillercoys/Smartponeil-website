import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import './Products.css'

function Products() {
  const { language } = useLanguage()
  const t = translations[language]
  const [selectedCategory, setSelectedCategory] = useState(t.products.allCategories)
  const [selectedProductType, setSelectedProductType] = useState(t.products.allTypes)
  const [selectedProduct, setSelectedProduct] = useState(null)

  // פונקציה להצגת מחיר לפי שפה
  const formatPrice = (priceInILS) => {
    if (language === 'he') {
      // עברית: "סכום ₪150 בלבד"
      return `${t.products.from} ₪${priceInILS} ${t.products.only}`
    } else {
      // אנגלית ותאילנדית: המחיר מוכפל ב-10 ומציג בבאט
      const priceInTHB = priceInILS * 10
      return `${t.products.from} ฿${priceInTHB} ${t.products.only}`
    }
  }

  // דוגמה למוצרים - תוכל להוסיף את המוצרים שלך כאן
  // המחירים נשמרים בשקלים, וההצגה משתנה לפי השפה
  const allProducts = [
    // מוצרי אוכל
    {
      id: 1,
      name: t.products.foodPackages,
      description: t.products.foodPackagesDesc,
      priceILS: 150,
      image: '/images/product-placeholder.jpg',
      category: t.products.foodCategory,
      productType: t.products.productTypeFood
    },
    {
      id: 2,
      name: t.products.essentials,
      description: t.products.essentialsDesc,
      priceILS: 100,
      image: '/images/product-placeholder.jpg',
      category: t.products.foodCategory,
      productType: t.products.productTypeHome
    },
    {
      id: 3,
      name: t.products.kitchen,
      description: t.products.kitchenDesc,
      priceILS: 80,
      image: '/images/product-placeholder.jpg',
      category: t.products.foodCategory,
      productType: t.products.productTypeHome
    },
    // מוצרי קניות - תקשורת
    {
      id: 4,
      name: t.products.simCards,
      description: t.products.simDesc,
      priceILS: 50,
      image: '/images/product-placeholder.jpg',
      category: t.products.shoppingCategory,
      productType: t.products.productTypeCommunication
    },
    {
      id: 5,
      name: t.products.internet,
      description: t.products.internetDesc,
      priceILS: 99,
      image: '/images/product-placeholder.jpg',
      category: t.products.shoppingCategory,
      productType: t.products.productTypeCommunication
    },
    {
      id: 6,
      name: t.products.phones,
      description: t.products.phonesDesc,
      priceILS: 200,
      image: '/images/product-placeholder.jpg',
      category: t.products.shoppingCategory,
      productType: t.products.productTypeElectronics
    },
    // מוצרי קניות - אופניים
    {
      id: 7,
      name: t.products.bikesNew,
      description: t.products.bikesNewDesc,
      priceILS: 800,
      image: '/images/product-placeholder.jpg',
      category: t.products.shoppingCategory,
      productType: t.products.productTypeBikes
    },
    {
      id: 8,
      name: t.products.bikesUsed,
      description: t.products.bikesUsedDesc,
      priceILS: 300,
      image: '/images/product-placeholder.jpg',
      category: t.products.shoppingCategory,
      productType: t.products.productTypeBikes
    },
    // מוצרי ביגוד - כובעים
    {
      id: 9,
      name: t.products.hatRegular,
      description: t.products.hatRegularDesc,
      priceILS: 35,
      image: '/images/כובע רגיל.jpeg',
      category: t.products.clothingCategory,
      productType: t.products.productTypeClothing
    },
    {
      id: 10,
      name: t.products.hatSock,
      description: t.products.hatSockDesc,
      priceILS: 50,
      image: '/images/כובע גרב.jpeg',
      category: t.products.clothingCategory,
      productType: t.products.productTypeClothing
    },
    {
      id: 11,
      name: t.products.hatThai1,
      description: t.products.hatThai1Desc,
      priceILS: 85,
      image: '/images/כובע תאילנדי.jpeg',
      category: t.products.clothingCategory,
      productType: t.products.productTypeClothing
    },
    {
      id: 12,
      name: t.products.hatThai2,
      description: t.products.hatThai2Desc,
      priceILS: 85,
      image: '/images/כובע תאילנדי 2.jpeg',
      category: t.products.clothingCategory,
      productType: t.products.productTypeClothing
    }
  ].map(product => ({
    ...product,
    price: formatPrice(product.priceILS)
  }))

  const categories = [t.products.allCategories, t.products.foodCategory, t.products.shoppingCategory, t.products.clothingCategory]
  
  // קביעת סוגי מוצרים זמינים לפי הקטגוריה שנבחרה
  const getAvailableProductTypes = () => {
    const filteredByCategory = selectedCategory === t.products.allCategories
      ? allProducts
      : allProducts.filter(product => product.category === selectedCategory)
    
    const types = [...new Set(filteredByCategory.map(p => p.productType))]
    return [t.products.allTypes, ...types]
  }

  const availableProductTypes = getAvailableProductTypes()

  // סינון כפול: לפי קטגוריה ולפי סוג מוצר
  const filteredProducts = allProducts.filter(product => {
    const categoryMatch = selectedCategory === t.products.allCategories || product.category === selectedCategory
    const typeMatch = selectedProductType === t.products.allTypes || product.productType === selectedProductType
    return categoryMatch && typeMatch
  })

  const handleBuyClick = (product) => {
    setSelectedProduct(product)
  }

  const closePaymentModal = () => {
    setSelectedProduct(null)
  }

  return (
    <div className="products-page">
      <div className="container">
        <h1 className="page-title">{t.products.title}</h1>
        <p className="products-intro">{t.products.intro}</p>

        {/* תפריט סינון ראשי - קטגוריות */}
        <div className="products-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory(category)
                setSelectedProductType(t.products.allTypes) // איפוס סינון סוג מוצר
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* תפריט סינון משני - סוגי מוצרים */}
        {selectedCategory !== t.products.allCategories && availableProductTypes.length > 1 && (
          <div className="products-filters products-filters-secondary">
            {availableProductTypes.map(type => (
              <button
                key={type}
                className={`filter-btn filter-btn-secondary ${selectedProductType === type ? 'active' : ''}`}
                onClick={() => setSelectedProductType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        )}

        {/* רשימת מוצרים */}
        <div className="products-scroll-container">
          <div className="products-grid-new">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card-new">
                <div className="product-image-wrapper">
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23e5e7eb" width="300" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="16"%3EProduct Image%3C/text%3E%3C/svg%3E'
                    }}
                  />
                </div>
                <div className="product-card-content">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-footer">
                    <span className="product-price-new">{product.price}</span>
                    <button 
                      className="buy-button"
                      onClick={() => handleBuyClick(product)}
                    >
                      {t.products.buyNow}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal לתשלום */}
        {selectedProduct && (
          <div className="payment-modal" onClick={closePaymentModal}>
            <div className="payment-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="payment-modal-close" onClick={closePaymentModal}>×</button>
              <h2 className="payment-modal-title">
                {language === 'he' ? 'רכישת' : language === 'en' ? 'Purchase' : 'การซื้อ'} {selectedProduct.name}
              </h2>
              <div className="payment-iframe-container">
                {/* כאן יופיע ה-iframe של התשלום */}
                <div className="payment-iframe-placeholder">
                  <p>
                    {language === 'he' 
                      ? 'כאן יופיע iframe של תשלום' 
                      : language === 'en' 
                      ? 'Payment iframe will appear here' 
                      : 'iframe การชำระเงินจะปรากฏที่นี่'}
                  </p>
                  <p className="payment-info">
                    {selectedProduct.name} - {selectedProduct.price}
                  </p>
                </div>
                {/* <iframe 
                  src="YOUR_PAYMENT_URL_HERE"
                  className="payment-iframe"
                  title="Payment"
                  frameBorder="0"
                /> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products

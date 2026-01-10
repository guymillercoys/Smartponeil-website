import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import './Products.css'

// Set to true to enable the products page, false to show "Coming Soon" message
const PRODUCTS_PAGE_ENABLED = false

function Products() {
  const { language } = useLanguage()
  const t = translations[language]
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState(t.products.allCategories)
  const [selectedProductType, setSelectedProductType] = useState(t.products.allTypes)

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
      sku: 'food-packages',
      name: t.products.foodPackages,
      description: t.products.foodPackagesDesc,
      priceILS: 150,
      image: '/images/product-placeholder.jpg',
      category: t.products.foodCategory,
      productType: t.products.productTypeFood
    },
    {
      id: 2,
      sku: 'essentials',
      name: t.products.essentials,
      description: t.products.essentialsDesc,
      priceILS: 100,
      image: '/images/product-placeholder.jpg',
      category: t.products.foodCategory,
      productType: t.products.productTypeHome
    },
    {
      id: 3,
      sku: 'kitchen-homeware',
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
      sku: 'sim-cards',
      name: t.products.simCards,
      description: t.products.simDesc,
      priceILS: 50,
      image: '/images/product-placeholder.jpg',
      category: t.products.shoppingCategory,
      productType: t.products.productTypeCommunication
    },
    {
      id: 5,
      sku: 'internet-packages',
      name: t.products.internet,
      description: t.products.internetDesc,
      priceILS: 99,
      image: '/images/product-placeholder.jpg',
      category: t.products.shoppingCategory,
      productType: t.products.productTypeCommunication
    },
    {
      id: 6,
      sku: 'mobile-phones',
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
      sku: 'bicycle-new',
      name: t.products.bikesNew,
      description: t.products.bikesNewDesc,
      priceILS: 800,
      image: '/images/product-placeholder.jpg',
      category: t.products.shoppingCategory,
      productType: t.products.productTypeBikes
    },
    {
      id: 8,
      sku: 'bicycle-used',
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
      sku: 'hat-regular',
      name: t.products.hatRegular,
      description: t.products.hatRegularDesc,
      priceILS: 35,
      image: '/images/כובע רגיל.jpeg',
      category: t.products.clothingCategory,
      productType: t.products.productTypeClothing
    },
    {
      id: 10,
      sku: 'hat-sock',
      name: t.products.hatSock,
      description: t.products.hatSockDesc,
      priceILS: 50,
      image: '/images/כובע גרב.jpeg',
      category: t.products.clothingCategory,
      productType: t.products.productTypeClothing
    },
    {
      id: 11,
      sku: 'hat-thai-001',
      name: t.products.hatThai1,
      description: t.products.hatThai1Desc,
      priceILS: 85,
      image: '/images/כובע תאילנדי.jpeg',
      category: t.products.clothingCategory,
      productType: t.products.productTypeClothing
    },
    {
      id: 12,
      sku: 'hat-thai-002',
      name: t.products.hatThai2,
      description: t.products.hatThai2Desc,
      priceILS: 85,
      image: '/images/כובע תאילנדי 2.jpeg',
      category: t.products.clothingCategory,
      productType: t.products.productTypeClothing
    },
    // מוצרי אפל - מסודרים לפי סוגים
    // קבלי טעינה
    {
      id: 13,
      sku: 'charging-cable-001',
      name: t.products.appleChargingCable,
      description: language === 'he' ? 'כבל טעינה איכותי לאפל' : language === 'en' ? 'Quality Apple charging cable' : 'สายชาร์จ Apple คุณภาพดี',
      priceILS: 50,
      image: '/images/WhatsApp Image 2026-01-02 at 06.42.39.jpeg',
      category: t.products.appleCategory,
      productType: t.products.appleChargingCable
    },
    {
      id: 16,
      sku: 'charging-cable-002',
      name: t.products.appleChargingCable,
      description: language === 'he' ? 'כבל טעינה איכותי לאפל' : language === 'en' ? 'Quality Apple charging cable' : 'สายชาร์จ Apple คุณภาพดี',
      priceILS: 50,
      image: '/images/WhatsApp Image 2026-01-02 at 06.42.40 (1).jpeg',
      category: t.products.appleCategory,
      productType: t.products.appleChargingCable
    },
    {
      id: 24,
      sku: 'charging-cable-003',
      name: t.products.appleChargingCable,
      description: language === 'he' ? 'כבל טעינה איכותי לאפל' : language === 'en' ? 'Quality Apple charging cable' : 'สายชาร์จ Apple คุณภาพดี',
      priceILS: 50,
      image: '/images/WhatsApp Image 2026-01-02 at 06.42.41 (4).jpeg',
      category: t.products.appleCategory,
      productType: t.products.appleChargingCable
    },
    {
      id: 29,
      sku: 'charging-cable-004',
      name: t.products.appleChargingCable,
      description: language === 'he' ? 'כבל טעינה איכותי לאפל' : language === 'en' ? 'Quality Apple charging cable' : 'สายชาร์จ Apple คุณภาพดี',
      priceILS: 50,
      image: '/images/WhatsApp Image 2026-01-02 at 06.42.43 (2).jpeg',
      category: t.products.appleCategory,
      productType: t.products.appleChargingCable
    },
    {
      id: 37,
      sku: 'charging-cable-005',
      name: t.products.appleChargingCable,
      description: language === 'he' ? 'כבל טעינה איכותי לאפל' : language === 'en' ? 'Quality Apple charging cable' : 'สายชาร์จ Apple คุณภาพดี',
      priceILS: 50,
      image: '/images/WhatsApp Image 2026-01-02 at 06.42.44 (3).jpeg',
      category: t.products.appleCategory,
      productType: t.products.appleChargingCable
    },
    // iPhone
    {
      id: 14,
      sku: 'iphone-001',
      name: t.products.applePhone,
      description: language === 'he' ? 'iPhone איכותי' : language === 'en' ? 'Quality iPhone' : 'iPhone คุณภาพดี',
      priceILS: 2000,
      image: '/images/WhatsApp Image 2026-01-02 at 06.42.39 (1).jpeg',
      category: t.products.appleCategory,
      productType: t.products.applePhone
    },
    {
      id: 31,
      sku: 'iphone-002',
      name: t.products.applePhone,
      description: language === 'he' ? 'iPhone איכותי' : language === 'en' ? 'Quality iPhone' : 'iPhone คุณภาพดี',
      priceILS: 2000,
      image: '/images/WhatsApp Image 2026-01-02 at 06.42.43 (3).jpeg',
      category: t.products.appleCategory,
      productType: t.products.applePhone
    },
    {
      id: 32,
      sku: 'iphone-003',
      name: t.products.applePhone,
      description: language === 'he' ? 'iPhone איכותי' : language === 'en' ? 'Quality iPhone' : 'iPhone คุณภาพดี',
      priceILS: 2000,
      image: '/images/WhatsApp Image 2026-01-02 at 06.42.43 (4).jpeg',
      category: t.products.appleCategory,
      productType: t.products.applePhone
    },
    {
      id: 33,
      sku: 'iphone-004',
      name: t.products.applePhone,
      description: language === 'he' ? 'iPhone איכותי' : language === 'en' ? 'Quality iPhone' : 'iPhone คุณภาพดี',
      priceILS: 2000,
      image: '/images/WhatsApp Image 2026-01-02 at 06.42.43.jpeg',
      category: t.products.appleCategory,
      productType: t.products.applePhone
    },
    // MacBook
    {
      id: 20,
      sku: 'macbook-001',
      name: t.products.appleMac,
      description: language === 'he' ? 'MacBook איכותי' : language === 'en' ? 'Quality MacBook' : 'MacBook คุณภาพดี',
      priceILS: 3000,
      image: '/images/WhatsApp Image 2026-01-02 at 06.42.41.jpeg',
      category: t.products.appleCategory,
      productType: t.products.appleMac
    },
    // AirPods
    {
      id: 15,
      sku: 'airpods-001',
      name: t.products.appleEarbuds,
      description: language === 'he' ? 'AirPods איכותיים' : language === 'en' ? 'Quality AirPods' : 'AirPods คุณภาพดี',
      priceILS: 300,
      image: '/images/WhatsApp Image 2026-01-02 at 06.42.40.jpeg',
      category: t.products.appleCategory,
      productType: t.products.appleEarbuds
    },
    {
      id: 19,
      sku: 'airpods-002',
      name: t.products.appleEarbuds,
      description: language === 'he' ? 'AirPods איכותיים' : language === 'en' ? 'Quality AirPods' : 'AirPods คุณภาพดี',
      priceILS: 300,
      image: '/images/WhatsApp Image 2026-01-02 at 06.42.40 (4).jpeg',
      category: t.products.appleCategory,
      productType: t.products.appleEarbuds
    },
    {
      id: 21,
      sku: 'airpods-003',
      name: t.products.appleEarbuds,
      description: language === 'he' ? 'AirPods איכותיים' : language === 'en' ? 'Quality AirPods' : 'AirPods คุณภาพดี',
      priceILS: 300,
      image: '/images/WhatsApp Image 2026-01-02 at 06.42.41 (1).jpeg',
      category: t.products.appleCategory,
      productType: t.products.appleEarbuds
    },
    {
      id: 22,
      sku: 'airpods-004',
      name: t.products.appleEarbuds,
      description: language === 'he' ? 'AirPods איכותיים' : language === 'en' ? 'Quality AirPods' : 'AirPods คุณภาพดี',
      priceILS: 300,
      image: '/images/WhatsApp Image 2026-01-02 at 06.42.41 (2).jpeg',
      category: t.products.appleCategory,
      productType: t.products.appleEarbuds
    },
    {
      id: 23,
      sku: 'airpods-005',
      name: t.products.appleEarbuds,
      description: language === 'he' ? 'AirPods איכותיים' : language === 'en' ? 'Quality AirPods' : 'AirPods คุณภาพดี',
      priceILS: 300,
      image: '/images/WhatsApp Image 2026-01-02 at 06.42.41 (3).jpeg',
      category: t.products.appleCategory,
      productType: t.products.appleEarbuds
    },
    // AirTag
    {
      id: 17,
      sku: 'airtag-001',
      name: t.products.appleAirTag,
      description: language === 'he' ? 'AirTag של אפל' : language === 'en' ? 'Apple AirTag' : 'Apple AirTag',
      priceILS: 100,
      image: '/images/WhatsApp Image 2026-01-02 at 06.42.40 (2).jpeg',
      category: t.products.appleCategory,
      productType: t.products.appleAirTag
    },
    {
      id: 36,
      sku: 'airtag-002',
      name: t.products.appleAirTag,
      description: language === 'he' ? 'AirTag של אפל' : language === 'en' ? 'Apple AirTag' : 'Apple AirTag',
      priceILS: 100,
      image: '/images/WhatsApp Image 2026-01-02 at 06.42.44 (2).jpeg',
      category: t.products.appleCategory,
      productType: t.products.appleAirTag
    },
    // iPad
    {
      id: 27,
      sku: 'ipad-001',
      name: t.products.appleIpad,
      description: language === 'he' ? 'iPad איכותי' : language === 'en' ? 'Quality iPad' : 'iPad คุณภาพดี',
      priceILS: 1500,
      image: '/images/WhatsApp Image 2026-01-02 at 06.42.42 (2).jpeg',
      category: t.products.appleCategory,
      productType: t.products.appleIpad
    },
    {
      id: 28,
      sku: 'ipad-002',
      name: t.products.appleIpad,
      description: language === 'he' ? 'iPad איכותי' : language === 'en' ? 'Quality iPad' : 'iPad คุณภาพดี',
      priceILS: 1500,
      image: '/images/WhatsApp Image 2026-01-02 at 06.42.42 (3).jpeg',
      category: t.products.appleCategory,
      productType: t.products.appleIpad
    },
    // Apple Pencil
    {
      id: 26,
      sku: 'apple-pencil-001',
      name: t.products.applePencil,
      description: language === 'he' ? 'Apple Pencil לאייפד' : language === 'en' ? 'Apple Pencil for iPad' : 'Apple Pencil สำหรับ iPad',
      priceILS: 400,
      image: '/images/WhatsApp Image 2026-01-02 at 06.42.42 (1).jpeg',
      category: t.products.appleCategory,
      productType: t.products.applePencil
    },
    // Apple Watch
    {
      id: 25,
      sku: 'apple-watch-001',
      name: t.products.appleWatch,
      description: language === 'he' ? 'Apple Watch איכותי' : language === 'en' ? 'Quality Apple Watch' : 'Apple Watch คุณภาพดี',
      priceILS: 800,
      image: '/images/WhatsApp Image 2026-01-02 at 06.42.42.jpeg',
      category: t.products.appleCategory,
      productType: t.products.appleWatch
    },
    {
      id: 30,
      sku: 'apple-watch-002',
      name: t.products.appleWatch,
      description: language === 'he' ? 'Apple Watch איכותי' : language === 'en' ? 'Quality Apple Watch' : 'Apple Watch คุณภาพดี',
      priceILS: 800,
      image: '/images/WhatsApp Image 2026-01-02 at 06.42.43 (1).jpeg',
      category: t.products.appleCategory,
      productType: t.products.appleWatch
    },
    {
      id: 34,
      sku: 'apple-watch-003',
      name: t.products.appleWatch,
      description: language === 'he' ? 'Apple Watch איכותי' : language === 'en' ? 'Quality Apple Watch' : 'Apple Watch คุณภาพดี',
      priceILS: 800,
      image: '/images/WhatsApp Image 2026-01-02 at 06.42.44.jpeg',
      category: t.products.appleCategory,
      productType: t.products.appleWatch
    }
  ].map(product => ({
    ...product,
    price: formatPrice(product.priceILS)
  }))

  const categories = [t.products.allCategories, t.products.foodCategory, t.products.shoppingCategory, t.products.clothingCategory, t.products.appleCategory]
  
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

  // Handle Buy button click - navigate to checkout with product SKU
  // Test: Clicking "Buy" on iPhone product should navigate to /checkout?product=iphone-001
  const handleBuyClick = (product) => {
    if (product.sku) {
      navigate(`/checkout?product=${encodeURIComponent(product.sku)}`)
    }
  }

  // Show "Coming Soon" message if products page is disabled
  if (!PRODUCTS_PAGE_ENABLED) {
    return (
      <div className="products-page">
        <div className="container">
          <h1 className="page-title">{t.products.comingSoon}</h1>
          <p className="products-intro" style={{ textAlign: 'center', fontSize: '1.2rem', marginTop: '2rem' }}>
            {t.products.comingSoonText}
          </p>
        </div>
      </div>
    )
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
                      disabled={!product.sku}
                    >
                      {t.products.buyNow}
                    </button>
                  </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Products

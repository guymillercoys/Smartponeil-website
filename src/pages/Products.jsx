import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import './Products.css'

function Products() {
  const { language } = useLanguage()
  const t = translations[language]

  const products = [
    {
      category: t.products.communication,
      icon: '📱',
      items: [
        { name: t.products.simCards, description: t.products.simDesc, price: `${t.products.from} ₪50` },
        { name: t.products.internet, description: t.products.internetDesc, price: `${t.products.from} ₪99` },
        { name: t.products.calls, description: t.products.callsDesc, price: `${t.products.from} ₪30` },
        { name: t.products.phones, description: t.products.phonesDesc, price: `${t.products.from} ₪200` }
      ]
    },
    {
      category: t.products.transport,
      icon: '🚲',
      items: [
        { name: t.products.bikesNew, description: t.products.bikesNewDesc, price: `${t.products.from} ₪800` },
        { name: t.products.bikesUsed, description: t.products.bikesUsedDesc, price: `${t.products.from} ₪300` },
        { name: t.products.bikeAccessories, description: t.products.bikeAccessoriesDesc, price: `${t.products.from} ₪50` },
        { name: t.products.bikeRepair, description: t.products.bikeRepairDesc, price: `${t.products.from} ₪80` }
      ]
    },
    {
      category: t.products.food,
      icon: '🛒',
      items: [
        { name: t.products.foodPackages, description: t.products.foodPackagesDesc, price: `${t.products.from} ₪150` },
        { name: t.products.essentials, description: t.products.essentialsDesc, price: `${t.products.from} ₪100` },
        { name: t.products.kitchen, description: t.products.kitchenDesc, price: `${t.products.from} ₪80` }
      ]
    },
    {
      category: t.products.additional,
      icon: '💼',
      items: [
        { name: t.products.legal, description: t.products.legalDesc, price: `${t.products.from} ₪200` },
        { name: t.products.translation, description: t.products.translationDesc, price: `${t.products.from} ₪100` },
        { name: t.products.moneyTransfer, description: t.products.moneyTransferDesc, price: t.products.lowFee },
        { name: t.products.insurance, description: t.products.insuranceDesc, price: `${t.products.from} ₪150` }
      ]
    }
  ]

  return (
    <div className="products-page">
      <div className="container">
        <h1 className="page-title">{t.products.title}</h1>
        <p className="products-intro">{t.products.intro}</p>

        <div className="products-grid">
          {products.map((category, categoryIndex) => (
            <div key={categoryIndex} className="product-category">
              <div className="category-header">
                <div className="category-icon">{category.icon}</div>
                <h2>{category.category}</h2>
              </div>
              <div className="products-list">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="product-card">
                    <div className="product-info">
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                    </div>
                    <div className="product-price">
                      {item.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <section className="products-cta">
          <h2>{t.products.wantMore}</h2>
          <p>{t.products.wantMoreText}</p>
          <Link to="/contact" className="cta-button">{t.products.contactNow}</Link>
        </section>
      </div>
    </div>
  )
}

export default Products







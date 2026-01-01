import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations/translations'
import './Gallery.css'

function Gallery() {
  const { language } = useLanguage()
  const t = translations[language]

  const galleryImages = [
    { id: 1, src: '/images/gallery-1.jpg', alt: language === 'he' ? 'תמונה 1' : language === 'en' ? 'Image 1' : 'ภาพ 1', category: t.gallery.general },
    { id: 2, src: '/images/gallery-2.jpg', alt: language === 'he' ? 'תמונה 2' : language === 'en' ? 'Image 2' : 'ภาพ 2', category: t.gallery.general },
    { id: 3, src: '/images/gallery-3.jpg', alt: language === 'he' ? 'תמונה 3' : language === 'en' ? 'Image 3' : 'ภาพ 3', category: t.gallery.products },
    { id: 4, src: '/images/gallery-4.jpg', alt: language === 'he' ? 'תמונה 4' : language === 'en' ? 'Image 4' : 'ภาพ 4', category: t.gallery.products },
    { id: 5, src: '/images/gallery-5.jpg', alt: language === 'he' ? 'תמונה 5' : language === 'en' ? 'Image 5' : 'ภาพ 5', category: t.gallery.services },
    { id: 6, src: '/images/gallery-6.jpg', alt: language === 'he' ? 'תמונה 6' : language === 'en' ? 'Image 6' : 'ภาพ 6', category: t.gallery.services },
    { id: 7, src: '/images/gallery-7.jpg', alt: language === 'he' ? 'תמונה 7' : language === 'en' ? 'Image 7' : 'ภาพ 7', category: t.gallery.general },
    { id: 8, src: '/images/gallery-8.jpg', alt: language === 'he' ? 'תמונה 8' : language === 'en' ? 'Image 8' : 'ภาพ 8', category: t.gallery.products },
    { id: 9, src: '/images/gallery-9.jpg', alt: language === 'he' ? 'תמונה 9' : language === 'en' ? 'Image 9' : 'ภาพ 9', category: t.gallery.services },
  ]

  const [selectedImage, setSelectedImage] = useState(null)
  const [filter, setFilter] = useState(t.gallery.all)

  const categories = [t.gallery.all, t.gallery.general, t.gallery.products, t.gallery.services]

  const filteredImages = filter === t.gallery.all 
    ? galleryImages 
    : galleryImages.filter(img => img.category === filter)

  const openModal = (image) => {
    setSelectedImage(image)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  const navigateImage = (direction) => {
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id)
    let newIndex
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredImages.length
    } else {
      newIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length
    }
    
    setSelectedImage(filteredImages[newIndex])
  }

  return (
    <div className="gallery-page">
      <div className="container">
        <h1 className="page-title">{t.gallery.title}</h1>
        <p className="gallery-intro">
          {t.gallery.intro}
        </p>

        <div className="gallery-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${filter === category ? 'active' : ''}`}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {filteredImages.map(image => (
            <div
              key={image.id}
              className="gallery-item"
              onClick={() => openModal(image)}
            >
              <img
                src={image.src}
                alt={image.alt}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="18"%3EPlaceholder%3C/text%3E%3C/svg%3E'
                }}
              />
              <div className="gallery-overlay">
                <span className="gallery-category">{image.category}</span>
              </div>
            </div>
          ))}
        </div>

        {selectedImage && (
          <div className="modal" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>×</button>
              <button className="modal-nav prev" onClick={() => navigateImage('prev')}>‹</button>
              <img src={selectedImage.src} alt={selectedImage.alt} />
              <button className="modal-nav next" onClick={() => navigateImage('next')}>›</button>
              <div className="modal-info">
                <p>{selectedImage.alt}</p>
                <span>{selectedImage.category}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Gallery







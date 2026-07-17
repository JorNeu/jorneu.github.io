import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Sliders, 
  MapPin, 
  Mail, 
  Phone, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  CreditCard, 
  QrCode, 
  Menu, 
  Download, 
  ArrowUpRight, 
  Lock,
  Award,
  Clock
} from 'lucide-react';
import { portfolioItems } from './data/portfolioData';
import { presets } from './data/presetsData';

// Servicios del fotógrafo
const services = [
  {
    id: "portrait-session",
    name: "Retrato Editorial & Moda",
    price: 350,
    time: "2 Horas de Sesión",
    description: "Ideal para modelos, profesionales o marcas que buscan retratos artísticos de alta costura con iluminación de estudio o locación urbana.",
    features: [
      "15 fotografías editadas en alta resolución",
      "Asesoría de estilismo y concepto visual",
      "1 locación (estudio o exteriores)",
      "Licencia de uso personal y comercial básico",
      "Presets exclusivos aplicados a la entrega"
    ]
  },
  {
    id: "commercial-campaign",
    name: "Campaña Comercial & Video",
    price: 850,
    time: "Día Completo (6 Horas)",
    description: "Producción audiovisual premium de alta definición. Perfecto para marcas de moda, corporativos o videos musicales con enfoque estético contemporáneo.",
    features: [
      "35 fotografías de alta gama con retoque profesional",
      "Video teaser de 60 segundos en 4K (apto para redes)",
      "Dirección artística e iluminación avanzada de cine",
      "Asistente de iluminación en set",
      "Derechos comerciales globales ilimitados"
    ]
  },
  {
    id: "cinematic-documentary",
    name: "Bodas & Eventos Cinematográficos",
    price: 1500,
    time: "Cobertura Completa",
    description: "Una narrativa documental íntima y poética de tu día especial. Fotografía artística combinada con tomas de video emotivas.",
    features: [
      "150+ fotos editadas con firma estética premium",
      "Película documental de boda (5-8 minutos en 4K)",
      "Video corto de highlights para redes sociales",
      "Galería online privada activa por 1 año",
      "Caja de madera artesanal con 20 impresiones físicas"
    ]
  }
];

// Testimonios de clientes
const testimonials = [
  {
    id: 1,
    name: "Valeria Rossi",
    role: "Diseñadora de Moda, VOGUE Latam",
    text: "La dirección artística de Fotografía2 elevó nuestra última campaña de otoño a otro nivel. El manejo de la iluminación cinematográfica y el retoque final es sencillamente impecable. Estética premium pura.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 2,
    name: "Mateo Kovic",
    role: "Director Creativo, AETHER Brands",
    text: "Comprar sus presets de Lightroom transformó nuestro flujo de trabajo de retoque. Lograr esos tonos de película analógica y cianes profundos solía tomarnos horas. Servicio rápido, limpio y estéticamente superior.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 3,
    name: "Sofía & Andrés",
    role: "Bodas en el Lago di Como",
    text: "Capturar el día más importante de nuestras vidas con ellos fue la mejor decisión. No se siente como la típica sesión acartonada, es más como una cobertura documental poética de película de autor. ¡Increíbles!",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
  }
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('todos');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [checkoutItem, setCheckoutItem] = useState(null);
  
  // Control de slider Antes/Después
  const [sliderPositions, setSliderPositions] = useState({
    "cyberpunk-nights": 50,
    "golden-editorial": 50,
    "nordic-mood": 50
  });

  // Checkout states
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // stripe or mercadopago
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Datos, 2: Pago, 3: Procesando, 4: Éxito
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  
  // Hero slider
  const [heroIndex, setHeroIndex] = useState(0);
  const heroImages = [
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1472214222555-d404758b1c42?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1920&q=80"
  ];

  // Testimonial slider state
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Auto transition hero
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Form submission state
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle preset before/after slider movement
  const handleSliderMove = (e, presetId) => {
    const container = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const offset = clientX - container.left;
    const percentage = Math.max(0, Math.min(100, (offset / container.width) * 100));
    setSliderPositions(prev => ({
      ...prev,
      [presetId]: percentage
    }));
  };

  const handlePortfolioFilter = (category) => {
    setActiveCategory(category);
  };

  const filteredPortfolio = activeCategory === 'todos' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  const startCheckout = (item) => {
    setCheckoutItem(item);
    setCheckoutStep(1);
    setPaymentMethod('stripe');
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setIsCardFlipped(false);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'stripe') {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        triggerNotification("Por favor completa todos los campos de tu tarjeta.");
        return;
      }
    }
    
    setCheckoutStep(3);
    
    setTimeout(() => {
      setCheckoutStep(4);
    }, 3500);
  };

  const triggerNotification = (msg) => {
    setNotificationMsg(msg);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      triggerNotification("Por favor llena todos los campos de contacto.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setContactForm({ name: '', email: '', message: '' });
      triggerNotification("¡Mensaje enviado con éxito! Nos contactaremos pronto.");
    }, 2000);
  };

  const handleNextPhoto = () => {
    const currentIndex = filteredPortfolio.findIndex(item => item.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % filteredPortfolio.length;
    setSelectedPhoto(filteredPortfolio[nextIndex]);
  };

  const handlePrevPhoto = () => {
    const currentIndex = filteredPortfolio.findIndex(item => item.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + filteredPortfolio.length) % filteredPortfolio.length;
    setSelectedPhoto(filteredPortfolio[prevIndex]);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      
      {/* Toast Notification */}
      {showNotification && (
        <div className="toast-notification glass-panel">
          <div className="toast-ping" />
          <p className="toast-message">{notificationMsg}</p>
        </div>
      )}

      {/* Floating glows */}
      <div className="radial-glow" style={{ top: '10%', left: '5%' }} />
      <div className="radial-glow" style={{ top: '40%', right: '5%' }} />
      <div className="radial-glow" style={{ bottom: '15%', left: '20%' }} />

      {/* NAVBAR */}
      <header className="navbar glass-panel">
        <div className="navbar-container">
          <a href="#" className="nav-logo">
            <Camera style={{ width: '22px', height: '22px', color: '#cfa83d' }} />
            FOTOGRAFIA<span>2</span>
          </a>
          
          <nav className="nav-links">
            <a href="#portfolio">Portafolio</a>
            <a href="#presets">Presets</a>
            <a href="#services">Servicios</a>
            <a href="#testimonials">Reseñas</a>
            <a href="#contact">Contacto</a>
          </nav>

          <div>
            <a href="#services" className="btn-gold">
              Reservar Cupo
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-bg-container">
          {heroImages.map((img, idx) => (
            <div 
              key={idx} 
              className={`hero-image ${idx === heroIndex ? 'active' : ''}`}
            >
              <img 
                src={img} 
                alt="Background" 
                className="ken-burns"
              />
            </div>
          ))}
          <div className="hero-overlay-shadow" />
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <Award style={{ width: '14px', height: '14px' }} />
            Estética Premium Digital
          </div>
          
          <h1 className="hero-title">
            La Estética del <br />
            <span className="text-gradient-gold">Instante Supremo</span>
          </h1>
          
          <p className="hero-desc">
            Fotografía conceptual de autor y producciones cinematográficas en formato digital de alta resolución. Capturamos la sofisticación de tu marca y tu vida.
          </p>

          <div className="hero-buttons">
            <a href="#portfolio" className="btn-gold">
              Ver Portafolio <ArrowRight style={{ width: '16px', height: '16px' }} />
            </a>
            <a href="#presets" className="btn-outline">
              Tienda de Presets
            </a>
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <span>Deslizar</span>
          <div className="hero-scroll-line" />
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" className="section-wrapper">
        <div className="section-header">
          <span className="section-badge">Exhibición Digital</span>
          <h2 className="section-title">Portafolio</h2>
          <div className="section-line" />
          
          <div className="portfolio-filters">
            {['todos', 'retrato', 'paisaje', 'comercial', 'street'].map((cat) => (
              <button
                key={cat}
                onClick={() => handlePortfolioFilter(cat)}
                className={`portfolio-filter-btn ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="portfolio-masonry">
          {filteredPortfolio.map((item) => (
            <div 
              key={item.id} 
              className="portfolio-item"
              onClick={() => setSelectedPhoto(item)}
            >
              <img 
                src={item.imageUrl} 
                alt={item.title} 
              />
              <div className="portfolio-overlay">
                <span className="portfolio-badge">
                  {item.category}
                </span>
                <h3 className="portfolio-title">{item.title}</h3>
                
                <div className="portfolio-meta">
                  <span>
                    <Camera style={{ width: '12px', height: '12px', color: '#cfa83d' }} /> {item.metadata.camera.split(' ')[0]}
                  </span>
                  <span>
                    <MapPin style={{ width: '12px', height: '12px' }} /> {item.metadata.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRESETS STORE */}
      <section id="presets" style={{ background: '#0b0b0f', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="section-wrapper">
          <div className="section-header">
            <span className="section-badge">Firma de Revelado Digital</span>
            <h2 className="section-title">Presets Profesionales</h2>
            <div className="section-line" />
            <p className="hero-desc" style={{ marginBottom: 0 }}>
              Utiliza las mismas curvas tonales y calibraciones de color que utilizo en mis producciones comerciales. Desliza para ver la diferencia.
            </p>
          </div>

          <div className="presets-grid">
            {presets.map((preset) => {
              const sliderPos = sliderPositions[preset.id];
              return (
                <div key={preset.id} className="preset-card glass-panel">
                  <div>
                    {/* Before / After Slider */}
                    <div 
                      className="before-after-container"
                      onMouseMove={(e) => handleSliderMove(e, preset.id)}
                      onTouchMove={(e) => handleSliderMove(e, preset.id)}
                    >
                      <div className="before-image">
                        <img src={preset.beforeImage} alt="Antes" />
                        <div className="badge-label badge-before">Original (RAW)</div>
                      </div>
                      
                      <div 
                        className="after-image" 
                        style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
                      >
                        <img src={preset.afterImage} alt="Después" />
                        <div className="badge-label badge-after">Preset</div>
                      </div>

                      <div 
                        className="slider-handle" 
                        style={{ left: `${sliderPos}%` }}
                      >
                        <div className="slider-button">
                          <Sliders style={{ width: '14px', height: '14px' }} />
                        </div>
                      </div>
                    </div>

                    <div className="preset-info-header">
                      <h3 className="preset-name">{preset.name}</h3>
                      <span className="preset-price">${preset.price}</span>
                    </div>

                    <p className="preset-desc">
                      {preset.description}
                    </p>
                  </div>

                  <button 
                    onClick={() => startCheckout(preset)}
                    className="btn-gold"
                    style={{ width: '100%' }}
                  >
                    Adquirir Preset <Download style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="section-wrapper">
        <div className="section-header">
          <span className="section-badge">Producciones y Reservas</span>
          <h2 className="section-title">Servicios Creativos</h2>
          <div className="section-line" />
        </div>

        <div className="services-grid">
          {services.map((svc) => (
            <div 
              key={svc.id} 
              className="service-card glass-panel"
            >
              <div className="service-card-glow" />

              <div>
                <div className="service-header">
                  <div>
                    <h3 className="service-name">{svc.name}</h3>
                    <span className="service-time">
                      <Clock style={{ width: '13px', height: '13px', color: '#cfa83d' }} /> {svc.time}
                    </span>
                  </div>
                </div>

                <div className="service-price-box">
                  <span className="service-price-curr">USD</span>
                  <span className="service-price-val">{svc.price}</span>
                </div>

                <p className="service-desc">
                  {svc.description}
                </p>

                <ul className="service-features">
                  {svc.features.map((feat, idx) => (
                    <li key={idx} className="service-feature-item">
                      <CheckCircle2 style={{ width: '14px', height: '14px', color: '#cfa83d' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => startCheckout(svc)}
                className="btn-outline"
                style={{ width: '100%' }}
              >
                Reservar Cupo <ArrowUpRight style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={{ background: '#0b0b0f', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="section-wrapper">
          <div className="section-header">
            <span className="section-badge">Opiniones de Clientes</span>
            <h2 className="section-title">Lo Que Dicen</h2>
            <div className="section-line" />
          </div>

          <div className="testimonials-container">
            <div className="testimonial-card glass-panel">
              <span className="quote-icon">“</span>
              
              <p className="testimonial-text">
                {testimonials[testimonialIndex].text}
              </p>
              
              <div className="testimonial-author">
                <img 
                  src={testimonials[testimonialIndex].avatar} 
                  alt={testimonials[testimonialIndex].name} 
                  className="author-avatar"
                />
                <div className="author-info">
                  <h4 className="author-name">{testimonials[testimonialIndex].name}</h4>
                  <p className="author-role">{testimonials[testimonialIndex].role}</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="testimonial-nav-btn prev" style={{ position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)' }} onClick={() => setTestimonialIndex(prev => (prev - 1 + testimonials.length) % testimonials.length)}>
                <ChevronLeft style={{ width: '18px', height: '18px' }} />
              </div>
              <div className="testimonial-nav-btn next" style={{ position: 'absolute', top: '50%', right: '15px', transform: 'translateY(-50%)' }} onClick={() => setTestimonialIndex(prev => (prev + 1) % testimonials.length)}>
                <ChevronRight style={{ width: '18px', height: '18px' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section-wrapper">
        <div className="contact-grid">
          <div className="contact-info">
            <span className="section-badge">Agendar Cita</span>
            <h2 className="section-title" style={{ textAlign: 'left', margin: '0.5rem 0 1.5rem' }}>Hablemos de tu Proyecto</h2>
            <div className="section-line" style={{ margin: '0 0 2rem' }} />
            <p className="contact-desc">
              ¿Listo para planificar tu próxima campaña de marca, portafolio personal o producción de cine digital? Completa el formulario y nos comunicaremos en menos de 24 horas.
            </p>

            <div className="contact-methods">
              <div className="contact-method-item">
                <div className="contact-method-icon">
                  <Mail style={{ width: '16px', height: '16px' }} />
                </div>
                <div>
                  <h4 className="contact-method-title">Email directo</h4>
                  <a href="mailto:info@fotografia2.com" className="contact-method-value">info@fotografia2.com</a>
                </div>
              </div>
              
              <div className="contact-method-item">
                <div className="contact-method-icon">
                  <Phone style={{ width: '16px', height: '16px' }} />
                </div>
                <div>
                  <h4 className="contact-method-title">WhatsApp Business</h4>
                  <a href="tel:+5491122334455" className="contact-method-value">+54 9 11 2233-4455</a>
                </div>
              </div>

              <div className="contact-method-item">
                <div className="contact-method-icon">
                  <MapPin style={{ width: '16px', height: '16px' }} />
                </div>
                <div>
                  <h4 className="contact-method-title">Estudio Central</h4>
                  <p className="contact-method-value" style={{ pointerEvents: 'none' }}>Buenos Aires, Argentina (Cobertura internacional)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-container glass-panel">
            <form onSubmit={handleContactSubmit} className="contact-form">
              <div className="form-group">
                <label className="form-label">Tu Nombre</label>
                <input 
                  type="text" 
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="form-input"
                  placeholder="Ej. Juan Pérez"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Correo Electrónico</label>
                <input 
                  type="email" 
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="form-input"
                  placeholder="juan@ejemplo.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cuéntanos sobre tu idea</label>
                <textarea 
                  rows="4" 
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  className="form-textarea"
                  placeholder="Describe la locación, concepto y fecha tentativa..."
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-gold"
                style={{ width: '100%' }}
              >
                {isSubmitting ? "Enviando..." : "Enviar Mensaje"} 
                <ArrowRight style={{ width: '14px', height: '14px' }} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <Camera style={{ width: '18px', height: '18px', color: '#cfa83d' }} />
            FOTOGRAFIA<span>2</span>
          </div>

          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><polygon points="10 15 15 12 10 9 10 15"/></svg>
            </a>
          </div>

          <p className="footer-copy">© {new Date().getFullYear()} Fotografía2. Todos los derechos reservados. Estética Premium.</p>
        </div>
      </footer>

      {/* LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div className="modal-backdrop">
          <button 
            onClick={() => setSelectedPhoto(null)}
            className="modal-close-btn"
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>

          <button 
            onClick={handlePrevPhoto}
            className="modal-nav-btn prev"
          >
            <ChevronLeft style={{ width: '18px', height: '18px' }} />
          </button>

          <button 
            onClick={handleNextPhoto}
            className="modal-nav-btn next"
          >
            <ChevronRight style={{ width: '18px', height: '18px' }} />
          </button>

          <div className="modal-content-container">
            <div className="modal-image-container">
              <img 
                src={selectedPhoto.imageUrl} 
                alt={selectedPhoto.title} 
                className="modal-image"
              />
            </div>

            <div className="modal-details-card glass-panel">
              <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#cfa83d', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
                Ficha Técnica EXIF
              </span>
              <h3 className="details-title">{selectedPhoto.title}</h3>
              
              <div className="details-grid">
                <div className="details-row">
                  <span className="details-label">Cámara</span>
                  <span className="details-value">{selectedPhoto.metadata.camera}</span>
                </div>
                <div className="details-row">
                  <span className="details-label">Lente</span>
                  <span className="details-value">{selectedPhoto.metadata.lens}</span>
                </div>
                <div className="details-row">
                  <span className="details-label">Apertura</span>
                  <span className="details-value" style={{ color: '#cfa83d', fontWeight: '700' }}>{selectedPhoto.metadata.aperture}</span>
                </div>
                <div className="details-row">
                  <span className="details-label">Velocidad</span>
                  <span className="details-value">{selectedPhoto.metadata.shutterSpeed}</span>
                </div>
                <div className="details-row">
                  <span className="details-label">ISO</span>
                  <span className="details-value">{selectedPhoto.metadata.iso}</span>
                </div>
                <div className="details-row">
                  <span className="details-label">Locación</span>
                  <span className="details-value">
                    <MapPin style={{ width: '12px', height: '12px', color: '#cfa83d' }} /> {selectedPhoto.metadata.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {checkoutItem && (
        <div className="checkout-backdrop">
          <div className="checkout-modal-card glass-panel animate-scale-up">
            {checkoutStep !== 3 && (
              <button 
                onClick={() => setCheckoutItem(null)}
                className="checkout-close-btn"
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            )}

            <div className="checkout-grid">
              
              {/* Order Summary */}
              <div className="checkout-summary-column">
                <div>
                  <span className="checkout-summary-item">Detalle del Pedido</span>
                  <h3 className="checkout-summary-name">{checkoutItem.name}</h3>
                  <p className="checkout-summary-desc">
                    {checkoutItem.time ? "Servicio de Sesión Digital" : "Paquete de Revelado Digital"}
                  </p>
                </div>
                
                <div className="checkout-price-breakdown">
                  <div className="price-row">
                    <span>Subtotal</span>
                    <span>USD {checkoutItem.price}</span>
                  </div>
                  <div className="price-row">
                    <span>Impuestos/Tasas</span>
                    <span>USD 0.00</span>
                  </div>
                  <div className="price-total-row">
                    <span className="price-total-label">Total</span>
                    <span className="price-total-val">USD {checkoutItem.price}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Form */}
              <div className="checkout-form-column">
                
                {/* Step 1: Selection */}
                {checkoutStep === 1 && (
                  <div>
                    <h4 className="checkout-section-title">Elige tu Pasarela de Pago</h4>
                    
                    <div className="payment-methods-grid">
                      <button
                        onClick={() => setPaymentMethod('stripe')}
                        className={`payment-method-btn ${paymentMethod === 'stripe' ? 'active' : ''}`}
                      >
                        <CreditCard style={{ width: '22px', height: '22px', color: '#6366f1' }} />
                        <span className="payment-method-btn-title">Stripe</span>
                        <span className="payment-method-btn-sub">Tarjeta Internacional</span>
                      </button>

                      <button
                        onClick={() => setPaymentMethod('mercadopago')}
                        className={`payment-method-btn ${paymentMethod === 'mercadopago' ? 'active' : ''}`}
                      >
                        <QrCode style={{ width: '22px', height: '22px', color: '#009ee3' }} />
                        <span className="payment-method-btn-title">Mercado Pago</span>
                        <span className="payment-method-btn-sub">QR / Transferencia</span>
                      </button>
                    </div>

                    <div className="payment-info-box">
                      <Lock style={{ width: '16px', height: '16px', color: '#cfa83d', flexShrink: 0, marginTop: '2px' }} />
                      <p className="payment-info-text">
                        Transacción encriptada de 256 bits. Cumplimiento de estándares de seguridad PCI-DSS.
                      </p>
                    </div>

                    <button 
                      onClick={() => setCheckoutStep(2)}
                      className="btn-gold"
                      style={{ width: '100%', marginTop: '1rem' }}
                    >
                      Continuar al Pago <ArrowRight style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                )}

                {/* Step 2: Payment forms */}
                {checkoutStep === 2 && (
                  <form onSubmit={handlePaymentSubmit}>
                    
                    {paymentMethod === 'stripe' ? (
                      /* STRIPE FORM */
                      <div className="stripe-form-container">
                        <div className="stripe-header-row">
                          <span>Pago Seguro con Stripe</span>
                          <button 
                            type="button" 
                            onClick={() => setCheckoutStep(1)} 
                            className="stripe-back-btn"
                          >
                            Atrás
                          </button>
                        </div>

                        {/* Credit Card Graphic */}
                        <div className={`credit-card-preview ${isCardFlipped ? 'flipped' : ''}`}>
                          <div className="credit-card-inner">
                            <div className="credit-card-front">
                              <div className="credit-card-front-header">
                                <span className="credit-card-type">PREMIUM PLATINUM</span>
                                <CreditCard style={{ width: '26px', height: '26px', color: '#cfa83d' }} />
                              </div>
                              <span className="credit-card-number">
                                {cardNumber || '•••• •••• •••• ••••'}
                              </span>
                              <div className="credit-card-footer">
                                <div>
                                  <div className="credit-card-label">Titular</div>
                                  <div className="credit-card-holder">{cardName || 'NOMBRE COMPLETO'}</div>
                                </div>
                                <div>
                                  <div className="credit-card-label">Expira</div>
                                  <div className="credit-card-expiry">{cardExpiry || 'MM/AA'}</div>
                                </div>
                              </div>
                            </div>
                            <div className="credit-card-back">
                              <div className="credit-card-back-stripe" />
                              <div className="credit-card-back-cvv-box">
                                <div className="credit-card-back-signature" />
                                <div className="credit-card-back-cvv">{cardCvv || 'CVV'}</div>
                              </div>
                              <p className="credit-card-back-text">
                                Esta tarjeta es intransferible. El uso de esta tarjeta implica la aceptación de los términos de Stripe.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Inputs */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                          <input 
                            type="text"
                            required
                            placeholder="Nombre del Titular"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value.toUpperCase())}
                            className="form-input"
                          />
                          <input 
                            type="text"
                            required
                            placeholder="Número de Tarjeta (16 dígitos)"
                            maxLength="19"
                            value={cardNumber}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\s?/g, '').replace(/\D/g, '');
                              let formatted = '';
                              for (let i = 0; i < val.length; i++) {
                                if (i > 0 && i % 4 === 0) formatted += ' ';
                                formatted += val[i];
                              }
                              setCardNumber(formatted);
                            }}
                            className="form-input"
                          />
                          <div className="input-row">
                            <input 
                              type="text"
                              required
                              placeholder="Exp. (MM/AA)"
                              maxLength="5"
                              value={cardExpiry}
                              onChange={(e) => {
                                let val = e.target.value.replace(/\s?/g, '').replace(/\D/g, '');
                                if (val.length >= 2) {
                                  setCardExpiry(val.slice(0, 2) + '/' + val.slice(2, 4));
                                } else {
                                  setCardExpiry(val);
                                }
                              }}
                              className="form-input"
                            />
                            <input 
                              type="password"
                              required
                              placeholder="CVV"
                              maxLength="3"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                              onFocus={() => setIsCardFlipped(true)}
                              onBlur={() => setIsCardFlipped(false)}
                              className="form-input"
                            />
                          </div>
                        </div>

                        <button 
                          type="submit"
                          className="btn-gold"
                          style={{ width: '100%', marginTop: '0.5rem' }}
                        >
                          Pagar Seguro con Stripe <Lock style={{ width: '13px', height: '13px' }} />
                        </button>
                      </div>
                    ) : (
                      /* MERCADOPAGO FORM */
                      <div className="mercadopago-container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          <span className="checkout-section-title" style={{ margin: 0 }}>Mercado Pago Checkout</span>
                          <button 
                            type="button" 
                            onClick={() => setCheckoutStep(1)} 
                            className="stripe-back-btn"
                          >
                            Atrás
                          </button>
                        </div>

                        <div className="qr-code-box glass-panel">
                          <span className="qr-code-label">Escanea el QR de Pago</span>
                          
                          <div className="qr-code-graphic">
                            <div className="qr-placeholder-grid">
                              {[...Array(16)].map((_, i) => (
                                <div key={i} className={`qr-placeholder-pixel ${i % 3 === 0 || i === 0 || i === 15 ? 'fill' : ''}`} />
                              ))}
                            </div>
                          </div>

                          <div className="qr-code-details">
                            <p>Alias: <span className="qr-alias select-all">fotografia2.estetica.mp</span></p>
                            <p className="qr-cbu">CBU: 0000003100098765432101</p>
                          </div>
                        </div>

                        <div className="payment-info-box" style={{ margin: 0 }}>
                          <QrCode style={{ width: '16px', height: '16px', color: '#009ee3', flexShrink: 0 }} />
                          <p className="payment-info-text" style={{ textAlign: 'left' }}>
                            Transfiere el importe exacto. Al hacer clic abajo, validaremos la acreditación instantánea con la red de Mercado Pago.
                          </p>
                        </div>

                        <button 
                          type="submit"
                          className="btn-gold"
                          style={{ width: '100%', background: 'linear-gradient(135deg, #009ee3 0%, #0073a8 100%)', color: 'white', border: 'none' }}
                        >
                          Confirmar Pago / Acreditado
                        </button>
                      </div>
                    )}

                  </form>
                )}

                {/* Step 3: Processing */}
                {checkoutStep === 3 && (
                  <div className="processing-container">
                    <div className="spinner-ring" />
                    <div>
                      <h4 className="processing-title">Verificando Transacción</h4>
                      <p className="processing-desc">
                        {paymentMethod === 'stripe' 
                          ? "Procesando autorización con el emisor bancario..." 
                          : "Validando comprobante de transferencia y notificaciones IPN..."
                        }
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 4: Success */}
                {checkoutStep === 4 && (
                  <div className="success-container animate-scale-up">
                    <div className="success-icon-box">
                      <CheckCircle2 style={{ width: '32px', height: '32px' }} />
                    </div>

                    <div>
                      <h4 className="success-title" style={{ fontFamily: 'var(--font-serif)' }}>¡Transacción Exitosa!</h4>
                      <div style={{ display: 'inline-block', marginTop: '0.5rem' }}>
                        <span className="success-badge">ID: #F2-{Math.floor(Math.random() * 900000) + 100000}</span>
                      </div>
                    </div>

                    <div className="success-summary-box">
                      <div className="success-summary-header">Resumen de Entrega</div>
                      {checkoutItem.time ? (
                        <div>
                          <p className="success-summary-text">
                            Tu reserva para <strong>{checkoutItem.name}</strong> ha sido agendada con éxito.
                          </p>
                          <p className="success-summary-text" style={{ color: 'var(--accent-gold)', fontWeight: '600', marginBottom: 0 }}>
                            Te enviaremos un email en breve para definir el día y horario de la sesión.
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="success-summary-text">
                            Tu paquete de revelado digital <strong>{checkoutItem.name}</strong> está listo para descargar.
                          </p>
                          <button 
                            onClick={() => triggerNotification("Descarga de Presets iniciada (.ZIP)")}
                            className="btn-gold download-btn"
                          >
                            Descargar Archivos <Download style={{ width: '14px', height: '14px' }} />
                          </button>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => setCheckoutItem(null)}
                      className="btn-outline"
                      style={{ padding: '0.65rem 1.8rem', fontSize: '0.65rem' }}
                    >
                      Cerrar Ventana
                    </button>
                  </div>
                )}

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  Heart,
  Calendar, 
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
  Download, 
  ArrowUpRight, 
  Lock,
  Award,
  Clock,
  Sparkles,
  Sun,
  Moon,
  MessageCircle,
  Scissors,
  Smile,
  ShieldCheck,
  Check
} from 'lucide-react';

// Catálogo de Servicios
const servicesData = [
  { id: "nails-sculpt", name: "Uñas Esculpidas & Manicuría", price: 35, duration: 1, icon: Sparkles, desc: "Esculpido en acrílico o gel premium, esmaltado semipermanente y nail art personalizado." },
  { id: "hair-style", name: "Peinados & Tratamiento Capilar", price: 65, duration: 1, icon: Scissors, desc: "Peinados para eventos, ondas al agua, trenzas de diseño y baño de nutrición profunda." },
  { id: "makeup-social", name: "Maquillaje Social & Editorial", price: 55, duration: 1, icon: Heart, desc: "Makeup de alta definición a prueba de agua con marcas de lujo. Pestañas postizas incluidas." },
  { id: "lash-lifting", name: "Lifting de Pestañas & Perfilado", price: 30, duration: 1, icon: Sparkles, desc: "Arqueado natural de tus pestañas con tinte, y diseño de cejas adaptado a tu rostro." },
  { id: "facial-express", name: "Tratamiento Facial Glow", price: 45, duration: 1, icon: Smile, desc: "Limpieza facial profunda con microdermoabrasión, mascarilla hidratante y sérum de vitamina C." }
];

// Planes de Suscripción Mensual
const subscriptionsData = [
  {
    id: "fiona-basic-pack",
    name: "Pack Fiona Express",
    price: 60,
    recurrence: "Mensual",
    features: [
      "1 Sesión de Uñas Esculpidas al mes",
      "1 Lifting de pestañas con tinte al mes",
      "10% de descuento en servicios adicionales",
      "Prioridad en lista de turnos los días sábados"
    ]
  },
  {
    id: "fiona-vip-club",
    name: "Club Fiona VIP Gold",
    price: 120,
    recurrence: "Mensual",
    features: [
      "2 Sesiones de Uñas Esculpidas o esmaltado al mes",
      "1 Sesión de Maquillaje Social al mes",
      "1 Peinado express o nutrición capilar al mes",
      "20% de descuento en servicios adicionales",
      "Bebida de cortesía (Champagne / Café Gourmet) en cada visita"
    ],
    popular: true
  }
];

// Testimonios
const testimonials = [
  {
    id: 1,
    name: "Camila Fernandez",
    role: "Cliente Regular",
    stars: 5,
    text: "¡El mejor salón de la ciudad! El lifting de pestañas me dura casi dos meses intacto y el trato de las chicas de uñas es sumamente delicado. El modo noche de la web es hermoso para agendar turnos tarde.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 2,
    name: "Juana Rossi",
    role: "Suscripción VIP",
    stars: 5,
    text: "La suscripción mensual VIP me salva la vida para mantener mis uñas y peinados perfectos para mis eventos semanales. El sistema de pago es súper ágil y reservar por WhatsApp me encanta.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 3,
    name: "Martina Gomez",
    role: "Maquillaje Novias",
    stars: 5,
    text: "Me maquillé para mi boda con Fiona. Desde la prueba de maquillaje hasta el gran día, todo fue impecable. La atención al detalle de los peinados capilares y la hidratación facial fue soñada.",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80"
  }
];

// Horarios disponibles (1 hora por turno de lunes a sábado)
const timeSlots = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00"
];

export default function App() {
  const [theme, setTheme] = useState('light'); // light (pastel) or dark (modo noche)
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [clientName, setClientName] = useState('');
  const [clientWhatsapp, setClientWhatsapp] = useState('');
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  
  // Testimonials
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  // Stripe card widget states
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Toast
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');

  // Generar próximos 6 días laborables (saltando domingo)
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    const dates = [];
    let current = new Date();
    
    while (dates.length < 6) {
      current.setDate(current.getDate() + 1);
      const dayOfWeek = current.getDay(); // 0 = Domingo, 6 = Sábado
      
      if (dayOfWeek !== 0) { // Omitir domingos
        const dayLabel = current.toLocaleDateString('es-ES', { weekday: 'short' });
        const formattedDay = dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1, 3);
        const dayNum = current.getDate();
        const fullDateStr = current.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric' });
        
        dates.push({
          label: formattedDay,
          number: dayNum,
          dateString: fullDateStr
        });
      }
    }
    setAvailableDates(dates);
  }, []);

  // Manejar el toggle de tema
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  // Agregar o remover servicios del listado acumulativo
  const handleServiceSelect = (service) => {
    if (selectedServices.some(s => s.id === service.id)) {
      setSelectedServices(prev => prev.filter(s => s.id !== service.id));
    } else {
      setSelectedServices(prev => [...prev, service]);
    }
  };

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  // Notificación flotante
  const triggerNotification = (msg) => {
    setNotificationMsg(msg);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  // Checkout modal
  const handleStartCheckout = (item) => {
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
      if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
        triggerNotification("Por favor completa los datos de tu tarjeta.");
        return;
      }
    }
    
    setCheckoutStep(3);
    
    setTimeout(() => {
      setCheckoutStep(4);
    }, 3500);
  };

  // Integración con WhatsApp
  const handleSendWhatsapp = () => {
    if (selectedServices.length === 0) {
      triggerNotification("Selecciona al menos un servicio para reservar.");
      return;
    }
    if (!selectedDate || !selectedTime) {
      triggerNotification("Elige fecha y hora para tu turno.");
      return;
    }
    if (!clientName) {
      triggerNotification("Completa tu nombre en el formulario.");
      return;
    }

    const servicesText = selectedServices.map(s => `🌸 ${s.name} ($${s.price})`).join('%0A');
    const dateText = `${selectedDate.label} ${selectedDate.number} (${selectedDate.dateString})`;
    const timeText = selectedTime;
    
    const message = `Hola Fiona! Me gustaría reservar un turno con estos detalles:%0A%0A` +
      `👤 *Cliente:* ${clientName}%0A` +
      (clientWhatsapp ? `📞 *Teléfono:* ${clientWhatsapp}%0A` : '') +
      `📅 *Fecha:* ${dateText}%0A` +
      `⏰ *Hora:* ${timeText}%0A` +
      `💖 *Servicios:*%0A${servicesText}%0A%0A` +
      `💰 *Total:* $${totalPrice}%0A` +
      `⏱️ *Duración estimada:* ${totalDuration} hs.%0A%0A` +
      `¿Tienen disponibilidad disponible? ¡Muchas gracias!`;

    const waLink = `https://wa.me/5491122334455?text=${message}`;
    window.open(waLink, '_blank');
    triggerNotification("Mensaje redactado. Abriendo WhatsApp...");
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

      {/* Background radial glows */}
      <div className="bg-rose-radial-glow" style={{ top: '5%', left: '5%' }} />
      <div className="bg-rose-radial-glow" style={{ top: '40%', right: '0%' }} />
      <div className="bg-rose-radial-glow" style={{ bottom: '10%', left: '15%' }} />

      {/* NAVBAR */}
      <header className="navbar glass-panel">
        <div className="navbar-container">
          <a href="#" className="nav-logo">
            FIONA<span>Estética</span>
          </a>
          
          <nav className="nav-links">
            <a href="#services">Servicios</a>
            <a href="#booking">Reservar Turno</a>
            <a href="#subscriptions">Suscripciones</a>
            <a href="#testimonials">Reseñas</a>
          </nav>

          <div className="nav-actions">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              className="theme-toggle-btn"
              aria-label="Cambiar tema"
            >
              {theme === 'light' ? (
                <Moon style={{ width: '18px', height: '18px' }} />
              ) : (
                <Sun style={{ width: '18px', height: '18px' }} />
              )}
            </button>

            <a href="#booking" className="btn-rose" style={{ padding: '0.65rem 1.4rem' }}>
              Agendar Turno
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-info">
            <div className="hero-badge">
              <Sparkles style={{ width: '14px', height: '14px' }} />
              Belleza &amp; Estética Femenina
            </div>
            <h1 className="hero-title">
              Tu esencia, <br />
              <span>tu propio reflejo</span>
            </h1>
            <p className="hero-desc">
              Descubre tratamientos personalizados de manicuría, peinados, cejas y pestañas de diseño, elaborados en un ambiente privado y con los mejores productos de cuidado premium.
            </p>
            <div className="hero-actions">
              <a href="#booking" className="btn-rose">
                Reservar Turno <ArrowRight style={{ width: '15px', height: '15px' }} />
              </a>
              <a href="#services" className="btn-outline-rose">
                Ver Catálogo
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-img-card">
              <img 
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80" 
                alt="Belleza estética facial" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SELECTOR (ACUMULATIVO) */}
      <section id="services" className="section-wrapper">
        <div className="section-header">
          <span className="section-badge">Elige lo que deseas</span>
          <h2 className="section-title">Nuestros Servicios</h2>
          <div className="section-line" />
          <p className="hero-desc" style={{ margin: '0 auto', textAlign: 'center' }}>
            Selecciona uno o más servicios. Se sumarán de forma acumulativa el precio y la duración estimada del turno.
          </p>
        </div>

        <div className="services-grid">
          {servicesData.map((svc) => {
            const isSelected = selectedServices.some(s => s.id === svc.id);
            const Icon = svc.icon;
            return (
              <div 
                key={svc.id} 
                className={`service-select-card glass-panel ${isSelected ? 'selected' : ''}`}
                onClick={() => handleServiceSelect(svc)}
              >
                <div className="service-select-header">
                  <div className="service-icon-box">
                    <Icon style={{ width: '18px', height: '18px' }} />
                  </div>
                  <div className="service-checkbox">
                    {isSelected && <Check style={{ width: '14px', height: '14px' }} />}
                  </div>
                </div>

                <div className="service-details">
                  <h3 className="service-name">{svc.name}</h3>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '1rem', minHeight: '44px' }}>
                    {svc.desc}
                  </p>
                  
                  <div className="service-meta">
                    <span className="service-time">
                      <Clock style={{ width: '13px', height: '13px' }} /> {svc.duration} hora
                    </span>
                    <span className="service-price">${svc.price}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SCHEDULER & BOOKING FORM */}
      <section id="booking" className="section-wrapper" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="section-header">
          <span className="section-badge">Agendamiento de Turnos</span>
          <h2 className="section-title">Elige Fecha y Hora</h2>
          <div className="section-line" />
        </div>

        <div className="booking-scheduler-container">
          
          {/* Day & Time slot selectors */}
          <div>
            <h4 className="scheduler-column-title">1. Elige el Día (Lunes a Sábado)</h4>
            <div className="days-grid" style={{ marginBottom: '2.5rem' }}>
              {availableDates.map((d, index) => {
                const isSelected = selectedDate && selectedDate.number === d.number;
                return (
                  <button 
                    key={index}
                    onClick={() => {
                      setSelectedDate(d);
                      setSelectedTime(null); // Reset hora al cambiar de fecha
                    }}
                    className={`day-btn ${isSelected ? 'selected' : ''}`}
                  >
                    <span className="day-btn-name">{d.label}</span>
                    <span className="day-btn-num">{d.number}</span>
                  </button>
                );
              })}
            </div>

            <h4 className="scheduler-column-title">2. Horarios Disponibles (Intervalos de 1 Hora)</h4>
            <div className="time-slots-grid">
              {timeSlots.map((slot, index) => {
                const isSelected = selectedTime === slot;
                // Deshabilitar slots si no hay fecha seleccionada
                const isDisabled = !selectedDate;
                return (
                  <button 
                    key={index}
                    disabled={isDisabled}
                    onClick={() => setSelectedTime(slot)}
                    className={`time-slot-btn ${isSelected ? 'selected' : ''}`}
                  >
                    <Clock style={{ width: '14px', height: '14px', opacity: 0.8 }} />
                    {slot.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Client Info Form */}
          <div className="contact-form-container glass-panel">
            <h4 className="scheduler-column-title" style={{ marginBottom: '1.25rem' }}>3. Datos de la Cliente</h4>
            
            <div className="contact-form">
              <div className="form-group">
                <label className="form-label">Nombre Completo</label>
                <input 
                  type="text" 
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="form-input"
                  placeholder="Ej. Sofía Rossi"
                />
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp de Contacto (opcional)</label>
                <input 
                  type="tel" 
                  value={clientWhatsapp}
                  onChange={(e) => setClientWhatsapp(e.target.value)}
                  className="form-input"
                  placeholder="Ej. +54 9 11 9999-8888"
                />
              </div>

              <div className="payment-info-box" style={{ margin: '0.5rem 0' }}>
                <ShieldCheck style={{ width: '18px', height: '18px', color: 'var(--accent-rose)', flexShrink: 0, marginTop: '2px' }} />
                <p className="payment-info-text">
                  Garantizamos confidencialidad absoluta en tu contacto. Utilizaremos el WhatsApp solo para notificaciones del turno.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Summary Panel */}
        <div className="summary-panel glass-panel">
          <div className="summary-grid">
            
            {/* Description box */}
            <div className="summary-details-box">
              <div>
                <span className="section-badge" style={{ fontSize: '9px', fontWeight: 'bold' }}>Resumen de Reserva</span>
                <h3 style={{ fontSize: '1.85rem', margin: '0.25rem 0 0.5rem' }}>Detalle de tu Turno</h3>
                
                {selectedServices.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ningún servicio seleccionado aún.</p>
                ) : (
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Servicios acumulados:</p>
                    <div className="summary-services-list">
                      {selectedServices.map(s => (
                        <span key={s.id} className="summary-service-tag">{s.name}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="summary-datetime-display">
                <div className="summary-datetime-item">
                  <Calendar style={{ width: '16px', height: '16px' }} />
                  <span>{selectedDate ? `${selectedDate.label} ${selectedDate.number} (${selectedDate.dateString})` : "Día no seleccionado"}</span>
                </div>
                <div className="summary-datetime-item">
                  <Clock style={{ width: '16px', height: '16px' }} />
                  <span>{selectedTime ? selectedTime : "Hora no seleccionada"}</span>
                </div>
              </div>
            </div>

            {/* Totals & actions box */}
            <div className="summary-totals-box">
              <div className="totals-summary-row">
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Monto Total Estimado</span>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Duración: {totalDuration} hs</div>
                </div>
                <div className="totals-val">${totalPrice}</div>
              </div>

              <div className="summary-actions">
                {/* Send via WhatsApp button */}
                <button 
                  onClick={handleSendWhatsapp}
                  className="btn-whatsapp"
                >
                  <MessageCircle style={{ width: '16px', height: '16px' }} />
                  Enviar Turno por WhatsApp
                </button>

                {/* Pay Online button */}
                <button 
                  onClick={() => {
                    if (selectedServices.length === 0) {
                      triggerNotification("Selecciona al menos un servicio para reservar.");
                      return;
                    }
                    if (!selectedDate || !selectedTime) {
                      triggerNotification("Elige fecha y hora para tu turno.");
                      return;
                    }
                    if (!clientName) {
                      triggerNotification("Completa tu nombre en el formulario.");
                      return;
                    }
                    handleStartCheckout({
                      name: `Turno Estético: ${selectedServices.map(s => s.name.split(' ')[0]).join(', ')}`,
                      price: totalPrice,
                      time: `${selectedDate.label} ${selectedDate.number} (${selectedTime})`
                    });
                  }}
                  className="btn-rose"
                  style={{ width: '100%' }}
                >
                  <CreditCard style={{ width: '16px', height: '16px' }} />
                  Pagar e Inscribir Online
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SUBSCRIPTIONS AND PACKS */}
      <section id="subscriptions" className="section-wrapper" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="section-header">
          <span className="section-badge">Club Fiona y Membresías</span>
          <h2 className="section-title">Planes Mensuales</h2>
          <div className="section-line" />
          <p className="hero-desc" style={{ margin: '0 auto', textAlign: 'center' }}>
            Ahorra contratando nuestros paquetes de beneficios recurrentes. Sesiones mensuales fijas y descuentos exclusivos.
          </p>
        </div>

        <div className="subscriptions-grid">
          {subscriptionsData.map((sub) => (
            <div 
              key={sub.id} 
              className={`sub-card glass-panel ${sub.popular ? 'popular' : ''}`}
            >
              {sub.popular && <span className="sub-popular-badge">Recomendado</span>}
              
              <div>
                <div className="sub-card-header">
                  <h3 className="sub-name">{sub.name}</h3>
                  <span className="sub-recurrence">{sub.recurrence}</span>
                </div>

                <div className="sub-price-box">
                  <span className="sub-price-val">${sub.price}</span>
                  <span className="sub-price-period">/mes</span>
                </div>

                <ul className="sub-features">
                  {sub.features.map((feat, idx) => (
                    <li key={idx} className="sub-feature-item">
                      <CheckCircle2 style={{ width: '14px', height: '14px', color: 'var(--accent-rose)', flexShrink: 0, marginTop: '1.5px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => handleStartCheckout({
                  name: `Membresía: ${sub.name}`,
                  price: sub.price,
                  time: "Recurrencia Mensual Automática"
                })}
                className="btn-rose"
                style={{ width: '100%', background: sub.popular ? undefined : 'transparent', border: sub.popular ? undefined : '1px solid var(--border-color-hover)', color: sub.popular ? undefined : 'var(--text-primary)' }}
              >
                Suscribirme Club
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="section-wrapper">
          <div className="section-header">
            <span className="section-badge">Nuestras Clientas</span>
            <h2 className="section-title">Opiniones y Reseñas</h2>
            <div className="section-line" />
          </div>

          <div className="testimonials-container">
            <div className="testimonial-card glass-panel">
              <span className="quote-icon">“</span>
              
              <div className="testimonial-stars">
                {[...Array(testimonials[testimonialIdx].stars)].map((_, i) => (
                  <Sparkles key={i} style={{ width: '16px', height: '16px', fill: 'currentColor' }} />
                ))}
              </div>

              <p className="testimonial-text">
                {testimonials[testimonialIdx].text}
              </p>
              
              <div className="testimonial-author">
                <img 
                  src={testimonials[testimonialIdx].avatar} 
                  alt={testimonials[testimonialIdx].name} 
                  className="author-avatar"
                />
                <div className="author-info">
                  <h4 className="author-name">{testimonials[testimonialIdx].name}</h4>
                  <p className="author-role">{testimonials[testimonialIdx].role}</p>
                </div>
              </div>

              {/* Slider nav */}
              <div className="testimonial-nav-btn prev" style={{ position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)' }} onClick={() => setTestimonialIdx(prev => (prev - 1 + testimonials.length) % testimonials.length)}>
                <ChevronLeft style={{ width: '16px', height: '16px' }} />
              </div>
              <div className="testimonial-nav-btn next" style={{ position: 'absolute', top: '50%', right: '15px', transform: 'translateY(-50%)' }} onClick={() => setTestimonialIdx(prev => (prev + 1) % testimonials.length)}>
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            FIONA<span>Estética</span>
          </div>

          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>

          <p className="footer-copy">© {new Date().getFullYear()} Fiona Estética. Todos los derechos reservados. Estética Premium Femenina.</p>
        </div>
      </footer>

      {/* CHECKOUT MODAL (STRIPE & MERCADOPAGO) */}
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
              
              {/* Summary */}
              <div className="checkout-summary-column">
                <div>
                  <span className="checkout-summary-item">Turno / Suscripción</span>
                  <h3 className="checkout-summary-name">{checkoutItem.name}</h3>
                  <p className="checkout-summary-desc">
                    {checkoutItem.time}
                  </p>
                </div>
                
                <div className="checkout-price-breakdown">
                  <div className="price-row">
                    <span>Monto Turno</span>
                    <span>USD {checkoutItem.price}</span>
                  </div>
                  <div className="price-row">
                    <span>Impuesto de Red</span>
                    <span>USD 0.00</span>
                  </div>
                  <div className="price-total-row">
                    <span className="price-total-label">Total</span>
                    <span className="price-total-val">USD {checkoutItem.price}</span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="checkout-form-column">
                
                {/* Step 1: Pasarela */}
                {checkoutStep === 1 && (
                  <div>
                    <h4 className="checkout-section-title">Elige Pasarela de Pago</h4>
                    
                    <div className="payment-methods-grid">
                      <button
                        onClick={() => setPaymentMethod('stripe')}
                        className={`payment-method-btn ${paymentMethod === 'stripe' ? 'active' : ''}`}
                      >
                        <CreditCard style={{ width: '22px', height: '22px', color: '#ec4899' }} />
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
                      <Lock style={{ width: '16px', height: '16px', color: 'var(--accent-rose)', flexShrink: 0, marginTop: '2px' }} />
                      <p className="payment-info-text">
                        Transacción encriptada de 256 bits. Cumplimiento de estándares de seguridad PCI-DSS.
                      </p>
                    </div>

                    <button 
                      onClick={() => setCheckoutStep(2)}
                      className="btn-rose"
                      style={{ width: '100%', marginTop: '1rem' }}
                    >
                      Continuar al Pago <ArrowRight style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                )}

                {/* Step 2: Payment flow */}
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

                        {/* Card graphical widget */}
                        <div className={`credit-card-preview ${isCardFlipped ? 'flipped' : ''}`}>
                          <div className="credit-card-inner">
                            <div className="credit-card-front">
                              <div className="credit-card-front-header">
                                <span className="credit-card-type">FIONA VIP CARD</span>
                                <Sparkles style={{ width: '24px', height: '24px', color: 'white' }} />
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
                                Autorizado para consumos estéticos recurrentes en Fiona Salón de Belleza.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Fields */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
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
                          className="btn-rose"
                          style={{ width: '100%', marginTop: '0.5rem' }}
                        >
                          Confirmar Pago Seguro <Lock style={{ width: '13px', height: '13px' }} />
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
                                <div key={i} className={`qr-placeholder-pixel ${i % 2 === 0 ? 'fill' : ''}`} />
                              ))}
                            </div>
                          </div>

                          <div className="qr-code-details">
                            <p>Alias: <span className="qr-alias select-all">fiona.estetica.mp</span></p>
                            <p className="qr-cbu">CBU: 0000003100098765432102</p>
                          </div>
                        </div>

                        <div className="payment-info-box" style={{ margin: 0 }}>
                          <QrCode style={{ width: '16px', height: '16px', color: '#009ee3', flexShrink: 0 }} />
                          <p className="payment-info-text" style={{ textAlign: 'left' }}>
                            Transfiere el importe total. Acreditado automático mediante nuestra API webhook de Mercado Pago.
                          </p>
                        </div>

                        <button 
                          type="submit"
                          className="btn-rose"
                          style={{ width: '100%', background: 'linear-gradient(135deg, #009ee3 0%, #0073a8 100%)', color: 'white', border: 'none' }}
                        >
                          Confirmar Acreditación MP
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
                      <h4 className="processing-title">Verificando Pago</h4>
                      <p className="processing-desc">
                        {paymentMethod === 'stripe' 
                          ? "Procesando autorización con el emisor bancario..." 
                          : "Validando comprobante de transferencia y notificaciones de red..."
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
                      <h4 className="success-title">¡Reserva Confirmada!</h4>
                      <div style={{ display: 'inline-block', marginTop: '0.5rem' }}>
                        <span className="success-badge">ID: #FI-{Math.floor(Math.random() * 900000) + 100000}</span>
                      </div>
                    </div>

                    <div className="success-summary-box">
                      <div className="success-summary-header">Turno Confirmado</div>
                      <p className="success-summary-text">
                        Hemos registrado tu reserva/suscripción para <strong>{checkoutItem.name}</strong>.
                      </p>
                      <p className="success-summary-text" style={{ color: 'var(--accent-rose)', fontWeight: '600', marginBottom: 0 }}>
                        Recibirás un SMS/WhatsApp con el recordatorio del turno y las instrucciones del salón. ¡Te esperamos!
                      </p>
                    </div>

                    <button 
                      onClick={() => {
                        setCheckoutItem(null);
                        // Reset reserva al finalizar pago exitoso
                        setSelectedServices([]);
                        setSelectedDate(null);
                        setSelectedTime(null);
                      }}
                      className="btn-outline-rose"
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

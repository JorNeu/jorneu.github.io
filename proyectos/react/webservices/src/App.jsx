import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sun, Moon, Sparkles, Clock, Star, ChevronLeft, ChevronRight,
  Check, MessageCircle, CreditCard, Wallet, Send, X,
  Scissors, Brush, Gem, Flower2, Zap, HeartHandshake, Crown,
  Globe, Share2, Phone
} from 'lucide-react';

// Inline SVG social icons (lucide-react v1.x doesn't export Instagram/Facebook)
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
import './App.css';

/* ==========================================
   DATA
   ========================================== */
const SERVICES = [
  { id: 1, name: 'Manicura Clásica', price: 2500, duration: 60, emoji: '💅', category: 'uñas', icon: Gem },
  { id: 2, name: 'Manicura Semipermanente', price: 3500, duration: 60, emoji: '✨', category: 'uñas', icon: Gem },
  { id: 3, name: 'Uñas Acrílicas', price: 5500, duration: 90, emoji: '💎', category: 'uñas', icon: Gem },
  { id: 4, name: 'Diseño de Uñas', price: 1500, duration: 30, emoji: '🎨', category: 'uñas', icon: Brush },
  { id: 5, name: 'Peinado Styling', price: 4000, duration: 60, emoji: '💇‍♀️', category: 'cabello', icon: Scissors },
  { id: 6, name: 'Brushing Premium', price: 3000, duration: 60, emoji: '🌟', category: 'cabello', icon: Scissors },
  { id: 7, name: 'Maquillaje Social', price: 5000, duration: 60, emoji: '💄', category: 'maquillaje', icon: Brush },
  { id: 8, name: 'Maquillaje de Novia', price: 9500, duration: 120, emoji: '👰', category: 'maquillaje', icon: Crown },
  { id: 9, name: 'Lifting de Pestañas', price: 4500, duration: 60, emoji: '👁️', category: 'lifting', icon: Zap },
  { id: 10, name: 'Lifting Facial', price: 7500, duration: 90, emoji: '🌸', category: 'lifting', icon: Flower2 },
  { id: 11, name: 'Depilación Facial', price: 2000, duration: 30, emoji: '🌺', category: 'facial', icon: Flower2 },
  { id: 12, name: 'Tratamiento Facial', price: 6000, duration: 75, emoji: '🧴', category: 'facial', icon: HeartHandshake },
];

const PLANS = [
  {
    id: 1,
    name: 'Esencial',
    emoji: '🌸',
    desc: 'Perfecto para empezar tu rutina de belleza',
    price: 9900,
    period: '/mes',
    services: 2,
    features: ['2 turnos por mes', 'Manicura incluida', 'Descuento 10% en extras', 'Recordatorio por WhatsApp'],
    popular: false,
  },
  {
    id: 2,
    name: 'Premium',
    emoji: '💎',
    desc: 'La experiencia completa de cuidado personal',
    price: 19900,
    period: '/mes',
    services: 4,
    features: ['4 turnos por mes', 'Manicura + Pedicura', 'Maquillaje social incluido', 'Descuento 20% en extras', 'Prioridad en reservas', 'Recordatorio por WhatsApp'],
    popular: true,
  },
  {
    id: 3,
    name: 'Novia / Evento',
    emoji: '👑',
    desc: 'Pack especial para tu día más importante',
    price: 35000,
    period: 'único',
    services: 99,
    features: ['Maquillaje de novia', 'Peinado de novia', 'Manicura + Pedicura', 'Pestañas y lifting', 'Prueba previa incluida', 'Atención personalizada'],
    popular: false,
  },
];

const INITIAL_REVIEWS = [
  {
    id: 1,
    name: 'Valentina R.',
    service: 'Maquillaje Social',
    text: 'El trabajo fue increíble, me sentí una reina. Las chicas son super profesionales y el ambiente es hermoso. ¡Vuelvo siempre!',
    rating: 5,
    date: '15 Jun 2026',
    avatar: 'https://i.pravatar.cc/80?img=5',
  },
  {
    id: 2,
    name: 'Camila T.',
    service: 'Uñas Acrílicas',
    text: 'Mis uñas quedaron espectaculares, duraron muchísimo. El diseño fue exactamente lo que pedí. 100% recomendado.',
    rating: 5,
    date: '28 May 2026',
    avatar: 'https://i.pravatar.cc/80?img=9',
  },
  {
    id: 3,
    name: 'Lucía M.',
    service: 'Lifting de Pestañas',
    text: 'Primera vez que me hacía lifting y quedé enamorada del resultado. Cero molestias y el efecto duró 2 meses.',
    rating: 5,
    date: '10 Jun 2026',
    avatar: 'https://i.pravatar.cc/80?img=6',
  },
  {
    id: 4,
    name: 'Sofía B.',
    service: 'Peinado Styling',
    text: 'Fui para un evento y quedé perfecta. Muy buena atención, el lugar es re lindo y se nota que usan productos de calidad.',
    rating: 4,
    date: '2 Jul 2026',
    avatar: 'https://i.pravatar.cc/80?img=16',
  },
  {
    id: 5,
    name: 'María J.',
    service: 'Tratamiento Facial',
    text: 'Mi piel cambió totalmente después del tratamiento. Lo hago una vez al mes y es mi lugar de consentimiento personal.',
    rating: 5,
    date: '5 Jul 2026',
    avatar: 'https://i.pravatar.cc/80?img=47',
  },
  {
    id: 6,
    name: 'Fernanda K.',
    service: 'Maquillaje de Novia',
    text: 'Para mi casamiento confié en Fiona y fue la mejor decisión. Duró todo el día y quedé exactamente como soñé.',
    rating: 5,
    date: '20 Jun 2026',
    avatar: 'https://i.pravatar.cc/80?img=21',
  },
];

const WHATSAPP_NUMBER = '5491112345678'; // ← reemplazar con número real

/* ==========================================
   HELPERS
   ========================================== */
const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function getWeekDays(startDate) {
  const days = [];
  const d = new Date(startDate);
  // Find Monday of the current week
  const dayOfWeek = d.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  d.setDate(d.getDate() + diff);
  for (let i = 0; i < 6; i++) { // Mon-Sat
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function generateSlots() {
  const slots = [];
  for (let h = 9; h <= 17; h++) {
    slots.push(`${String(h).padStart(2,'0')}:00`);
    if (h < 17) slots.push(`${String(h).padStart(2,'0')}:30`);
  }
  return slots;
}

const ALL_SLOTS = generateSlots();

// Simulate some booked slots deterministically
function isBooked(dateStr, slot) {
  const hash = (dateStr + slot).split('').reduce((a,c) => a + c.charCodeAt(0), 0);
  return hash % 7 === 0;
}

function buildWhatsAppMsg(selectedServices, day, slot) {
  const names = selectedServices.map(s => s.name).join(', ');
  const total = selectedServices.reduce((s, svc) => s + svc.price, 0);
  const dayLabel = day
    ? `${DAYS_ES[day.getDay()]} ${day.getDate()} de ${MONTHS_ES[day.getMonth()]}`
    : '';
  const timeLabel = slot || '';
  const msg = `¡Hola Fiona! 💕 Me gustaría reservar un turno.\n\n📋 *Servicios:* ${names}\n📅 *Día:* ${dayLabel}\n🕐 *Horario:* ${timeLabel}\n💰 *Total estimado:* $${total.toLocaleString('es-AR')}\n\n¿Está disponible? ¡Muchas gracias! 🌸`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function formatPrice(n) {
  return `$${n.toLocaleString('es-AR')}`;
}

/* ==========================================
   SUB-COMPONENTS
   ========================================== */

function Toast({ msg }) {
  return <div className={`toast ${msg ? 'show' : ''}`}>{msg}</div>;
}

function StarRating({ value }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= value ? 'var(--gold)' : 'var(--border)' }}>★</span>
      ))}
    </div>
  );
}

function StarRatingInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="star-rating-input">
      {[1,2,3,4,5].map(i => (
        <button
          key={i}
          type="button"
          className={i <= (hovered || value) ? 'active' : ''}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}
          aria-label={`${i} estrella${i > 1 ? 's' : ''}`}
        >★</button>
      ))}
    </div>
  );
}

/* ==========================================
   MAIN APP
   ========================================== */
export default function App() {
  const [dark, setDark] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('todos');

  // Booking state
  const [weekStart, setWeekStart] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modalPlan, setModalPlan] = useState(null);

  // Reviews
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [reviewForm, setReviewForm] = useState({ name: '', service: '', text: '', rating: 5 });

  // Toast
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  // Scroll reveal
  const revealRefs = useRef([]);

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
  }, [dark]);

  // Scroll reveal observer
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    const els = document.querySelectorAll('.reveal');
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [reviews]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3000);
  }, []);

  const toggleService = (svc) => {
    setSelectedServices(prev =>
      prev.find(s => s.id === svc.id)
        ? prev.filter(s => s.id !== svc.id)
        : [...prev, svc]
    );
  };

  const totalPrice = selectedServices.reduce((s, svc) => s + svc.price, 0);

  const weekDays = getWeekDays(weekStart);

  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
    setSelectedDay(null);
    setSelectedSlot(null);
  };

  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
    setSelectedDay(null);
    setSelectedSlot(null);
  };

  const dayStr = (d) => d ? `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` : '';

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.text) {
      showToast('Por favor completá nombre y comentario');
      return;
    }
    const now = new Date();
    const dateLabel = `${now.getDate()} ${MONTHS_ES[now.getMonth()].slice(0,3)} ${now.getFullYear()}`;
    setReviews(prev => [{
      id: Date.now(),
      name: reviewForm.name,
      service: reviewForm.service || 'Servicio Fiona',
      text: reviewForm.text,
      rating: reviewForm.rating,
      date: dateLabel,
      avatar: `https://i.pravatar.cc/80?u=${reviewForm.name}`,
    }, ...prev]);
    setReviewForm({ name: '', service: '', text: '', rating: 5 });
    showToast('¡Gracias por tu reseña! 💕');
  };

  const canBook = selectedServices.length > 0 && selectedDay && selectedSlot;

  const handleWhatsApp = () => {
    if (!canBook) { showToast('Seleccioná servicios, día y horario primero'); return; }
    window.open(buildWhatsAppMsg(selectedServices, selectedDay, selectedSlot), '_blank');
  };

  const CATEGORIES = ['todos', ...Array.from(new Set(SERVICES.map(s => s.category)))];
  const visibleServices = categoryFilter === 'todos' ? SERVICES : SERVICES.filter(s => s.category === categoryFilter);

  return (
    <>
      {/* ======================== NAVBAR ======================== */}
      <nav className="navbar" role="navigation" aria-label="Menú principal">
        <div className="navbar-brand">
          <div className="brand-logo" aria-hidden="true">F</div>
          <span className="brand-name">Fiona</span>
        </div>

        <ul className="nav-links" role="list">
          {[
            ['#servicios', 'Servicios'],
            ['#turnos', 'Turnos'],
            ['#planes', 'Planes'],
            ['#resenas', 'Reseñas'],
          ].map(([href, label]) => (
            <li key={href}>
              <a href={href} onClick={e => { e.preventDefault(); document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }); }}>
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <button
            id="theme-toggle"
            className="theme-toggle"
            onClick={() => setDark(d => !d)}
            aria-label={dark ? 'Activar modo claro' : 'Activar modo oscuro'}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a href="#turnos" className="nav-cta" onClick={e => { e.preventDefault(); document.getElementById('turnos')?.scrollIntoView({ behavior: 'smooth' }); }}>
            Reservar
          </a>
        </div>
      </nav>

      {/* ======================== HERO ======================== */}
      <section id="inicio" className="hero-section" aria-labelledby="hero-title">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-blobs" aria-hidden="true">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>

        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">
                <Sparkles size={13} /> Studio de Belleza Premium
              </div>
              <h1 id="hero-title" className="hero-title">
                Tu belleza,<br />
                <span className="gradient-text">nuestra pasión</span>
              </h1>
              <p className="hero-subtitle">
                Uñas, peinados, maquillaje, lifting y mucho más.
                Reservá tu turno online y viví la experiencia Fiona.
              </p>
              <div className="hero-actions">
                <button
                  id="hero-cta"
                  className="btn-primary"
                  onClick={() => document.getElementById('turnos')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Sparkles size={17} /> Reservar turno
                </button>
                <button
                  className="btn-ghost"
                  onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Ver servicios
                </button>
              </div>
              <div className="hero-stats" aria-label="Estadísticas">
                <div className="hero-stat">
                  <strong>+500</strong>
                  <span>Clientas felices</span>
                </div>
                <div className="hero-stat">
                  <strong>5★</strong>
                  <span>Calificación</span>
                </div>
                <div className="hero-stat">
                  <strong>6 días</strong>
                  <span>Atención</span>
                </div>
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="hero-card">
                <div className="hero-card-icon" style={{ background: 'rgba(248,180,217,0.2)' }}>💅</div>
                <div className="hero-card-text">
                  <strong>Manicura Semipermanente</strong>
                  <span>Disponible hoy</span>
                </div>
              </div>
              <div className="hero-card">
                <div className="hero-card-icon" style={{ background: 'rgba(216,180,254,0.2)' }}>💄</div>
                <div className="hero-card-text">
                  <strong>Maquillaje Profesional</strong>
                  <span>Turnos este mes</span>
                </div>
              </div>
              <div className="hero-card">
                <div className="hero-card-icon" style={{ background: 'rgba(252,213,176,0.2)' }}>🌸</div>
                <div className="hero-card-text">
                  <strong>Lifting Facial</strong>
                  <span>Nuevo tratamiento</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== SERVICIOS ======================== */}
      <section id="servicios" className="services-section" aria-labelledby="services-title">
        <div className="container">
          <div className="section-header reveal">
            <div className="section-label">Nuestros Servicios</div>
            <h2 id="services-title">Todo lo que necesitás en un solo lugar</h2>
            <p>Seleccioná uno o varios servicios y armá tu turno a medida</p>
          </div>

          {/* Category filter */}
          <div className="reveal" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                id={`cat-${cat}`}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  padding: '6px 18px',
                  borderRadius: '999px',
                  border: '1.5px solid',
                  borderColor: categoryFilter === cat ? 'var(--accent)' : 'var(--border)',
                  background: categoryFilter === cat ? 'var(--accent)' : 'transparent',
                  color: categoryFilter === cat ? '#fff' : 'var(--text)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all var(--transition)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="services-grid">
            {visibleServices.map((svc, i) => {
              const isSelected = !!selectedServices.find(s => s.id === svc.id);
              return (
                <article
                  key={svc.id}
                  id={`service-${svc.id}`}
                  className={`service-card reveal ${isSelected ? 'selected' : ''}`}
                  style={{ transitionDelay: `${i * 50}ms` }}
                  onClick={() => toggleService(svc)}
                  role="button"
                  aria-pressed={isSelected}
                  aria-label={`${svc.name} – ${formatPrice(svc.price)}`}
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && toggleService(svc)}
                >
                  <div className="service-check" aria-hidden="true"><Check size={13} /></div>
                  <div className="service-icon-wrap" aria-hidden="true">{svc.emoji}</div>
                  <div className="service-name">{svc.name}</div>
                  <div className="service-duration">
                    <Clock size={12} /> {svc.duration} min
                  </div>
                  <div className="service-price">{formatPrice(svc.price)}</div>
                </article>
              );
            })}
          </div>

          {/* Cart bar */}
          {selectedServices.length > 0 && (
            <div className="cart-bar reveal" role="region" aria-label="Servicios seleccionados">
              <div className="cart-bar-info">
                <div className="cart-total-label">Total estimado</div>
                <div className="cart-total-amount">{formatPrice(totalPrice)}</div>
              </div>
              <div className="cart-selected-tags">
                {selectedServices.map(s => (
                  <span key={s.id} className="cart-tag">{s.emoji} {s.name}</span>
                ))}
              </div>
              <div className="cart-actions">
                <button
                  id="go-book-btn"
                  className="btn-primary"
                  onClick={() => document.getElementById('turnos')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Reservar <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ======================== TURNOS / BOOKING ======================== */}
      <section id="turnos" className="booking-section" aria-labelledby="booking-title">
        <div className="container">
          <div className="section-header reveal">
            <div className="section-label">Reservá tu turno</div>
            <h2 id="booking-title">Elegí día y horario</h2>
            <p>Lunes a Sábado · Turnos de 1 hora · Confirmación por WhatsApp</p>
          </div>

          <div className="booking-wrapper">
            {/* Calendar panel */}
            <div className="booking-panel reveal">
              <h3><Sparkles size={18} /> Seleccioná el día</h3>

              <div className="week-nav" aria-label="Navegación de semana">
                <button
                  id="prev-week"
                  className="week-nav-btn"
                  onClick={prevWeek}
                  aria-label="Semana anterior"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="week-nav-label">
                  {MONTHS_ES[weekDays[0].getMonth()]} {weekDays[0].getFullYear()}
                </span>
                <button
                  id="next-week"
                  className="week-nav-btn"
                  onClick={nextWeek}
                  aria-label="Semana siguiente"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="days-row" role="group" aria-label="Días disponibles">
                {weekDays.map((day, i) => {
                  const isActive = selectedDay && dayStr(selectedDay) === dayStr(day);
                  const isPast = day < new Date(new Date().setHours(0,0,0,0));
                  return (
                    <button
                      key={i}
                      id={`day-${i}`}
                      className={`day-btn ${isActive ? 'active' : ''}`}
                      onClick={() => { if (!isPast) { setSelectedDay(day); setSelectedSlot(null); } }}
                      disabled={isPast}
                      aria-label={`${DAYS_ES[day.getDay()]} ${day.getDate()}`}
                      aria-pressed={isActive}
                    >
                      <span className="day-name">{DAYS_ES[day.getDay()]}</span>
                      <span className="day-num">{day.getDate()}</span>
                    </button>
                  );
                })}
              </div>

              <h3 style={{ marginBottom: '1rem' }}><Clock size={18} /> Horarios disponibles</h3>
              {selectedDay ? (
                <div className="slots-grid" role="group" aria-label="Horarios disponibles">
                  {ALL_SLOTS.map(slot => {
                    const booked = isBooked(dayStr(selectedDay), slot);
                    const isActive = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        id={`slot-${slot.replace(':','-')}`}
                        className={`slot-btn ${isActive ? 'selected' : ''}`}
                        disabled={booked}
                        onClick={() => setSelectedSlot(slot)}
                        aria-label={`${slot}${booked ? ' – ocupado' : ''}`}
                        aria-pressed={isActive}
                      >
                        {booked ? '–' : slot}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', padding: '2rem 0' }}>
                  Seleccioná un día para ver los horarios disponibles
                </p>
              )}
            </div>

            {/* Summary + payment panel */}
            <div className="booking-panel reveal" aria-label="Resumen de reserva">
              <h3><CreditCard size={18} /> Resumen y pago</h3>

              <div className="booking-summary" role="region" aria-live="polite">
                <div className="summary-row">
                  <span className="label">Servicios</span>
                  <span className="value">
                    {selectedServices.length > 0
                      ? selectedServices.map(s => s.name).join(', ')
                      : <span style={{ color: 'var(--text-muted)' }}>Ninguno seleccionado</span>
                    }
                  </span>
                </div>
                <div className="summary-row">
                  <span className="label">Día</span>
                  <span className="value">
                    {selectedDay
                      ? `${DAYS_ES[selectedDay.getDay()]} ${selectedDay.getDate()} de ${MONTHS_ES[selectedDay.getMonth()]}`
                      : <span style={{ color: 'var(--text-muted)' }}>Sin seleccionar</span>
                    }
                  </span>
                </div>
                <div className="summary-row">
                  <span className="label">Horario</span>
                  <span className="value">
                    {selectedSlot
                      ? `${selectedSlot} hs`
                      : <span style={{ color: 'var(--text-muted)' }}>Sin seleccionar</span>
                    }
                  </span>
                </div>
                <div className="summary-row summary-total">
                  <span className="label">Total</span>
                  <span className="value">{totalPrice > 0 ? formatPrice(totalPrice) : '–'}</span>
                </div>
              </div>

              <div className="payment-btns">
                {/* WhatsApp – primary booking channel */}
                <button
                  id="whatsapp-book-btn"
                  className="pay-btn pay-wsp"
                  onClick={handleWhatsApp}
                  disabled={!canBook}
                  aria-label="Reservar por WhatsApp"
                >
                  <MessageCircle size={18} /> Reservar por WhatsApp
                </button>

                {/* Stripe (placeholder) */}
                <button
                  id="stripe-btn"
                  className="pay-btn pay-stripe"
                  onClick={() => {
                    if (!canBook) { showToast('Completá la selección antes de pagar'); return; }
                    showToast('Próximamente: pago con Stripe 💳');
                  }}
                  aria-label="Pagar con Stripe"
                >
                  <CreditCard size={18} /> Pagar con Stripe
                </button>

                {/* MercadoPago (placeholder) */}
                <button
                  id="mp-btn"
                  className="pay-btn pay-mp"
                  onClick={() => {
                    if (!canBook) { showToast('Completá la selección antes de pagar'); return; }
                    showToast('Próximamente: pago con MercadoPago 💙');
                  }}
                  aria-label="Pagar con MercadoPago"
                >
                  <Wallet size={18} /> Pagar con MercadoPago
                </button>
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem' }}>
                📲 Al reservar por WhatsApp, te confirmamos el turno en minutos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== PLANES ======================== */}
      <section id="planes" className="subscriptions-section" aria-labelledby="plans-title">
        <div className="container">
          <div className="section-header reveal">
            <div className="section-label">Planes y Suscripciones</div>
            <h2 id="plans-title">Invertí en vos todos los meses</h2>
            <p>Elegí el plan que mejor se adapta a tu estilo de vida</p>
          </div>

          <div className="plans-grid">
            {PLANS.map((plan, i) => (
              <article
                key={plan.id}
                id={`plan-${plan.id}`}
                className={`plan-card reveal ${plan.popular ? 'featured' : ''}`}
                style={{ transitionDelay: `${i * 100}ms` }}
                aria-label={`Plan ${plan.name}`}
              >
                {plan.popular && <div className="plan-badge">⭐ Más popular</div>}
                <div className="plan-emoji" aria-hidden="true">{plan.emoji}</div>
                <div className="plan-name">{plan.name}</div>
                <p className="plan-desc">{plan.desc}</p>
                <div className="plan-price-wrap">
                  <span className="plan-price">{formatPrice(plan.price)}</span>
                  <span className="plan-period">{plan.period}</span>
                </div>
                <ul className="plan-features" aria-label={`Características del plan ${plan.name}`}>
                  {plan.features.map((f, fi) => (
                    <li key={fi}>
                      <span className="feat-icon" aria-hidden="true"><Check size={14} /></span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className="plan-btn"
                  id={`plan-btn-${plan.id}`}
                  onClick={() => {
                    setModalPlan(plan);
                    setShowModal(true);
                  }}
                  aria-label={`Contratar plan ${plan.name}`}
                >
                  Contratar plan
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== RESEÑAS ======================== */}
      <section id="resenas" className="reviews-section" aria-labelledby="reviews-title">
        <div className="container">
          <div className="section-header reveal">
            <div className="section-label">Lo que dicen nuestras clientas</div>
            <h2 id="reviews-title">Reseñas reales, resultados reales</h2>
            <p>Más de 500 clientas confían en Fiona cada mes</p>
          </div>

          <div className="reviews-grid">
            {reviews.map((rev, i) => (
              <article
                key={rev.id}
                className="review-card reveal"
                style={{ transitionDelay: `${(i % 3) * 80}ms` }}
                aria-label={`Reseña de ${rev.name}`}
              >
                <div className="review-header">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="review-avatar"
                    loading="lazy"
                    width={46}
                    height={46}
                  />
                  <div className="review-meta">
                    <strong>{rev.name}</strong>
                    <span>{rev.service} · {rev.date}</span>
                  </div>
                </div>
                <StarRating value={rev.rating} />
                <p className="review-text">"{rev.text}"</p>
              </article>
            ))}
          </div>

          {/* Add review form */}
          <div className="add-review-card reveal">
            <h3>💬 Dejá tu reseña</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tu experiencia ayuda a otras clientas a elegir</p>

            <form onSubmit={handleReviewSubmit} className="review-form" aria-label="Formulario de reseña" noValidate>
              <div className="form-field">
                <label htmlFor="review-name">Nombre</label>
                <input
                  id="review-name"
                  type="text"
                  placeholder="Tu nombre"
                  value={reviewForm.name}
                  onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="review-service">Servicio</label>
                <select
                  id="review-service"
                  value={reviewForm.service}
                  onChange={e => setReviewForm(f => ({ ...f, service: e.target.value }))}
                >
                  <option value="">Seleccioná un servicio</option>
                  {SERVICES.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-field full-width">
                <label htmlFor="review-text">Tu comentario</label>
                <textarea
                  id="review-text"
                  rows={3}
                  placeholder="Contanos tu experiencia..."
                  value={reviewForm.text}
                  onChange={e => setReviewForm(f => ({ ...f, text: e.target.value }))}
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="form-field full-width">
                <label>Calificación</label>
                <StarRatingInput
                  value={reviewForm.rating}
                  onChange={v => setReviewForm(f => ({ ...f, rating: v }))}
                />
              </div>

              <div className="form-field full-width" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  id="submit-review-btn"
                  type="submit"
                  className="btn-primary"
                  style={{ width: 'auto', padding: '0.75rem 2rem' }}
                >
                  <Send size={15} /> Publicar reseña
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ======================== FOOTER ======================== */}
      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <span className="brand-name">Fiona</span>
              <p>Studio de belleza premium. Tu lugar de consentimiento. Atendemos de lunes a sábado para que siempre estés radiante. 💕</p>
              <div className="footer-social" aria-label="Redes sociales">
                <a href="#" className="social-btn" aria-label="Instagram">
                  <InstagramIcon />
                </a>
                <a href="#" className="social-btn" aria-label="Facebook">
                  <FacebookIcon />
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn"
                  aria-label="WhatsApp"
                >
                  <Phone size={16} />
                </a>
              </div>
            </div>

            <nav aria-label="Links servicios" className="footer-col">
              <h4>Servicios</h4>
              <ul className="footer-links">
                {['Manicura', 'Peinados', 'Maquillaje', 'Lifting', 'Faciales'].map(s => (
                  <li key={s}>
                    <a href="#servicios" onClick={e => { e.preventDefault(); document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' }); }}>
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Links info" className="footer-col">
              <h4>Información</h4>
              <ul className="footer-links">
                <li><a href="#planes">Planes y Packs</a></li>
                <li><a href="#resenas">Reseñas</a></li>
                <li><a href="#turnos">Reservar turno</a></li>
                <li>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                    Contacto WhatsApp
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Fiona Studio. Todos los derechos reservados.</span>
            <span>Lunes a Sábado · 9:00 – 18:00 hs</span>
          </div>
        </div>
      </footer>

      {/* ======================== PLAN MODAL ======================== */}
      {showModal && modalPlan && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-plan-title"
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="modal-box">
            <div className="modal-header">
              <h3 id="modal-plan-title">
                {modalPlan.emoji} Plan {modalPlan.name}
              </h3>
              <button
                id="modal-close-btn"
                className="modal-close"
                onClick={() => setShowModal(false)}
                aria-label="Cerrar modal"
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
              {modalPlan.desc}
            </p>

            <ul className="modal-services-list">
              {modalPlan.features.map((f, i) => (
                <li key={i}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Check size={14} color="var(--accent)" /> {f}
                  </span>
                </li>
              ))}
            </ul>

            <div className="modal-total">
              <span>Total</span>
              <span style={{ color: 'var(--accent)' }}>{formatPrice(modalPlan.price)}{modalPlan.period}</span>
            </div>

            <div className="payment-btns">
              <a
                id="modal-wsp-btn"
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`¡Hola! Quiero contratar el Plan ${modalPlan.name} de Fiona 💕`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pay-btn pay-wsp"
                style={{ textDecoration: 'none' }}
              >
                <MessageCircle size={18} /> Contratar por WhatsApp
              </a>
              <button
                id="modal-stripe-btn"
                className="pay-btn pay-stripe"
                onClick={() => { setShowModal(false); showToast('Próximamente: pago con Stripe 💳'); }}
              >
                <CreditCard size={18} /> Pagar con Stripe
              </button>
              <button
                id="modal-mp-btn"
                className="pay-btn pay-mp"
                onClick={() => { setShowModal(false); showToast('Próximamente: pago con MercadoPago 💙'); }}
              >
                <Wallet size={18} /> Pagar con MercadoPago
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================== TOAST ======================== */}
      <Toast msg={toast} />
    </>
  );
}

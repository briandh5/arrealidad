import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  ArrowUpRight, Bookmark, ChevronLeft, ChevronRight, Camera, Check, Clapperboard, Clock, Globe,
  MapPin, Minus, Navigation, Pause, Play, Plus, RotateCcw, ScanLine, Settings, Share2, Star,
  Ticket, UtensilsCrossed, X,
} from 'lucide-react'
import lugar from './assets/lugar.jpg'
import poster from './assets/poster.jpg'
import xrNoche from './assets/xr-noche.jpg'
import xrNocheEn from './assets/xr-noche-en.jpg'

const FIGMA_XR = 'https://www.figma.com/community/file/1698455080528285372'
const LINKEDIN = 'https://www.linkedin.com/in/briandh5/'
const RETO = 'https://101greatideas.vercel.app'

// Medidas del video y punto del edificio seleccionado (en píxeles del video)
const VW = 1280
const VH = 720
const ANCLA = { x: 617, y: 215 }
// La ficha se queda unos segundos y el video se repite solo; tras VUELTAS reproducciones aparece el botón de repetir
const SEG_CARD = 2500
const VUELTAS = 5

// Fotos con licencia Unsplash (uso libre); se cargan desde unsplash.com
const unsplash = (id) => `https://unsplash.com/photos/${id}/download?w=1200`

// Textos en inglés (por defecto) y español; el idioma se cambia desde el botón de ajustes
const IDIOMAS = [
  { id: 'en', nombre: 'English' },
  { id: 'es', nombre: 'Español' },
]

const TXT = {
  en: {
    htmlTitle: 'Mira AR · An augmented reality proposal',
    ajustes: 'Settings',
    idioma: 'Language',
    hoy: [
      {
        icon: UtensilsCrossed,
        rubro: 'Restaurants',
        titulo: 'Book by looking at the facade',
        texto: 'Point at a restaurant and see its rating, wait time and most-ordered dishes. Pick a time and party size without leaving the camera.',
        puntos: ['Real-time table availability', 'Menu with photos from other diners', 'Confirmation in your calendar'],
        ar: { icon: Clock, texto: 'Table for 4 · 8:30 PM', accion: 'Book' },
        foto: { id: 'i8BuLYg7Ryk', autor: 'Moriah Bender', alt: 'Restaurant facade with its sign above the door' },
      },
      {
        icon: Clapperboard,
        rubro: 'Movies and events',
        titulo: 'Tickets from the marquee',
        texto: 'Point at a cinema, theater or stadium to see upcoming showtimes, open seats and prices. Pay with Wallet in two taps.',
        puntos: ['Today’s listings and showtimes', 'Seat map in AR', 'Tickets saved to Wallet'],
        ar: { icon: Ticket, texto: 'Showing 9:15 PM · Theater 4', accion: '2 tickets' },
        foto: { id: 'P17cUmurgiQ', autor: 'David Vives', alt: 'Exterior of Yankee Stadium in the Bronx, New York' },
      },
      {
        icon: Camera,
        rubro: 'Photos',
        titulo: 'Capture and post instantly',
        texto: 'Take the photo from the same view. It’s tagged with the right place, and you can add it to Maps or your shared album right away.',
        puntos: ['Automatic place tagging', 'Upload to Maps reviews', 'Albums shared with your group'],
        ar: { icon: Check, texto: 'Photo added to Chicago 360', accion: 'View' },
        foto: { id: 'kH3RcKOgpH0', autor: 'Brady Jordan', alt: 'Woman photographing the city skyline with her phone at sunset' },
      },
    ],
    pasos: [
      { icon: ScanLine, titulo: 'Point', texto: 'The camera recognizes buildings, businesses and signs using Maps information.' },
      { icon: MapPin, titulo: 'Tap', texto: 'The place card appears: hours, reviews, photos and what you can do there.' },
      { icon: Check, titulo: 'Done', texto: 'Book, buy or share in the moment, without switching apps.' },
    ],
    slides: [
      'The problem: stop spinning your phone to figure out where you are',
      'The map is in your hand, the street is in front of you',
      'Four moments where the map falls short',
      'Fewer steps between seeing and understanding',
      'The card appears on top of the building',
      'Four user experience rules',
      'The flow: point, tap and done',
      'Each place decides what to show',
      'Personalized card examples',
      'Useful promotions, never a street full of ads',
      'How to measure it with users',
    ],
    carrusel: {
      etiqueta: 'Mira AR UX presentation',
      rol: 'carousel',
      intro: 'The problem of finding your way with a map and how Mira AR solves it, in 11 slides.',
      anterior: 'Previous slide',
      siguiente: 'Next slide',
      irA: (n) => `Go to slide ${n}`,
    },
    xr: {
      alt: 'Expanded Chicago 360 card floating next to the building in a headset, over the Chicago skyline',
      etiqueta: 'Figma case study',
      titulo: 'Mira AR brought to glasses and headsets',
      texto: 'How the card adapts when the screen sits on top of the real world: what you see at a glance, how it expands and how it stays readable by day and by night.',
      temas: ['Glance view on glasses', 'Expanded card on headset', 'Readability by day and night', 'Visual system and motion'],
      boton: 'View on Figma Community',
    },
    proyecto: {
      etiqueta: 'The project',
      titulo: 'Two ways to see it',
      lista: 'Project material',
      pestanas: { ux: 'UX presentation', xr: 'Android XR case' },
    },
    ficha: {
      fotoAlt: 'The selected building seen from the lakeshore',
      reconocido: 'Recognized in AR',
      cerrar: 'Close card',
      tipo: 'Observation deck',
      abierto: 'Open',
      cierra: 'Closes at 10 PM',
      distancia: '1.4 mi · 9 min by car',
      llegar: 'Directions',
      tickets: 'Buy tickets',
      sitio: 'Website',
      guardar: 'Save',
      guardado: 'Saved',
      compartir: 'Share',
      ejemplo: 'Sample data for the demo',
      hoy: 'Chicago 360 · Today',
      entrada: 'General admission',
      cadaUno: (p) => `Tickets · $${p} each`,
      quitar: 'Remove a ticket',
      agregar: 'Add a ticket',
      total: 'Total',
      moneda: (n) => `$${n}`,
      atras: 'Back',
      pagar: 'Pay with Wallet',
      simulada: 'Simulated purchase, nothing is charged',
      listos: 'Tickets ready',
      resumen: (n) => `${n} ${n === 1 ? 'ticket' : 'tickets'} for today. You’ll see them in Wallet when you arrive.`,
      volver: 'Back to the card',
    },
    hero: {
      video: 'Video: a hand points at the Chicago skyline from the frozen lakeshore and the app recognizes the building in the center',
      propuesta: 'A proposal for the Google ecosystem',
      lugar: 'Chicago · Lakefront Trail',
      titulo: 'Point at a building. Maps answers.',
      verFicha: 'Show place card',
      conoce: 'See the proposal',
      reanudar: 'Resume demo',
      pausar: 'Pause demo',
      deNuevo: 'Watch again',
    },
    foto: 'Photo',
    futuro: {
      titulo: 'The future of augmented reality is here',
      texto:
        'Mira AR brings together the camera and Maps information. Point at a building, a business or a sign and a card appears with everything you can do there: book, buy tickets, get directions or share a photo. No searching, no typing and no switching apps.',
    },
    bloque: {
      etiqueta: 'From day one',
      titulo: 'What you can do just by pointing',
      texto: 'Three actions that today require searching, opening another app and coming back. With Mira AR they happen right on the camera view.',
    },
    contacto: {
      etiqueta: 'An idea for Google',
      titulo: 'I would love to be part of the process',
      antes: 'I’m Brian Hawkins, a computer science graduate who loves technology and data, and thinking about the right user experience. ',
      despues:
        ' is app #8 of my 101 apps challenge. If this concept fits the Google ecosystem, I would like to join the team working on it.',
      sub: 'Independent proposal · 101 apps challenge',
      linkedin: 'Message me on LinkedIn',
      reto: 'See the 101 apps challenge',
    },
    pie: {
      aviso:
        'Independent concept created by Brian Hawkins. Not affiliated with or endorsed by Google. Google, Google Maps and Google Wallet are trademarks of Google LLC. Ratings, hours and prices shown are examples.',
      creditos: 'Hero video: provided by Brian Hawkins. Card photos under the ',
      licencia: 'Unsplash License',
      autores: ': Moriah Bender, David Vives and Brady Jordan.',
    },
  },
  es: {
    htmlTitle: 'Mira AR · Propuesta de realidad aumentada',
    ajustes: 'Ajustes',
    idioma: 'Idioma',
    hoy: [
      {
        icon: UtensilsCrossed,
        rubro: 'Restaurantes',
        titulo: 'Reserva mirando la fachada',
        texto: 'Apunta a un restaurante y ve su calificación, el tiempo de espera y los platillos más pedidos. Elige hora y personas sin salir de la cámara.',
        puntos: ['Mesas disponibles en tiempo real', 'Menú con fotos de otros comensales', 'Confirmación en tu calendario'],
        ar: { icon: Clock, texto: 'Mesa para 4 · 20:30', accion: 'Reservar' },
        foto: { id: 'i8BuLYg7Ryk', autor: 'Moriah Bender', alt: 'Fachada de un restaurante con su letrero sobre la puerta' },
      },
      {
        icon: Clapperboard,
        rubro: 'Cines y eventos',
        titulo: 'Boletos desde la marquesina',
        texto: 'Señala un cine, un teatro o un estadio y aparecen las próximas funciones, los asientos libres y el precio. Pagas con Wallet en dos toques.',
        puntos: ['Cartelera y horarios del día', 'Mapa de asientos en AR', 'Boletos guardados en Wallet'],
        ar: { icon: Ticket, texto: 'Función 21:15 · Sala 4', accion: '2 boletos' },
        foto: { id: 'P17cUmurgiQ', autor: 'David Vives', alt: 'Fachada exterior del Yankee Stadium en el Bronx, Nueva York' },
      },
      {
        icon: Camera,
        rubro: 'Fotos',
        titulo: 'Captura y publica al instante',
        texto: 'Toma la foto desde la misma vista. Se etiqueta con el lugar correcto y la puedes añadir a Maps o a tu álbum compartido en el momento.',
        puntos: ['Etiqueta automática del lugar', 'Sube a reseñas de Maps', 'Álbumes compartidos con tu grupo'],
        ar: { icon: Check, texto: 'Foto añadida a Chicago 360', accion: 'Ver' },
        foto: { id: 'kH3RcKOgpH0', autor: 'Brady Jordan', alt: 'Mujer fotografiando el skyline de la ciudad con su teléfono al atardecer' },
      },
    ],
    pasos: [
      { icon: ScanLine, titulo: 'Apunta', texto: 'La cámara reconoce edificios, negocios y letreros con la información de Maps.' },
      { icon: MapPin, titulo: 'Toca', texto: 'Aparece la ficha del lugar: horarios, reseñas, fotos y lo que puedes hacer ahí.' },
      { icon: Check, titulo: 'Resuelve', texto: 'Reserva, compra o comparte en el mismo momento, sin cambiar de app.' },
    ],
    slides: [
      'El problema: dejar de girar el celular para saber dónde estás',
      'El mapa está en tu mano, la calle está enfrente',
      'Cuatro momentos donde el mapa se queda corto',
      'Menos pasos entre ver y entender',
      'La ficha aparece encima del edificio',
      'Cuatro reglas de experiencia de usuario',
      'El flujo: apunta, toca y resuelve',
      'Cada lugar decide qué mostrar',
      'Ejemplos de fichas personalizadas',
      'Promociones útiles, nunca una calle llena de anuncios',
      'Cómo medirlo con usuarios',
    ],
    carrusel: {
      etiqueta: 'Presentación de UX de Mira AR',
      rol: 'carrusel',
      intro: 'El problema de ubicarse con el mapa y cómo lo resuelve Mira AR, en 11 slides.',
      anterior: 'Slide anterior',
      siguiente: 'Slide siguiente',
      irA: (n) => `Ir a la slide ${n}`,
    },
    xr: {
      alt: 'Ficha expandida de Chicago 360 flotando junto al edificio en un headset, sobre el skyline de Chicago',
      etiqueta: 'Caso de estudio en Figma',
      titulo: 'Mira AR llevado a lentes y headsets',
      texto: 'Cómo se adapta la ficha cuando la pantalla está sobre el mundo real: qué se ve de un vistazo, cómo se expande y cómo se mantiene legible de día y de noche.',
      temas: ['Vistazo en lentes', 'Ficha expandida en headset', 'Legibilidad de día y de noche', 'Sistema visual y motion'],
      boton: 'Ver en Figma Community',
    },
    proyecto: {
      etiqueta: 'El proyecto',
      titulo: 'Dos formas de verlo',
      lista: 'Material del proyecto',
      pestanas: { ux: 'Presentación UX', xr: 'Caso Android XR' },
    },
    ficha: {
      fotoAlt: 'Vista del edificio seleccionado desde la orilla del lago',
      reconocido: 'Reconocido en AR',
      cerrar: 'Cerrar ficha',
      tipo: 'Mirador',
      abierto: 'Abierto',
      cierra: 'Cierra a las 22:00',
      distancia: 'A 2.3 km · 9 min en auto',
      llegar: 'Cómo llegar',
      tickets: 'Comprar tickets',
      sitio: 'Sitio web',
      guardar: 'Guardar',
      guardado: 'Guardado',
      compartir: 'Compartir',
      ejemplo: 'Datos de ejemplo para la demo',
      hoy: 'Chicago 360 · Hoy',
      entrada: 'Entrada general',
      cadaUno: (p) => `Boletos · US$${p} c/u`,
      quitar: 'Quitar un boleto',
      agregar: 'Agregar un boleto',
      total: 'Total',
      moneda: (n) => `US$${n}`,
      atras: 'Atrás',
      pagar: 'Pagar con Wallet',
      simulada: 'Compra simulada, no se cobra nada',
      listos: 'Boletos listos',
      resumen: (n) => `${n} ${n === 1 ? 'entrada' : 'entradas'} para hoy. Las verás en Wallet al llegar.`,
      volver: 'Volver a la ficha',
    },
    hero: {
      video: 'Video: una mano señala el skyline de Chicago desde la orilla congelada del lago y la app reconoce el edificio del centro',
      propuesta: 'Propuesta para el ecosistema de Google',
      lugar: 'Chicago · Lakefront Trail',
      titulo: 'Señala un edificio. Maps te responde.',
      verFicha: 'Ver ficha del lugar',
      conoce: 'Conoce la propuesta',
      reanudar: 'Reanudar demo',
      pausar: 'Pausar demo',
      deNuevo: 'Ver de nuevo',
    },
    foto: 'Foto',
    futuro: {
      titulo: 'El futuro de la realidad aumentada está aquí',
      texto:
        'Mira AR une la cámara con la información de Maps. Apuntas a un edificio, un negocio o un letrero y aparece una ficha con todo lo que puedes hacer ahí: reservar, comprar boletos, llegar o compartir una foto. Sin buscar, sin escribir y sin cambiar de app.',
    },
    bloque: {
      etiqueta: 'Desde el primer día',
      titulo: 'Lo que puedes hacer con solo apuntar',
      texto: 'Tres acciones que hoy requieren buscar, abrir otra app y volver. Con Mira AR suceden sobre la vista de la cámara.',
    },
    contacto: {
      etiqueta: 'Una idea para Google',
      titulo: 'Me encantaría ser parte del proceso',
      antes: 'Soy Brian Hawkins, licenciado en informática, y me gusta la tecnología y los datos, así como pensar en la correcta experiencia del usuario. ',
      despues:
        ' es la app #8 de mi reto de 101 apps. Si este concepto encaja con el ecosistema de Google, me gustaría formar parte del equipo que esté trabajando en él.',
      sub: 'Propuesta independiente · Reto 101 apps',
      linkedin: 'Escríbeme en LinkedIn',
      reto: 'Ver reto 101 apps',
    },
    pie: {
      aviso:
        'Concepto independiente creado por Brian Hawkins. No está afiliado ni respaldado por Google. Google, Google Maps y Google Wallet son marcas de Google LLC. Calificaciones, horarios y precios mostrados son ejemplos.',
      creditos: 'Video del hero: proporcionado por Brian Hawkins. Fotografías de las tarjetas bajo la ',
      licencia: 'Licencia Unsplash',
      autores: ': Moriah Bender, David Vives y Brady Jordan.',
    },
  },
}

const Idioma = createContext({ idioma: 'en', t: TXT.en, setIdioma: () => {} })
const useT = () => useContext(Idioma).t

// Inglés por defecto; ?lang=es o la elección guardada en este navegador lo cambian
function idiomaInicial() {
  try {
    const q = new URLSearchParams(location.search).get('lang')
    if (q && TXT[q]) return q
    const g = localStorage.getItem('mira-idioma')
    if (g && TXT[g]) return g
  } catch {}
  return 'en'
}

// Las slides en inglés viven en slides/en/
const rutaSlides = (idioma) => (idioma === 'en' ? 'slides/en/' : 'slides/')

const SEG_SLIDE = 4500

// Avanza solo hasta que la persona usa las flechas, los puntos o desliza
function Carrusel() {
  const { idioma, t } = useContext(Idioma)
  const c = t.carrusel
  const SLIDES = t.slides.map((alt, i) => ({ src: `${rutaSlides(idioma)}${String(i + 1).padStart(2, '0')}.webp`, alt }))
  const pista = useRef(null)
  const [actual, setActual] = useState(0)
  const [auto, setAuto] = useState(() => typeof matchMedia === 'undefined' || !matchMedia('(prefers-reduced-motion: reduce)').matches)
  const total = SLIDES.length

  const ir = useCallback((i) => {
    const el = pista.current
    if (!el) return
    const n = (i + total) % total
    el.scrollTo({ left: n * el.clientWidth, behavior: 'smooth' })
  }, [total])

  const manual = (i) => {
    setAuto(false)
    ir(i)
  }

  useEffect(() => {
    if (!auto) return
    const t = setTimeout(() => ir(actual + 1), SEG_SLIDE)
    return () => clearTimeout(t)
  }, [auto, actual, ir])

  const alDesplazar = () => {
    const el = pista.current
    if (el) setActual(Math.round(el.scrollLeft / el.clientWidth))
  }

  const detener = () => setAuto(false)

  return (
    <div className="grid gap-4" aria-roledescription={c.rol} aria-label={c.etiqueta}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-[15px] text-ink2">{c.intro}</p>
        <div className="flex items-center gap-2">
          <span className="mr-1 font-display text-[14px] tabular-nums text-ink2">
            {actual + 1} / {total}
          </span>
          <button type="button" onClick={() => manual(actual - 1)} aria-label={c.anterior} className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink hover:bg-surface2">
            <ChevronLeft size={20} />
          </button>
          <button type="button" onClick={() => manual(actual + 1)} aria-label={c.siguiente} className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink hover:bg-surface2">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div
        ref={pista}
        onScroll={alDesplazar}
        onPointerDown={detener}
        onWheel={detener}
        onKeyDown={detener}
        tabIndex={0}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-[24px] border border-line/70 bg-surface2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {SLIDES.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt={`Slide ${i + 1}: ${s.alt}`}
            loading={i < 2 ? 'eager' : 'lazy'}
            draggable={false}
            className="aspect-video w-full max-w-full shrink-0 snap-center select-none object-cover"
          />
        ))}
      </div>
      <div className="flex justify-center gap-1.5">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => manual(i)}
            aria-label={c.irA(i + 1)}
            aria-current={i === actual}
            className={`h-2 rounded-full transition-all ${i === actual ? 'w-6 bg-primary' : 'w-2 bg-line hover:bg-ink2'}`}
          />
        ))}
      </div>
    </div>
  )
}

// Caso de estudio para lentes Android XR, publicado en Figma Community
function CasoXR() {
  const { idioma, t } = useContext(Idioma)
  const x = t.xr
  return (
    <div className="grid overflow-hidden rounded-[24px] border border-line/70 bg-surface md:grid-cols-[1.25fr_1fr]">
      <div className="relative aspect-video w-full max-w-full md:aspect-auto md:min-h-[340px]">
        <img src={idioma === 'en' ? xrNocheEn : xrNoche} alt={x.alt} className="absolute inset-0 h-full w-full object-cover object-right" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 font-display text-[13px] font-medium text-white backdrop-blur-md">
          <ScanLine size={14} /> Android XR
        </span>
      </div>
      <div className="flex min-w-0 flex-col gap-4 p-6 sm:p-8">
        <p className="font-display text-[13px] font-medium uppercase tracking-[0.12em] text-primary">{x.etiqueta}</p>
        <h4 className="font-display text-[26px] font-normal leading-8 text-ink">{x.titulo}</h4>
        <p className="text-[15px] leading-6 text-ink2">
          {x.texto}
        </p>
        <ul className="grid gap-2">
          {x.temas.map((t) => (
            <li key={t} className="flex items-start gap-2 text-[14px] text-ink">
              <Check size={16} className="mt-0.5 shrink-0 text-primary" /> {t}
            </li>
          ))}
        </ul>
        <a href={FIGMA_XR} target="_blank" rel="noreferrer" className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 font-display text-[15px] font-medium text-white">
          {x.boton} <ArrowUpRight size={16} />
        </a>
      </div>
    </div>
  )
}

const PESTANAS = [{ id: 'ux' }, { id: 'xr' }]

function Proyecto() {
  const pr = useT().proyecto
  const [pestana, setPestana] = useState('ux')
  const mover = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    const i = PESTANAS.findIndex((p) => p.id === pestana)
    const n = PESTANAS[(i + (e.key === 'ArrowRight' ? 1 : -1) + PESTANAS.length) % PESTANAS.length]
    setPestana(n.id)
    document.getElementById(`pestana-${n.id}`)?.focus()
  }
  return (
    <section className="grid gap-6">
      <div className="grid gap-2">
        <p className="font-display text-[13px] font-medium uppercase tracking-[0.12em] text-primary">{pr.etiqueta}</p>
        <h3 className="font-display text-[28px] font-normal leading-9 text-ink">{pr.titulo}</h3>
      </div>
      <div role="tablist" aria-label={pr.lista} onKeyDown={mover} className="flex w-full max-w-full gap-1 overflow-x-auto rounded-full bg-surface2 p-1 sm:w-fit">
        {PESTANAS.map((p) => (
          <button
            key={p.id}
            id={`pestana-${p.id}`}
            role="tab"
            type="button"
            aria-selected={pestana === p.id}
            aria-controls={`panel-${p.id}`}
            tabIndex={pestana === p.id ? 0 : -1}
            onClick={() => setPestana(p.id)}
            className={`h-10 flex-1 whitespace-nowrap rounded-full px-5 font-display text-[14px] font-medium transition-colors sm:flex-none ${
              pestana === p.id ? 'bg-surface text-primary shadow-e1' : 'text-ink2 hover:text-ink'
            }`}
          >
            {pr.pestanas[p.id]}
          </button>
        ))}
      </div>
      <div id="panel-ux" role="tabpanel" aria-labelledby="pestana-ux" hidden={pestana !== 'ux'}>
        <Carrusel />
      </div>
      <div id="panel-xr" role="tabpanel" aria-labelledby="pestana-xr" hidden={pestana !== 'xr'}>
        <CasoXR />
      </div>
    </section>
  )
}

function useMedida(ref) {
  const [m, setM] = useState({ w: 0, h: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setM({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return m
}

function useMovimientoReducido() {
  const [r, setR] = useState(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const f = () => setR(mq.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])
  return r
}

function Estrellas({ valor }) {
  return (
    <span className="inline-flex" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={14} className="text-star" fill={i <= Math.round(valor) ? 'currentColor' : 'none'} strokeWidth={1.8} />
      ))}
    </span>
  )
}

function BotonAccion({ icon: Icon, children, filled, href, onClick }) {
  const cls = `inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 h-9 text-[14px] font-medium font-display transition-colors ${
    filled ? 'bg-primary text-white hover:brightness-110' : 'bg-tonal text-onTonal hover:brightness-95'
  }`
  if (href) {
    return (
      <a className={cls} href={href} target="_blank" rel="noreferrer">
        <Icon size={16} /> {children}
      </a>
    )
  }
  return (
    <button type="button" className={cls} onClick={onClick}>
      <Icon size={16} /> {children}
    </button>
  )
}

function FichaLugar({ onCerrar, onInteractuar }) {
  const f = useT().ficha
  const [vista, setVista] = useState('info')
  const [cantidad, setCantidad] = useState(2)
  const [guardado, setGuardado] = useState(false)
  const precio = 40

  const ir = (v) => {
    onInteractuar()
    setVista(v)
  }

  return (
    <div className="w-full overflow-hidden rounded-[28px] bg-surface text-ink shadow-e3 font-sans">
      <div className="relative h-[108px]">
        <img src={lugar} alt={f.fotoAlt} className="h-full w-full object-cover" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-medium text-ink font-display">
          <ScanLine size={13} className="text-primary" /> {f.reconocido}
        </span>
        <button
          type="button"
          onClick={onCerrar}
          aria-label={f.cerrar}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-ink hover:bg-white"
        >
          <X size={18} />
        </button>
      </div>

      {vista === 'info' && (
        <div className="px-4 pb-4 pt-3">
          <h3 className="font-display text-[22px] font-medium leading-7">Chicago 360</h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[14px] text-ink2">
            <span className="font-medium text-ink">4.7</span>
            <Estrellas valor={4.7} />
            <span>(18,204)</span>
            <span aria-hidden="true">·</span>
            <span>{f.tipo}</span>
          </div>
          <p className="mt-1 text-[14px] text-ink2">
            <span className="font-medium text-ok">{f.abierto}</span> · {f.cierra}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[14px] text-ink2">
            <Navigation size={13} /> {f.distancia}
          </p>
          <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
            <BotonAccion icon={Navigation} filled href="https://www.google.com/maps/search/?api=1&query=360+CHICAGO">
              {f.llegar}
            </BotonAccion>
            <BotonAccion icon={Ticket} onClick={() => ir('tickets')}>{f.tickets}</BotonAccion>
            <BotonAccion icon={Globe} href="https://360chicago.com">{f.sitio}</BotonAccion>
            <BotonAccion icon={Bookmark} onClick={() => { onInteractuar(); setGuardado((g) => !g) }}>
              {guardado ? f.guardado : f.guardar}
            </BotonAccion>
            <BotonAccion icon={Share2} onClick={onInteractuar}>{f.compartir}</BotonAccion>
          </div>
          <p className="mt-3 border-t border-line pt-2 text-[12px] text-ink2">{f.ejemplo}</p>
        </div>
      )}

      {vista === 'tickets' && (
        <div className="px-4 pb-4 pt-3">
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-ink2">{f.hoy}</p>
          <h3 className="mt-0.5 font-display text-[20px] font-medium">{f.entrada}</h3>
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-surface2 px-3 py-2">
            <span className="text-[14px] text-ink2">{f.cadaUno(precio)}</span>
            <div className="flex items-center gap-2">
              <button type="button" aria-label={f.quitar} onClick={() => setCantidad((c) => Math.max(1, c - 1))} className="grid h-8 w-8 place-items-center rounded-full bg-surface text-ink shadow-e1">
                <Minus size={16} />
              </button>
              <span className="w-5 text-center font-display text-[16px] font-medium tabular-nums">{cantidad}</span>
              <button type="button" aria-label={f.agregar} onClick={() => setCantidad((c) => Math.min(8, c + 1))} className="grid h-8 w-8 place-items-center rounded-full bg-surface text-ink shadow-e1">
                <Plus size={16} />
              </button>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[14px]">
            <span className="text-ink2">{f.total}</span>
            <span className="font-display text-[18px] font-medium tabular-nums">{f.moneda(precio * cantidad)}</span>
          </div>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => setVista('info')} className="h-10 flex-1 rounded-full border border-line font-display text-[14px] font-medium text-primary">
              {f.atras}
            </button>
            <button type="button" onClick={() => setVista('listo')} className="h-10 flex-[2] rounded-full bg-primary font-display text-[14px] font-medium text-white">
              {f.pagar}
            </button>
          </div>
          <p className="mt-2 text-[12px] text-ink2">{f.simulada}</p>
        </div>
      )}

      {vista === 'listo' && (
        <div className="px-4 pb-4 pt-4 text-center">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-tonal text-onTonal">
            <Check size={22} />
          </span>
          <h3 className="mt-2 font-display text-[20px] font-medium">{f.listos}</h3>
          <p className="mt-1 text-[14px] text-ink2">
            {f.resumen(cantidad)}
          </p>
          <button type="button" onClick={() => setVista('info')} className="mt-3 h-10 w-full rounded-full bg-tonal font-display text-[14px] font-medium text-onTonal">
            {f.volver}
          </button>
        </div>
      )}
    </div>
  )
}

function Hero() {
  const hx = useT().hero
  const caja = useRef(null)
  const video = useRef(null)
  const { w, h } = useMedida(caja)
  const reducido = useMovimientoReducido()
  const [fase, setFase] = useState('video')
  const [cerrada, setCerrada] = useState(false)
  const [pausado, setPausado] = useState(false)
  const [terminado, setTerminado] = useState(false)
  const vueltas = useRef(0)

  // Posición del edificio en pantalla con object-fit: cover
  const s = Math.max(w / VW, h / VH) || 1
  const ax = (w - VW * s) / 2 + ANCLA.x * s
  const ay = (h - VH * s) / 2 + ANCLA.y * s
  const ancho = w >= 900

  const mostrarFicha = () => {
    setCerrada(false)
    setFase('ficha')
  }

  // Si el navegador no reproduce el video, se queda la ficha con el botón para intentarlo de nuevo
  const sinVideo = () => {
    setTerminado(true)
    mostrarFicha()
  }

  const alTerminar = () => {
    vueltas.current += 1
    if (vueltas.current >= VUELTAS) setTerminado(true)
    mostrarFicha()
  }

  const repetir = () => {
    const v = video.current
    setCerrada(false)
    setFase('video')
    if (v) {
      v.currentTime = 0
      v.play().catch(sinVideo)
      setPausado(false)
    }
  }

  useEffect(() => {
    if (reducido) {
      setFase('ficha')
      setTerminado(true)
      return
    }
    video.current?.play().catch(sinVideo)
  }, [reducido])

  useEffect(() => {
    if (fase !== 'ficha' || pausado || terminado) return
    const t = setTimeout(repetir, SEG_CARD)
    return () => clearTimeout(t)
  }, [fase, pausado, terminado])

  // Al usar la ficha se detiene la repetición para no quitársela a la persona
  const usarFicha = () => setTerminado(true)

  const verDeNuevo = () => {
    vueltas.current = VUELTAS - 1
    setTerminado(false)
    repetir()
  }

  const alternarPausa = () => {
    const v = video.current
    if (pausado) {
      setPausado(false)
      if (fase === 'video') v?.play().catch(() => {})
    } else {
      setPausado(true)
      v?.pause()
    }
  }

  const cardW = 360
  const cardX = Math.min(ax + 64, w - cardW - 32)
  const cardY = Math.max(88, Math.min(ay - 70, h - 420))
  const verFicha = fase === 'ficha' && !cerrada

  return (
    <header ref={caja} className="relative h-[min(86vh,780px)] min-h-[560px] w-full overflow-hidden bg-[#0b1d2e]">
      <video
        ref={video}
        className="absolute inset-0 h-full w-full object-cover"
        src="hero.mp4"
        poster={poster}
        muted
        playsInline
        preload="auto"
        onEnded={alTerminar}
        aria-label={hx.video}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,18,32,.55)_0%,rgba(4,18,32,0)_22%,rgba(4,18,32,0)_55%,rgba(4,18,32,.7)_100%)]" />

      <div className="gutter absolute inset-x-0 top-0 flex items-center justify-between pt-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 font-display text-[15px] font-medium text-white backdrop-blur">
          <span className="grid h-5 w-5 place-items-center rounded-full border-2 border-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          Mira AR
        </span>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-black/30 px-3 py-1.5 font-display text-[13px] text-white/90 backdrop-blur sm:inline">
            {hx.propuesta}
          </span>
          <Ajustes />
        </div>
      </div>

      {fase === 'ficha' && w > 0 && (
        <>
          <span className="pointer-events-none absolute" style={{ left: ax, top: ay }} aria-hidden="true">
            <span className="anillo absolute left-0 top-0 h-14 w-14 rounded-full border-2 border-white" />
            <span className="absolute left-0 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-primary shadow-e3" />
          </span>
          {ancho && verFicha && (
            <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
              <line x1={ax + 10} y1={ay} x2={cardX} y2={cardY + 54} stroke="#ffffff" strokeOpacity=".85" strokeWidth="1.5" strokeDasharray="4 4" />
            </svg>
          )}
        </>
      )}

      {verFicha && w > 0 && (
        <div
          className="entra absolute"
          style={
            ancho
              ? { left: cardX, top: cardY, width: cardW }
              : { left: 'max(16px, env(safe-area-inset-left, 0px))', right: 'max(16px, env(safe-area-inset-right, 0px))', bottom: 16 }
          }
        >
          <FichaLugar onCerrar={() => { usarFicha(); setCerrada(true) }} onInteractuar={usarFicha} />
        </div>
      )}

      {(ancho || !verFicha) && (
        <div className="gutter absolute inset-x-0 bottom-0 pb-8">
          <div className="max-w-[560px] text-white">
            <p className="font-display text-[14px] font-medium uppercase tracking-[0.12em] text-white/80">{hx.lugar}</p>
            <h1 className="mt-2 font-display text-[clamp(30px,4.6vw,52px)] font-medium leading-[1.08]">
              {hx.titulo}
            </h1>
            <div className="mt-5 flex flex-wrap gap-2">
              {cerrada && (
                <button type="button" onClick={mostrarFicha} className="inline-flex h-10 items-center gap-2 rounded-full bg-surface px-4 font-display text-[14px] font-medium text-primary">
                  <MapPin size={16} /> {hx.verFicha}
                </button>
              )}
              <a href="#futuro" className="inline-flex h-10 items-center rounded-full bg-primary px-5 font-display text-[14px] font-medium text-white">
                {hx.conoce}
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="absolute right-[max(16px,env(safe-area-inset-right,0px))] top-16 flex gap-2 min-[900px]:top-auto min-[900px]:bottom-8">
        {!terminado && (
        <button type="button" onClick={alternarPausa} aria-label={pausado ? hx.reanudar : hx.pausar} className="grid h-9 w-9 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/45">
          {pausado ? <Play size={16} /> : <Pause size={16} />}
        </button>
        )}
        {terminado && (
          <button type="button" onClick={verDeNuevo} aria-label={hx.deNuevo} className="entra inline-flex h-9 items-center gap-1.5 rounded-full bg-black/40 px-3 font-display text-[13px] font-medium text-white backdrop-blur hover:bg-black/55">
            <RotateCcw size={15} /> {hx.deNuevo}
          </button>
        )}
      </div>
    </header>
  )
}

function Foto({ foto, icon: Icon }) {
  const [fallo, setFallo] = useState(false)
  return (
    <div className="absolute inset-0">
      {!fallo ? (
        <img src={unsplash(foto.id)} alt={foto.alt} loading="lazy" onError={() => setFallo(true)} className="h-full w-full object-cover" />
      ) : (
        <div role="img" aria-label={foto.alt} className="grid h-full w-full place-items-center bg-[radial-gradient(120%_90%_at_20%_10%,#e8f0fe_0%,#d3e3fd_45%,#a8c7fa_100%)]">
          <Icon size={56} strokeWidth={1.3} className="text-onTonal/60" />
        </div>
      )}
    </div>
  )
}

function Tarjeta({ item }) {
  const t = useT()
  const { icon: Icon, ar } = item
  const ArIcon = ar.icon
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-[24px] border border-line/70 bg-surface transition-shadow hover:shadow-e3">
      <div className="relative aspect-[4/3] w-full max-w-full overflow-hidden bg-surface2">
        <Foto foto={item.foto} icon={Icon} />
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-full bg-black/55 py-1.5 pl-2 pr-1.5 shadow-e3 backdrop-blur-md">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-tonal text-onTonal">
            <ArIcon size={15} />
          </span>
          <span className="min-w-0 flex-1 truncate font-display text-[14px] font-medium text-white">{ar.texto}</span>
          <span className="shrink-0 rounded-full bg-primary px-3 py-1 font-display text-[13px] font-medium text-white">{ar.accion}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line px-3 font-display text-[13px] font-medium text-ink2">
            <Icon size={15} /> {item.rubro}
          </span>
        </div>
        <h3 className="mt-3 font-display text-[22px] font-medium leading-7 text-ink">{item.titulo}</h3>
        <p className="mt-2 text-[15px] leading-6 text-ink2">{item.texto}</p>
        <ul className="mt-4 grid gap-2 border-t border-line/70 pt-4">
          {item.puntos.map((p) => (
            <li key={p} className="flex items-start gap-2 text-[14px] text-ink">
              <Check size={16} className="mt-0.5 shrink-0 text-primary" /> {p}
            </li>
          ))}
        </ul>
        <p className="mt-auto pt-4 text-[12px] text-ink2">
          {t.foto}:{' '}
          <a className="underline decoration-line underline-offset-2 hover:text-primary" href={`https://unsplash.com/photos/${item.foto.id}`} target="_blank" rel="noreferrer">
            {item.foto.autor ?? 'Unsplash'}
          </a>
          {item.foto.autor && ' / Unsplash'}
        </p>
      </div>
    </article>
  )
}

function Bloque({ etiqueta, titulo, texto, items }) {
  return (
    <section className="grid gap-6">
      <div className="grid gap-2">
        <p className="font-display text-[13px] font-medium uppercase tracking-[0.12em] text-primary">{etiqueta}</p>
        <h3 className="font-display text-[28px] font-normal leading-9 text-ink">{titulo}</h3>
        <p className="max-w-[62ch] text-[16px] leading-7 text-ink2">{texto}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((it) => (
          <Tarjeta key={it.titulo} item={it} />
        ))}
      </div>
    </section>
  )
}

// Botón de ajustes con el selector de idioma
function Ajustes() {
  const { idioma, t, setIdioma } = useContext(Idioma)
  const [abierto, setAbierto] = useState(false)
  const caja = useRef(null)
  useEffect(() => {
    if (!abierto) return
    const fuera = (e) => caja.current && !caja.current.contains(e.target) && setAbierto(false)
    const esc = (e) => e.key === 'Escape' && setAbierto(false)
    document.addEventListener('pointerdown', fuera)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('pointerdown', fuera)
      document.removeEventListener('keydown', esc)
    }
  }, [abierto])
  return (
    <div ref={caja} className="relative">
      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        aria-label={t.ajustes}
        aria-expanded={abierto}
        aria-haspopup="true"
        className="grid h-9 w-9 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/45"
      >
        <Settings size={18} />
      </button>
      {abierto && (
        <div role="group" aria-label={t.idioma} className="entra absolute right-0 top-11 z-20 w-56 rounded-[20px] bg-surface p-2 text-ink shadow-e3">
          <p className="flex items-center gap-2 px-3 pb-1 pt-2 font-display text-[12px] font-medium uppercase tracking-[0.1em] text-ink2">
            <Globe size={14} /> {t.idioma}
          </p>
          {IDIOMAS.map((l) => (
            <button
              key={l.id}
              type="button"
              lang={l.id}
              aria-pressed={idioma === l.id}
              onClick={() => {
                setIdioma(l.id)
                setAbierto(false)
              }}
              className={`flex h-10 w-full items-center justify-between rounded-full px-3 font-display text-[15px] ${
                idioma === l.id ? 'bg-tonal font-medium text-onTonal' : 'hover:bg-surface2'
              }`}
            >
              {l.nombre}
              {idioma === l.id && <Check size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function MiraAR() {
  const [idioma, setIdiomaEstado] = useState(idiomaInicial)
  const t = TXT[idioma]
  const setIdioma = (id) => {
    setIdiomaEstado(id)
    try {
      localStorage.setItem('mira-idioma', id)
    } catch {}
  }
  useEffect(() => {
    document.documentElement.lang = idioma
    document.title = t.htmlTitle
  }, [idioma, t])
  return (
    <Idioma.Provider value={{ idioma, t, setIdioma }}>
    <div className="min-h-screen bg-surface font-sans text-ink">
      <Hero />

      <main id="futuro" className="gutter mx-auto grid max-w-[1160px] gap-20 pb-24 pt-20 sm:pt-28">
        <div className="grid gap-5">
          <h2 className="max-w-[16ch] font-display text-[clamp(38px,6vw,68px)] font-normal leading-[1.05] tracking-[-0.01em] text-ink">
            {t.futuro.titulo}
          </h2>
          <p className="max-w-[60ch] text-[18px] leading-8 text-ink2">
            {t.futuro.texto}
          </p>
        </div>

        <ol className="grid gap-3 sm:grid-cols-3">
          {t.pasos.map(({ icon: Icon, titulo, texto }, i) => (
            <li key={titulo} className="flex min-w-0 gap-4 rounded-[20px] bg-surface2 p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface text-primary shadow-e1">
                <Icon size={18} />
              </span>
              <div className="min-w-0">
                <p className="font-display text-[16px] font-medium text-ink">
                  <span className="text-ink2 tabular-nums">{i + 1}.</span> {titulo}
                </p>
                <p className="mt-1 text-[14px] leading-6 text-ink2">{texto}</p>
              </div>
            </li>
          ))}
        </ol>

        <Bloque
          etiqueta={t.bloque.etiqueta}
          titulo={t.bloque.titulo}
          texto={t.bloque.texto}
          items={t.hoy}
        />

        <Proyecto />

        <section className="overflow-hidden rounded-[32px] bg-surface2">
          <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div className="min-w-0">
              <p className="font-display text-[13px] font-medium uppercase tracking-[0.12em] text-primary">{t.contacto.etiqueta}</p>
              <h2 className="mt-2 font-display text-[clamp(28px,4vw,40px)] font-normal leading-tight text-ink">
                {t.contacto.titulo}
              </h2>
              <p className="mt-4 max-w-[58ch] text-[16px] leading-7 text-ink2">
                {t.contacto.antes}
                <strong className="font-bold text-ink">Mira AR</strong>
                {t.contacto.despues}
              </p>
            </div>
            <div className="grid gap-3 rounded-[24px] bg-surface p-5 shadow-e1">
              <p className="font-display text-[20px] font-medium text-ink">Brian Hawkins</p>
              <p className="-mt-2 text-[14px] text-ink2">{t.contacto.sub}</p>
              <a href={LINKEDIN} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary font-display text-[15px] font-medium text-white">
                {t.contacto.linkedin} <ArrowUpRight size={16} />
              </a>
              <a href={RETO} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line font-display text-[15px] font-medium text-primary">
                {t.contacto.reto} <ArrowUpRight size={16} />
              </a>
              <p className="select-all text-center text-[13px] text-ink2">linkedin.com/in/briandh5</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="gutter border-t border-line/70 bg-surface pb-10 pt-6">
        <div className="mx-auto grid max-w-[1160px] gap-2 text-[12px] leading-5 text-ink2">
          <p>
            {t.pie.aviso}
          </p>
          <p>
            {t.pie.creditos}
            <a className="underline underline-offset-2 hover:text-primary" href="https://unsplash.com/license" target="_blank" rel="noreferrer">
              {t.pie.licencia}
            </a>
            {t.pie.autores}
          </p>
        </div>
      </footer>
    </div>
    </Idioma.Provider>
  )
}

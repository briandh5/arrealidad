import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  ArrowUpRight, Bookmark, Camera, Check, Clapperboard, Clock, Globe,
  MapPin, Minus, Navigation, Pause, Play, Plus, RotateCcw, ScanLine, Share2, Star,
  Ticket, UtensilsCrossed, X,
} from 'lucide-react'
import lugar from './assets/lugar.jpg'
import poster from './assets/poster.jpg'

const LINKEDIN = 'https://www.linkedin.com/in/briandh5/'
const RETO = 'https://101greatideas.vercel.app'

// Medidas del video y punto del edificio seleccionado (en píxeles del video)
const VW = 1280
const VH = 720
const ANCLA = { x: 617, y: 215 }
const SEG_CARD = 9000

// Fotos con licencia Unsplash (uso libre); se cargan desde unsplash.com
const unsplash = (id) => `https://unsplash.com/photos/${id}/download?w=1200`

const HOY = [
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
]

const PASOS = [
  { icon: ScanLine, titulo: 'Apunta', texto: 'La cámara reconoce edificios, negocios y letreros con la información de Maps.' },
  { icon: MapPin, titulo: 'Toca', texto: 'Aparece la ficha del lugar: horarios, reseñas, fotos y lo que puedes hacer ahí.' },
  { icon: Check, titulo: 'Resuelve', texto: 'Reserva, compra o comparte en el mismo momento, sin cambiar de app.' },
]

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
        <img src={lugar} alt="Vista del edificio seleccionado desde la orilla del lago" className="h-full w-full object-cover" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-medium text-ink font-display">
          <ScanLine size={13} className="text-primary" /> Reconocido en AR
        </span>
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar ficha"
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
            <span>Mirador</span>
          </div>
          <p className="mt-1 text-[14px] text-ink2">
            <span className="font-medium text-ok">Abierto</span> · Cierra a las 22:00
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[14px] text-ink2">
            <Navigation size={13} /> A 2.3 km · 9 min en auto
          </p>
          <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
            <BotonAccion icon={Navigation} filled href="https://www.google.com/maps/search/?api=1&query=360+CHICAGO">
              Cómo llegar
            </BotonAccion>
            <BotonAccion icon={Ticket} onClick={() => ir('tickets')}>Comprar tickets</BotonAccion>
            <BotonAccion icon={Globe} href="https://360chicago.com">Sitio web</BotonAccion>
            <BotonAccion icon={Bookmark} onClick={() => { onInteractuar(); setGuardado((g) => !g) }}>
              {guardado ? 'Guardado' : 'Guardar'}
            </BotonAccion>
            <BotonAccion icon={Share2} onClick={onInteractuar}>Compartir</BotonAccion>
          </div>
          <p className="mt-3 border-t border-line pt-2 text-[12px] text-ink2">Datos de ejemplo para la demo</p>
        </div>
      )}

      {vista === 'tickets' && (
        <div className="px-4 pb-4 pt-3">
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-ink2">Chicago 360 · Hoy</p>
          <h3 className="mt-0.5 font-display text-[20px] font-medium">Entrada general</h3>
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-surface2 px-3 py-2">
            <span className="text-[14px] text-ink2">Boletos · US${precio} c/u</span>
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Quitar un boleto" onClick={() => setCantidad((c) => Math.max(1, c - 1))} className="grid h-8 w-8 place-items-center rounded-full bg-surface text-ink shadow-e1">
                <Minus size={16} />
              </button>
              <span className="w-5 text-center font-display text-[16px] font-medium tabular-nums">{cantidad}</span>
              <button type="button" aria-label="Agregar un boleto" onClick={() => setCantidad((c) => Math.min(8, c + 1))} className="grid h-8 w-8 place-items-center rounded-full bg-surface text-ink shadow-e1">
                <Plus size={16} />
              </button>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[14px]">
            <span className="text-ink2">Total</span>
            <span className="font-display text-[18px] font-medium tabular-nums">US${precio * cantidad}</span>
          </div>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => setVista('info')} className="h-10 flex-1 rounded-full border border-line font-display text-[14px] font-medium text-primary">
              Atrás
            </button>
            <button type="button" onClick={() => setVista('listo')} className="h-10 flex-[2] rounded-full bg-primary font-display text-[14px] font-medium text-white">
              Pagar con Wallet
            </button>
          </div>
          <p className="mt-2 text-[12px] text-ink2">Compra simulada, no se cobra nada</p>
        </div>
      )}

      {vista === 'listo' && (
        <div className="px-4 pb-4 pt-4 text-center">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-tonal text-onTonal">
            <Check size={22} />
          </span>
          <h3 className="mt-2 font-display text-[20px] font-medium">Boletos listos</h3>
          <p className="mt-1 text-[14px] text-ink2">
            {cantidad} {cantidad === 1 ? 'entrada' : 'entradas'} para hoy. Las verás en Wallet al llegar.
          </p>
          <button type="button" onClick={() => setVista('info')} className="mt-3 h-10 w-full rounded-full bg-tonal font-display text-[14px] font-medium text-onTonal">
            Volver a la ficha
          </button>
        </div>
      )}
    </div>
  )
}

function Hero() {
  const caja = useRef(null)
  const video = useRef(null)
  const { w, h } = useMedida(caja)
  const reducido = useMovimientoReducido()
  const [fase, setFase] = useState('video')
  const [cerrada, setCerrada] = useState(false)
  const [pausado, setPausado] = useState(false)
  const ocupado = useRef(false)

  // Posición del edificio en pantalla con object-fit: cover
  const s = Math.max(w / VW, h / VH) || 1
  const ax = (w - VW * s) / 2 + ANCLA.x * s
  const ay = (h - VH * s) / 2 + ANCLA.y * s
  const ancho = w >= 900

  const mostrarFicha = () => {
    setCerrada(false)
    setFase('ficha')
  }

  const repetir = () => {
    const v = video.current
    ocupado.current = false
    setCerrada(false)
    setFase('video')
    if (v) {
      v.currentTime = 0
      v.play().catch(() => mostrarFicha())
      setPausado(false)
    }
  }

  useEffect(() => {
    if (reducido) {
      setFase('ficha')
      setPausado(true)
      return
    }
    video.current?.play().catch(() => mostrarFicha())
  }, [reducido])

  useEffect(() => {
    if (fase !== 'ficha' || pausado || reducido) return
    const t = setTimeout(() => {
      if (!ocupado.current) repetir()
    }, SEG_CARD)
    return () => clearTimeout(t)
  }, [fase, pausado, reducido])

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
        onEnded={mostrarFicha}
        aria-label="Video: una mano señala el skyline de Chicago desde la orilla congelada del lago y la app reconoce el edificio del centro"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,18,32,.55)_0%,rgba(4,18,32,0)_22%,rgba(4,18,32,0)_55%,rgba(4,18,32,.7)_100%)]" />

      <div className="gutter absolute inset-x-0 top-0 flex items-center justify-between pt-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 font-display text-[15px] font-medium text-white backdrop-blur">
          <span className="grid h-5 w-5 place-items-center rounded-full border-2 border-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          Mira AR
        </span>
        <span className="hidden rounded-full bg-black/30 px-3 py-1.5 font-display text-[13px] text-white/90 backdrop-blur sm:inline">
          Propuesta para el ecosistema de Google
        </span>
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
          onPointerEnter={() => (ocupado.current = true)}
          onPointerLeave={() => (ocupado.current = false)}
          onFocus={() => (ocupado.current = true)}
        >
          <FichaLugar onCerrar={() => setCerrada(true)} onInteractuar={() => (ocupado.current = true)} />
        </div>
      )}

      {(ancho || !verFicha) && (
        <div className="gutter absolute inset-x-0 bottom-0 pb-8">
          <div className="max-w-[560px] text-white">
            <p className="font-display text-[14px] font-medium uppercase tracking-[0.12em] text-white/80">Chicago · Lakefront Trail</p>
            <h1 className="mt-2 font-display text-[clamp(30px,4.6vw,52px)] font-medium leading-[1.08]">
              Señala un edificio. Maps te responde.
            </h1>
            <div className="mt-5 flex flex-wrap gap-2">
              {cerrada && (
                <button type="button" onClick={mostrarFicha} className="inline-flex h-10 items-center gap-2 rounded-full bg-surface px-4 font-display text-[14px] font-medium text-primary">
                  <MapPin size={16} /> Ver ficha del lugar
                </button>
              )}
              <a href="#futuro" className="inline-flex h-10 items-center rounded-full bg-primary px-5 font-display text-[14px] font-medium text-white">
                Conoce la propuesta
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="absolute right-[max(16px,env(safe-area-inset-right,0px))] top-16 flex gap-2 min-[900px]:top-auto min-[900px]:bottom-8">
        <button type="button" onClick={alternarPausa} aria-label={pausado ? 'Reanudar demo' : 'Pausar demo'} className="grid h-9 w-9 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/45">
          {pausado ? <Play size={16} /> : <Pause size={16} />}
        </button>
        <button type="button" onClick={repetir} aria-label="Repetir demo" className="grid h-9 w-9 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/45">
          <RotateCcw size={16} />
        </button>
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
          Foto:{' '}
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

export default function MiraAR() {
  return (
    <div className="min-h-screen bg-surface font-sans text-ink">
      <Hero />

      <main id="futuro" className="gutter mx-auto grid max-w-[1160px] gap-20 pb-24 pt-20 sm:pt-28">
        <div className="grid gap-5">
          <h2 className="max-w-[16ch] font-display text-[clamp(38px,6vw,68px)] font-normal leading-[1.05] tracking-[-0.01em] text-ink">
            El futuro de la realidad aumentada está aquí
          </h2>
          <p className="max-w-[60ch] text-[18px] leading-8 text-ink2">
            Mira AR une la cámara con la información de Maps. Apuntas a un edificio, un negocio o un letrero y aparece una ficha con
            todo lo que puedes hacer ahí: reservar, comprar boletos, llegar o compartir una foto. Sin buscar, sin escribir y sin
            cambiar de app.
          </p>
        </div>

        <ol className="grid gap-3 sm:grid-cols-3">
          {PASOS.map(({ icon: Icon, titulo, texto }, i) => (
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
          etiqueta="Desde el primer día"
          titulo="Lo que puedes hacer con solo apuntar"
          texto="Tres acciones que hoy requieren buscar, abrir otra app y volver. Con Mira AR suceden sobre la vista de la cámara."
          items={HOY}
        />

        <section className="overflow-hidden rounded-[32px] bg-surface2">
          <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div className="min-w-0">
              <p className="font-display text-[13px] font-medium uppercase tracking-[0.12em] text-primary">Una idea para Google</p>
              <h2 className="mt-2 font-display text-[clamp(28px,4vw,40px)] font-normal leading-tight text-ink">
                Me encantaría ser parte del proceso
              </h2>
              <p className="mt-4 max-w-[58ch] text-[16px] leading-7 text-ink2">
                Soy Brian Hawkins, licenciado en informática, y me gusta la tecnología y los datos, así como pensar en la correcta
                experiencia del usuario. <strong className="font-bold text-ink">Mira AR</strong> es la app #8 de mi reto de 101 apps. Si
                este concepto encaja con el ecosistema de Google, me gustaría formar parte del equipo que esté trabajando en él.
              </p>
            </div>
            <div className="grid gap-3 rounded-[24px] bg-surface p-5 shadow-e1">
              <p className="font-display text-[20px] font-medium text-ink">Brian Hawkins</p>
              <p className="-mt-2 text-[14px] text-ink2">Propuesta independiente · Reto 101 apps</p>
              <a href={LINKEDIN} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary font-display text-[15px] font-medium text-white">
                Escríbeme en LinkedIn <ArrowUpRight size={16} />
              </a>
              <a href={RETO} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line font-display text-[15px] font-medium text-primary">
                Ver reto 101 apps <ArrowUpRight size={16} />
              </a>
              <p className="select-all text-center text-[13px] text-ink2">linkedin.com/in/briandh5</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="gutter border-t border-line/70 bg-surface pb-10 pt-6">
        <div className="mx-auto grid max-w-[1160px] gap-2 text-[12px] leading-5 text-ink2">
          <p>
            Concepto independiente creado por Brian Hawkins. No está afiliado ni respaldado por Google. Google, Google Maps y Google Wallet
            son marcas de Google LLC. Calificaciones, horarios y precios mostrados son ejemplos.
          </p>
          <p>
            Video del hero: proporcionado por Brian Hawkins. Fotografías de las tarjetas bajo la{' '}
            <a className="underline underline-offset-2 hover:text-primary" href="https://unsplash.com/license" target="_blank" rel="noreferrer">
              Licencia Unsplash
            </a>
            : Moriah Bender, David Vives y Brady Jordan.
          </p>
        </div>
      </footer>
    </div>
  )
}

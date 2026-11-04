import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowIcon, SiteFooter, SiteHeader } from '~/components/site-chrome';
import { useSession } from '~/components/session-provider';
import ShinyText from '~/components/ShinyText';
import { LaunchTicket } from '~/components/launch-ticket';

export function meta() {
  return [
    { title: 'Flashing — Menos scroll. Más vida.' },
    { name: 'description', content: 'Un reto inesperado. Un momento para ti. Descubre Flashing y crea tu cuenta antes del lanzamiento.' },
  ];
}

const flashes = [
  { title: 'Tu día acaba de cambiar.', text: 'El flash de hoy ya está aquí.\n¿Cómo se ve el mundo desde donde estás?', action: 'Descubrir el flash' },
  { title: 'Mira hacia arriba.', text: 'Fotografía lo que tienes encima.\nLuego gira la cámara: también formas parte.', action: 'Capturar mi momento' },
  { title: 'Este momento ya es tuyo.', text: 'Así será compartir un flash.\nDespués podrás descubrir el de tus amigos.', action: 'Descubrir Flashing' },
];

const stories = [
  { title: <>Llega cuando<br /> menos lo esperas.</>, text: 'Estás en lo tuyo y aparece un flash. La misma propuesta para todos, con un tiempo limitado para hacerla tuya.', action: '¿Y después?' },
  { title: <>Dos cámaras.<br /> Una historia tuya.</>, text: 'Captura lo que tienes delante y lo que estás viviendo. Un momento cotidiano, desde tu punto de vista.', action: '¿Y mis amigos?' },
  { title: <>Tu día se cruza<br /> con el de los tuyos.</>, text: 'Al compartir tu flash descubres el de tus amigos. La misma propuesta, vivida de formas completamente distintas.', action: 'Así empieza todo' },
];

export default function Landing() {
  const { user } = useSession();
  const [flashIndex, setFlashIndex] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);
  const [store, setStore] = useState('');
  const destination = user ? '/welcome' : '/register';
  const flash = flashes[flashIndex];
  const story = stories[storyIndex];

  return (
    <div className="landing-page">
      <div className="landing-intro">
        <SiteHeader landing />
        <main className="content-grid">
          <div className="hero">
            <div className="hero-copy">
              <h1><ShinyText text="Menos scroll." color="#000000" shineColor="#535A75" trigger="loop" delay={3} speed={2.5} shineWidth={25} />{' '}
                <ShinyText className="hero-life" text="Más vida." color="#FFFFFF" shineColor="#E6E0AC" trigger="loop" delay={3} speed={2.5} shineWidth={25} /></h1>
              <p>Un reto inesperado. Un momento para ti. Una nueva forma de compartir el día con tus amigos.</p>
              <Link className="pill" to={destination}>Quiero mi próximo flash <ArrowIcon /></Link>
            </div>
            <div className="hero-logo" aria-hidden="true">
              <div className="hero-emblem">
                <img src="/branding/flashing.svg" alt="" width="220" height="326" />
              </div>
            </div>
            <div className="flash-stage">
              <article className={`flash-preview flash-state-${flashIndex}`} aria-label="Prueba una muestra de Flashing">
                <div className="preview-heading"><span><img src="/branding/flashing.svg" alt="" width="14" height="21" />flashing</span><span>ahora</span></div>
                <div className="preview-content" key={flashIndex} aria-live="polite"><h2>{flash.title}</h2><p>{flash.text}</p></div>
                {flashIndex === flashes.length - 1
                  ? <Link className="preview-action" to={destination}>{flash.action} <ArrowIcon /></Link>
                  : <button className="preview-action" type="button" onClick={() => setFlashIndex(flashIndex + 1)}>{flash.action} <ArrowIcon /></button>}
              </article>
            </div>
          </div>
        </main>
      </div>
      <LaunchTicket destination={destination} />
      <section className="how-section content-grid" id="how" aria-labelledby="how-title">
        <h2 id="how-title">Lo inesperado<br />también se comparte.</h2>
        <article className="story-card">
          <div className="story-content" key={storyIndex} aria-live="polite"><h3>{story.title}</h3><p>{story.text}</p></div>
          <button className="story-next" type="button" onClick={() => setStoryIndex((storyIndex + 1) % stories.length)}>{story.action}<span aria-hidden="true">→</span></button>
        </article>
      </section>
      <section className="download-section content-grid" id="download" aria-labelledby="download-title">
        <div className="download-inner">
          <h2 id="download-title">Hay un mundo<br /><span>fuera del feed.</span></h2>
          <div className="store-group">
            <div className="store-buttons">
              <button className="store-button" type="button" onClick={() => setStore('App Store')} aria-describedby="store-status"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M11 18h2" /></svg><span><small>Próximamente en</small> App Store</span></button>
              <button className="store-button" type="button" onClick={() => setStore('Google Play')} aria-describedby="store-status"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m5 3 15 9-15 9Z" strokeLinejoin="round" /></svg><span><small>Próximamente en</small> Google Play</span></button>
            </div>
            <p className="store-status" id="store-status" role="status">{store ? `Todavía no estamos en ${store}. Crea tu cuenta y elige recibir el aviso de lanzamiento.` : 'Estamos preparando algo que merece la pena vivir.'}</p>
            <Link className="download-register" to={destination}>{user ? 'Ir a mi cuenta' : 'Crea tu cuenta y entérate antes'} <ArrowIcon /></Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

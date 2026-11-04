import { Link, useNavigate } from 'react-router';
import TearTicket from './TearTicket';
import { ArrowIcon } from './site-chrome';
import { useElementWidth } from '~/hooks/use-element-width';

export function LaunchTicket({ destination }: { destination: string }) {
  const navigate = useNavigate();
  const { ref, width } = useElementWidth(340);
  const vertical = width < 440;
  const signedIn = destination === '/welcome';

  return (
    <section className="launch-ticket-section content-grid" aria-label="Tu ticket para el lanzamiento de Flashing">
      <div className="launch-ticket-slot" ref={ref}>
        <TearTicket width={width} height={vertical ? 340 : 250} stubSize={vertical ? 88 : 130}
          orientation={vertical ? 'vertical' : 'horizontal'} rotate={0} tilt={false} parallax={0}
          background="var(--sand)" stubBackground="var(--yellow)" color="var(--black)" border={false}
          radius={20} recenter={false} ariaLabel={signedIn ? 'Romper el ticket y ver mi cuenta' : 'Romper el ticket y crear mi cuenta'}
          onTear={() => navigate(destination)}
          stub={<div className="launch-ticket-stub"><span>Tira de aquí</span><ArrowIcon /></div>}>
          <div className="launch-ticket-body">
            <span className="ticket-brand"><img src="/branding/flashing.svg" alt="" width="16" height="24" />flashing</span>
            <h2>Tu próximo flash<br />empieza aquí.</h2>
            <p>{signedIn ? 'Ya tienes tu sitio. Revisa tu aviso de lanzamiento desde tu cuenta.' : 'Crea tu cuenta y elige recibir el aviso del lanzamiento.'}</p>
          </div>
        </TearTicket>
      </div>
      <Link className="ticket-direct-link" to={destination}>{signedIn ? 'Ir a mi cuenta' : 'Crear cuenta directamente'} <ArrowIcon /></Link>
    </section>
  );
}

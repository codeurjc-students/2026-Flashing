import { useId } from 'react';
import type { NotificationPreferences } from '~/services/auth-service';

export function NotificationFields({ preferences, onChange, disabled = false }: {
  preferences: NotificationPreferences;
  onChange: (preferences: NotificationPreferences) => void;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <fieldset className="notification-fields" disabled={disabled}>
      <legend>Aviso de lanzamiento</legend>
      <label className="check-field" htmlFor={`${id}-launch`}>
        <input id={`${id}-launch`} name="launchUpdates" type="checkbox" checked={preferences.launchUpdates}
          onChange={(event) => onChange({ ...preferences, launchUpdates: event.target.checked })} />
        <span>Avísame por correo cuando Flashing esté lista.</span>
      </label>
      <p className="field-hint">Un correo cuando llegue el momento. Es voluntario y puedes desactivar el aviso desde tu cuenta.</p>
    </fieldset>
  );
}

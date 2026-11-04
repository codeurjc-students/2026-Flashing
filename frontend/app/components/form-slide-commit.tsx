import { useEffect, useRef, type RefObject } from 'react';
import SlideCommit, { type SlideCommitHandle } from './SlideCommit';
import { useElementWidth } from '~/hooks/use-element-width';

export function FormSlideCommit({ formRef, label, onConfirm, disabled }: {
  formRef: RefObject<HTMLFormElement | null>;
  label: string;
  onConfirm: (form: HTMLFormElement) => Promise<void>;
  disabled: boolean;
}) {
  const control = useRef<SlideCommitHandle>(null);
  const { ref, width } = useElementWidth(280);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    // Native Enter submission and the gesture use the exact same async action.
    const submit = (event: SubmitEvent) => {
      event.preventDefault();
      control.current?.confirm();
    };
    form.addEventListener('submit', submit);
    return () => form.removeEventListener('submit', submit);
  }, [formRef]);

  async function confirm() {
    const form = formRef.current;
    if (!form?.reportValidity()) throw new Error('Revisa los campos del formulario.');
    await onConfirm(form);
  }

  return (
    <div className="form-commit" ref={ref}>
      <SlideCommit ref={control} label={label} doneLabel="Todo listo" errorLabel="Vuelve a intentarlo"
        width={width} height={58} trackColor="#000000" handleColor="#FFE500"
        successColor="#FFE500" dangerColor="#535A75" returnBounce={0.2} landingDip={0}
        disabled={disabled} onConfirm={confirm} />
      <p className="field-hint">Desliza o pulsa Intro para continuar.</p>
      <button type="submit" hidden tabIndex={-1} aria-hidden="true" />
    </div>
  );
}

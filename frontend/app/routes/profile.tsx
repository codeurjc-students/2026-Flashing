import { redirect } from 'react-router';

export function clientLoader() {
  return redirect('/welcome');
}

export default function ProfileRedirect() {
  return null;
}

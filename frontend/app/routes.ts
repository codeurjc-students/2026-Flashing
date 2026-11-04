import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('./routes/landing.tsx'),
  route('login', './routes/login.tsx'),
  route('register', './routes/register.tsx'),
  route('profile', './routes/profile.tsx'),
  route('welcome', './routes/welcome.tsx'),
  route('privacy', './routes/privacy.tsx'),
] satisfies RouteConfig;

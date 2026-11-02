import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('./routes/challenges.tsx'),
  route('login', './routes/login.tsx'),
  route('register', './routes/register.tsx'),
  route('profile', './routes/profile.tsx'),
] satisfies RouteConfig;

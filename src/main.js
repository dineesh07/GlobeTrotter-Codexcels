import './styles/style.css';
import { observeAuth } from './services/auth';
import { Home } from './pages/home';
import { Login } from './pages/login';
import { Signup } from './pages/signup';
import { Dashboard } from './pages/dashboard';
import { CreateTrip } from './pages/createTrip';
import { TripDetails } from './pages/tripDetails';
import { PublicTrip } from './pages/publicTrip';
import { UserSettings } from './pages/settings';
import { Community } from './pages/community';
import { Search } from './pages/search';

const app = document.querySelector('#app');

// Simple Router
const routes = {
  'home': Home,
  'login': Login,
  'signup': Signup,
  'dashboard': Dashboard,
  'create-trip': CreateTrip,
  'trip-details': TripDetails,
  'public-trip': PublicTrip,
  'settings': UserSettings,
  'community': Community,
  'search': Search
};

let currentUser = null;

// Navigate function exposed globally for simplicity in this vanilla setup
window.navigateTo = async (route, params = {}) => {
  const componentFn = routes[route];
  if (componentFn) {
    app.innerHTML = ''; // Clear current content

    // Support both sync and async components
    try {
      let component = componentFn(currentUser, params);

      // If it's a promise, await it
      if (component instanceof Promise) {
        component = await component;
      }

      app.appendChild(component);

      // Update URL without reload (optional but good for UX)
      // const url = new URL(window.location);
      // url.searchParams.set('route', route);
      // window.history.pushState({}, '', url);

    } catch (error) {
      console.error(`Error rendering route ${route}:`, error);
      app.innerHTML = `<p style="color: red; padding: 2rem;">Error loading page: ${error.message}</p>`;
    }
  } else {
    console.error(`Route ${route} not found`);
    app.innerHTML = `<p>404 - Page Not Found</p>`;
  }
};

// Auth State Observer
observeAuth((user) => {
  currentUser = user;

  // check for query params primarily for public routes
  const urlParams = new URLSearchParams(window.location.search);
  const routeParam = urlParams.get('route');
  const tripIdParam = urlParams.get('tripId');

  if (routeParam === 'public-trip' && tripIdParam) {
    // Public route: allow access even if not logged in (or if logged in)
    window.navigateTo('public-trip', { tripId: tripIdParam });
    return;
  }

  if (user) {
    // If logged in
    // If explicitly on home, redirect to dashboard
    if (!routeParam || routeParam === 'home') {
      window.navigateTo('dashboard');
    } else {
      // Navigate to requested route if it exists
      if (routes[routeParam]) {
        window.navigateTo(routeParam);
      } else {
        window.navigateTo('dashboard');
      }
    }
  } else {
    // If logged out
    const publicRoutes = ['login', 'signup', 'home'];

    if (routeParam && publicRoutes.includes(routeParam)) {
      window.navigateTo(routeParam);
    } else {
      // Default to Home instead of Login
      window.navigateTo('home');
    }
  }
});

// Handle initial render if auth takes time?
// Usually auth observer fires quickly. We can show a loader if needed.
app.innerHTML = '<p style="margin-top: 2rem;">Loading...</p>';

import { ViteReactSSG } from 'vite-react-ssg'
import App, { routes } from './App' // Import both the Component and the Routes
import './index.css'

export const createApp = ViteReactSSG(
  App, // Pass the App component here as the root wrapper
  { routes },
  ({ app, router, routes, isClient }) => {
    // This hook runs during pre-rendering. 
    // If you need to add analytics or specific logic for the browser, do it here.
  }
)
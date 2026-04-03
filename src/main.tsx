import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './App'
import './index.css'

export const createApp = ViteReactSSG(
  { routes },
  ({ app, router, routes, isClient }) => {
    // optional setup hook
  }
)

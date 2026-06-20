import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

if (import.meta.env.DEV) {
  // Available in browser console: pitchcall.resolveAll() / pitchcall.resolvePredictions(id)
  import('./lib/scoring.js').then(m => {
    window.pitchcall = { resolvePredictions: m.resolvePredictions, resolveAll: m.resolveAll }
    console.log('[pitchcall] scoring helpers → window.pitchcall')
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

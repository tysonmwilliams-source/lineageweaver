import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Import theme CSS files
import './styles/themes/theme-royal-parchment.css'
import './styles/themes/theme-light-manuscript.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

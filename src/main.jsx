import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Theme CSS is now loaded dynamically by ThemeContext
// Only the base theme variables are loaded here for initial render
import './styles/themes/theme-base.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Import theme CSS files
import './styles/themes/theme-royal-parchment.css'
import './styles/themes/theme-light-manuscript.css'
import './styles/themes/theme-emerald-court.css'
import './styles/themes/theme-sapphire-dynasty.css'
import './styles/themes/theme-autumn-chronicle.css'
import './styles/themes/theme-rose-lineage.css'
import './styles/themes/theme-twilight-realm.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

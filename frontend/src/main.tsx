import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'primereact/resources/themes/saga-blue/theme.css';  // choose any theme
import 'primereact/resources/primereact.min.css';          // core styles
import 'primeicons/primeicons.css';                        // icons

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <App />
  </StrictMode>
  ,
)

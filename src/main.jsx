import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MiraAR from './MiraAR.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MiraAR />
  </StrictMode>
)

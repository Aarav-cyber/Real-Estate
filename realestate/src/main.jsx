import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { GoogleOAuthProvider } from '@react-oauth/google';

// import './index.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(

  <StrictMode>
    <GoogleOAuthProvider clientId="493087171666-r7uird1qvp1u2ap42ad4aqmp34if3svb.apps.googleusercontent.com">

      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)

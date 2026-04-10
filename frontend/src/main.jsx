import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { InstallPWA } from './components/common/InstallPWA'
import { OfflineIndicator } from './components/common/OfflineIndicator'
import { usePWAInstallPrompt, useOfflineStatus, useServiceWorker } from './hooks/usePWA'
import { useState } from 'react'

// #region agent log
fetch('http://127.0.0.1:7595/ingest/a1327625-861f-425d-8b19-5e387310336b',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5ea8b1'},body:JSON.stringify({sessionId:'5ea8b1',runId:'run2',hypothesisId:'H5',location:'main.jsx:module-load',message:'frontend bootstrap executed',data:{url:window.location.pathname},timestamp:Date.now()})}).catch(()=>{});
// #endregion

function PWAWrapper() {
  const { isInstallable } = usePWAInstallPrompt()
  const { updateAvailable } = useServiceWorker()
  const [dismissed, setDismissed] = useState(false)
  
  const showBanner = (isInstallable || updateAvailable) && !dismissed
  
  return (
    <>
      <OfflineIndicator />
      {showBanner && <InstallPWA onDismiss={() => setDismissed(true)} />}
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PWAWrapper />
    <App />
  </StrictMode>,
)

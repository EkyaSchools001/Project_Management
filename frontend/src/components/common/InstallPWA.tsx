import { useState } from 'react';
import { Download, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWAInstallPrompt, useServiceWorker } from '@/hooks/usePWA';

export function InstallPWA({ onDismiss }) {
  const { isInstallable, install } = usePWAInstallPrompt();
  const { updateAvailable, update } = useServiceWorker();
  const [isInstalling, setIsInstalling] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable && !updateAvailable || dismissed) {
    return null;
  }

  const handleInstall = async () => {
    setIsInstalling(true);
    await install();
    setIsInstalling(false);
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-card border border-border rounded-xl shadow-lg p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            {updateAvailable ? (
              <>
                <h3 className="font-semibold text-foreground">Update Available</h3>
                <p className="text-sm text-muted-foreground">
                  A new version of SchoolOS is available.
                </p>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-foreground">Install SchoolOS</h3>
                <p className="text-sm text-muted-foreground">
                  Add to your home screen for quick access and offline support.
                </p>
              </>
            )}
          </div>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex gap-2">
          {updateAvailable ? (
            <Button onClick={update} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Update Now
            </Button>
          ) : (
            <Button onClick={handleInstall} disabled={isInstalling} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              {isInstalling ? 'Installing...' : 'Install App'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default InstallPWA;
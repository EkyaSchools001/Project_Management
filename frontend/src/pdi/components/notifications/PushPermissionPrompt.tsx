import React from 'react';
import { Bell, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '@pdi/components/ui/button';
import { Card, CardContent } from '@pdi/components/ui/card';
import { usePushNotifications } from '@pdi/hooks/usePushNotifications';

interface PushPermissionPromptProps {
  onComplete?: (granted: boolean) => void;
}

export const PushPermissionPrompt: React.FC<PushPermissionPromptProps> = ({ onComplete }) => {
  const {
    permission,
    isSupported,
    isLoading,
    error,
    subscribe,
    unsubscribe,
  } = usePushNotifications({ autoSubscribe: false });

  const handleEnable = async () => {
    const subscription = await subscribe();
    if (subscription) {
      onComplete?.(true);
    }
  };

  const handleDisable = async () => {
    await unsubscribe();
    onComplete?.(false);
  };

  if (!isSupported) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4 text-center">
          <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-foreground/70 text-sm">
            Push notifications are not supported in your browser
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-[#8b5cf6] border-t-transparent rounded-full mx-auto" />
          <p className="text-foreground/50 text-sm mt-2">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (permission === 'granted') {
    return (
      <Card className="bg-violet-500/10 border-violet-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-violet-500" />
              </div>
              <div>
                <p className="text-foreground font-medium">Push Notifications Enabled</p>
                <p className="text-foreground/50 text-sm">You'll receive notifications in your browser</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDisable}
              className="border-white/20 text-foreground hover:bg-white/10"
            >
              Disable
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (permission === 'denied') {
    return (
      <Card className="bg-red-500/10 border-red-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <X className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-foreground font-medium">Push Notifications Blocked</p>
              <p className="text-foreground/50 text-sm">
                Please enable notifications in your browser settings
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#8b5cf6]" />
            </div>
            <div>
              <p className="text-foreground font-medium">Enable Push Notifications</p>
              <p className="text-foreground/50 text-sm">Stay updated with real-time alerts</p>
            </div>
          </div>
          <Button 
            onClick={handleEnable}
            className="bg-[#8b5cf6] text-black hover:bg-[#8b5cf6]/80"
          >
            Enable
          </Button>
        </div>
        {error && (
          <p className="text-red-400 text-sm mt-2">{error}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PushPermissionPrompt;
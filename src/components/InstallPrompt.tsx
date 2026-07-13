"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true;
    setIsInstalled(isAppInstalled);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Don't show if already installed or user dismissed before
      if (!isAppInstalled && !localStorage.getItem('pwa-install-dismissed')) {
        setShowInstallPrompt(true);
      }
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
        localStorage.setItem('pwa-install-dismissed', 'true');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('Error during install prompt:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or no prompt available
  if (isInstalled || !showInstallPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-slideIn">
      <div className="bg-paper border border-ink/20 rounded-[3px] shadow-[5px_5px_0_0_rgba(36,26,53,0.15)] p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-ink text-paper rounded-[3px] flex items-center justify-center mr-3">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif font-medium text-lg text-ink leading-tight">Install Zeno</h3>
              <p className="text-sm text-ink-soft">Get the full app experience</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-ink-soft/60 hover:text-ink p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2 mb-4 border-y border-dashed border-ink/15 py-3">
          <div className="flex items-center text-sm text-ink-soft">
            <span className="w-1.5 h-1.5 rotate-45 bg-purple-700 mr-2.5"></span>
            Works offline
          </div>
          <div className="flex items-center text-sm text-ink-soft">
            <span className="w-1.5 h-1.5 rotate-45 bg-purple-700 mr-2.5"></span>
            Faster loading
          </div>
          <div className="flex items-center text-sm text-ink-soft">
            <span className="w-1.5 h-1.5 rotate-45 bg-purple-700 mr-2.5"></span>
            App-like experience
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={handleInstallClick}
            className="flex-1 shadow-[2px_2px_0_0_#241a35] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0_0_#241a35]"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Install
          </Button>
          <Button
            variant="outline"
            onClick={handleDismiss}
            size="sm"
          >
            Later
          </Button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, ExternalLink, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const WelcomePopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem('fanspark-welcome-popup-seen');
    
    if (!hasSeenPopup) {
      // Show popup after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Mark that user has seen the popup
    localStorage.setItem('fanspark-welcome-popup-seen', 'true');
  };

  const handleVisitMainPage = () => {
    // You can update this URL to your actual main webpage
    window.open('https://www.fanspark.xyz/fanspark-home', '_blank');
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300 p-4">
      <Card className="py-0 relative w-full max-w-5xl min-h-[60vh] max-h-[90vh] mx-4 bg-white/90 dark:bg-black/90 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-gray-800/50 overflow-auto animate-in zoom-in-95 duration-500 rounded-lg">
        {/* Glassy overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 dark:from-white/5 dark:via-transparent dark:to-white/2 pointer-events-none"></div>
        
        {/* Header with close button */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-10 w-10 p-0 rounded-full bg-white/20 dark:bg-black/30 hover:bg-white/30 dark:hover:bg-black/50 backdrop-blur-sm transition-all duration-200 border border-white/30 dark:border-gray-600/30"
          >
            <X size={18} className="text-gray-700 dark:text-gray-300" />
          </Button>
        </div>

        <div className="min-h-[60vh] flex flex-col lg:flex-row relative z-[1]">
          {/* Left side - Image */}
          <div className="lg:w-1/3 min-h-[60vh] lg:min-h-full relative overflow-hidden rounded-l-lg">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url(/scientist-pose-1.png)'
              }}
            />
          </div>

          {/* Right side - Content */}
          <div className="lg:w-2/3 p-6 lg:p-8 flex flex-col justify-center min-h-[60vh] lg:min-h-full bg-gradient-to-br from-white/50 via-white/30 to-white/20 dark:from-black/50 dark:via-black/30 dark:to-black/20 backdrop-blur-sm overflow-y-auto">
            <div className="space-y-5">
              {/* Header */}
              <div className="space-y-3 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                  <Sparkles size={24} className="text-blue-600 dark:text-blue-400 animate-pulse" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Welcome to FanSpark! (Beta)
                  </span>
                </div>
                <h2 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mt-2">
                  Hello Testers!
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mx-auto lg:mx-0 shadow-lg"></div>
              </div>

              {/* Main message */}
              <div className="space-y-4 text-gray-700 dark:text-gray-200 text-center lg:text-left">
                <div className="p-4 rounded-lg bg-white/30 dark:bg-black/30 backdrop-blur-sm border border-white/40 dark:border-gray-600/30">
                  <p className="text-base leading-relaxed mb-4">
                    You're exploring the beta version of <span className="font-semibold text-blue-600 dark:text-blue-400">FanSpark</span>, a new platform where fans and creators unite to spark bold ideas to life. While we're still polishing things, you can already discover early projects and campaigns!
                  </p>
                  <p className="text-base leading-relaxed mb-4">
                    Soon you'll be able to support creators, and help shape the future of fan-powered storytelling.
                  </p>
                  <p className="text-base leading-relaxed font-medium">
                    Thanks for being part of the journey!
                  </p>
                </div>
              </div>

              {/* Action button */}
              <div>
                <Button
                  onClick={handleClose}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-medium py-2.5 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm border border-white/20"
                >
                  Continue Testing
                </Button>
              </div>

              {/* Footer signature */}
              <div className="pt-4 mt-3 border-t border-white/30 dark:border-gray-600/30 text-center lg:text-left">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <Sparkles size={12} className="text-white" />
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">FanSpark Team</span>
                  </div>
                  <div className="flex items-center space-x-2 px-2 py-1 rounded-full bg-orange-100/50 dark:bg-orange-900/30 backdrop-blur-sm border border-orange-200/50 dark:border-orange-700/50">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-lg shadow-orange-500/50"></div>
                    <span className="text-xs font-medium text-orange-700 dark:text-orange-300">Beta Testing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WelcomePopup; 
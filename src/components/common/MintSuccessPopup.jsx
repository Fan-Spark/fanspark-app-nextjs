'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, MessageCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const MintSuccessPopup = ({ isVisible, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <Card className="py-0 relative w-full max-w-5xl h-[45vh] max-h-[45vh] mx-4 bg-white/90 dark:bg-black/90 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-gray-800/50 overflow-hidden animate-in zoom-in-95 duration-500 rounded-lg">
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

        <div className="h-full flex flex-col lg:flex-row relative z-[1]">
          {/* Left side - Image */}
          <div className="lg:w-1/3 h-full relative overflow-hidden rounded-l-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 dark:to-black/20 z-10"></div>
            <Image
              src="/sparky04.png"
              alt="Sparky Character"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Right side - Content */}
          <div className="lg:w-2/3 p-8 flex flex-col justify-center h-full bg-gradient-to-br from-white/50 via-white/30 to-white/20 dark:from-black/50 dark:via-black/30 dark:to-black/20 backdrop-blur-sm">
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-3 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                  <Sparkles size={24} className="text-purple-600 dark:text-purple-400 animate-pulse" />
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider">Success!</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                  You're In!
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-full mx-auto lg:mx-0 shadow-lg"></div>
              </div>

              {/* Main message */}
              <div className="space-y-4 text-gray-700 dark:text-gray-200 text-center lg:text-left">
                <div className="p-4 rounded-lg bg-white/30 dark:bg-black/30 backdrop-blur-sm border border-white/40 dark:border-gray-600/30">
                  <p className="text-lg leading-relaxed">
                    Thanks for sparking this campaign to life with your support. <span className="text-red-500">♡</span>
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-blue-50/30 dark:bg-blue-900/20 backdrop-blur-sm border border-blue-200/40 dark:border-blue-600/30">
                  <p className="text-base leading-relaxed">
                    While we await its next exciting phase, stay tuned for updates, or discover more collectibles and live campaigns waiting for you to explore!
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-green-50/30 dark:bg-green-900/20 backdrop-blur-sm border border-green-200/40 dark:border-green-600/30">
                  <p className="text-base leading-relaxed flex items-center justify-center lg:justify-start space-x-2">
                    <span>Chat with AI agents</span>
                    <MessageCircle size={20} className="text-green-600 dark:text-green-400" />
                    <span>in the bottom-right corner!</span>
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              {/* <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={handleClose}
                  className="flex-1 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 hover:from-purple-700 hover:via-blue-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm border border-white/20"
                >
                  <MessageCircle size={18} className="mr-2" />
                  Start Chatting
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 bg-white/20 dark:bg-black/20 backdrop-blur-sm border border-white/40 dark:border-gray-600/40 hover:bg-white/30 dark:hover:bg-black/30 font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                >
                  Continue Exploring
                </Button>
              </div> */}

              {/* Footer signature */}
              <div className="pt-6 mt-4 border-t border-white/30 dark:border-gray-600/30 text-center lg:text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                      <Sparkles size={14} className="text-white" />
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">FanSpark Team</span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-100/50 dark:bg-purple-900/30 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50"></div>
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Mint Successful</span>
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

export default MintSuccessPopup; 
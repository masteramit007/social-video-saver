import React from 'react';
import { CheckCircle2, Heart, Coffee, X } from 'lucide-react';

interface DownloadSuccessToastProps {
  show: boolean;
  onClose: () => void;
}

const DownloadSuccessToast: React.FC<DownloadSuccessToastProps> = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-4 sm:bottom-6 z-[100] flex justify-center px-4 pointer-events-none"
      role="status"
      aria-live="polite"
    >
      <div className="glass pointer-events-auto w-full max-w-md p-4 sm:p-5 border border-neon-cyan/40 shadow-[0_0_40px_rgba(0,255,255,0.25)] animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1.5 rounded-lg hover:bg-foreground/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-foreground/50" />
        </button>

        <div className="flex items-start gap-3">
          <div className="relative shrink-0 mt-0.5">
            <CheckCircle2 className="w-8 h-8 text-neon-cyan animate-scale-in" />
            <span className="absolute -inset-1 rounded-full bg-neon-cyan/20 blur-lg animate-pulse pointer-events-none" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-orbitron text-base font-bold neon-text mb-1">
              Your video has downloaded! 🎉
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We're an <span className="text-foreground font-semibold">independent indie team</span> building this for free.
              If it helped you, please support us with a coffee 💛
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <a
                href="https://ko-fi.com/socialmediavideodownload"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#FF5E5B] to-[#FF8A5B] text-white hover:scale-105 transition-transform shadow-lg"
              >
                <Coffee className="w-3.5 h-3.5" />
                Support on Ko-fi
              </a>
              <span className="inline-flex items-center gap-1 text-[11px] text-foreground/60">
                <Heart className="w-3 h-3 text-neon-pink fill-neon-pink" />
                Made with love
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadSuccessToast;

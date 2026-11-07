import React, { useEffect, useState } from 'react';
import { Radio, Volume2, Sparkles, AlertTriangle, CheckCircle, Flame, Coffee, X } from 'lucide-react';
import { sound } from '../utils/audio';

export interface RadioTransmission {
  id: string;
  speaker: string;
  role: string;
  message: string;
  mood: 'annoyed' | 'alarmed' | 'impressed' | 'sarcastic' | 'neutral';
  timestamp?: string;
}

interface RadioCommProps {
  transmission: RadioTransmission | null;
  onDismiss?: () => void;
}

export const RadioComm: React.FC<RadioCommProps> = ({ transmission, onDismiss }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!transmission) {
      setDisplayedText('');
      return;
    }

    sound.radioChirp();

    // Typewriter effect
    let currentIdx = 0;
    const fullText = transmission.message;
    setDisplayedText('');
    setIsTyping(true);

    const timer = setInterval(() => {
      currentIdx++;
      setDisplayedText(fullText.slice(0, currentIdx));
      if (currentIdx >= fullText.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 22);

    return () => clearInterval(timer);
  }, [transmission]);

  if (!transmission) return null;

  const moodColors = {
    neutral: {
      border: 'border-amber-500/50',
      badge: 'bg-amber-950/80 text-amber-300 border-amber-700',
      led: 'bg-amber-400',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.25)]',
    },
    annoyed: {
      border: 'border-orange-500/60',
      badge: 'bg-orange-950/80 text-orange-300 border-orange-700',
      led: 'bg-orange-400',
      glow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]',
    },
    alarmed: {
      border: 'border-rose-500/70',
      badge: 'bg-rose-950/80 text-rose-300 border-rose-700',
      led: 'bg-rose-500 animate-ping',
      glow: 'shadow-[0_0_18px_rgba(244,63,94,0.4)]',
    },
    impressed: {
      border: 'border-emerald-500/60',
      badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-700',
      led: 'bg-emerald-400',
      glow: 'shadow-[0_0_18px_rgba(16,185,129,0.35)]',
    },
    sarcastic: {
      border: 'border-cyan-500/60',
      badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-700',
      led: 'bg-cyan-400',
      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    },
  }[transmission.mood];

  return (
    <div className="w-full max-w-2xl mx-auto mb-2 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
      <div
        className={`relative bg-slate-950/95 border-2 rounded-2xl p-3.5 backdrop-blur-md text-slate-100 font-sans shadow-2xl ${moodColors.border} ${moodColors.glow}`}
      >
        {/* Walkie-Talkie Top Antenna & Channel Header */}
        <div className="flex items-center justify-between border-b border-slate-800/90 pb-2 mb-2.5">
          <div className="flex items-center gap-2.5">
            {/* Blinking Radio LED */}
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${moodColors.led}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${moodColors.led}`}></span>
            </span>

            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-xs font-bold text-amber-300 tracking-wider">
                COSMO BOND TRANSCEIVER [CH-07: 현장 작업망]
              </span>
            </div>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 hidden sm:inline-block">
              수신감도: 양호 (치직-)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${moodColors.badge}`}>
              {transmission.role}
            </span>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-slate-500 hover:text-slate-300 p-0.5 rounded transition-colors cursor-pointer"
                title="무전 닫기"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Transmission Body */}
        <div className="flex items-start gap-3.5">
          {/* Supervisor Avatar Badge */}
          <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
            <Coffee className="w-5 h-5 text-amber-400" />
            <span className="text-[8px] font-mono text-slate-400 mt-0.5">박 대리</span>
            {/* Hazard stripe on avatar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500/60"></div>
          </div>

          {/* Dialogue Speech & Audio Waves */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-amber-400 font-mono flex items-center gap-1.5">
                <span>{transmission.speaker}</span>
                <span className="text-slate-500 font-normal text-[11px]">| 나노-결합 1팀 사수</span>
              </span>
              <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                <Volume2 className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>TX ON</span>
              </div>
            </div>

            {/* Main Message with Typewriter */}
            <p className="text-xs sm:text-sm text-slate-100 font-sans leading-relaxed break-keep font-medium tracking-tight">
              "{displayedText}"
              {isTyping && <span className="inline-block w-1.5 h-3.5 bg-amber-400 ml-1 animate-pulse"></span>}
            </p>
          </div>
        </div>

        {/* Walkie-talkie speaker mesh aesthetic at bottom */}
        <div className="mt-2.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <div className="flex gap-1 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
            <span className="ml-1 text-[9px] text-slate-600">SPEAKER GRILLE</span>
          </div>
          <span className="text-slate-400">
            코스모 본드 사원 수칙 제3조: "모로 가도 퇴근만 하면 된다"
          </span>
        </div>
      </div>
    </div>
  );
};

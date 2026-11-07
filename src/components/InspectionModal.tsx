import React, { useEffect } from 'react';
import { Search, X, Activity, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';
import { sound } from '../utils/audio';

export interface InspectableTarget {
  id: string;
  name: string;
  category: string;
  status: string;
  distancePx: number;
  physicalObservation: string;
  chemicalObservation?: string;
  hazardLevel: '안전' | '주의' | '위험' | '극도로 위험';
}

interface InspectionModalProps {
  isOpen: boolean;
  target: InspectableTarget | null;
  onClose: () => void;
}

export const InspectionModal: React.FC<InspectionModalProps> = ({ isOpen, target, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      sound.scannerOpen();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.code === 'KeyZ' || e.code === 'Tab' || e.code === 'Escape') {
        e.preventDefault();
        sound.scannerBeep();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !target) return null;

  const hazardColor =
    target.hazardLevel === '극도로 위험'
      ? 'text-rose-400 border-rose-500/50 bg-rose-950/60'
      : target.hazardLevel === '위험'
      ? 'text-amber-400 border-amber-500/50 bg-amber-950/60'
      : target.hazardLevel === '주의'
      ? 'text-yellow-300 border-yellow-500/50 bg-yellow-950/60'
      : 'text-emerald-400 border-emerald-500/50 bg-emerald-950/60';

  const approxDistanceCm = Math.max(12, Math.round(target.distancePx * 0.75));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-slate-900/95 border-2 border-cyan-400/80 rounded-2xl shadow-[0_0_40px_rgba(34,211,238,0.25)] text-slate-100 p-5 sm:p-6 overflow-hidden flex flex-col gap-4 font-mono select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle holographic scanner grid effect */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:20px_20px]" />
        
        {/* Animated Scanner Laser Sweep */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

        {/* Header Telemetry */}
        <div className="flex items-center justify-between border-b border-cyan-800/60 pb-3 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/60 flex items-center justify-center text-cyan-400">
              <Search className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <div>
              <div className="text-[10px] text-cyan-400 font-bold tracking-widest flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-cyan-400" />
                <span>COSMO BOND // NANO-SPECTROMETER v3.8</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>센서 탐지 거리: <span className="text-cyan-300 font-bold">{approxDistanceCm}cm</span></span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  분석 신뢰도 99.8%
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              sound.scannerBeep();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
            title="닫기 (Z / Tab / ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Identity */}
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-cyan-800/80">
              {target.category}
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${hazardColor}`}>
              <AlertTriangle className="w-3 h-3" />
              <span>위험도: {target.hazardLevel}</span>
            </span>
            <span className="text-[11px] text-slate-400">
              상태: <span className="text-slate-200">{target.status}</span>
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
            {target.name}
          </h3>
        </div>

        {/* Detailed Observation Box */}
        <div className="relative z-10 bg-slate-950/90 rounded-xl p-4 border border-cyan-900/60 shadow-inner flex flex-col gap-2.5">
          <div className="text-[11px] font-bold text-cyan-400 tracking-wide flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>정밀 화학·물리 특성 스캔 결과</span>
          </div>
          
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans font-medium whitespace-pre-line">
            {target.physicalObservation}
          </p>

          {target.chemicalObservation && (
            <div className="mt-1 pt-2 border-t border-slate-800 text-[11px] sm:text-xs text-cyan-200/90 leading-relaxed font-sans font-normal">
              💡 {target.chemicalObservation}
            </div>
          )}
        </div>

        {/* Footer Quick Controls */}
        <div className="relative z-10 flex items-center justify-between pt-1 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-bold text-[10px]">Z</kbd>
            <span>또는</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-bold text-[10px]">Tab</kbd>
            <span>키로 언제든 전환</span>
          </div>

          <button
            onClick={() => {
              sound.scannerBeep();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};

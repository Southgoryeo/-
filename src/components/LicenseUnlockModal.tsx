import React, { useEffect, useState } from 'react';
import { Award, Sparkles, CheckCircle2, Atom, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface LicenseUnlockModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

export const LicenseUnlockModal: React.FC<LicenseUnlockModalProps> = ({ isOpen, onConfirm }) => {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    sound.licenseFanfare();

    // Spawn celebratory fireworks confetti
    const colors = ['#f59e0b', '#38bdf8', '#a855f7', '#10b981', '#f43f5e', '#facc15'];
    const p: ConfettiParticle[] = [];
    for (let i = 0; i < 65; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      p.push({
        id: i,
        x: 50 + (Math.random() - 0.5) * 20,
        y: 40 + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 6,
      });
    }
    setParticles(p);

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((pt) => ({
            ...pt,
            x: pt.x + pt.vx * 0.1,
            y: pt.y + pt.vy * 0.1 + 0.12, // subtle gravity
            vy: pt.vy + 0.08,
          }))
          .filter((pt) => pt.y < 110)
      );
    }, 25);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      {/* Confetti particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((pt) => (
          <div
            key={pt.id}
            className="absolute rounded-full"
            style={{
              left: `${pt.x}%`,
              top: `${pt.y}%`,
              width: `${pt.size}px`,
              height: `${pt.size}px`,
              backgroundColor: pt.color,
              boxShadow: `0 0 10px ${pt.color}`,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-center text-slate-100 flex flex-col items-center">
        {/* Certificate Badge Icon */}
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)] animate-bounce">
            <Award className="w-10 h-10" />
          </div>
          <div className="absolute -top-2 -right-2 p-1.5 rounded-full bg-cyan-500 text-slate-950 shadow-md">
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        {/* Certificate Header */}
        <div className="inline-block text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-700/60 mb-2">
          COSMO BOND HEADQUARTERS // PROMOTION NOTICE
        </div>

        <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white mb-2">
          2급 입체 결합 자격증 취득!
        </h2>
        <p className="text-sm font-semibold text-amber-400 mb-5">
          상하 슬롯 개방! 신규 원소 탄소(C) & 질소(N) 정식 인가
        </p>

        {/* Unlocked Capabilities Cards */}
        <div className="w-full space-y-2.5 text-left mb-6">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-mono font-bold shrink-0">
              +
            </div>
            <div className="text-xs">
              <div className="font-bold text-slate-200">십자(+) 2D 입체 결합대 해금</div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                탄소의 4개 원자가 손을 활용하여 상하좌우로 원소를 이어붙이는 다차원 분자 합성이 가능해집니다.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-mono font-bold shrink-0">
              <Atom className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <div className="font-bold text-slate-200">탄소(C) & 질소(N) 원소 지급</div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                유기화학의 뼈대인 탄소(C, 손 4개)와 질소(N, 손 3개)를 보충받아 복잡한 거대 유기 분자를 창조하세요.
              </p>
            </div>
          </div>
        </div>

        {/* Quote from Park Dae-ri */}
        <div className="w-full bg-slate-950/80 rounded-xl p-3 border border-amber-900/40 text-[11px] text-slate-300 italic text-left mb-6">
          <span className="text-amber-400 font-bold not-italic block mb-0.5">📻 사수 박 대리:</span>
          "축하해 신입! 드디어 상하 모듈도 쓸 수 있군. 이번 구역은 인간들이 버린 플라스틱과 유기물이 뒤엉킨 '방치된 쓰레기장'이야. 이제 진정한 '분자 건축가'로서 실력을 보여줘!"
        </div>

        {/* Proceed Action Button */}
        <button
          onClick={onConfirm}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm font-mono flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>자격증 등록 및 제4구역 쓰레기장 진입</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

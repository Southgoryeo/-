import React, { useEffect, useState } from 'react';
import { Trophy, Sparkles, Home, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { sound } from '../utils/audio';

interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReturnToTitle: () => void;
}

interface Confetti {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ isOpen, onClose, onReturnToTitle }) => {
  const [confetti, setConfetti] = useState<Confetti[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    sound.licenseFanfare();

    const colors = ['#f59e0b', '#38bdf8', '#a855f7', '#10b981', '#f43f5e', '#facc15', '#ec4899'];
    const particles: Confetti[] = [];
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 9;
      particles.push({
        id: i,
        x: 50 + (Math.random() - 0.5) * 30,
        y: 35 + (Math.random() - 0.5) * 25,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 5 + Math.random() * 7,
        rotation: Math.random() * 360,
      });
    }
    setConfetti(particles);

    const interval = setInterval(() => {
      setConfetti((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * 0.12,
            y: p.y + p.vy * 0.12 + 0.18,
            vy: p.vy + 0.1,
            rotation: p.rotation + 4,
          }))
          .filter((p) => p.y < 120)
      );
    }, 25);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      {/* Confetti animation */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {confetti.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-sm"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size * 0.6}px`,
              backgroundColor: p.color,
              boxShadow: `0 0 12px ${p.color}`,
              transform: `rotate(${p.rotation}deg)`,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(245,158,11,0.35)] text-center text-slate-100 flex flex-col items-center">
        {/* Trophy icon */}
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 p-0.5 shadow-[0_0_30px_rgba(245,158,11,0.6)]">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-amber-400">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>
          </div>
          <div className="absolute -top-2 -right-2 p-1.5 rounded-full bg-cyan-400 text-slate-950 shadow-md">
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-700/60 mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>COSMO BOND HEADQUARTERS // MISSION ACCOMPLISHED</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white mb-1">
          제4구역 쓰레기장 완전 수복!
        </h2>
        <p className="text-sm font-semibold text-amber-400 mb-4 font-mono">
          🏆 특급 분자 건축가 (Master Molecular Architect) 승급 완료
        </p>

        {/* Milestone Summary Grid */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-left">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-cyan-400 font-mono">CH₄ 메탄 부력</div>
            <div className="text-xs font-bold text-slate-200 mt-0.5">티타늄 상자 부유</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-sky-400 font-mono">CO₂ 흡열 동결</div>
            <div className="text-xs font-bold text-slate-200 mt-0.5">독 늪 빙판화</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-amber-400 font-mono">NH₃ 악취 가스</div>
            <div className="text-xs font-bold text-slate-200 mt-0.5">해충 군집 퇴치</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-rose-400 font-mono flex items-center gap-1">
              <Flame className="w-3 h-3" /> C₂H₅OH 화공
            </div>
            <div className="text-xs font-bold text-slate-200 mt-0.5">괴물 식물 소각</div>
          </div>
        </div>

        {/* Park Dae-ri Commendation */}
        <div className="w-full bg-slate-950/90 rounded-2xl p-3.5 border border-amber-900/40 text-xs text-slate-300 text-left mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-amber-400">📻 현장 사수 박 대리:</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              인사 고과 S등급 확정
            </span>
          </div>
          <p className="leading-relaxed">
            "세상에 신입, 자네 진짜 대단하구만! 그 거대한 고분자 괴물 나무를 직접 합성한 유기 연료로 흠뻑 적셔서 단숨에 태워버리다니... 오늘부로 자네는 견습이 아니라 우리 회사의 에이스 특급 엔지니어라네. 오늘 저녁 회식은 내가 쏜다!"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={onReturnToTitle}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-700"
          >
            <Home className="w-4 h-4 text-cyan-400" />
            <span>타이틀로 돌아가기</span>
          </button>
          <button
            onClick={onClose}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
          >
            <span>자유 탐험 계속하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

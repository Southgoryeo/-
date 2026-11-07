import React from 'react';
import { Terminal, Shield, Flame, RotateCcw, Plus, Sparkles, AlertCircle } from 'lucide-react';
import { ElementType } from '../types/game';

interface DevInspectorProps {
  logs: string[];
  onClearLogs: () => void;
  inventoryElements: Record<ElementType, number>;
  flasks: { moleculeId: string; count: number }[];
  onAddFlask: (moleculeId: string) => void;
  onQuickRefill: () => void;
}

export const DevInspector: React.FC<DevInspectorProps> = ({
  logs,
  onClearLogs,
  inventoryElements,
  flasks,
  onAddFlask,
  onQuickRefill,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-300 font-sans space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold font-mono text-white">
            GAME ENGINE DEV MONITOR & STATE INSPECTOR
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
          60 FPS ACTIVE
        </span>
      </div>

      {/* State Snapshot Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
          <span className="text-slate-500 text-[10px] block mb-1">인벤토리 (H / O)</span>
          <span className="text-cyan-300 font-bold text-sm">
            H: {inventoryElements.H || 0} / O: {inventoryElements.O || 0}
          </span>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
          <span className="text-slate-500 text-[10px] block mb-1">장착 플라스크</span>
          <span className="text-emerald-300 font-bold text-sm">
            {flasks.length}개 보유 중
          </span>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
          <span className="text-slate-500 text-[10px] block mb-1">엔진 물리 조작계</span>
          <span className="text-amber-300 font-bold text-sm">W/S 이동 + Space 점프</span>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
          <span className="text-slate-500 text-[10px] block mb-1">루이스 반응성</span>
          <span className="text-purple-300 font-bold text-sm">Octet Rule Check</span>
        </div>
      </div>

      {/* Level Designer Quick Test Cheats */}
      <div>
        <div className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>기믹 테스트용 즉시 지급 치트 (4가지 화학 반응 즉시 테스트)</span>
          <span className="text-[10px] text-slate-500 font-normal">화학반응 즉시 검증</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button
            onClick={() => onAddFlask('H2O')}
            className="p-2 rounded-lg bg-sky-950/70 border border-sky-500/40 text-sky-300 hover:bg-sky-900 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+H₂O (소화 물)</span>
          </button>
          <button
            onClick={() => onAddFlask('H2')}
            className="p-2 rounded-lg bg-indigo-950/70 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-900 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="불에 던져 폭발 및 돌벽 파괴 테스트"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>+H₂ (폭발/돌벽 파괴)</span>
          </button>
          <button
            onClick={() => onAddFlask('O2')}
            className="p-2 rounded-lg bg-red-950/70 border border-red-500/40 text-red-300 hover:bg-red-900 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="화염에 던져 화력증폭/불티 및 덩굴 소각 테스트"
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>+O₂ (화력증폭/불티)</span>
          </button>
          <button
            onClick={() => onAddFlask('H2O2')}
            className="p-2 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="바닥/벽/불에 던져 탄성 거품 발판 생성 테스트"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>+H₂O₂ (거품 점프대)</span>
          </button>
          <button
            onClick={() => onAddFlask('O3')}
            className="p-2 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="세균 슬라임에 던져 살균 소멸 테스트"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>+O₃ (살균 독가스)</span>
          </button>
          <button
            onClick={onQuickRefill}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>원소 충전 (+H, +O)</span>
          </button>
        </div>
      </div>

      {/* Real-time Event Console Log */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            이벤트 콘솔 로그 (Recent Game Events)
          </span>
          <button
            onClick={onClearLogs}
            className="text-[10px] text-slate-500 hover:text-slate-300 underline cursor-pointer"
          >
            로그 비우기
          </button>
        </div>
        <div className="h-32 bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-xs overflow-y-auto space-y-1">
          {logs.length === 0 ? (
            <span className="text-slate-600 italic">기록된 이벤트가 없습니다. 게임을 조작해 보세요.</span>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="text-slate-300 text-[11px] leading-tight flex items-start gap-1.5">
                <span className="text-cyan-500 select-none">›</span>
                <span>{log}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

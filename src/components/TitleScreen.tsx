import React from 'react';
import { Play, Sliders, BookOpen, FileText, Atom, ShieldAlert, Sparkles, Terminal, ChevronRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface TitleScreenProps {
  onStartGame: (chapter?: 1 | 2 | 3) => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onOpenDesignDoc: () => void;
  currentChapter?: 1 | 2 | 3;
  onSelectChapter?: (ch: 1 | 2 | 3) => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenSettings,
  onOpenHelp,
  onOpenDesignDoc,
  currentChapter = 1,
  onSelectChapter,
}) => {
  const [selectedCh, setSelectedCh] = React.useState<1 | 2 | 3>(currentChapter);

  const handleStart = () => {
    sound.pickup();
    if (onSelectChapter) onSelectChapter(selectedCh);
    onStartGame(selectedCh);
  };

  const handleSettings = () => {
    sound.pickup();
    onOpenSettings();
  };

  const handleHelp = () => {
    sound.pickup();
    onOpenHelp();
  };

  const handleDocs = () => {
    sound.pickup();
    onOpenDesignDoc();
  };

  return (
    <div className="relative min-h-[620px] w-full bg-slate-950 rounded-2xl border-2 border-cyan-500/30 overflow-hidden flex flex-col justify-between p-6 sm:p-10 shadow-2xl">
      
      {/* Background Parallax Grid & Subtle Cosmic Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(#06b6d4 1px, transparent 1px), radial-gradient(#3b82f6 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          backgroundPosition: '0 0, 18px 18px',
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Corporate Status Header */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Atom className="w-6 h-6 animate-spin" style={{ animationDuration: '24s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-cyan-300 tracking-widest uppercase">
                COSMO BOND DISPATCH TERMINAL
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                SYSTEM ONLINE
              </span>
            </div>
            <p className="text-xs text-slate-400">범우주적 환경미화 및 유지보수 하청업체 • 은하계 수복 센터</p>
          </div>
        </div>

        {/* Employee ID Badge */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2 font-mono text-xs flex items-center gap-3 shadow-md">
          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">나노-직원 사번</div>
            <div className="font-bold text-amber-400">#CB-88204</div>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">배속 구역</div>
            <div className="font-bold text-slate-200">배수구 화재 구역 (Sector 03)</div>
          </div>
        </div>
      </div>

      {/* Center Hero: Title & Corporate Identity */}
      <div className="relative z-10 my-auto py-8 text-center max-w-2xl mx-auto space-y-4">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-700/60 text-cyan-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>신입 나노-결합기 현장 투입 프로토콜</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-mono drop-shadow-[0_0_25px_rgba(6,182,212,0.35)]">
          COSMO BOND
        </h1>

        <p className="text-sm sm:text-base text-cyan-200 font-medium">
          “엔트로피 붕괴병 수복 현장 — 신입 나노-직원 출근 첫날”
        </p>

        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
          세상의 모든 물질을 이루는 원자 결합이 스스로 끊어지기 시작했습니다.
          코스모 본드의 신입 나노-직원이 되어, 능청스러운 사수 <strong>'박 대리'</strong>의 무전 코칭을 받으며
          화학 분자를 합성해 알칼리 화재를 해결하고 무사 퇴근하세요!
        </p>

        {/* Chapter Selection Selector */}
        <div className="pt-2 max-w-lg mx-auto text-left">
          <div className="text-[11px] font-mono text-cyan-400 font-bold mb-2 flex items-center justify-between">
            <span>배속 구역 및 임무 챕터 선택</span>
            <span className="text-slate-500">원소 조합 샌드박스</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Chapter 1 Card */}
            <button
              type="button"
              onClick={() => {
                setSelectedCh(1);
                sound.pickup();
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedCh === 1
                  ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold text-cyan-300">CH 01</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-900/60 text-cyan-200">
                  H, O
                </span>
              </div>
              <div className="text-xs font-bold text-white mb-0.5">나노 튜토리얼</div>
              <div className="text-[10px] text-slate-400 leading-tight">
                페트리 접시 • 키트 습득 • 화재 해결
              </div>
            </button>

            {/* Chapter 2 Card */}
            <button
              type="button"
              onClick={() => {
                setSelectedCh(2);
                sound.pickup();
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedCh === 2
                  ? 'bg-amber-950/80 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-1 ring-amber-400'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold text-amber-300">CH 02</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-900/60 text-amber-200">
                  Na, Cl
                </span>
              </div>
              <div className="text-xs font-bold text-white mb-0.5">제3 정수 시설</div>
              <div className="text-[10px] text-slate-400 leading-tight">
                녹슨 철창 • 기름때 • 수로 • 산성 해자
              </div>
            </button>

            {/* Chapter 3 Card */}
            <button
              type="button"
              onClick={() => {
                setSelectedCh(3);
                sound.pickup();
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedCh === 3
                  ? 'bg-purple-950/80 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)] ring-1 ring-purple-400'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold text-purple-300">CH 03</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-900/60 text-purple-200">
                  C, N 해금
                </span>
              </div>
              <div className="text-xs font-bold text-white mb-0.5">방치된 쓰레기장</div>
              <div className="text-[10px] text-slate-400 leading-tight">
                십자 결합 • 부력 • 독 늪 빙판 • 플라스틱-트리
              </div>
            </button>
          </div>
        </div>

        {/* Menu Buttons Group */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
          
          {/* Main Start Button */}
          <button
            onClick={handleStart}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm font-mono tracking-wider transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>임무 시작 (CH {selectedCh} START)</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Settings Button */}
          <button
            onClick={handleSettings}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono font-bold transition-all hover:border-cyan-500/50 cursor-pointer shadow-md"
            title="환경 설정 열기"
          >
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>환경설정</span>
          </button>

          {/* Help Button */}
          <button
            onClick={handleHelp}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono font-bold transition-all hover:border-amber-500/50 cursor-pointer shadow-md"
            title="신입 사원 지침서 열기"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>도움말</span>
          </button>

        </div>

        {/* Extra Documentation link */}
        <div className="pt-2">
          <button
            onClick={handleDocs}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 font-mono transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>기획서 & 4대 화학 반응 상세 고증 보기</span>
          </button>
        </div>

      </div>

      {/* Bottom Footer Controls Summary */}
      <div className="relative z-10 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-mono gap-2">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold">기본 조작키:</span>
          <span>A / D 이동 • Space 점프 • F 습득/보충 • C 결합창 • R 투척</span>
        </div>
        <div className="text-slate-500 text-[11px]">
          COSMO BOND NANO-WORKER ENGINE v2.4 // READY TO BOOT
        </div>
      </div>

    </div>
  );
};

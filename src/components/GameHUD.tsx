import React from 'react';
import { ElementType } from '../types/game';
import { ELEMENTS, MOLECULE_RECIPES } from '../game/chemistryData';
import { FlaskConical, Atom, ChevronLeft, ChevronRight, Lock, Unlock, Radio, Compass, Sliders, BookOpen, Home } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameHUDProps {
  inventoryElements: Record<ElementType, number>;
  flasks: { moleculeId: string; count: number }[];
  activeFlaskIndex: number;
  onSelectFlaskIndex: (idx: number) => void;
  onOpenCrafting: () => void;
  currentStep: number;
  onResetTutorial: () => void;
  hasPickedWorkKit: boolean;
  onReturnToTitle?: () => void;
  onOpenSettings?: () => void;
  onOpenHelp?: () => void;
  chapter?: 1 | 2 | 3;
  onSelectChapter?: (ch: 1 | 2 | 3) => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  inventoryElements,
  flasks,
  activeFlaskIndex,
  onSelectFlaskIndex,
  onOpenCrafting,
  currentStep,
  onResetTutorial,
  hasPickedWorkKit,
  onReturnToTitle,
  onOpenSettings,
  onOpenHelp,
  chapter = 1,
  onSelectChapter,
}) => {
  const activeFlask = flasks[activeFlaskIndex];
  const activeRecipe = activeFlask
    ? MOLECULE_RECIPES.find((r) => r.id === activeFlask.moleculeId)
    : null;

  const chapter1Steps = [
    {
      id: 1,
      title: '출근 및 기동',
      text: '[출근] 페트리 접시 위에서 A/D로 굳은 관절을 풀고 Space로 점프하세요.',
      target: 'A/D 좌우 이동 및 Space 점프',
    },
    {
      id: 2,
      title: '키트 습득 & 화재 분석',
      text: '[키트 습득] 전방 화재에 접근하여 [Z]키로 화재의 특성을 분석하고, [F]로 바닥의 작업용 키트를 주우세요.',
      target: '화재 접근 후 [Z] 물질 분석 및 바닥 키트 [F] 습득',
    },
    {
      id: 3,
      title: '원소 보충',
      text: '[원소 보충] 필드의 원소 공급기(H-공급기, O-공급기)에 접근하여 [F]로 원소를 보충하세요.',
      target: '필드에 설치된 H-공급기 및 O-공급기에서 [F]키로 수소/산소 보충',
    },
    {
      id: 4,
      title: '현장 땜질',
      text: '[현장 땜질] [C]로 키트를 열어 적절한 분자를 합성한 뒤 [R]로 던져 화재를 해결하세요!',
      target: '[C] 화학 결합창에서 분자 합성 후 [R] 투척으로 상황 해결',
    },
    {
      id: 5,
      title: '퇴근 보고',
      text: '[퇴근] 화재를 해결하고 무사 퇴근 게이트로 이동하세요!',
      target: '화재 해결 후 탈출 게이트에서 [F]',
    },
  ];

  const chapter2Steps = [
    {
      id: 1,
      title: '제3 정수 시설 진입',
      text: '[현장 진입] 하수 처리장 배관망에 진입했습니다. A/D로 이동하고 Space로 점프하여 원소 공급기 구역으로 이동하세요.',
      target: 'A/D 좌우 이동 및 Space 점프로 이동',
    },
    {
      id: 2,
      title: '원소 충전',
      text: '[원소 보충] 기지에 배치된 원소 공급기에서 [F]로 필요한 원소들을 채취하세요.',
      target: '원소 공급기 접근 후 [F]로 원소 보충',
    },
    {
      id: 3,
      title: '1구역 배관 돌파',
      text: '[녹슨 철창] 두꺼운 녹으로 막힌 철창입니다. 가까이서 [Z]키로 산화철 표면을 분석해 통로를 여세요.',
      target: '[Z]키로 물질 분석 후 원소 결합으로 1구역 장애물 해결',
    },
    {
      id: 4,
      title: '2구역 배관 돌파',
      text: '[기름때 제거] 배관을 가로막은 거대 슬라임입니다. [Z]키로 지방산의 화학적 약점을 파악하세요.',
      target: '[Z]키로 약점 분석 후 원소 결합으로 2구역 장애물 해결',
    },
    {
      id: 5,
      title: '수로 및 해자 돌파',
      text: '[수로 돌파 & 해자 극복] 남은 수로와 위험한 해자를 극복하고 정수 시설 출구로 탈출하세요. [Z]키로 해자 성분을 분석하세요.',
      target: '화학 반응을 활용해 최종 게이트 도달',
    },
  ];

  const chapter3Steps = [
    {
      id: 1,
      title: '방치된 쓰레기장 진입',
      text: '[현장 진입] 제4구역 부패와 플라스틱의 숲에 진입했습니다. 공급기에서 C, N 등 신규 유기 원소를 채취하세요.',
      target: '원소 공급대에서 탄소(C), 질소(N) 등 원소 [F] 채취',
    },
    {
      id: 2,
      title: '유기 원소 보충 완료',
      text: '[분자 합성 준비] 공급기에서 원소를 채웠습니다. 십자(+) 슬롯을 활용해 상황에 맞는 기체를 스스로 연구·조립하세요.',
      target: '[C] 결합창을 열어 공기보다 가벼운 부양성 기체를 연구·합성',
    },
    {
      id: 3,
      title: '1구역: 초고밀도 티타늄 격벽',
      text: '[티타늄 격벽] 무거운 티타늄 블록이 통로를 완전히 차단하고 있습니다. 가까이 다가가 [Z]키로 물질을 정밀 분석하세요!',
      target: '격벽 접근 후 [Z]키로 물리 특성 분석 및 공략 기체 조립',
    },
    {
      id: 4,
      title: '2구역: 펄펄 끓는 열독 늪',
      text: '[지열 열독 늪] 180°C로 끓어오르는 치명적인 유기 독소 늪입니다. [Z]키로 늪의 열적 특성을 정밀 관측하세요!',
      target: '늪지 접근 후 [Z]키로 물질 분석 및 냉각 분자 투척',
    },
    {
      id: 5,
      title: '3구역: 변이 군체 해충 포식자',
      text: '[키틴 군집] 길을 막고 산성 독침을 쏘는 해충 떼입니다. [Z]키로 생물체의 신경계 취약점을 관측하세요!',
      target: '군체 접근 후 [Z]키로 생체 특성 분석 및 퇴치 가스 투척',
    },
    {
      id: 6,
      title: '보스전: 변이 침식수 방어벽 약화',
      text: '[세포벽 공략] 두꺼운 세포벽으로 둘러싸여 일반 공격이 통하지 않습니다. [Z]키로 보스의 고분자 세포막을 분석하세요!',
      target: '보스 접근 후 [Z]키로 세포벽 분석 및 고인화성 연료 도포',
    },
    {
      id: 7,
      title: '화공 대폭발: 스파크 점화',
      text: '[대화재 점화] 보스가 인화성 연료에 100% 젖었습니다! 전방의 스파크 점화기[F]를 당기거나 불씨를 던지세요!',
      target: '스파크 점화기에서 [F]를 눌러 보스를 잿더미로 소각',
    },
    {
      id: 8,
      title: '제4구역 완전 수복 및 퇴근',
      text: '[임무 완료] 아르보르 플라스티카가 전소되었습니다! 제4구역 수복 게이트로 이동하여 퇴근 보고를 완료하세요!',
      target: '우측 끝 제4구역 수복 게이트 접근 후 [F]',
    },
  ];

  const tutorialSteps = chapter === 3 ? chapter3Steps : chapter === 2 ? chapter2Steps : chapter1Steps;
  const currentMission = tutorialSteps[Math.min(currentStep - 1, tutorialSteps.length - 1)];

  const handleCraftClick = () => {
    if (!hasPickedWorkKit) {
      sound.locked();
      return;
    }
    onOpenCrafting();
  };

  return (
    <div className="w-full flex flex-col gap-4 font-sans">
      {/* 1. TOP BAR: ACTIVE MISSION DISPATCH (다음에는 여기에 미션뜰거임) & PORTABLE WORK KIT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Active Mission Card */}
        <div className="md:col-span-2 bg-slate-900/95 border-2 border-cyan-500/40 rounded-2xl p-4 backdrop-blur-md flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2.5 mb-3 gap-2">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-wider text-cyan-300">
                  COSMO BOND HQ • 현장 디스패치
                </span>
                {onSelectChapter && (
                  <div className="inline-flex rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-[10px] font-mono">
                    <button
                      onClick={() => onSelectChapter(1)}
                      className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        chapter === 1
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      CH 1: 튜토리얼
                    </button>
                    <button
                      onClick={() => onSelectChapter(2)}
                      className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        chapter === 2
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      CH 2: 제3 정수 시설
                    </button>
                    <button
                      onClick={() => onSelectChapter(3)}
                      className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        chapter === 3
                          ? 'bg-purple-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      CH 3: 방치된 쓰레기장
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-semibold">
                  STEP {currentStep} / 5
                </span>
                <span className="text-[10px] font-mono text-amber-400 font-semibold bg-amber-950/70 px-2 py-0.5 rounded border border-amber-800">
                  사수: 박 대리
                </span>
              </div>
            </div>

            {/* Current Active Mission Focus */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/40">
                  MISSION 0{currentStep}
                </span>
                <h3 className="text-sm md:text-base font-bold text-white tracking-wide">
                  {currentMission.title}
                </h3>
                <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  수행 중
                </span>
              </div>
              <p className="text-xs md:text-sm text-cyan-200/90 font-medium leading-relaxed pl-1">
                {currentMission.text}
              </p>
              <div className="text-[11px] text-slate-400 font-mono pl-1 flex items-center gap-1.5 pt-1">
                <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>목표 지침: <strong className="text-slate-300">{currentMission.target}</strong></span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 pt-2.5 border-t border-slate-800/70 flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-amber-400 transition-all duration-500"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              ></div>
            </div>
            <span className="text-[11px] font-mono text-slate-400 shrink-0">
              {Math.round((currentStep / 5) * 100)}% 완료
            </span>
          </div>
        </div>

        {/* Quick Tools & Portable Work Kit with Lock State */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div>
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>휴대용 작업 키트</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                hasPickedWorkKit
                  ? 'text-cyan-400 bg-cyan-950 border-cyan-800'
                  : 'text-rose-400 bg-rose-950/80 border-rose-800'
              }`}>
                {hasPickedWorkKit ? '단축키 [C] 해금' : '단축키 [C] 봉인'}
              </span>
            </div>

            <button
              onClick={handleCraftClick}
              disabled={!hasPickedWorkKit}
              className={`w-full py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                hasPickedWorkKit
                  ? 'bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.2)] active:scale-95'
                  : 'bg-slate-950/80 border border-slate-800 text-slate-500 cursor-not-allowed opacity-80'
              }`}
              title={hasPickedWorkKit ? '화학 결합창 열기' : '작업용 키트를 아직 습득하지 않았습니다'}
            >
              {hasPickedWorkKit ? (
                <>
                  <Unlock className="w-4 h-4 text-cyan-400" />
                  <span>화학 결합창 열기 [C]</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-rose-400" />
                  <span>작업용 키트 미습득 (C 봉인)</span>
                </>
              )}
            </button>
            {!hasPickedWorkKit && (
              <p className="text-[11px] text-rose-400/90 mt-2 font-mono text-center">
                전방 바닥의 키트를 먼저 습득([F])하세요!
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Atom className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>디스펜서에서 [F]로 원소 보충 가능</span>
            </span>
            <div className="flex items-center gap-1.5">
              {onReturnToTitle && (
                <button
                  onClick={onReturnToTitle}
                  className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-mono border border-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                  title="타이틀 화면으로 이동"
                >
                  <Home className="w-3 h-3 text-cyan-400" />
                  <span>타이틀</span>
                </button>
              )}
              {onOpenSettings && (
                <button
                  onClick={onOpenSettings}
                  className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-mono border border-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                  title="환경 설정"
                >
                  <Sliders className="w-3 h-3 text-cyan-400" />
                  <span>설정</span>
                </button>
              )}
              {onOpenHelp && (
                <button
                  onClick={onOpenHelp}
                  className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-mono border border-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                  title="신입 사원 도움말"
                >
                  <BookOpen className="w-3 h-3 text-amber-400" />
                  <span>도움말</span>
                </button>
              )}
              <button
                onClick={onResetTutorial}
                className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[11px] font-mono border border-slate-700 transition-colors cursor-pointer shrink-0"
                title="튜토리얼 처음부터 다시 시작"
              >
                초기화
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 2. MIDDLE BAR: ELEMENT TRAY & ACTIVE FLASK BELT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Held Elements Inventory */}
        <div className="bg-slate-900/85 border border-slate-800 rounded-xl p-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Atom className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-slate-300 font-semibold">원소 보유함 (Subatomic Tray)</span>
          </div>
          <div className="flex items-center gap-2">
            {((chapter >= 3 ? ['H', 'O', 'C', 'N', 'Na', 'Cl'] : ['H', 'O', 'Na', 'Cl']) as ElementType[]).map((sym) => {
              const el = ELEMENTS[sym];
              const count = inventoryElements[sym] || 0;
              return (
                <div
                  key={sym}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800"
                >
                  <span
                    className="font-mono font-bold text-xs"
                    style={{ color: el.color }}
                  >
                    {sym}
                  </span>
                  <span className={`text-xs font-mono ${count > 0 ? 'text-slate-200 font-bold' : 'text-slate-600'}`}>
                    ×{count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Flask Belt (Q/E Switchable) */}
        <div className="bg-slate-900/85 border border-slate-800 rounded-xl p-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-slate-300 font-semibold">
              장착 분자병 벨트 <span className="text-[11px] text-cyan-400 font-normal">[Q / E 스위칭, R 투척]</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {flasks.length === 0 ? (
              <span className="text-xs text-slate-500 font-mono italic">
                보유 분자 없음 (키트에서 합성)
              </span>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onSelectFlaskIndex((activeFlaskIndex - 1 + flasks.length) % flasks.length)}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <div className="px-3 py-1 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center gap-2">
                  <span
                    className="font-mono font-bold text-xs"
                    style={{ color: activeRecipe?.color || '#38bdf8' }}
                  >
                    {activeRecipe?.formula || activeFlask?.moleculeId}
                  </span>
                  <span className="text-[11px] text-cyan-300">
                    ({activeRecipe?.koreanName})
                  </span>
                  <span className="text-xs font-mono font-bold text-white bg-cyan-900/80 px-1.5 py-0.2 rounded">
                    ×{activeFlask?.count}
                  </span>
                </div>
                <button
                  onClick={() => onSelectFlaskIndex((activeFlaskIndex + 1) % flasks.length)}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

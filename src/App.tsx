/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameCanvas } from './game/GameCanvas';
import { CraftingModal } from './components/CraftingModal';
import { GameHUD } from './components/GameHUD';
import { DesignDocument } from './components/DesignDocument';
import { DevInspector } from './components/DevInspector';
import { TitleScreen } from './components/TitleScreen';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { BootSequenceModal } from './components/BootSequenceModal';
import { LicenseUnlockModal } from './components/LicenseUnlockModal';
import { VictoryModal } from './components/VictoryModal';
import { ElementType, MoleculeRecipe, GameSettings } from './types/game';
import { FlaskConical, Atom, Gamepad2, FileText, Wrench, Sparkles, Sliders, BookOpen, Home } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'game' | 'design_doc' | 'inspector'>('game');
  const [gameMode, setGameMode] = useState<'title' | 'booting' | 'playing'>('title');
  const [currentChapter, setCurrentChapter] = useState<1 | 2 | 3>(1);
  const [isCraftingOpen, setIsCraftingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState(false);

  const [settings, setSettings] = useState<GameSettings>({
    masterVolume: 75,
    isMuted: false,
    screenShake: true,
    scanlines: true,
    particleQuality: 'high',
  });

  // Player state: 0 elements at start; orbs spawn after picking up kit!
  const [inventoryElements, setInventoryElements] = useState<Record<ElementType, number>>({
    H: 0,
    O: 0,
    C: 0,
    N: 0,
    Na: 0,
    Cl: 0,
  });

  const [hasPickedWorkKit, setHasPickedWorkKit] = useState(false);

  const [flasks, setFlasks] = useState<{ moleculeId: string; count: number }[]>([
    // Start empty so tutorial guides player to synthesize
  ]);

  const [activeFlaskIndex, setActiveFlaskIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [logs, setLogs] = useState<string[]>([
    '[Init] 2D 나노 월드 튜토리얼 챕터 1 로드 완료',
    '[Guide] A/D 이동 및 Space 점프로 첫 번째 구역을 탐험하세요.',
  ]);

  const handleAddLog = React.useCallback((msg: string) => {
    setLogs((prev) => [msg, ...prev.slice(0, 49)]);
  }, []);

  const handleSelectChapter = React.useCallback((ch: 1 | 2 | 3) => {
    setCurrentChapter(ch);
    setCurrentStep(1);
    if (ch === 3) {
      setHasPickedWorkKit(true);
      setInventoryElements({ H: 12, O: 6, C: 8, N: 6, Na: 2, Cl: 2 });
      setFlasks([]);
      setIsLicenseModalOpen(true);
      handleAddLog('[System] 챕터 3: 방치된 쓰레기장 (플라스틱과 부패의 숲) 로드 완료 - 2급 입체 결합 인가');
    } else if (ch === 2) {
      setHasPickedWorkKit(true);
      setInventoryElements({ H: 4, O: 2, C: 0, N: 0, Na: 2, Cl: 2 });
      setFlasks([]);
      handleAddLog('[System] 챕터 2: 제3 정수 시설 - 꽉 막힌 배관망 로드 완료');
    } else {
      setHasPickedWorkKit(false);
      setInventoryElements({ H: 0, O: 0, C: 0, N: 0, Na: 0, Cl: 0 });
      setFlasks([]);
      handleAddLog('[System] 챕터 1: 나노 튜토리얼 - 알칼리 화재 로드 완료');
    }
  }, [handleAddLog]);

  const handleAddElement = React.useCallback((type: ElementType, amount: number) => {
    setInventoryElements((prev) => ({
      ...prev,
      [type]: (prev[type] || 0) + amount,
    }));
  }, []);

  const handlePickWorkKit = React.useCallback(() => {
    setHasPickedWorkKit(true);
  }, []);

  const handleCraftSuccess = React.useCallback((recipe: MoleculeRecipe, consumed: Record<ElementType, number>) => {
    // Deduct consumed
    setInventoryElements((prev) => {
      const next = { ...prev };
      (Object.keys(consumed) as ElementType[]).forEach((k) => {
        next[k] = Math.max(0, (next[k] || 0) - consumed[k]);
      });
      return next;
    });

    // Add flask
    setFlasks((prev) => {
      const existingIdx = prev.findIndex((f) => f.moleculeId === recipe.id);
      if (existingIdx !== -1) {
        const next = [...prev];
        next[existingIdx].count += 1;
        return next;
      } else {
        return [...prev, { moleculeId: recipe.id, count: 1 }];
      }
    });

    setIsCraftingOpen(false);
    handleAddLog(`[Synthesis] ${recipe.formula} (${recipe.koreanName}) 플라스크 합성 성공! 인벤토리 추가.`);
    setCurrentStep((prev) => (prev === 2 || prev === 3 ? 3 : prev));
  }, [handleAddLog]);

  const handleConsumeFlask = React.useCallback((index: number) => {
    setFlasks((prev) => {
      if (!prev[index]) return prev;
      const next = [...prev];
      next[index].count -= 1;
      if (next[index].count <= 0) {
        next.splice(index, 1);
      }
      return next;
    });
    setActiveFlaskIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleQuickAddElements = React.useCallback(() => {
    setInventoryElements((prev) => ({
      ...prev,
      H: (prev.H || 0) + 4,
      O: (prev.O || 0) + 2,
    }));
    handleAddLog('[Cheat] H +4, O +2 원소 충전');
  }, [handleAddLog]);

  const handleAddFlaskCheat = React.useCallback((moleculeId: string) => {
    setFlasks((prev) => {
      const existing = prev.find((f) => f.moleculeId === moleculeId);
      if (existing) {
        return prev.map((f) => (f.moleculeId === moleculeId ? { ...f, count: f.count + 1 } : f));
      }
      return [...prev, { moleculeId, count: 1 }];
    });
    handleAddLog(`[Cheat] ${moleculeId} 분자 플라스크 즉시 지급`);
  }, [handleAddLog]);

  const handleResetTutorial = React.useCallback(() => {
    setCurrentStep(1);
    setCurrentChapter((ch) => {
      if (ch === 3) {
        setHasPickedWorkKit(true);
        setInventoryElements({ H: 12, O: 6, C: 8, N: 6, Na: 2, Cl: 2 });
        setFlasks([]);
        setIsLicenseModalOpen(true);
        handleAddLog('[System] 챕터 3: 방치된 쓰레기장 상태 초기화');
      } else if (ch === 2) {
        setHasPickedWorkKit(true);
        setInventoryElements({ H: 4, O: 2, C: 0, N: 0, Na: 2, Cl: 2 });
        setFlasks([]);
        handleAddLog('[System] 챕터 2: 제3 정수 시설 상태 초기화');
      } else {
        setInventoryElements({ H: 0, O: 0, C: 0, N: 0, Na: 0, Cl: 0 });
        setFlasks([]);
        setHasPickedWorkKit(false);
        handleAddLog('[System] 튜토리얼 챕터 상태 리셋 (원소 0개, 키트 미습득 초기화)');
      }
      return ch;
    });
  }, [handleAddLog]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      
      {/* Top Main Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Logo & Role identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
              <Atom className="w-5 h-5 animate-spin" style={{ animationDuration: '20s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold tracking-wider text-sm sm:text-base text-white">
                  COSMO BOND : NANO-WORKER
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800">
                  코스모 본드 하청 현장
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                범우주적 엔트로피 붕괴 유지보수 | 신입 나노-직원 출근 첫날 & 첫 번째 임무
              </p>
            </div>
          </div>

          {/* View Tab Switcher & System Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setActiveTab('game')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'game'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                <span>게임 {gameMode === 'title' ? '(타이틀)' : '(플레이 중)'}</span>
              </button>
              <button
                onClick={() => setActiveTab('design_doc')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'design_doc'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>기획서 & 고증</span>
              </button>
              <button
                onClick={() => setActiveTab('inspector')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'inspector'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>상태 모니터 (Dev)</span>
              </button>
            </div>

            {/* Quick System Buttons (Always accessible) */}
            <div className="flex items-center gap-1">
              {gameMode === 'playing' && (
                <button
                  onClick={() => setGameMode('title')}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                  title="타이틀 화면으로 이동"
                >
                  <Home className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">타이틀</span>
                </button>
              )}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                title="환경 설정"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">환경설정</span>
              </button>
              <button
                onClick={() => setIsHelpOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                title="신입 사원 도움말 지침서"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">도움말</span>
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {activeTab === 'game' && (
          <div className="space-y-6">
            
            {/* 1. TITLE SCREEN STATE */}
            {gameMode === 'title' && (
              <TitleScreen
                onStartGame={(chosenCh) => {
                  if (chosenCh) handleSelectChapter(chosenCh);
                  setGameMode('booting');
                }}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenHelp={() => setIsHelpOpen(true)}
                onOpenDesignDoc={() => setActiveTab('design_doc')}
                currentChapter={currentChapter}
                onSelectChapter={handleSelectChapter}
              />
            )}

            {/* 2. COLD OPEN BOOT SEQUENCE */}
            {gameMode === 'booting' && (
              <BootSequenceModal
                onComplete={() => {
                  setGameMode('playing');
                  handleAddLog(`[System] 나노-결합기 기동 완료: 챕터 ${currentChapter} 투입`);
                }}
              />
            )}

            {/* 3. ACTIVE PLAYING CANVAS & HUD */}
            {gameMode === 'playing' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Quick Context Pill */}
                <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-cyan-300">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>
                      <strong className="text-amber-300 font-mono">[CHAPTER {currentChapter}]</strong> {currentChapter === 1 ? '나노 튜토리얼 (화재 구역)' : currentChapter === 2 ? '제3 정수 시설 (꽉 막힌 배관망)' : '제4구역 - 방치된 쓰레기장 (플라스틱과 부패의 숲)'} | [A/D] 이동 | [Space] 점프 | [F] 상호작용 | [C] 결합창 {hasPickedWorkKit ? '(해금)' : '(봉인)'} | [Q/E] 분자 슬롯 | [R] 투척
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setGameMode('title')}
                      className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                      title="타이틀 시작 화면으로 돌아가기"
                    >
                      <Home className="w-3.5 h-3.5 text-cyan-400" />
                      <span>타이틀로</span>
                    </button>
                    <button
                      onClick={() => {
                        if (!hasPickedWorkKit) {
                          handleAddLog('[Alert] 키트 미습득: 전방 바닥의 작업용 키트를 먼저 습득[F]하세요');
                          return;
                        }
                        setIsCraftingOpen(true);
                      }}
                      className={`flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                        hasPickedWorkKit
                          ? 'bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border-cyan-700/60'
                          : 'bg-slate-900 text-slate-500 border-slate-800 opacity-80'
                      }`}
                      title={hasPickedWorkKit ? '화학 결합창 열기' : '작업용 키트를 아직 습득하지 않았습니다'}
                    >
                      <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
                      {hasPickedWorkKit ? '화학 결합창 [C]' : '키트 미습득 [C 봉인]'}
                    </button>
                  </div>
                </div>

                {/* Interactive 2D Canvas Engine */}
                <GameCanvas
                  onOpenCrafting={() => setIsCraftingOpen(true)}
                  inventoryElements={inventoryElements}
                  onAddElement={handleAddElement}
                  flasks={flasks}
                  activeFlaskIndex={activeFlaskIndex}
                  onSelectFlaskIndex={setActiveFlaskIndex}
                  onConsumeFlask={handleConsumeFlask}
                  onTutorialStepChange={(step) => {
                    setCurrentStep(step);
                    if (currentChapter === 3 && step === 8) {
                      setIsVictoryModalOpen(true);
                    }
                  }}
                  currentStep={currentStep}
                  devMode={true}
                  onLogEvent={handleAddLog}
                  hasPickedWorkKit={hasPickedWorkKit}
                  onPickWorkKit={handlePickWorkKit}
                  settings={settings}
                  chapter={currentChapter}
                  onNextChapter={() => {
                    if (currentChapter === 1) handleSelectChapter(2);
                    else if (currentChapter === 2) handleSelectChapter(3);
                    else setIsVictoryModalOpen(true);
                  }}
                />

                {/* HUD & Missions */}
                <GameHUD
                  inventoryElements={inventoryElements}
                  flasks={flasks}
                  activeFlaskIndex={activeFlaskIndex}
                  onSelectFlaskIndex={setActiveFlaskIndex}
                  onOpenCrafting={() => setIsCraftingOpen(true)}
                  currentStep={currentStep}
                  onResetTutorial={handleResetTutorial}
                  hasPickedWorkKit={hasPickedWorkKit}
                  onReturnToTitle={() => setGameMode('title')}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                  onOpenHelp={() => setIsHelpOpen(true)}
                  chapter={currentChapter}
                  onSelectChapter={handleSelectChapter}
                />
              </div>
            )}

          </div>
        )}

        {activeTab === 'design_doc' && <DesignDocument />}

        {activeTab === 'inspector' && (
          <DevInspector
            logs={logs}
            onClearLogs={() => setLogs([])}
            inventoryElements={inventoryElements}
            flasks={flasks}
            onAddFlask={handleAddFlaskCheat}
            onQuickRefill={handleQuickAddElements}
          />
        )}

      </main>

      {/* Lewis Structure Crafting Modal */}
      <CraftingModal
        isOpen={isCraftingOpen}
        onClose={() => setIsCraftingOpen(false)}
        inventoryElements={inventoryElements}
        onCraftSuccess={handleCraftSuccess}
        chapter={currentChapter}
      />

      {/* 2nd Grade Cross-Bonding License Unlock Celebratory Modal */}
      <LicenseUnlockModal
        isOpen={isLicenseModalOpen}
        onConfirm={() => setIsLicenseModalOpen(false)}
      />

      {/* Chapter 3 Grand Victory & Master Molecular Architect Ending Modal */}
      <VictoryModal
        isOpen={isVictoryModalOpen}
        onClose={() => setIsVictoryModalOpen(false)}
        onReturnToTitle={() => {
          setIsVictoryModalOpen(false);
          setGameMode('title');
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />

      {/* Employee Field Manual / Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-4 py-4 text-center text-xs text-slate-500 font-mono">
        Molecular Alchemist • 2D Chemical Action Puzzle Engine Prototype • General Chemistry Advisory
      </footer>
    </div>
  );
}

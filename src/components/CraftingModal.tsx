import React, { useState } from 'react';
import { X, Sparkles, RefreshCw, AlertCircle, CheckCircle2, FlaskConical, Atom, Plus, Lock, Wrench, ShieldCheck } from 'lucide-react';
import { ElementType, MoleculeRecipe } from '../types/game';
import { ELEMENTS, matchGridRecipe } from '../game/chemistryData';
import { sound } from '../utils/audio';

interface CraftingModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryElements: Record<ElementType, number>;
  onCraftSuccess: (recipe: MoleculeRecipe, consumed: Record<ElementType, number>) => void;
  chapter?: 1 | 2 | 3;
}

function isCellVerticalSlot(r: number, c: number): boolean {
  return (r === 0 || r === 2) && (c === 1 || c === 2);
}

function isCellPlayable(r: number, c: number, ch: number): boolean {
  if (r === 1) return true; // all 5 center backbone columns
  if (ch >= 3 && isCellVerticalSlot(r, c)) return true; // top and bottom substituents ONLY in Chapter 3
  return false;
}

export const CraftingModal: React.FC<CraftingModalProps> = ({
  isOpen,
  onClose,
  inventoryElements,
  onCraftSuccess,
  chapter = 1,
}) => {
  // 3x5 grid state
  const [grid, setGrid] = useState<(ElementType | null)[][]>([
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ]);

  const [selectedCell, setSelectedCell] = useState<[number, number] | null>([1, 1]);
  const [lockWarning, setLockWarning] = useState<string | null>(null);

  if (!isOpen) return null;

  // Active playable cells based on chapter tier
  const activeCells: [number, number][] = chapter >= 3
    ? [
        [1, 1], // Center 1
        [1, 2], // Center 2
        [1, 0], // Left
        [0, 1], // Top 1
        [2, 1], // Bottom 1
        [0, 2], // Top 2
        [2, 2], // Bottom 2
        [1, 3], // Right 1
        [1, 4], // Right 2
      ]
    : [
        [1, 1], // Center 1
        [1, 2], // Center 2
        [1, 0], // Left
        [1, 3], // Right 1
        [1, 4], // Right 2
      ];

  // Calculate current counts in grid
  const slottedCounts: Record<ElementType, number> = { H: 0, O: 0, C: 0, Na: 0, Cl: 0, N: 0 };
  let totalSlotted = 0;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 5; c++) {
      const atom = grid[r][c];
      if (atom) {
        slottedCounts[atom] = (slottedCounts[atom] || 0) + 1;
        totalSlotted++;
      }
    }
  }

  // Evaluate structural recipe match
  const structuralResult = matchGridRecipe(grid);
  const matchedRecipe = structuralResult.recipe;
  const structuralError = structuralResult.structuralError;
  const suggestedCorrection = structuralResult.suggestedCorrection;

  const handleCellClick = (r: number, c: number) => {
    if (!isCellPlayable(r, c, chapter)) {
      if (isCellVerticalSlot(r, c)) {
        sound.locked();
        setLockWarning('🔒 [상하 결합 모듈 잠김] 2급 입체 결합 자격증(챕터 3) 취득 시 개방됩니다!');
        setTimeout(() => setLockWarning(null), 3000);
      }
      return;
    }

    if (grid[r][c] !== null) {
      // Remove element back to inventory
      const nextGrid = grid.map((row) => [...row]);
      nextGrid[r][c] = null;
      setGrid(nextGrid);
      setSelectedCell([r, c]);
    } else {
      setSelectedCell([r, c]);
    }
  };

  const handleAddElementToSlot = (type: ElementType) => {
    // Check if player has enough in inventory
    const available = (inventoryElements[type] || 0) - (slottedCounts[type] || 0);
    if (available <= 0) return;

    const nextGrid = grid.map((row) => [...row]);

    // If a playable cell is actively selected and empty, place there
    if (selectedCell && isCellPlayable(selectedCell[0], selectedCell[1], chapter) && nextGrid[selectedCell[0]][selectedCell[1]] === null) {
      nextGrid[selectedCell[0]][selectedCell[1]] = type;
      setGrid(nextGrid);

      // Advance selection to next empty cell
      const nextEmpty = activeCells.find(([r, c]) => nextGrid[r][c] === null && !(r === selectedCell[0] && c === selectedCell[1]));
      setSelectedCell(nextEmpty || null);
      return;
    }

    // Otherwise find the first empty playable cell in logical order
    const emptyCell = activeCells.find(([r, c]) => nextGrid[r][c] === null);
    if (emptyCell) {
      nextGrid[emptyCell[0]][emptyCell[1]] = type;
      setGrid(nextGrid);

      // Select next empty cell
      const nextEmpty = activeCells.find(([r, c]) => nextGrid[r][c] === null && !(r === emptyCell[0] && c === emptyCell[1]));
      setSelectedCell(nextEmpty || null);
    }
  };

  const handleResetGrid = () => {
    setGrid([
      [null, null, null, null, null],
      [null, null, null, null, null],
      [null, null, null, null, null],
    ]);
    setSelectedCell([1, 1]);
  };

  const handleSynthesize = () => {
    if (!matchedRecipe) return;
    sound.craftSuccess();
    onCraftSuccess(matchedRecipe, slottedCounts);
    handleResetGrid();
  };

  const availableElementKeys: ElementType[] = chapter === 1
    ? ['H', 'O']
    : chapter === 2
    ? ['H', 'O', 'Na', 'Cl']
    : ['H', 'O', 'C', 'N', 'Na', 'Cl'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div
        className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col font-sans max-h-[92vh] ${
          chapter === 1
            ? 'bg-slate-900 border-2 border-slate-700 shadow-slate-950/80'
            : chapter === 2
            ? 'bg-slate-900 border-2 border-teal-500/60 shadow-[0_0_35px_rgba(20,184,166,0.18)]'
            : 'bg-slate-900 border-2 border-amber-500/80 shadow-[0_0_45px_rgba(245,158,11,0.28)]'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-3.5 bg-slate-950 border-b ${
            chapter === 1
              ? 'border-slate-800'
              : chapter === 2
              ? 'border-teal-500/40'
              : 'border-amber-500/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl border ${
                chapter === 1
                  ? 'bg-slate-800 text-slate-300 border-slate-600'
                  : chapter === 2
                  ? 'bg-teal-500/20 text-teal-400 border-teal-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse'
              }`}
            >
              {chapter === 1 ? (
                <Wrench className="w-5 h-5" />
              ) : chapter === 2 ? (
                <FlaskConical className="w-5 h-5 animate-pulse" />
              ) : (
                <Atom className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  className={`text-lg font-bold tracking-wider font-mono ${
                    chapter === 1
                      ? 'text-slate-200'
                      : chapter === 2
                      ? 'text-teal-300'
                      : 'text-amber-300'
                  }`}
                >
                  {chapter === 1
                    ? 'FIELD SYNTHESIS KIT'
                    : chapter === 2
                    ? 'LAB EXTENSION BENCH'
                    : '★ 2D CROSS MOLECULAR BENCH ★'}
                </h2>
                {chapter === 1 ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono font-semibold">
                    3급 기본형 휴대용 키트 (1차원 수평 결합)
                  </span>
                ) : chapter === 2 ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-700/60 font-mono font-semibold">
                    3급 확장형 반응기 (1차원 전해질/산염기)
                  </span>
                ) : (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-amber-300 border border-amber-500 font-mono font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)] animate-pulse">
                    ★ 2급 입체 결합 인가 (상하좌우 십자+ 결합 개방) ★
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {chapter === 1
                  ? '기본 휴대용 키트: 수평 1차원 공유 결합만 지원됩니다. (상하 결합 모듈 미장착)'
                  : chapter === 2
                  ? '확장형 키트: Na/Cl 이온 결합 지원. (상하 결합 모듈은 2급 자격 필요)'
                  : '2급 정식 입체 결합대: 탄소(C)의 4결합 팔을 이용한 상하좌우 십자(+) 유기화학 결합이 개방되었습니다.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {/* Reaction Grid & Lewis Preview */}
          <div className="relative bg-slate-950 rounded-xl border border-slate-800 p-4 sm:p-5 flex flex-col items-center justify-center min-h-[220px]">
            {/* Reaction Chamber Header */}
            <div className="w-full flex items-center justify-between text-[11px] font-mono mb-2 px-1">
              <div className="flex items-center gap-1.5 text-cyan-400/90">
                <Atom className="w-3.5 h-3.5" />
                <span>
                  {chapter >= 3 ? '2D STEREOCHEMICAL REACTION CHAMBER' : '1D LINEAR REACTION CHAMBER'}
                </span>
              </div>
              <span className={chapter >= 3 ? 'text-amber-400 text-[10px] font-bold' : 'text-slate-500 text-[10px]'}>
                {chapter === 1
                  ? '1차원 수평 슬롯 전용 (상하 모듈 잠김)'
                  : chapter === 2
                  ? '1차원 다원소 반응기 (상하 모듈 잠김)'
                  : '★ 상하좌우 십자(+) 4결합 입체 개방 ★'}
              </span>
            </div>

            {/* Lock Warning Toast if player clicked locked vertical slot */}
            {lockWarning && (
              <div className="w-full max-w-md mb-2 flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-amber-950/90 border border-amber-500/70 text-amber-200 shadow-lg animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{lockWarning}</span>
                </div>
                <button onClick={() => setLockWarning(null)} className="text-slate-400 hover:text-white ml-2">×</button>
              </div>
            )}

            {/* 3x5 Interactive Grid */}
            <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 my-1">
              {[0, 1, 2].map((r) => (
                <div key={r} className="flex items-center justify-center gap-1.5 sm:gap-2 relative">
                  {[0, 1, 2, 3, 4].map((c) => {
                    const isVertical = isCellVerticalSlot(r, c);
                    const playable = isCellPlayable(r, c, chapter);

                    if (!isVertical && r !== 1) {
                      // Decorative empty space
                      return (
                        <div
                          key={c}
                          className="w-11 h-11 sm:w-13 sm:h-13 opacity-0 pointer-events-none"
                        />
                      );
                    }

                    // If vertical slot in Chapter 1 or 2: Show LOCKED hardware bay!
                    if (isVertical && !playable) {
                      return (
                        <button
                          key={c}
                          onClick={() => handleCellClick(r, c)}
                          className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-xl flex flex-col items-center justify-center font-mono border border-dashed border-red-900/60 bg-slate-950/90 text-slate-500 hover:border-amber-600/70 hover:bg-slate-900 hover:text-amber-300 transition-all cursor-pointer group shadow-inner"
                          title="상하 결합 모듈 미장착 (2급 자격증 필요)"
                        >
                          <Lock className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
                          <span className="text-[7.5px] text-slate-600 font-bold group-hover:text-amber-300">잠김</span>
                          <span className="absolute -top-1 -right-1 text-[7px] px-1 py-0.2 rounded bg-red-950 text-red-400 border border-red-800">
                            LOCK
                          </span>
                        </button>
                      );
                    }

                    // Playable cell (Center row, or Top/Bottom in Chapter 3)
                    const val = grid[r][c];
                    const isSelected = selectedCell && selectedCell[0] === r && selectedCell[1] === c;
                    const elem = val ? ELEMENTS[val] : null;

                    return (
                      <button
                        key={c}
                        onClick={() => handleCellClick(r, c)}
                        className={`relative w-11 h-11 sm:w-13 sm:h-13 rounded-xl flex flex-col items-center justify-center font-mono font-bold transition-all cursor-pointer ${
                          val && elem
                            ? 'border-2 scale-100 shadow-md hover:scale-105 active:scale-95'
                            : isSelected
                            ? isVertical
                              ? 'border-2 border-amber-400 bg-amber-950/50 text-amber-300 ring-2 ring-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                              : 'border-2 border-cyan-400 bg-cyan-950/40 text-cyan-300 ring-2 ring-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                            : isVertical
                            ? 'border-2 border-dashed border-amber-600/70 bg-amber-950/20 text-amber-400/80 hover:border-amber-400 hover:bg-amber-950/40'
                            : 'border border-dashed border-slate-700 bg-slate-900/40 text-slate-500 hover:border-slate-500 hover:bg-slate-900/80'
                        }`}
                        style={
                          val && elem
                            ? {
                                backgroundColor: `${elem.color}25`,
                                borderColor: elem.color,
                                color: elem.color,
                                boxShadow: `0 0 10px ${elem.color}33`,
                              }
                            : undefined
                        }
                        title={val ? `${val} (클릭하여 제거)` : '클릭하여 결합 슬롯 선택'}
                      >
                        {val ? (
                          <>
                            <span className="text-base sm:text-lg">{val}</span>
                            <span className="text-[8px] opacity-70">
                              {val === 'H' ? '1s¹' : val === 'C' ? '2p²' : val === 'N' ? '2p³' : ''}
                            </span>
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center shadow">
                              ×
                            </span>
                          </>
                        ) : (
                          <>
                            <span className={`text-[10px] font-mono ${isVertical ? 'text-amber-400/90 font-bold' : 'text-slate-500'}`}>
                              {r === 0 ? '▲Top' : r === 2 ? '▼Bot' : c === 1 ? 'C1' : c === 2 ? 'C2' : '+'}
                            </span>
                            {isVertical && (
                              <span className="absolute -top-1 -right-1 text-[7px] px-1 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-600 font-bold shadow">
                                2급
                              </span>
                            )}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Status indicator bar */}
            <div className="mt-3 w-full max-w-md">
              {matchedRecipe ? (
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-500/40 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    안정적인 {matchedRecipe.bondType === 'covalent' ? '공유결합' : '이온결합'} 형성! ({matchedRecipe.formula} 루이스 구조 완성)
                  </span>
                </div>
              ) : structuralError ? (
                <div className="flex flex-col gap-1 text-rose-300 bg-rose-950/70 p-2.5 rounded-lg border border-rose-500/40 text-xs">
                  <div className="flex items-center gap-2 font-bold text-rose-400">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{structuralError}</span>
                  </div>
                  {suggestedCorrection && (
                    <span className="text-[11px] text-cyan-300 pl-6 font-mono">
                      {suggestedCorrection}
                    </span>
                  )}
                </div>
              ) : totalSlotted > 0 ? (
                <div className="flex items-center gap-2 text-amber-400 bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-500/40 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    원자가 전자를 채워 옥텟 규칙을 만족하도록 원소를 추가 배치하세요.
                  </span>
                </div>
              ) : (
                <div className="text-center text-xs text-slate-500">
                  슬롯을 클릭하여 선택한 후, 하단 원소 트레이에서 원소를 배치하세요.
                </div>
              )}
            </div>
          </div>

          {/* Matched Molecule Briefing Card */}
          {matchedRecipe ? (
            <div className="bg-slate-800/80 rounded-xl p-3.5 border border-cyan-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black font-mono text-cyan-400">{matchedRecipe.formula}</span>
                  <span className="text-sm font-semibold text-slate-200">{matchedRecipe.koreanName}</span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-900 text-cyan-300 font-mono border border-cyan-700">
                  {matchedRecipe.bondType.toUpperCase()} BOND
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{matchedRecipe.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                <div className="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                  <span className="text-cyan-400 font-bold block mb-0.5">🔬 화학적 고증</span>
                  <span className="text-slate-300 text-[11px] leading-tight block">{matchedRecipe.chemicalKnowledge}</span>
                </div>
                <div className="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                  <span className="text-emerald-400 font-bold block mb-0.5">🎮 게임 기믹 효과</span>
                  <span className="text-slate-300 text-[11px] leading-tight block">{matchedRecipe.gameEffect}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/50 rounded-xl p-2.5 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Atom className="w-4 h-4 text-cyan-400" />
                <span>
                  Tip: 원소 트레이에서 원소를 클릭하여 슬롯에 배치하고 안정된 결합 구조를 만들어 보세요.
                </span>
              </div>
              {totalSlotted > 0 && (
                <button
                  onClick={handleResetGrid}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  비우기
                </button>
              )}
            </div>
          )}

          {/* Player's Available Elements Inventory Tray */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-mono tracking-wider text-slate-400 uppercase">보유 원소 트레이 (클릭하여 슬롯에 배치)</h3>
              <span className="text-[11px] text-slate-500 font-mono">가용 원자가 전자 결합</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5">
              {availableElementKeys.map((elemKey) => {
                const elem = ELEMENTS[elemKey];
                const totalInInv = inventoryElements[elemKey] || 0;
                const usedInSlots = slottedCounts[elemKey] || 0;
                const remaining = totalInInv - usedInSlots;
                const isDisabled = remaining <= 0;

                return (
                  <button
                    key={elemKey}
                    onClick={() => handleAddElementToSlot(elemKey)}
                    disabled={isDisabled}
                    className={`relative p-2.5 sm:p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isDisabled
                        ? 'opacity-40 border-slate-800 bg-slate-950 cursor-not-allowed'
                        : 'border-slate-700 bg-slate-800/80 hover:border-cyan-400 hover:bg-slate-800 cursor-pointer hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className="text-xl sm:text-2xl font-black font-mono"
                        style={{ color: elem.color }}
                      >
                        {elem.symbol}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                        ×{remaining}
                      </span>
                    </div>

                    <div className="mt-1.5">
                      <div className="text-[11px] font-semibold text-slate-200 truncate">{elem.name}</div>
                      <div className="text-[9px] text-slate-400 font-mono">
                        결합 손: {elem.valency}개
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            닫기 (ESC / F)
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetGrid}
              disabled={totalSlotted === 0}
              className="px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              초기화
            </button>
            <button
              onClick={handleSynthesize}
              disabled={!matchedRecipe}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all ${
                matchedRecipe
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/30 hover:scale-105 active:scale-95 cursor-pointer'
                  : 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {matchedRecipe ? `${matchedRecipe.formula} 분자병 합성하기` : '안정 결합 필요'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

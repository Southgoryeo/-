import React, { useState } from 'react';
import { BookOpen, X, Keyboard, Flame, AlertTriangle, ShieldAlert, Sparkles, Compass, CheckCircle2 } from 'lucide-react';
import { MOLECULE_RECIPES } from '../game/chemistryData';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'controls' | 'reactions' | 'hazards' | 'lore'>('controls');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-cyan-500/40 rounded-2xl max-w-2xl w-full max-h-[85vh] shadow-2xl flex flex-col font-sans overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-mono">신입 나노-직원 현장 지침서</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  사원 필독
                </span>
              </div>
              <p className="text-xs text-slate-400">코스모 본드 유지보수 하청 현장 안전 및 땜질 가이드</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 pt-2 gap-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('controls')}
            className={`pb-2.5 px-3 border-b-2 font-semibold transition-all cursor-pointer ${
              activeTab === 'controls'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            기본 조작법
          </button>
          <button
            onClick={() => setActiveTab('reactions')}
            className={`pb-2.5 px-3 border-b-2 font-semibold transition-all cursor-pointer ${
              activeTab === 'reactions'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4대 화학 반응식
          </button>
          <button
            onClick={() => setActiveTab('hazards')}
            className={`pb-2.5 px-3 border-b-2 font-semibold transition-all cursor-pointer ${
              activeTab === 'hazards'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            위험 수칙 및 탈출
          </button>
          <button
            onClick={() => setActiveTab('lore')}
            className={`pb-2.5 px-3 border-b-2 font-semibold transition-all cursor-pointer ${
              activeTab === 'lore'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            세계관 & 사수 조언
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-200 flex-1">
          
          {/* TAB 1: CONTROLS */}
          {activeTab === 'controls' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">A / D</span>
                    <span>좌우 이동</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    페트리 접시 및 실험실 바닥을 좌우로 이동합니다. 굳은 관절을 부드럽게 푸세요.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">Space</span>
                    <span>점프 (도약)</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    장애물을 뛰어넘습니다. 거품 더미(H₂O₂) 위에서는 160% 높이의 슈퍼 점프가 발동합니다.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-mono font-bold">
                    <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800">F</span>
                    <span>습득 & 보충 상호작용</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    바닥의 작업용 키트를 습득하거나, H/O 원소 공급기에서 원소를 보충하고 탈출구와 상호작용합니다.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">C</span>
                    <span>화학 결합창 열기</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    작업용 키트를 습득한 이후 열립니다. 원소를 배치하고 전자쌍 결합선을 이어 분자를 합성합니다.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-indigo-400 font-mono font-bold">
                    <span className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800">Q / E</span>
                    <span>분자 슬롯 교체</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    합성하여 보유 중인 분자 플라스크 슬롯을 앞뒤로 전환합니다.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-rose-400 font-mono font-bold">
                    <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-800">R (누르기)</span>
                    <span>궤적 조준 및 투척</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    키를 누르면 포물선 궤적 점선이 표시되며, 떼면 전방으로 분자 플라스크를 투척합니다.
                  </p>
                </div>

              </div>

              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200">
                💡 <strong>핵심 팁:</strong> 시작할 때 C키는 봉인되어 있습니다! 화재 전방 바닥의 [작업용 키트]를 먼저 [F]키로 습득해야 화학 결합창이 해금됩니다.
              </div>
            </div>
          )}

          {/* TAB 2: REACTIONS */}
          {activeTab === 'reactions' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-cyan-400">[현장 화학 반응 원리 지침서]</span>
                <p className="text-xs text-slate-400">
                  나노-결합기가 현장의 물질과 장애물을 돌파할 때 활용하는 화학 원리:
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-950 border border-blue-500/30 flex items-start gap-3">
                  <div className="px-2.5 py-1 rounded bg-blue-950 text-blue-400 border border-blue-800 font-mono font-bold text-xs shrink-0 mt-0.5">
                    소화 및 냉각
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="font-bold text-blue-300 font-mono">열에너지 흡수와 냉각 작용</div>
                    <p className="text-slate-400">
                      비열과 기화열이 높은 물질은 고온 화염의 열에너지를 급속 흡수하여 온도를 발화점 아래로 낮추어 화재를 진압합니다.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/30 flex items-start gap-3">
                  <div className="px-2.5 py-1 rounded bg-indigo-950 text-indigo-400 border border-indigo-800 font-mono font-bold text-xs shrink-0 mt-0.5">
                    가연성 연소
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="font-bold text-indigo-300 font-mono">급격한 산화 반응과 압력 충격파</div>
                    <p className="text-slate-400">
                      가연성 분자가 고온의 점화원과 결합하면 순식간에 급격한 팽창과 연소 충격파를 발생시켜 구조물에 물리적 충격을 가합니다.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/30 flex items-start gap-3">
                  <div className="px-2.5 py-1 rounded bg-rose-950 text-rose-400 border border-rose-800 font-mono font-bold text-xs shrink-0 mt-0.5">
                    조연성 촉진
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="font-bold text-rose-300 font-mono">연소 반응 가속 및 고열 방출</div>
                    <p className="text-slate-400">
                      연소를 돕는 조연성 가스가 공급되면 불꽃의 연소 온도가 급격히 상승하여 주위 가연물을 태우거나 화염을 치솟게 합니다.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-start gap-3">
                  <div className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-bold text-xs shrink-0 mt-0.5">
                    산성 부식 & 염기성 비누화
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="font-bold text-emerald-300 font-mono">금속 산화막 용해 및 유기 지질 분해</div>
                    <p className="text-slate-400">
                      강산은 금속과 산화물 층을 부식시켜 용해하며, 강염기는 유기물과 지방을 비누화 반응으로 가수분해하여 세척합니다.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 flex items-start gap-3">
                  <div className="px-2.5 py-1 rounded bg-amber-950 text-amber-400 border border-amber-800 font-mono font-bold text-xs shrink-0 mt-0.5">
                    알칼리 금속 수반응
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="font-bold text-amber-300 font-mono">물과의 격렬한 발열 반응</div>
                    <p className="text-slate-400">
                      반응성이 큰 알칼리 금속 홑원소는 물과 닿는 즉시 격렬한 수화열과 함께 강력한 폭발적 기체 분출을 일으킵니다.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-start gap-3">
                  <div className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono font-bold text-xs shrink-0 mt-0.5">
                    산-염기 중화 반응
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="font-bold text-cyan-300 font-mono">산 + 염기 → 염(Salt) + 물(Water)</div>
                    <p className="text-slate-400">
                      강산성과 강염기성이 반응하면 수소 이온과 수산화 이온이 결합하여 물이 생성되고 중화열과 함께 이온 결정 염이 형성됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HAZARDS */}
          {activeTab === 'hazards' && (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-2">
                <div className="flex items-center gap-2 text-rose-300 font-mono font-bold">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>현장 즉사 위험 요소 (Critical Hazards)</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li><strong>고열 화재 접촉:</strong> 고온 화염에 나노 몸체가 닿으면 열화로 인해 분자 구조가 즉시 붕괴됩니다.</li>
                  <li><strong>폭발 충격파 반경:</strong> 급격한 화학 폭발의 충격파 반경 안에 머무르면 사망합니다. 안전거리에서 투척하세요!</li>
                  <li><strong>고열 불티 비산:</strong> 불꽃이 격화될 때 튀는 불티에 닿으면 즉사합니다.</li>
                  <li><strong>강산성 액체 접촉:</strong> 고농도 산성 해자에 빠지면 나노 외골격이 순식간에 녹아내립니다.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 space-y-2">
                <div className="flex items-center gap-2 text-indigo-300 font-mono font-bold">
                  <Compass className="w-4 h-4 text-indigo-400" />
                  <span>출구 탐색 지침</span>
                </div>
                <div className="space-y-1.5 text-slate-300">
                  <p>
                    • <strong>주 통로:</strong> 장애물을 정상적으로 해결하거나 안전하게 극복하여 도달하는 메인 출구.
                  </p>
                  <p>
                    • <strong>우회로 및 환경 활용:</strong> 충격파나 환경 상호작용으로 열리는 대체 경로와 다양한 돌파법이 존재합니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LORE */}
          {activeTab === 'lore' && (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-amber-400 font-mono font-bold">
                  🏢 회사 개요: 범우주적 하청업체 "코스모 본드(Cosmo Bond)"
                </div>
                <p className="text-slate-300 leading-relaxed">
                  원인 불명의 <strong>'엔트로피 붕괴병'</strong>으로 인해 우주의 물질을 지탱하던 원자 결합들이 제멋대로 끊어지기 시작했습니다.
                  은하 연방의 의뢰를 받은 우주 하청업체 '코스모 본드'는 초미세 나노-결합기를 대량 생산하여 현장에 투입하고 있습니다.
                </p>
                <p className="text-slate-400">
                  플레이어는 오늘 갓 생산되어 배속된 <strong>신입 나노-직원(#CB-88204)</strong>입니다. 매일 할당량을 채우며 화학 물질을 합성해 망가진 세상을 땜질해야 합니다.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-cyan-400 font-mono font-bold">
                  📻 사수 '박 대리'의 코멘트
                </div>
                <p className="text-slate-300 italic">
                  "아, 아. 신입, 내 말 들리나? 현장에선 교과서 지식만 달달 외운다고 다가 아니야. 주어진 원소들을 합성해서 물질의 반응성을 시험해 봐. 모로 가도 서울만 가면 되니까. 단, 안전사고로 나노 바디를 날려먹으면 자네 월급에서 깔 거라는 것만 명심해."
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            확인 및 지침서 닫기
          </button>
        </div>

      </div>
    </div>
  );
};

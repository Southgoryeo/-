import React from 'react';
import { BookOpen, Flame, Atom, FlaskConical, AlertTriangle, Cpu, Compass, Sparkles } from 'lucide-react';

export const DesignDocument: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200 font-sans leading-relaxed">
      
      {/* Executive Summary Card */}
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white font-mono">
              [기획서] 우주 하청업체 "코스모 본드" : 출근 첫날과 첫 번째 임무
            </h1>
            <p className="text-xs md:text-sm text-amber-300">
              엔트로피 붕괴병 수복 나노-결합 현장 | 블루칼라 블랙코미디 튜토리얼 설계안
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-300 mt-2">
          세상의 모든 물질을 이루는 원자 결합이 원인 불명의 '엔트로피 붕괴병'으로 끊어지는 세상.
          범우주적 환경미화 하청업체 <strong>'코스모 본드(Cosmo Bond)'</strong>의 갓 생산된 신입 나노-직원이 되어,
          능청스러운 사수 <strong>'박 대리'</strong>의 무전 코칭을 받으며 망가진 세상을 땜질해 나가는 액션 퍼즐입니다.
        </p>
      </div>

      {/* 4대 화학 물질 및 기믹 상세 스펙 */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <FlaskConical className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white font-mono">
            1. 신규 4대 화학 물질별 기믹 구조 & 레벨 디자인 (Official Specs)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 1. H2 (수소) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold font-mono text-indigo-400">1. H₂ (수소 가스) : "펑!" 폭발 기믹</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700">폭발 AoE / 돌벽 파쇄</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>화학적 특징:</strong> 수소는 극한의 가연성 가스입니다. 불꽃과 접촉하면 급격한 연소($2H_2 + O_2 \rightarrow 2H_2O$)로 순간 팽창 충격파를 형성합니다.
            </p>
            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-xs space-y-1">
              <span className="text-amber-400 font-bold block">🎮 게임 기믹 & 튜토리얼 활용:</span>
              <p className="text-slate-300 text-[11px]">
                • 화염에 H₂를 던지면 거대한 폭발 충격파가 발생합니다.<br />
                • <strong>치명성:</strong> 폭발 반경(165px) 내에 플레이어가 있으면 <strong>폭발에 닿아 즉사</strong>합니다 (안전거리 투척 강제).<br />
                • <strong>퍼즐 해결:</strong> 불 뒤에 있는 '금이 간 돌벽'이 폭발 충격파로 무너지며 숨겨진 방과 추가 자원이 개방됩니다!
              </p>
            </div>
          </div>

          {/* 2. O2 (산소) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold font-mono text-rose-400">2. O₂ (산소 가스) : 화력 증폭 & 불티 기믹</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700">조연성 / 도개교 하강</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>화학적 특징:</strong> 산소는 스스로 타지 않으나 연소를 맹렬하게 돕는 <strong>조연성(Oxidizer)</strong> 가스입니다. 화염의 온도와 높이를 폭발적으로 증가시킵니다.
            </p>
            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-xs space-y-1">
              <span className="text-amber-400 font-bold block">🎮 게임 기믹 & 튜토리얼 활용:</span>
              <p className="text-slate-300 text-[11px]">
                • 불에 O₂를 던지면 불길이 1200°C의 <strong>파란 고열 불꽃</strong>으로 거대화됩니다.<br />
                • <strong>치명성:</strong> 불길에서 사방으로 튀어나오는 <strong>고열 불티(Ember)에 맞으면 즉사</strong>합니다!<br />
                • <strong>퍼즐 해결:</strong> 높이 솟구친 불꽃이 천장에 매달린 덩굴/밧줄을 소각하여, 묶여 있던 도개교(다리)가 쿵 내려와 상층 길을 엽니다!
              </p>
            </div>
          </div>

          {/* 3. H2O2 (과산화수소) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold font-mono text-emerald-400">3. H₂O₂ (과산화수소) : 부글부글 거품 기믹</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">촉매 분해 / 탄성 발판</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>화학적 특징:</strong> 과산화수소는 열이나 표면 촉매와 만나면 물과 산소로 분해되며 엄청난 기포 거품을 뿜어냅니다 (코끼리 치약 반응).
            </p>
            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-xs space-y-1">
              <span className="text-amber-400 font-bold block">🎮 게임 기믹 & 튜토리얼 활용:</span>
              <p className="text-slate-300 text-[11px]">
                • 땅, 벽, 불 어디든 던지면 부글부글 끓어오르며 <strong>탄성 거품 더미(Bouncy Foam Mound)</strong>가 형성됩니다.<br />
                • <strong>발판 도약:</strong> 거품 더미 위에 올라가 [Space]를 누르면 <strong>슈퍼 하이 점프(155% 높이)</strong>를 하여 높은 곳의 통로로 올라갈 수 있습니다.
              </p>
            </div>
          </div>

          {/* 4. O3 (오존) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold font-mono text-cyan-400">4. O₃ (오존) : 맹독성 살균 가스 기믹</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">강력 산화 / 생체 슬라임 용해</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>화학적 특징:</strong> 오존은 강력한 산화력을 가진 푸른빛 기체로, 유기 세포벽을 순식간에 파괴하는 맹독 살균제입니다.
            </p>
            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-xs space-y-1">
              <span className="text-amber-400 font-bold block">🎮 게임 기믹 & 튜토리얼 활용:</span>
              <p className="text-slate-300 text-[11px]">
                • 투척 시 주변에 푸른빛 살균 가스 장판이 깔립니다.<br />
                • <strong>퍼즐 해결:</strong> 통로를 막고 있는 '세균 오염체 (Contaminated Germ Slime)'에 O₃ 가스가 닿으면 거품을 일으키며 <strong>즉시 용해되어 소멸</strong>합니다!
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 조작계 및 크래프팅 UX 개선 요약 */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <Cpu className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white font-mono">
            2. 조작계 최적화 & 크래프팅 원터치 캔슬 UX
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-cyan-300 font-mono block">🎮 조작계 변경 내역</span>
            <p className="text-slate-300">
              • <strong>A 키:</strong> 좌측 이동 (Move Left)<br />
              • <strong>D 키:</strong> 우측 이동 (Move Right) (W/S 이동 완전 삭제, A/D 좌우 이동 전용)<br />
              • <strong>Space 키:</strong> 점프 <strong>전용</strong><br />
              • <strong>C 키:</strong> 작업용 키트 습득([F]) 후 해금되는 화학 결합창 열기 (습득 전 봉인)<br />
              • <strong>F 키:</strong> 작업용 키트 줍기 및 디스펜서/탈출구 상호작용<br />
              • <strong>R 키:</strong> 길게 눌러 포물선 탄도 궤적 조준 후 투척
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-emerald-300 font-mono block">✨ 크래프팅 원터치 캔슬 UX</span>
            <p className="text-slate-300">
              • 기존: 분자가 완성되면 아래 '초기화' 버튼까지 마우스를 옮겨야 했음.<br />
              • <strong>개선:</strong> 결합 챔버에 올라간 <strong>원소를 직접 클릭하기만 하면 즉시 1개씩 슬롯에서 제거(취소)</strong>되어 인벤토리로 반환됩니다! (빨간 × 뱃지 지원).
            </p>
          </div>
        </div>
      </section>

      {/* 3. 튜토리얼 방 구조 & 4대 멀티 솔루션 (레벨 디자인 분석) */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <Compass className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white font-mono">
            3. 튜토리얼 룸 레벨 기믹 구조: 모닥불 × 밧줄 철상자 × 금이 간 바닥 (4대 멀티 솔루션)
          </h2>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/20 text-xs text-slate-300 space-y-2">
          <p className="font-semibold text-cyan-300">
            [공간 구조] 방 한가운데에 <strong>'모닥불'</strong>이 길을 막고 있으며, 천장에는 밧줄로 매달린 <strong>'무거운 철상자'</strong>가 위치합니다.
            그리고 모닥불 바로 아래 바닥은 <strong>'금이 간 바닥'</strong>으로 구성되어 플레이어의 창의적 화학 선택에 따라 4가지 경로가 열립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 정석 플레이 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold font-mono text-blue-400">🌊 정석 플레이 (H₂O)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-700">기본 클리어</span>
            </div>
            <p className="text-xs text-slate-300">
              • <strong>작용:</strong> 물(H₂O)의 높은 비열과 기화열로 모닥불을 소화.<br />
              • <strong>결과:</strong> 불이 안전하게 꺼지며 격벽 없이 개방된 지상 메인 출구(Surface Exit)로 전진하여 클리어합니다.
            </p>
          </div>

          {/* 응용 플레이 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold font-mono text-rose-400">🔥 응용 플레이 (O₂)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700">연쇄 물리 반응</span>
            </div>
            <p className="text-xs text-slate-300">
              • <strong>작용:</strong> 산소(O₂)로 모닥불을 1200°C 고열 파란 불꽃으로 격화.<br />
              • <strong>결과:</strong> 치솟은 불길이 천장 밧줄을 태우고, 500KG 철상자가 쿵 낙하하며 바닥을 격파! 지하의 숨겨진 길과 <strong>독립된 지하 비밀 탈출구(Secret Escape)</strong>를 발견하여 시크릿 클리어할 수 있습니다.
            </p>
          </div>

          {/* 과격한 플레이 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold font-mono text-indigo-400">💥 과격한 플레이 (H₂)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700">하이 리스크 / 쾌감</span>
            </div>
            <p className="text-xs text-slate-300">
              • <strong>작용:</strong> 수소(H₂)를 불에 던져 순간적인 대형 화학 폭발을 유도.<br />
              • <strong>결과:</strong> 폭발 충격파가 바닥을 직접 산산조각 내어 지하 비밀 탈출로를 즉각 개방합니다. (단, 폭발 반경 165px 내에 있으면 사망하므로 안전거리 투척 필수!)
            </p>
          </div>

          {/* 과산화수소 플레이 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold font-mono text-emerald-400">🧼 과산화수소 플레이 (H₂O₂)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">아크로바틱 도약</span>
            </div>
            <p className="text-xs text-slate-300">
              • <strong>작용:</strong> H₂O₂를 던져 바닥에 부글부글 탄성 거품 발판을 형성.<br />
              • <strong>결과:</strong> 거품을 밟고 160% 슈퍼 점프! 불을 끄지 않고도 천장에 매달린 철상자 위를 밟고 불길을 완벽히 뛰어넘어 지나갑니다.
            </p>
          </div>

        </div>
      </section>

      {/* 4. 코스모 본드 사수 '박 대리'의 현장 무전 스크립트 (블루칼라 블랙코미디) */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white font-mono">
            4. 코스모 본드 현장 무전 대사집 (박 대리 & 신입 나노-직원)
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-amber-400 font-bold font-mono">📻 [출근 첫 방송 - 페트리 접시 위 깨어남]</span>
            <p className="text-slate-300 italic">
              "아, 아. 마이크 테스트. 신입, 내 말 들리나? 자네는 방금 가동을 시작한 최신형 나노-결합기야. 일단 관절에 기름칠 좀 하게 거기서 움직여봐. (ad 이동 space점프)"
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-orange-400 font-bold font-mono">📻 [가스 화재 직면 - 작업용 키트 수색 지시]</span>
            <p className="text-slate-300 italic">
              "이런, 누가 구역에 알칼리 금속을 버렸는지 배수구 쪽에 화재가 발생했군. 쯧, 첫날부터 운도 없지. 빨리 F키를 눌러서 바닥에 굴러다니는 작업용 키트(제작 테이블 기능)나 주워."
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold font-mono">📻 [키트 습득 후 - 공급기에서 원소 보충 및 조립 지시]</span>
            <p className="text-slate-300 italic">
              "좋아, 키트를 챙겼군. 이제 구역에 설치된 수소(H) 공급기랑 산소(O) 공급기에서 F키를 눌러 원소를 보충해봐. 그걸 어떻게 조립해야 불이 꺼질지는... 기본 교육 때 졸지 않았다면 알겠지? 자, 만들어서 던져! (R 투척)"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-950 p-3 rounded-xl border border-blue-500/30 space-y-1">
              <span className="text-blue-400 font-bold font-mono">🌊 정석 분기 (H₂O 물)</span>
              <p className="text-slate-300 italic">
                "오, 한 번에 맞추다니. 서류 전형 패스한 값은 하는군. 좋아, 다음 구역으로 넘어가자고."
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-indigo-500/30 space-y-1">
              <span className="text-indigo-400 font-bold font-mono">💥 과격 분기 (H₂ 수소 폭발)</span>
              <p className="text-slate-300 italic">
                "미친 건가 신입?! 수소를 불에 던지면 어떡해! ...뭐, 폭압 때문에 길이 뚫리긴 했으니 일단 넘어가 주지. 다음부턴 회사 기물 파손 청구서를 자네 월급에서 깔 거니까 알아서 해."
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-rose-500/30 space-y-1">
              <span className="text-rose-400 font-bold font-mono">🔥 응용 분기 (O₂ 산소 줄 소각)</span>
              <p className="text-slate-300 italic">
                "음...뭐라 말을 해야될지 모르겠군 일단 모로가도 서울만 가면 된다고 성공은 했으니 넘어가주지 근데 바닥이 부숴지긴 했으니까, 감봉은 면치 못할 거야."
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30 space-y-1">
              <span className="text-emerald-400 font-bold font-mono">🧼 도약 분기 (H₂O₂ 과산화수소 월담)</span>
              <p className="text-slate-300 italic">
                "...똑똑하군! 어떻게 가르쳐준적도 없는걸 한거지? 운이좋았던건가? 이야~ 다른 팀장들 보다 훨씬 나은데?"
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};



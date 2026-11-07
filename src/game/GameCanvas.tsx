import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  PlayerState,
  ElementType,
  MoleculeRecipe,
  Projectile,
  Particle,
  LevelObstacle,
  InteractiveEntity,
  BouncyFoam,
  LethalEmber,
  EnemyProjectile,
  GroundHazard,
} from '../types/game';
import { ELEMENTS, MOLECULE_RECIPES } from './chemistryData';
import { sound } from '../utils/audio';
import { RadioComm, RadioTransmission } from '../components/RadioComm';
import { InspectionModal, InspectableTarget } from '../components/InspectionModal';
import { GameSettings } from '../types/game';

function getChapterPlatforms(ch: number) {
  if (ch === 3) {
    return [
      { x: 0, y: 380, w: 620, h: 25 },        // Zone 1: Solid continuous ground from spawn through titanium shaft to swamp edge
      { x: 230, y: 310, w: 60, h: 16 },      // Zone 1: Low observation ledge far from crate
      { x: 880, y: 380, w: 320, h: 25 },     // Zone 3: Swamp right bank to cockroach corridor
      { x: 970, y: 275, w: 100, h: 16 },     // Zone 3: Overhead vantage catwalk
      { x: 1190, y: 380, w: 580, h: 25 },    // Zone 4: Boss arena & exit gate
      { x: 1240, y: 265, w: 80, h: 16 },     // Zone 4: Tactical catwalk left
      { x: 1560, y: 265, w: 90, h: 16 },     // Zone 4: Tactical catwalk right
    ];
  }
  if (ch === 2) {
    return [
      { x: 0, y: 380, w: 380, h: 25 },       // Zone 1: spawn to rust gate
      { x: 405, y: 380, w: 235, h: 25 },     // Zone 2: rust gate to grease monster
      { x: 685, y: 380, w: 305, h: 25 },     // Zone 3: grease monster to water puddle / boulder
      { x: 1340, y: 380, w: 350, h: 25 },    // Zone 4: after acid moat to filtration exit
      { x: 200, y: 300, w: 60, h: 16 },      // Overhead stepping pipe
      { x: 500, y: 300, w: 70, h: 16 },      // Vantage catwalk
      { x: 800, y: 290, w: 70, h: 16 },      // Canal catwalk
    ];
  }
  return [
    { x: 0, y: 380, w: 620, h: 20 },
    { x: 820, y: 380, w: 460, h: 20 },
    { x: 160, y: 300, w: 60, h: 16 },
    { x: 520, y: 300, w: 60, h: 16 },
    { x: 580, y: 460, w: 500, h: 35 },
    { x: 1070, y: 380, w: 30, h: 115 },
    { x: 560, y: 380, w: 20, h: 115 },
  ];
}

function getChapterObstacles(ch: number): LevelObstacle[] {
  if (ch === 3) {
    return [
      {
        id: 'titanium_crate',
        type: 'titanium_crate',
        x: 420,
        y: 200,
        width: 70,
        height: 180,
        active: true,
        name: '초고밀도 티타늄 압축벽「타이탄 블록-X」',
        stateText: '중량 12,000kg 극경도 금속 격벽',
        category: '초고밀도 전이금속 합금',
        analysisDetail:
          '....무게가 약 12,000kg으로 극도로 무겁고, 초고밀도 티타늄 합금으로 촘촘히 압축 결속되어 있어 통상적인 물리 타격이나 폭발로는 흠집조차 나지 않는다. 중력의 영향을 강하게 받고 있어, 공기보다 훨씬 가벼운 부양성 기체 주머니를 연결해 부력을 일으키지 않는 이상 꿈쩍도 하지 않을 것 같다.',
      },
      {
        id: 'boiling_swamp',
        type: 'boiling_swamp',
        x: 620,
        y: 382,
        width: 260,
        height: 40,
        active: true,
        name: '지열 비등성 유기 독소 늪「써멀 톡식 웰」',
        stateText: '180°C 유기 열독소 비등 중',
        category: '고열 화학 유기 독액',
        analysisDetail:
          '....썩은 쓰레기의 화학적 부패열로 인해 180°C까지 펄펄 끓고 있는 유기 독소 늪이다. 발을 딛는 순간 온몸이 순식간에 녹아내린다. 주변의 열량을 급격히 흡수해 스스로 동결되는 강력한 흡열 물질을 접촉시키면 바닥 전체가 단단한 얼음판으로 굳을 것으로 분석된다.',
      },
      {
        id: 'cockroach_swarm',
        type: 'cockroach_swarm',
        x: 990,
        y: 320,
        width: 90,
        height: 60,
        active: true,
        name: '변이 키틴질 군체 포식자「키틴 브루드 네크로」',
        stateText: '군체 포식자 독침 경계 태세',
        category: '변이 절지동물 키틴 군체',
        analysisDetail:
          '....키틴질 외골격으로 무장한 거대 변이 곤충 떼. 산성 독침을 쏘며 무리를 지어 휴식하고 있다. 후각 기관이 극도로 예민하게 발달되어 있어, 코를 찌르는 지독한 자극성 악취 가스를 감지하면 공포에 질려 사방으로 흩어져 달아날 것으로 분석된다.',
      },
      {
        id: 'plastic_tree',
        type: 'plastic_tree',
        x: 1420,
        y: 160,
        width: 110,
        height: 220,
        active: true,
        name: '비정질 합성고분자 침식수「아르보르 플라스티카」',
        stateText: '두꺼운 유기물 세포벽',
        category: '변이 합성수지 고분자 식물체',
        analysisDetail:
          '....쓰레기장의 고분자 유기물을 먹고 자라난 거대 돌연변이 식포수. 세포벽이 너무나 두껍고 질겨 일반 칼날이나 불씨로는 끄떡도 없다. 땔감이 될 만한 고인화성 유기 화합물을 전신에 흠뻑 적셔 세포막을 투과시킨 뒤, 스파크를 튀겨 일거에 전소시켜야만 쓰러뜨릴 수 있다.',
      },
    ];
  }
  if (ch === 2) {
    return [
      {
        id: 'rust_gate',
        type: 'rust_gate',
        x: 380,
        y: 120,
        width: 30,
        height: 260,
        active: true,
        name: '극성 산화철 방폭 차폐벽「페럼 러스트 게이트」',
        stateText: '산화철 부식 차폐막 형성',
        category: '금속 산화물(Fe₂O₃) 결합체',
        analysisDetail:
          '....오랜 산화 반응으로 인해 두꺼운 산화철(녹) 껍질이 형성되어 배관을 꽉 틀어막고 있다. 물리적인 망치질이나 충격에는 부서지지 않으며, 금속 산화물을 화학적으로 부식시켜 녹여낼 수 있는 강력한 산성 물질에 반응할 것으로 분석된다.',
      },
      {
        id: 'grease_monster',
        type: 'grease_monster',
        x: 640,
        y: 120,
        width: 50,
        height: 260,
        active: true,
        name: '불포화 지방산 겔 복합체「세범 글루토니」',
        stateText: '불포화 지방산 슬러지 응집체',
        category: '불포화 지방산 생체 콜로이드',
        analysisDetail:
          '....하수관에 굳어붙은 삼겹살 기름과 동물성 지방 찌꺼기가 뭉쳐 생겨난 거대 슬라임. 산성 물질에는 끈적거리는 내성을 보이며 독성 슬러지를 사격한다. 지방 덩어리를 친수성 거품으로 분해해 깨끗이 씻어내는 알칼리성 비누화 반응에 극히 취약하다.',
      },
      {
        id: 'water_puddle',
        type: 'water_puddle',
        x: 735,
        y: 368,
        width: 135,
        height: 14,
        active: true,
        name: '알칼리 반응성 배수로「수성 냉각 런웨이」',
        stateText: '고인 배관 냉각수',
        category: '고순도 액체 H₂O',
        analysisDetail:
          '....배수로 바닥에 깊게 고인 냉각수 웅덩이. 순수한 물(H₂O)로 이루어져 있으며, 물과 만나면 전자를 격렬하게 방출하며 거대한 폭발을 일으키는 알칼리 금속을 투척하면 엄청난 충격파가 생길 것이다.',
      },
      {
        id: 'heavy_boulder',
        type: 'heavy_boulder',
        x: 870,
        y: 120,
        width: 50,
        height: 260,
        active: true,
        name: '고밀도 탄산염 집적 암괴「카보네이트 모놀리스」',
        stateText: '고밀도 탄산염 암석 암벽',
        category: '결정질 탄산염 암석',
        analysisDetail:
          '....통로를 가로막은 거대한 탄산염 암석 덩어리. 너무 단단해 평범한 방법으로는 부술 수 없으나, 바로 앞의 수로에서 일어나는 강력한 화학 폭발 충격파를 이용하면 산산조각 낼 수 있어 보인다.',
      },
      {
        id: 'acid_moat',
        type: 'acid_moat',
        x: 990,
        y: 382,
        width: 350,
        height: 98,
        active: true,
        name: '초강산 농축 폐액조「하이드로클로릭 애시드 핏」',
        stateText: 'pH 0.5 극산성 폐액',
        category: '할로젠화 수소산 수용액',
        analysisDetail:
          '....pH 0.5 수준의 맹독성 극산성 폐액이 넘실거리는 깊은 해자. 발을 헛디디면 분자 단위로 녹아버린다. 반대 성질의 강염기성 물질을 부어 산-염기 중화 반응을 일으키면, 침전되는 소금 결정들이 굳어 안전한 디딤돌 발판이 만들어질 수 있다.',
      },
    ];
  }
  return [
    {
      id: 'fire_wall',
      type: 'thermal_flame',
      x: 685,
      y: 255,
      width: 75,
      height: 125,
      active: true,
      name: '고열 알칼리 연소 플라스마벽「파이로-배리어」',
      stateText: '450°C 고열 연소 중',
      category: '연소 화학 플라스마',
      analysisDetail:
        '....450°C 고열로 맹렬하게 타오르는 알칼리 플라스마 화재. 가연성 기체나 산소를 접촉하면 불길이 걷잡을 수 없이 거세진다. 열량을 급격히 흡수해 발화점 이하로 온도를 떨어뜨리는 안전한 소화 물질을 던져 불을 끄거나, 상단의 철상자 구조물을 밟고 뛰어넘을 수 있는 고탄성 기포 수단을 강구해야 한다.',
    },
    {
      id: 'cracked_floor',
      type: 'cracked_floor',
      x: 620,
      y: 380,
      width: 200,
      height: 20,
      active: true,
      name: '나노-직원 주 통행로「메인 콩코스 브릿지」',
      stateText: '내열 콘크리트 보도',
      category: '내열 구조 슬래브',
      analysisDetail:
        '....내열 규산염 콘크리트로 시공된 나노-직원 주 통행로. 전방의 화재가 진압되면 안전하게 디디고 건너갈 수 있다.',
    },
  ];
}

function getChapterInteractives(ch: number): InteractiveEntity[] {
  if (ch === 3) {
    return [
      // Zone 1 Depot (Spawn)
      {
        id: 'dispenser_h',
        type: 'element_dispenser',
        x: 40,
        y: 300,
        width: 44,
        height: 80,
        label: 'H-수소 공급기',
        promptText: '[F] 수소(H) 원소 4개 충전',
        elementGranted: 'H',
      },
      {
        id: 'dispenser_o',
        type: 'element_dispenser',
        x: 95,
        y: 300,
        width: 44,
        height: 80,
        label: 'O-산소 공급기',
        promptText: '[F] 산소(O) 원소 4개 충전',
        elementGranted: 'O',
      },
      {
        id: 'dispenser_c',
        type: 'element_dispenser',
        x: 150,
        y: 300,
        width: 44,
        height: 80,
        label: 'C-탄소 공급기',
        promptText: '[F] 탄소(C) 원소 4개 충전',
        elementGranted: 'C',
      },
      {
        id: 'dispenser_n',
        type: 'element_dispenser',
        x: 205,
        y: 300,
        width: 44,
        height: 80,
        label: 'N-질소 공급기',
        promptText: '[F] 질소(N) 원소 4개 충전',
        elementGranted: 'N',
      },
      // Zone 2 Checkpoint Depot (Before Boiling Swamp)
      {
        id: 'dispenser_c_z2',
        type: 'element_dispenser',
        x: 540,
        y: 300,
        width: 40,
        height: 80,
        label: 'C-탄소 비축기',
        promptText: '[F] 탄소(C) 원소 4개 보충',
        elementGranted: 'C',
      },
      {
        id: 'dispenser_o_z2',
        type: 'element_dispenser',
        x: 585,
        y: 300,
        width: 40,
        height: 80,
        label: 'O-산소 비축기',
        promptText: '[F] 산소(O) 원소 4개 보충',
        elementGranted: 'O',
      },
      // Zone 3 Checkpoint Depot (Before Cockroach Swarm)
      {
        id: 'dispenser_h_z3',
        type: 'element_dispenser',
        x: 895,
        y: 300,
        width: 40,
        height: 80,
        label: 'H-수소 비축기',
        promptText: '[F] 수소(H) 원소 4개 보충',
        elementGranted: 'H',
      },
      {
        id: 'dispenser_n_z3',
        type: 'element_dispenser',
        x: 940,
        y: 300,
        width: 40,
        height: 80,
        label: 'N-질소 비축기',
        promptText: '[F] 질소(N) 원소 4개 보충',
        elementGranted: 'N',
      },
      // Zone 4 Boss Arena Supply Station (Before Arbor Plastica)
      {
        id: 'dispenser_h_z4',
        type: 'element_dispenser',
        x: 1205,
        y: 300,
        width: 40,
        height: 80,
        label: 'H-전진 공급기',
        promptText: '[F] 수소(H) 원소 4개 급속 충전',
        elementGranted: 'H',
      },
      {
        id: 'dispenser_c_z4',
        type: 'element_dispenser',
        x: 1250,
        y: 300,
        width: 40,
        height: 80,
        label: 'C-전진 공급기',
        promptText: '[F] 탄소(C) 원소 4개 급속 충전',
        elementGranted: 'C',
      },
      {
        id: 'dispenser_o_z4',
        type: 'element_dispenser',
        x: 1295,
        y: 300,
        width: 40,
        height: 80,
        label: 'O-전진 공급기',
        promptText: '[F] 산소(O) 원소 4개 급속 충전',
        elementGranted: 'O',
      },
      // Spark Igniter Console
      {
        id: 'spark_igniter',
        type: 'door_console',
        x: 1350,
        y: 310,
        width: 46,
        height: 70,
        label: '스파크 점화기',
        promptText: '[F] 마찰 점화 스파크 발사!',
      },
      // Exit Gate
      {
        id: 'ch3_exit',
        type: 'door_console',
        x: 1650,
        y: 305,
        width: 58,
        height: 75,
        label: '제4구역 수복 게이트',
        promptText: '[F] 챕터 3 클리어 및 특급 연구원 승급',
      },
    ];
  }
  if (ch === 2) {
    return [
      {
        id: 'dispenser_h',
        type: 'element_dispenser',
        x: 50,
        y: 300,
        width: 48,
        height: 80,
        label: 'H-수소 공급기',
        promptText: '[F] 수소(H) 원소 2개 보충',
        elementGranted: 'H',
      },
      {
        id: 'dispenser_o',
        type: 'element_dispenser',
        x: 115,
        y: 300,
        width: 48,
        height: 80,
        label: 'O-산소 공급기',
        promptText: '[F] 산소(O) 원소 2개 보충',
        elementGranted: 'O',
      },
      {
        id: 'dispenser_na',
        type: 'element_dispenser',
        x: 180,
        y: 300,
        width: 48,
        height: 80,
        label: 'Na-나트륨 공급기',
        promptText: '[F] 나트륨(Na) 원소 2개 보충',
        elementGranted: 'Na',
      },
      {
        id: 'dispenser_cl',
        type: 'element_dispenser',
        x: 245,
        y: 300,
        width: 48,
        height: 80,
        label: 'Cl-염소 공급기',
        promptText: '[F] 염소(Cl) 원소 2개 보충',
        elementGranted: 'Cl',
      },
      {
        id: 'ch2_exit',
        type: 'door_console',
        x: 1420,
        y: 305,
        width: 56,
        height: 75,
        label: '제3 정수 시설 수복 게이트',
        promptText: '[F] 정수 시설 수복 완료 및 퇴근 보고',
      },
    ];
  }
  return [
    {
      id: 'work_kit',
      type: 'crafting_bench',
      x: 280,
      y: 345,
      width: 44,
      height: 35,
      label: '코스모 본드 작업용 키트',
      promptText: '[F] 작업용 키트 습득 (화학 결합창 열기)',
    },
    {
      id: 'dispenser_h',
      type: 'element_dispenser',
      x: 210,
      y: 310,
      width: 40,
      height: 70,
      label: 'H-공급기',
      promptText: '[F] 수소(H) 원소 2개 보충',
      elementGranted: 'H',
    },
    {
      id: 'dispenser_o',
      type: 'element_dispenser',
      x: 580,
      y: 310,
      width: 40,
      height: 70,
      label: 'O-공급기',
      promptText: '[F] 산소(O) 원소 2개 보충',
      elementGranted: 'O',
    },
    {
      id: 'underground_exit',
      type: 'checkpoint',
      x: 940,
      y: 405,
      width: 50,
      height: 55,
      label: 'Secret Escape (비밀 탈출구)',
      promptText: '[F] 지하 비밀 탈출구로 무사 퇴근!',
    },
    {
      id: 'gate_terminal',
      type: 'door_console',
      x: 1100,
      y: 320,
      width: 46,
      height: 60,
      label: 'Surface Exit (지상 출구)',
      promptText: '[F] 지상 챕터 클리어 및 다음 구역 진입',
    },
  ];
}

interface GameCanvasProps {
  onOpenCrafting: () => void;
  inventoryElements: Record<ElementType, number>;
  onAddElement: (type: ElementType, amount: number) => void;
  flasks: { moleculeId: string; count: number }[];
  activeFlaskIndex: number;
  onSelectFlaskIndex: (idx: number) => void;
  onConsumeFlask: (idx: number) => void;
  onTutorialStepChange: (step: number) => void;
  currentStep: number;
  devMode: boolean;
  onLogEvent: (msg: string) => void;
  hasPickedWorkKit: boolean;
  onPickWorkKit: () => void;
  settings?: GameSettings;
  chapter?: 1 | 2 | 3;
  onNextChapter?: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  onOpenCrafting,
  inventoryElements,
  onAddElement,
  flasks,
  activeFlaskIndex,
  onSelectFlaskIndex,
  onConsumeFlask,
  onTutorialStepChange,
  currentStep,
  devMode,
  onLogEvent,
  hasPickedWorkKit,
  onPickWorkKit,
  settings,
  chapter = 1,
  onNextChapter,
}) => {
  const currentCh = chapter;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Cosmo Bond Senior Radio Transmission State
  const [radioTransmission, setRadioTransmission] = useState<RadioTransmission | null>(() => {
    if (chapter === 3) {
      return {
        id: 'ch3_intro',
        speaker: '박 대리',
        role: '현장 사수',
        message:
          '축하해 신입, 이제 상하 모듈도 쓸 수 있군. 이번 구역은 인간들이 쓰레기통을 안 비워서 생긴 "부패한 쓰레기 산"이야. 온갖 탄소 화합물과 유기물 몬스터가 득실거리지. 배운 걸 써먹어봐!',
        mood: 'impressed',
      };
    }
    if (chapter === 2) {
      return {
        id: 'ch2_intro',
        speaker: '박 대리',
        role: '현장 사수',
        message: '신입, 챕터 1 탕비실은 장난이었어. 이번엔 메인 하수 처리장이다. 파이프가 다 썩어 문드러지고 기름때로 꽉 막혔지. 회사에서 Na(나트륨)랑 Cl(염소) 지급 스위치를 열어줬으니까, 알아서 뚫고 지나가.',
        mood: 'neutral',
      };
    }
    return {
      id: 'intro',
      speaker: '박 대리',
      role: '현장 사수',
      message: '아, 아. 마이크 테스트. 신입, 내 말 들리나? 자네는 방금 가동을 시작한 최신형 나노-결합기야. 일단 관절에 기름칠 좀 하게 거기서 움직여봐. (ad 이동 space점프)',
      mood: 'neutral',
    };
  });

  // Story Trigger Flags
  const storyMilestoneRef = useRef<{
    spottedFire: boolean;
    pickedKit: boolean;
    resolvedFire: boolean;
  }>({
    spottedFire: false,
    pickedKit: false,
    resolvedFire: false,
  });

  // Chapter 2 Story Trigger Flags
  const ch2MilestonesRef = useRef<{
    hintRustGate: boolean;
    hintGrease: boolean;
    hintBoulder: boolean;
    hintMoat: boolean;
  }>({
    hintRustGate: false,
    hintGrease: false,
    hintBoulder: false,
    hintMoat: false,
  });

  // Chapter 3 Story Trigger Flags
  const ch3MilestonesRef = useRef<{
    hintCrate: boolean;
    hintSwamp: boolean;
    hintCockroach: boolean;
    hintBoss: boolean;
  }>({
    hintCrate: false,
    hintSwamp: false,
    hintCockroach: false,
    hintBoss: false,
  });

  // Chapter 3 Gimmick Physics State
  const titaniumCrateRef = useRef<{
    y: number;
    isFloating: boolean;
    balloonBags: number;
  }>({
    y: 200,
    isFloating: false,
    balloonBags: 0,
  });

  const isSwampFrozenRef = useRef<boolean>(false);
  const isCockroachScatteredRef = useRef<boolean>(false);
  const bossRef = useRef<{
    isSoaked: boolean;
    alcoholStacks: number;
    isBurning: boolean;
    burnTimer: number;
    isDefeated: boolean;
    stunTimer: number;
    maxHp: number;
    hp: number;
  }>({
    isSoaked: false,
    alcoholStacks: 0,
    isBurning: false,
    burnTimer: 0,
    isDefeated: false,
    stunTimer: 0,
    maxHp: 3,
    hp: 3,
  });

  // Enemy Projectiles & Ground Hazards
  const enemyProjectilesRef = useRef<EnemyProjectile[]>([]);
  const groundHazardsRef = useRef<GroundHazard[]>([]);

  // Enemy Attack Pattern Cooldowns & Timers
  const enemyCooldownsRef = useRef<{
    greaseAttackTimer: number;
    greaseWaveTimer: number;
    greaseWarning: number;
    cockroachAttackTimer: number;
    bossVolleyTimer: number;
    bossThornTimer: number;
    bossSprayTimer: number;
    playerInvulnerableTimer: number;
  }>({
    greaseAttackTimer: 100,
    greaseWaveTimer: 280,
    greaseWarning: 0,
    cockroachAttackTimer: 90,
    bossVolleyTimer: 160,
    bossThornTimer: 240,
    bossSprayTimer: 330,
    playerInvulnerableTimer: 0,
  });

  // Game World Player State
  const playerRef = useRef<PlayerState>({
    x: 80,
    y: 330,
    vx: 0,
    vy: 0,
    width: 24,
    height: 32,
    isGrounded: false,
    facing: 'right',
    isAiming: false,
    aimAngle: -Math.PI / 4,
    aimPower: 14,
    canInteractWith: null,
    hp: 100,
    maxHp: 100,
  });

  const keysPressed = useRef<Record<string, boolean>>({});
  const mousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Heavy Iron Crate Physical State (Suspended above bonfire by a rope)
  const ironCrateRef = useRef<{
    x: number;
    y: number;
    w: number;
    h: number;
    vy: number;
    isSuspended: boolean;
    isFalling: boolean;
    hasCrashed: boolean;
    ropeIntact: boolean;
  }>({
    x: 690,
    y: 175,
    w: 60,
    h: 42,
    vy: 0,
    isSuspended: true,
    isFalling: false,
    hasCrashed: false,
    ropeIntact: true,
  });

  // Obstacles in the level
  const obstaclesRef = useRef<LevelObstacle[]>(getChapterObstacles(currentCh));

  // Interactive Entities
  const interactivesRef = useRef<InteractiveEntity[]>(getChapterInteractives(currentCh));

  // Projectiles & Dynamic Particles
  const projectilesRef = useRef<Projectile[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const bouncyFoamsRef = useRef<BouncyFoam[]>([]);
  const lethalEmbersRef = useRef<LethalEmber[]>([]);
  const shockwavesRef = useRef<{ x: number; y: number; radius: number; maxRadius: number; color: string; life: number }[]>([]);
  const screenShakeRef = useRef<number>(0);

  // Underground Secret Discovery Flag
  const hasDiscoveredUndergroundRef = useRef<boolean>(false);

  // Callback refs to break infinite render loops
  const onLogEventRef = useRef(onLogEvent);
  onLogEventRef.current = onLogEvent;

  const onTutorialStepChangeRef = useRef(onTutorialStepChange);
  onTutorialStepChangeRef.current = onTutorialStepChange;

  const onPickWorkKitRef = useRef(onPickWorkKit);
  onPickWorkKitRef.current = onPickWorkKit;

  const onNextChapterRef = useRef(onNextChapter);
  onNextChapterRef.current = onNextChapter;

  const onConsumeFlaskRef = useRef(onConsumeFlask);
  onConsumeFlaskRef.current = onConsumeFlask;

  const onOpenCraftingRef = useRef(onOpenCrafting);
  onOpenCraftingRef.current = onOpenCrafting;

  const onAddElementRef = useRef(onAddElement);
  onAddElementRef.current = onAddElement;

  const onSelectFlaskIndexRef = useRef(onSelectFlaskIndex);
  onSelectFlaskIndexRef.current = onSelectFlaskIndex;

  const hasPickedWorkKitRef = useRef(hasPickedWorkKit);
  hasPickedWorkKitRef.current = hasPickedWorkKit;

  const currentStepRef = useRef(currentStep);
  currentStepRef.current = currentStep;

  const inventoryElementsRef = useRef(inventoryElements);
  inventoryElementsRef.current = inventoryElements;

  const flasksRef = useRef(flasks);
  flasksRef.current = flasks;

  const activeFlaskIndexRef = useRef(activeFlaskIndex);
  activeFlaskIndexRef.current = activeFlaskIndex;

  // Death & Respawn State
  const [deathOverlay, setDeathOverlay] = useState<{ isDead: boolean; reason: string } | null>(null);
  const isDeadRef = useRef<boolean>(false);
  const deathReasonRef = useRef<string>('');
  const deathTimerRef = useRef<number | null>(null);

  // Level platforms geometry
  const platformsRef = useRef<{ x: number; y: number; w: number; h: number }[]>(getChapterPlatforms(currentCh));

  // Camera scroll offsets
  const cameraX = useRef<number>(0);
  const cameraY = useRef<number>(0);

  // Floating notification banner
  const [inGameNotice, setInGameNotice] = useState<string | null>(() =>
    currentCh === 3
      ? '[2급 입체 결합 인가] C(탄소), N(질소) 원소를 충전하고 상하좌우(+) 십자 결합을 시도하세요!'
      : currentCh === 2
      ? '[A/D] 이동하여 공급기에서 H, O, Na, Cl 원소를 보충하고 [C] 결합창을 여세요!'
      : '[A/D] 이동, [Space] 점프. 전방을 탐험하여 알칼리 가스 화재를 확인하세요!'
  );

  // Material Detailed Inspection (Inspect / 자세히 보기)
  const [inspectedTarget, setInspectedTarget] = useState<InspectableTarget | null>(null);
  const [nearbyInspectable, setNearbyInspectable] = useState<{ obstacle: LevelObstacle; distance: number } | null>(null);
  const nearbyInspectableRef = useRef<{ obstacle: LevelObstacle; distance: number } | null>(null);

  const toggleInspect = useCallback(() => {
    if (inspectedTarget) {
      setInspectedTarget(null);
      sound.scannerBeep();
      return;
    }

    const nearby = nearbyInspectableRef.current;
    if (!nearby || !nearby.obstacle) {
      sound.locked();
      setInGameNotice('🔍 [분석 거리 초과] 자세히 볼 물질에 더 가까이 접근하세요 (최대 1m 이내).');
      return;
    }

    const obs = nearby.obstacle;
    const hazardLevel =
      obs.type.includes('acid') || obs.type.includes('swamp') || obs.type.includes('tree')
        ? '극도로 위험'
        : obs.type.includes('fire') || obs.type.includes('cockroach') || obs.type.includes('grease')
        ? '위험'
        : '주의';

    setInspectedTarget({
      id: obs.id,
      name: obs.name,
      category: obs.category || '화학 복합 물질',
      status: obs.stateText,
      distancePx: Math.round(nearby.distance),
      physicalObservation: obs.analysisDetail || '....정밀 스캔 분석 완료.',
      chemicalObservation: '화학적 상호작용 및 반응 가능성을 확인하려면 키트[C]에서 알맞은 분자를 합성해 투척하세요.',
      hazardLevel,
    });
  }, [inspectedTarget]);

  // Reset / Switch chapter levels when currentCh changes
  useEffect(() => {
    platformsRef.current = getChapterPlatforms(currentCh);
    obstaclesRef.current = getChapterObstacles(currentCh);
    interactivesRef.current = getChapterInteractives(currentCh);
    projectilesRef.current = [];
    particlesRef.current = [];
    bouncyFoamsRef.current = [];
    lethalEmbersRef.current = [];
    shockwavesRef.current = [];
    hasDiscoveredUndergroundRef.current = false;
    isDeadRef.current = false;
    deathReasonRef.current = '';
    setDeathOverlay(null);
    ch2MilestonesRef.current = {
      hintRustGate: false,
      hintGrease: false,
      hintBoulder: false,
      hintMoat: false,
    };
    ch3MilestonesRef.current = {
      hintCrate: false,
      hintSwamp: false,
      hintCockroach: false,
      hintBoss: false,
    };
    titaniumCrateRef.current = {
      y: 200,
      isFloating: false,
      balloonBags: 0,
    };
    isSwampFrozenRef.current = false;
    isCockroachScatteredRef.current = false;
    bossRef.current = {
      isSoaked: false,
      alcoholStacks: 0,
      isBurning: false,
      burnTimer: 0,
      isDefeated: false,
      stunTimer: 0,
      maxHp: 3,
      hp: 3,
    };
    enemyProjectilesRef.current = [];
    groundHazardsRef.current = [];
    enemyCooldownsRef.current = {
      greaseAttackTimer: 100,
      greaseWaveTimer: 280,
      greaseWarning: 0,
      cockroachAttackTimer: 90,
      bossVolleyTimer: 160,
      bossThornTimer: 240,
      bossSprayTimer: 330,
      playerInvulnerableTimer: 0,
    };

    const p = playerRef.current;
    p.x = 60;
    p.y = 330;
    p.vx = 0;
    p.vy = 0;

    if (currentCh === 3) {
      onPickWorkKitRef.current();
      setRadioTransmission({
        id: 'ch3_intro',
        speaker: '박 대리',
        role: '현장 사수',
        message:
          '축하해 신입, 이제 상하 모듈도 쓸 수 있군. 이번 구역은 인간들이 쓰레기통을 안 비워서 생긴 "부패한 쓰레기 산"이야. 온갖 탄소 화합물과 유기물 몬스터가 득실거리지. 배운 걸 써먹어봐!',
        mood: 'impressed',
      });
      setInGameNotice('[2급 입체 결합 인가] C(탄소), N(질소) 원소를 충전하고 상하좌우(+) 십자 결합을 시도하세요!');
      onLogEventRef.current('[Chapter 3] 제4구역 - 방치된 쓰레기장 (플라스틱과 부패의 숲) 진입');
    } else if (currentCh === 2) {
      onPickWorkKitRef.current();
      setRadioTransmission({
        id: 'ch2_intro',
        speaker: '박 대리',
        role: '현장 사수',
        message:
          '신입, 챕터 1 탕비실은 장난이었어. 이번엔 메인 하수 처리장이다. 파이프가 다 썩어 문드러지고 기름때로 꽉 막혔지. 회사에서 Na(나트륨)랑 Cl(염소) 지급 스위치를 열어줬으니까, 알아서 뚫고 지나가.',
        mood: 'neutral',
      });
      setInGameNotice('[A/D] 이동하여 공급기에서 H, O, Na, Cl 원소를 보충하고 [C] 결합창을 열어 분자를 합성하세요!');
      onLogEventRef.current('[Chapter 2] 제3 정수 시설 - 꽉 막힌 배관망 진입');
    } else {
      setRadioTransmission({
        id: 'intro',
        speaker: '박 대리',
        role: '현장 사수',
        message:
          '아, 아. 마이크 테스트. 신입, 내 말 들리나? 자네는 방금 가동을 시작한 최신형 나노-결합기야. 일단 관절에 기름칠 좀 하게 거기서 움직여봐. (ad 이동 space점프)',
        mood: 'neutral',
      });
      setInGameNotice('[A/D] 이동, [Space] 점프. 전방을 탐험하여 알칼리 가스 화재를 확인하세요!');
      onLogEventRef.current('[Chapter 1] 출근 첫날 페트리 접시 기동.');
    }
  }, [currentCh]);

  // Flame intensity state (normal 1.0, blue high-temp 2.6 when O2 hit)
  const flameIntensityRef = useRef<number>(1.0);
  const isFlameBlueRef = useRef<boolean>(false);

  // Stable event/step dispatcher helpers to prevent infinite render loops
  const emitLog = useCallback((msg: string) => {
    onLogEventRef.current(msg);
  }, []);

  const setStep = useCallback((step: number) => {
    onTutorialStepChangeRef.current(step);
  }, []);

  // Active molecule helper
  const getActiveMolecule = useCallback((): MoleculeRecipe | null => {
    if (flasks.length === 0 || activeFlaskIndex < 0 || activeFlaskIndex >= flasks.length) {
      return null;
    }
    const currentFlask = flasks[activeFlaskIndex];
    if (!currentFlask || currentFlask.count <= 0) return null;
    return MOLECULE_RECIPES.find((m) => m.id === currentFlask.moleculeId) || null;
  }, [flasks, activeFlaskIndex]);

  // Respawn player back to start
  const respawnPlayer = useCallback((reason: string) => {
    const p = playerRef.current;
    if (currentCh === 3) {
      if (p.x > 1150) {
        p.x = 1200; // Boss Arena checkpoint
      } else if (p.x > 500) {
        p.x = 540; // Zone 2 entrance checkpoint
      } else {
        p.x = 80;
      }
    } else if (currentCh === 2) {
      if (p.x > 680) {
        p.x = 700; // Zone 3 entrance checkpoint
      } else {
        p.x = 80;
      }
    } else {
      p.x = 80;
    }
    p.y = 330;
    p.vx = 0;
    p.vy = 0;
    p.hp = p.maxHp;
    p.isAiming = false;
    isDeadRef.current = false;
    deathReasonRef.current = '';
    enemyProjectilesRef.current = [];
    groundHazardsRef.current = [];
    enemyCooldownsRef.current.playerInvulnerableTimer = 60;
    setDeathOverlay(null);
    setInGameNotice(`[코스모 본드] 나노-직원 안전 체크포인트 재조립 완료!`);
    onLogEventRef.current(`[Respawn] 나노-직원 체크포인트(x:${Math.round(p.x)})로 재조립 완료.`);
  }, [currentCh]);

  // Trigger Player Death
  const triggerPlayerDeath = useCallback((reason: string, isFire: boolean) => {
    if (isDeadRef.current) return;
    isDeadRef.current = true;
    deathReasonRef.current = reason;

    sound.playerDeath();
    const p = playerRef.current;
    p.hp = 0;
    p.vx = 0;
    p.vy = 0;
    p.isAiming = false;

    // Disintegration particle explosion
    for (let i = 0; i < 55; i++) {
      particlesRef.current.push({
        x: p.x + p.width / 2,
        y: p.y + p.height / 2,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10 - (isFire ? 3 : 0),
        life: 0,
        maxLife: 45,
        color: isFire ? (Math.random() > 0.4 ? '#f97316' : '#ef4444') : '#38bdf8',
        size: 4 + Math.random() * 6,
        type: isFire ? 'fire' : 'spark',
      });
    }

    setDeathOverlay({ isDead: true, reason });
    onLogEventRef.current(`[Death] ${reason}`);

    if (deathTimerRef.current) clearTimeout(deathTimerRef.current);
    deathTimerRef.current = window.setTimeout(() => {
      respawnPlayer(reason);
    }, 1200);
  }, [respawnPlayer]);

  // Damage Player Helper
  const damagePlayer = useCallback((amount: number, reason: string) => {
    if (isDeadRef.current) return;
    if (enemyCooldownsRef.current.playerInvulnerableTimer > 0) return;

    const p = playerRef.current;
    p.hp = Math.max(0, p.hp - amount);
    enemyCooldownsRef.current.playerInvulnerableTimer = 45; // 0.75s i-frames
    sound.playerHurt();
    screenShakeRef.current = Math.max(screenShakeRef.current, 10);

    for (let i = 0; i < 16; i++) {
      particlesRef.current.push({
        x: p.x + p.width / 2,
        y: p.y + p.height / 2,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 0,
        maxLife: 25,
        color: '#ef4444',
        size: 3 + Math.random() * 3,
        type: 'spark',
      });
    }

    if (p.hp <= 0) {
      triggerPlayerDeath(reason, false);
    }
  }, [triggerPlayerDeath]);

  // Handle R key aim & throw
  const startAiming = useCallback(() => {
    if (isDeadRef.current) return;
    const activeMol = getActiveMolecule();
    if (!activeMol) {
      setInGameNotice('⚠️ 투척할 분자 플라스크가 없습니다! [C] 키를 눌러 작업용 키트에서 합성하세요.');
      return;
    }
    playerRef.current.isAiming = true;
  }, [getActiveMolecule]);

  const releaseAndThrow = useCallback(() => {
    if (!playerRef.current.isAiming || isDeadRef.current) return;
    playerRef.current.isAiming = false;

    const activeMol = getActiveMolecule();
    if (!activeMol) return;

    const p = playerRef.current;
    const vx = Math.cos(p.aimAngle) * p.aimPower;
    const vy = Math.sin(p.aimAngle) * p.aimPower;

    projectilesRef.current.push({
      x: p.x + (p.facing === 'right' ? p.width + 4 : -4),
      y: p.y + p.height / 2 - 6,
      vx,
      vy,
      radius: 8,
      molecule: activeMol,
      active: true,
      bounces: 0,
    });

    sound.throwFlask();
    onConsumeFlaskRef.current(activeFlaskIndex);
    onLogEventRef.current(`[Action] 투척: ${activeMol.formula} (${activeMol.koreanName}) 발사.`);
  }, [getActiveMolecule, activeFlaskIndex]);

  // Key Event Listeners - A/D and W/S for horizontal movement, Space ONLY for jump
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
      }

      keysPressed.current[e.code] = true;

      // C: Open Portable Work Kit (SEALED UNTIL KIT PICKED UP!)
      if (e.code === 'KeyC') {
        if (!hasPickedWorkKitRef.current) {
          sound.locked();
          setInGameNotice('🔒 [C 봉인] 전방 바닥의 [코스모 본드 작업용 키트]를 먼저 습득([F])하세요!');
          onLogEventRef.current('[Alert] 작업용 키트 미습득 상태: C 화학 결합창 봉인');
          return;
        }
        onOpenCraftingRef.current();
        onLogEventRef.current('[System] 코스모 본드 휴대용 화학 결합 키트 [C] 오픈');
      }

      // Z / Tab: Detailed Material Inspection (자세히 보기)
      if (e.code === 'KeyZ' || e.code === 'Tab') {
        e.preventDefault();
        toggleInspect();
      }

      // Q/E Switch Flasks
      if (e.code === 'KeyQ') {
        if (flasksRef.current.length > 0) {
          const nextIdx = (activeFlaskIndexRef.current - 1 + flasksRef.current.length) % flasksRef.current.length;
          onSelectFlaskIndexRef.current(nextIdx);
        }
      } else if (e.code === 'KeyE') {
        if (flasksRef.current.length > 0) {
          const nextIdx = (activeFlaskIndexRef.current + 1) % flasksRef.current.length;
          onSelectFlaskIndexRef.current(nextIdx);
        }
      }

      // F: Interact
      if (e.code === 'KeyF') {
        const interactTarget = playerRef.current.canInteractWith;
        if (interactTarget) {
          if (interactTarget.id === 'work_kit') {
            sound.pickup();
            storyMilestoneRef.current.pickedKit = true;
            onPickWorkKitRef.current();
            // Remove work kit from ground upon pickup
            interactivesRef.current = interactivesRef.current.filter((it) => it.id !== 'work_kit');

            setRadioTransmission({
              id: 'picked_kit',
              speaker: '박 대리',
              role: '현장 사수',
              message: '좋아, 키트를 챙겼군. 이제 구역에 설치된 수소(H) 공급기랑 산소(O) 공급기에서 F키를 눌러 원소를 보충해봐. 그걸 어떻게 조립해야 불이 꺼질지는... 기본 교육 때 졸지 않았다면 알겠지? 자, 만들어서 던져! (R 투척)',
              mood: 'neutral',
            });
            setInGameNotice('📦 작업용 키트 습득 완료! [C] 봉인 해제! H-공급기와 O-공급기에서 [F]로 원소를 보충하세요.');
            onLogEventRef.current('[Story] 작업용 키트 습득 및 C 결합창 해금. 공급기 원소 보충 지시 수신.');
            onTutorialStepChangeRef.current(3);
          } else if (interactTarget.type === 'element_dispenser' && interactTarget.elementGranted) {
            const elemType = interactTarget.elementGranted;
            const amount = currentCh === 3 ? 4 : 2;
            onAddElementRef.current(elemType, amount);
            sound.pickup();

            if (currentCh === 3) {
              if (currentStepRef.current === 1) {
                onTutorialStepChangeRef.current(2);
                setRadioTransmission({
                  id: 'ch3_elements_ready',
                  speaker: '박 대리',
                  role: '현장 사수',
                  message:
                    '원소 충전은 완료됐군! 십자(+) 결합 슬롯에 탄소(C)를 중심으로 수소(H)를 상하좌우로 붙여 가벼운 기체(메탄)를 만들어봐. 저 티타늄 상자에 가스 풍선처럼 달아서 띄우는 거야!',
                  mood: 'neutral',
                });
                setInGameNotice(
                  `+${amount} ${ELEMENTS[elemType].koreanName}(${elemType}) 충전 완료! [C]를 눌러 탄소(C)와 수소(H)를 결합하여 부양성 가스 분자를 합성하세요!`
                );
                onLogEventRef.current(`[Mission] 원소 확보 완료 -> Step 2 티타늄 상자 부력 부유 임무 개시`);
              } else {
                setInGameNotice(`+${amount} ${ELEMENTS[elemType].koreanName}(${elemType}) 충전 완료!`);
                onLogEventRef.current(`[Inventory] 원소 보충: ${elemType} ×${amount}`);
              }
            } else if (currentCh === 2) {
              if (currentStepRef.current === 1) {
                onTutorialStepChangeRef.current(2);
                setRadioTransmission({
                  id: 'ch2_elements_ready',
                  speaker: '박 대리',
                  role: '현장 사수',
                  message:
                    '원소 충전은 됐고, 저기 앞을 막고 있는 녹슨 철창 보이지? [C]를 눌러 수소(H)와 염소(Cl)로 염산(HCl)을 합성해서 던져봐!',
                  mood: 'neutral',
                });
                setInGameNotice(
                  `+${amount} ${ELEMENTS[elemType].koreanName}(${elemType}) 충전 완료! [C]에서 염산(HCl)을 합성하여 녹슨 철창을 녹이세요.`
                );
                onLogEventRef.current(`[Mission] 원소 확보 완료 -> Step 2 철창 부식 임무 개시`);
              } else {
                setInGameNotice(`+${amount} ${ELEMENTS[elemType].koreanName}(${elemType}) 충전 완료!`);
                onLogEventRef.current(`[Inventory] 원소 보충: ${elemType} ×${amount}`);
              }
            } else {
              const nextH = (inventoryElementsRef.current.H || 0) + (elemType === 'H' ? amount : 0);
              const nextO = (inventoryElementsRef.current.O || 0) + (elemType === 'O' ? amount : 0);

              if (currentStepRef.current === 3 && nextH >= 2 && nextO >= 1) {
                onTutorialStepChangeRef.current(4);
                setRadioTransmission({
                  id: 'elements_ready',
                  speaker: '박 대리',
                  role: '현장 사수',
                  message:
                    '원소는 넉넉히 충전했겠지? 이제 [C]를 눌러 화학 결합창을 열고 분자를 합성해봐. 다 만들었으면 [R]키로 조준해서 불길에 던져!',
                  mood: 'neutral',
                });
                setInGameNotice(
                  `+${amount} ${ELEMENTS[elemType].koreanName}(${elemType}) 충전 완료! 원소 보충 완료. [C]로 결합창을 열어 분자를 합성하세요!`
                );
                onLogEventRef.current(
                  `[Mission] Step 3 원소 보충 완료 (H:${nextH}, O:${nextO}) -> Step 4 현장 땜질 개시`
                );
              } else {
                setInGameNotice(
                  `+${amount} ${ELEMENTS[elemType].koreanName}(${elemType}) 충전 완료! [F]로 다른 공급기에서도 필요한 원소를 보충하세요.`
                );
                onLogEventRef.current(
                  `[Inventory] 원소 보충: ${elemType} ×${amount} (현재 H:${nextH}, O:${nextO})`
                );
              }
            }
          } else if (interactTarget.id === 'spark_igniter') {
            sound.flareUp();
            // Fire stream of sparks towards the boss
            for (let i = 0; i < 40; i++) {
              particlesRef.current.push({
                x: interactTarget.x + interactTarget.width,
                y: interactTarget.y + 20 + (Math.random() - 0.5) * 10,
                vx: 8 + Math.random() * 8,
                vy: (Math.random() - 0.5) * 4,
                life: 0,
                maxLife: 40,
                color: Math.random() > 0.4 ? '#f59e0b' : '#ef4444',
                size: 4 + Math.random() * 4,
                type: 'spark',
              });
            }

            if (bossRef.current.isSoaked && !bossRef.current.isDefeated && !bossRef.current.isBurning) {
              bossRef.current.isBurning = true;
              sound.infernoBlast();
              screenShakeRef.current = 35;

              const plasticTree = obstaclesRef.current.find((o) => o.id === 'plastic_tree');
              if (plasticTree) {
                plasticTree.active = false;
                plasticTree.stateText = '소각 진행 중...';
              }

              // Inferno particles engulfing screen
              for (let i = 0; i < 110; i++) {
                particlesRef.current.push({
                  x: 1420 + Math.random() * 110,
                  y: 160 + Math.random() * 220,
                  vx: (Math.random() - 0.5) * 14,
                  vy: -Math.random() * 12 - 3,
                  life: 0,
                  maxLife: 60,
                  color: Math.random() > 0.4 ? '#ff3b30' : '#ffcc00',
                  size: 6 + Math.random() * 10,
                  type: 'fire',
                });
              }

              setRadioTransmission({
                id: 'boss_inferno',
                speaker: '박 대리',
                role: '현장 사수',
                message:
                  '우와아아악! 엄청난 불길이야! 저 질긴 괴물 나무가 단숨에 잿더미가 됐잖아! 신입, 자네 진정한 "분자 건축가"였구만?!',
                mood: 'alarmed',
              });
              setInGameNotice('🔥 [화공 대폭발] 에탄올 연소 대화재! 플라스틱-트리가 전소되어 퇴근 게이트가 개방되었습니다!');
              emitLog('[Boss] 에탄올 인화 폭발로 플라스틱-트리 소각 완료!');
              onTutorialStepChangeRef.current(7);

              // Clear projectiles & thorns, finalize defeat after fire storm
              setTimeout(() => {
                bossRef.current.isBurning = false;
                bossRef.current.isDefeated = true;
                enemyProjectilesRef.current = [];
                groundHazardsRef.current = [];
                const pt = obstaclesRef.current.find((o) => o.id === 'plastic_tree');
                if (pt) {
                  pt.active = false;
                  pt.stateText = '소각 완료 - 잿더미';
                }
              }, 2200);
            } else if (!bossRef.current.isSoaked) {
              setInGameNotice('⚠️ 스파크를 튀겼지만 세포벽이 너무 축축하고 질겨 불이 붙지 않습니다! 먼저 C₂H₅OH(에탄올)을 흠뻑 뿌리세요.');
            }
          } else if (interactTarget.id === 'underground_exit') {
            sound.puzzleSolved();
            setInGameNotice('🌟 [시크릿 탈출] 지하 비밀 통로를 수복하고 탈출했습니다! 다음 구역으로 전진합니다!');
            onLogEventRef.current('[Mission] 지하 비밀 탈출구 클리어!');
            if (currentStepRef.current < 5) onTutorialStepChangeRef.current(5);
            if (onNextChapterRef.current) onNextChapterRef.current();
          } else if (interactTarget.id === 'gate_terminal') {
            sound.puzzleSolved();
            setInGameNotice('🎉 튜토리얼 챕터 클리어! 지상 메인 통로를 수복하고 전진합니다!');
            onLogEventRef.current('[Mission] 튜토리얼 챕터 지상 출구 클리어!');
            if (currentStepRef.current < 5) onTutorialStepChangeRef.current(5);
            if (onNextChapterRef.current) onNextChapterRef.current();
          } else if (interactTarget.id === 'ch2_exit') {
            sound.puzzleSolved();
            setInGameNotice('🎉 [챕터 2 클리어] 제3 정수 시설 수복 완료! 박 대리의 2급 입체 결합 자격 획득!');
            onLogEventRef.current('[Mission] 챕터 2 제3 정수 시설 수복 완료 클리어!');
            if (currentStepRef.current < 5) onTutorialStepChangeRef.current(5);
            if (onNextChapterRef.current) onNextChapterRef.current();
          } else if (interactTarget.id === 'ch3_exit') {
            sound.licenseFanfare();
            sound.puzzleSolved();
            setInGameNotice('🏆 [챕터 3 클리어] 방치된 쓰레기장 수복 완료! 특급 분자 건축가 마스터 달성!');
            onLogEventRef.current('[Mission] 챕터 3 방치된 쓰레기장 수복 완료 클리어!');
            setRadioTransmission({
              id: 'ch3_cleared',
              speaker: '박 대리',
              role: '현장 사수',
              message:
                '수고했다 신입! 유기화학 챕터까지 완벽히 정복했군. 이제 자네는 코스모 본드의 전설적인 특급 연구원이야!',
              mood: 'impressed',
            });
            onTutorialStepChangeRef.current(8);
            if (onNextChapterRef.current) onNextChapterRef.current();
          }
        }
      }

      // R: Aim
      if (e.code === 'KeyR' && !e.repeat) {
        startAiming();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;

      if (e.code === 'KeyR') {
        releaseAndThrow();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      mousePos.current = { x: mouseX, y: mouseY };

      if (playerRef.current.isAiming) {
        const pScreenX = playerRef.current.x - cameraX.current;
        const pScreenY = playerRef.current.y - cameraY.current;
        const dx = mouseX - pScreenX;
        const dy = mouseY - pScreenY;
        let angle = Math.atan2(dy, dx);
        playerRef.current.aimAngle = angle;
        playerRef.current.facing = dx >= 0 ? 'right' : 'left';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [startAiming, releaseAndThrow, currentCh]);

  // Main Game Loop (Physics, Update, Render)
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 860;
    const height = 480;
    canvas.width = width;
    canvas.height = height;

    const gravity = 0.55;
    const friction = 0.82;
    const moveSpeed = 0.75;
    const maxSpeed = 4.2;
    const jumpStrength = -10.5;

    const loop = () => {
      const p = playerRef.current;
      const keys = keysPressed.current;
      const crate = ironCrateRef.current;
      const crackedFloor = obstaclesRef.current.find((o) => o.id === 'cracked_floor');
      const fireObstacle = obstaclesRef.current.find((o) => o.id === 'fire_wall');

      // 0. NARRATIVE TRIGGER: SPOTTED FIRE WHEN ADVANCING
      if (!storyMilestoneRef.current.spottedFire && p.x > 180) {
        storyMilestoneRef.current.spottedFire = true;
        screenShakeRef.current = 10;
        sound.radioStatic();
        setRadioTransmission({
          id: 'spotted_fire',
          speaker: '박 대리',
          role: '현장 사수',
          message: '이런, 누가 구역에 알칼리 금속을 버렸는지 배수구 쪽에 화재가 발생했군. 쯧, 첫날부터 운도 없지. 빨리 F키를 눌러서 바닥에 굴러다니는 작업용 키트(제작 테이블 기능)나 주워.',
          mood: 'annoyed',
        });
        setInGameNotice('🚨 전방 알칼리 가스 화재 발생! 작업용 키트[F]를 획득하세요.');
        emitLog('[Story] 가스 화재 발생. 박 대리의 작업용 키트 수색 지시.');
        if (currentStepRef.current === 1) setStep(2);
      }

      // Check underground discovery
      if (p.y > 380 && (!crackedFloor || !crackedFloor.active)) {
        hasDiscoveredUndergroundRef.current = true;
      }


      // Screen shake decay
      if (screenShakeRef.current > 0) {
        screenShakeRef.current *= 0.88;
        if (screenShakeRef.current < 0.2) screenShakeRef.current = 0;
      }

      // 1. INPUT & HORIZONTAL MOVEMENT (A/D ONLY for horizontal, Space ONLY for Jump. No W/S!)
      if (!isDeadRef.current) {
        if (keys['KeyA'] || keys['ArrowLeft']) {
          p.vx -= moveSpeed;
          p.facing = 'left';
        }
        if (keys['KeyD'] || keys['ArrowRight']) {
          p.vx += moveSpeed;
          p.facing = 'right';
        }

        // Jump ONLY via Space!
        if (keys['Space'] && p.isGrounded) {
          p.vy = jumpStrength;
          p.isGrounded = false;
          sound.jump();
        }
      }

      // Physics integration for Player
      p.vx *= friction;
      if (Math.abs(p.vx) > maxSpeed) p.vx = Math.sign(p.vx) * maxSpeed;
      p.vy += gravity;

      p.x += p.vx;
      p.y += p.vy;

      // Chapter 1 Fire Leap-over Check: Jumping over the flames using H2O2 elastic foam & crate!
      if (currentCh === 1 && !storyMilestoneRef.current.resolvedFire && p.x > 775 && p.y <= 380) {
        storyMilestoneRef.current.resolvedFire = true;
        sound.puzzleSolved();
        setRadioTransmission({
          id: 'cleared_h2o2_jump',
          speaker: '박 대리',
          role: '현장 사수',
          message:
            '와! 물로 불을 끄지 않고 과산화수소 거품 탄성으로 철상자를 밟고 뛰어넘다니! 위험천만하지만 대단한 기지였어, 신입! 출구로 직진해!',
          mood: 'impressed',
        });
        setInGameNotice('🧼 [도약 돌파 성공] 과산화수소 탄성 거품으로 불길을 뛰어넘었습니다! 출구로 전진하세요.');
        emitLog('[Reaction] H₂O₂ 탄성 거품 슈퍼 점프로 불길 상공 돌파 성공.');
        if (currentStepRef.current < 5) onTutorialStepChangeRef.current(5);
      }

      // 2. FLOOR INTEGRITY: When fire is extinguished by H2O or H2O2, the floor remains completely sturdy and solid!
      // (The floor is only destroyed by deliberate H2 explosion shockwave or 500kg iron crate impact)

      // 3. HEAVY IRON CRATE PHYSICS (Suspension / Falling / Crash)
      if (crate.isFalling) {
        crate.vy += 0.7;
        crate.y += crate.vy;

        // Crate hits surface level
        if (crate.y + crate.h >= 380 && !crate.hasCrashed) {
          if (crackedFloor && crackedFloor.active) {
            crackedFloor.active = false; // Floor collapses into chasm!

            // Extinguish and clear surface fire as the ground drops!
            const fire = obstaclesRef.current.find((o) => o.id === 'fire_wall');
            if (fire) fire.active = false;

            sound.heavyThud();
            sound.explosion();
            screenShakeRef.current = 20;

            // Rubble and stone particles
            for (let i = 0; i < 45; i++) {
              particlesRef.current.push({
                x: crate.x + crate.w / 2 + (Math.random() - 0.5) * 80,
                y: 380 + (Math.random() - 0.5) * 15,
                vx: (Math.random() - 0.5) * 8,
                vy: -Math.random() * 6 - 2,
                life: 0,
                maxLife: 50,
                color: Math.random() > 0.5 ? '#64748b' : '#334155',
                size: 4 + Math.random() * 6,
                type: 'smoke',
              });
            }

            setInGameNotice('🔥 쿵!! 밧줄이 타서 철상자가 추락! 바닥이 무너져 내리며 아래가 뚫렸습니다!');
            emitLog('[Gimmick] 밧줄 소각 → 철상자 추락으로 바닥 붕괴! 지하 통로 개방.');
          } else {
            sound.heavyThud();
          }

          // Crate settles on underground chamber floor at y=460
          if (crate.y + crate.h >= 460) {
            crate.y = 460 - crate.h;
            crate.vy = 0;
            crate.isFalling = false;
            crate.hasCrashed = true;
          }
        } else if (crate.hasCrashed && crate.y + crate.h >= 460) {
          crate.y = 460 - crate.h;
          crate.vy = 0;
          crate.isFalling = false;
        }
      }

      // Pit fall death check (only below the underground floor depth: > 540)
      if (p.y > 540 && !isDeadRef.current) {
        triggerPlayerDeath('추락 사망: 나노 심연으로 추락하여 분해되었습니다!', false);
      }

      // 4. PLATFORM & TERRAIN COLLISIONS
      p.isGrounded = false;

      // Base platforms
      for (const plat of platformsRef.current) {
        if (
          p.x + p.width > plat.x &&
          p.x < plat.x + plat.w &&
          p.y + p.height >= plat.y &&
          p.y + p.height <= plat.y + plat.h + p.vy + 4 &&
          p.vy >= 0
        ) {
          p.y = plat.y - p.height;
          p.vy = 0;
          p.isGrounded = true;
        }
      }

      // Center floor collision (SOLID ONLY WHILE ACTIVE)
      if (crackedFloor && crackedFloor.active) {
        if (
          p.x + p.width > crackedFloor.x &&
          p.x < crackedFloor.x + crackedFloor.width &&
          p.y + p.height >= crackedFloor.y &&
          p.y + p.height <= crackedFloor.y + crackedFloor.height + p.vy + 4 &&
          p.vy >= 0
        ) {
          p.y = crackedFloor.y - p.height;
          p.vy = 0;
          p.isGrounded = true;
        }
      }

      // Iron Crate platform (Player can land on top of the crate!)
      if (crate.isSuspended || crate.hasCrashed) {
        if (
          p.x + p.width > crate.x &&
          p.x < crate.x + crate.w &&
          p.y + p.height >= crate.y &&
          p.y + p.height <= crate.y + crate.h + p.vy + 4 &&
          p.vy >= 0
        ) {
          p.y = crate.y - p.height;
          p.vy = 0;
          p.isGrounded = true;
        }
      }

      // Bouncy Foams (H2O2) Collision & Boosted Spring Jump
      for (const foam of bouncyFoamsRef.current) {
        if (
          p.x + p.width > foam.x &&
          p.x < foam.x + foam.width &&
          p.y + p.height >= foam.y &&
          p.y + p.height <= foam.y + foam.height + p.vy + 4 &&
          p.vy >= 0
        ) {
          p.y = foam.y - p.height;
          p.isGrounded = true;
          if (keys['Space']) {
            p.vy = jumpStrength * 1.62;
            p.isGrounded = false;
            sound.jump();
            sound.bubbleFoam();
            setInGameNotice('🧼 탄성 거품 슈퍼 점프! 천장의 철상자를 밟고 불길을 넘으세요!');
          } else {
            p.vy = -3.5;
          }
        }
      }

      // Solid obstacle barriers in Chapter 2 (blocking horizontal movement)
      obstaclesRef.current.forEach((obs) => {
        if (!obs.active) return;
        if (obs.type === 'rust_gate' || obs.type === 'grease_monster' || obs.type === 'heavy_boulder') {
          if (
            p.x + p.width > obs.x &&
            p.x < obs.x + obs.width &&
            p.y + p.height > obs.y + 4 &&
            p.y < obs.y + obs.height
          ) {
            if (p.x + p.width / 2 < obs.x + obs.width / 2) {
              p.x = obs.x - p.width;
            } else {
              p.x = obs.x + obs.width;
            }
            p.vx = 0;
          }
        }
      });

      // Chapter 3 Physics, Platforms, Hazards & Sliding
      if (currentCh === 3) {
        const crate = titaniumCrateRef.current;
        if (crate.isFloating) {
          crate.y = Math.max(25, crate.y - 1.8);
          const tCrateObs = obstaclesRef.current.find((o) => o.id === 'titanium_crate');
          if (tCrateObs) tCrateObs.y = crate.y;
        }

        // Titanium crate platform & barrier
        const tCrateObs = obstaclesRef.current.find((o) => o.id === 'titanium_crate');
        if (tCrateObs && tCrateObs.active) {
          // When NOT floated or not high enough, the vertical bulkhead seals from ceiling (y: 0) to floor (y: 380),
          // completely preventing the player from jumping over or bypassing the Titan Block!
          if (!crate.isFloating || crate.y >= 230) {
            if (
              p.x + p.width > tCrateObs.x &&
              p.x < tCrateObs.x + tCrateObs.width &&
              p.y + p.height > 0 &&
              p.y < 380
            ) {
              if (p.x + p.width / 2 < tCrateObs.x + tCrateObs.width / 2) {
                p.x = tCrateObs.x - p.width;
              } else {
                p.x = tCrateObs.x + tCrateObs.width;
              }
              p.vx = 0;
            }
          } else {
            // Once the crate has floated up towards the ceiling chute (crate.y < 230),
            // the corridor underneath is open (ground at 380, crate bottom at crate.y + crate.height).
            // If the player jumps into the floating crate in midair, block collision with the crate body.
            if (
              p.x + p.width > tCrateObs.x &&
              p.x < tCrateObs.x + tCrateObs.width &&
              p.y + p.height > tCrateObs.y &&
              p.y < tCrateObs.y + tCrateObs.height
            ) {
              if (p.x + p.width / 2 < tCrateObs.x + tCrateObs.width / 2) {
                p.x = tCrateObs.x - p.width;
              } else {
                p.x = tCrateObs.x + tCrateObs.width;
              }
              p.vx = 0;
            }
          }
        }

        // Slippery Ice Path friction when swamp is frozen
        if (isSwampFrozenRef.current && p.isGrounded && p.x >= 620 && p.x <= 880) {
          p.vx *= 0.985;
        }

        // Lethal Boiling Swamp Check
        const boilingSwamp = obstaclesRef.current.find((o) => o.id === 'boiling_swamp' && o.active);
        if (
          boilingSwamp &&
          !isSwampFrozenRef.current &&
          p.x + p.width > boilingSwamp.x + 10 &&
          p.x < boilingSwamp.x + boilingSwamp.width - 10 &&
          p.y + p.height >= boilingSwamp.y + 12 &&
          !isDeadRef.current
        ) {
          triggerPlayerDeath(
            '열상 사망: 펄펄 끓는 독 늪에 빠져 용해되었습니다! (급속 흡열 냉각 물질이 필요합니다)',
            true
          );
        }

        // Lethal Cockroach Swarm Check
        const cockroachSwarm = obstaclesRef.current.find((o) => o.id === 'cockroach_swarm' && o.active);
        if (
          cockroachSwarm &&
          !isCockroachScatteredRef.current &&
          p.x + p.width > cockroachSwarm.x + 5 &&
          p.x < cockroachSwarm.x + cockroachSwarm.width - 5 &&
          p.y + p.height > cockroachSwarm.y + 10 &&
          !isDeadRef.current
        ) {
          triggerPlayerDeath(
            '압사 사망: 거대 돌연변이 해충 무리에게 덮쳐졌습니다! (접근하기 전에 악취 가스로 쫓아내야 합니다)',
            false
          );
        }

        // Lethal Boss 'Plastic-Tree' Check
        const plasticTree = obstaclesRef.current.find((o) => o.id === 'plastic_tree' && o.active);
        if (
          plasticTree &&
          !bossRef.current.isDefeated &&
          !bossRef.current.isBurning &&
          p.x + p.width > plasticTree.x + 15 &&
          p.x < plasticTree.x + plasticTree.width - 15 &&
          p.y + p.height > plasticTree.y + 20 &&
          !isDeadRef.current
        ) {
          triggerPlayerDeath(
            '포식 사망: 돌연변이 식물의 가시 덩굴에 휘감겨 소화되었습니다! (원거리에서 화공을 가해야 합니다)',
            false
          );
        }
      }

      // Lethal acid moat check in Chapter 2
      if (currentCh === 2) {
        const acidMoat = obstaclesRef.current.find((o) => o.id === 'acid_moat' && o.active);
        if (
          acidMoat &&
          p.x + p.width > acidMoat.x &&
          p.x < acidMoat.x + acidMoat.width &&
          p.y + p.height >= acidMoat.y + 15 &&
          !isDeadRef.current
        ) {
          triggerPlayerDeath(
            '부식 사망: 붉은 산성 해자에 빠져 분자 구조가 녹아내렸습니다! (산성을 중화시킬 방법을 찾아야 합니다)',
            false
          );
        }
      }

      // Fire Obstacle Collision (Instant Death! Chapter 1)
      if (fireObstacle && fireObstacle.active && !isDeadRef.current) {
        const fireH = fireObstacle.height * flameIntensityRef.current;
        const fireTop = fireObstacle.y - (fireH - fireObstacle.height);
        if (
          p.x + p.width > fireObstacle.x &&
          p.x < fireObstacle.x + fireObstacle.width &&
          p.y + p.height > fireTop &&
          p.y < fireObstacle.y + fireObstacle.height
        ) {
          triggerPlayerDeath('열화 사망: 맹렬한 고열 화재에 접촉하여 분자 구조가 붕괴되었습니다! 냉각 소화하거나 상공을 안전하게 우회하십시오.', true);
        }
      }

      // Universal Bottom Void / Abyss Fall Check
      if (p.y > 470 && !isDeadRef.current) {
        triggerPlayerDeath('추락 사망: 지하 시설 심연으로 추락하여 분해되었습니다!', false);
      }

      // Check interaction proximity
      let closestTarget: InteractiveEntity | null = null;
      for (const ent of interactivesRef.current) {
        if ((ent.id === 'underground_core' || ent.id === 'underground_exit') && crackedFloor && crackedFloor.active) continue;

        const dist = Math.hypot(p.x + p.width / 2 - (ent.x + ent.width / 2), p.y + p.height / 2 - (ent.y + ent.height / 2));
        if (dist < 65) {
          closestTarget = ent;
          break;
        }
      }
      p.canInteractWith = closestTarget;

      // Check inspectable obstacle proximity (Strict small range threshold <= 85px)
      let closestInspectObs: LevelObstacle | null = null;
      let minInspectDist = Infinity;
      for (const obs of obstaclesRef.current) {
        const dx = Math.max(0, obs.x - (p.x + p.width), p.x - (obs.x + obs.width));
        const dy = Math.max(0, obs.y - (p.y + p.height), p.y - (obs.y + obs.height));
        const dist = Math.hypot(dx, dy);
        if (dist <= 85 && dist < minInspectDist) {
          minInspectDist = dist;
          closestInspectObs = obs;
        }
      }

      if (closestInspectObs) {
        nearbyInspectableRef.current = { obstacle: closestInspectObs, distance: minInspectDist };
      } else {
        nearbyInspectableRef.current = null;
      }

      // Chapter 3 Proximity Radio & Notice Hints
      if (currentCh === 3 && !isDeadRef.current) {
        const titaniumCrate = obstaclesRef.current.find((o) => o.id === 'titanium_crate' && o.active);
        const boilingSwamp = obstaclesRef.current.find((o) => o.id === 'boiling_swamp' && o.active);
        const cockroachSwarm = obstaclesRef.current.find((o) => o.id === 'cockroach_swarm' && o.active);
        const plasticTree = obstaclesRef.current.find((o) => o.id === 'plastic_tree' && o.active);

        // Approaching Titanium Crate (x: 420)
        if (titaniumCrate && !ch3MilestonesRef.current.hintCrate && p.x > 220 && p.x < 410) {
          ch3MilestonesRef.current.hintCrate = true;
          setRadioTransmission({
            id: 'hint_crate',
            speaker: '박 대리',
            role: '현장 사수',
            message:
              '신입, 저 앞의 티타늄 상자가 수직 통로를 꽉 막고 있어. 폭발로도 안 부서지는 고밀도 금속이야. 가벼운 기체로 풍선처럼 띄워 올릴 수는 없겠나?',
            mood: 'neutral',
          });
          setInGameNotice('📦 [1구역] 티타늄 상자: 무거운 금속 상자가 수직 통로를 막고 있습니다.');
        }

        // Approaching Boiling Swamp (x: 620)
        if (boilingSwamp && !ch3MilestonesRef.current.hintSwamp && p.x > 490 && p.x < 615) {
          ch3MilestonesRef.current.hintSwamp = true;
          setRadioTransmission({
            id: 'hint_swamp',
            speaker: '박 대리',
            role: '현장 사수',
            message:
              '으, 저 펄펄 끓는 유기 독 늪 좀 봐. 발만 닿아도 온몸이 녹아버려. 급격하게 열을 빨아들여 단단한 얼음판으로 만들 흡열 물질이 필요해.',
            mood: 'alarmed',
          });
          setInGameNotice('🧪 [2구역] 끓는 유기 독 늪: 고열과 독성으로 가득한 늪입니다 (접촉 시 즉사).');
        }

        // Approaching Cockroach Swarm (x: 990)
        if (cockroachSwarm && !ch3MilestonesRef.current.hintCockroach && p.x > 860 && p.x < 980) {
          ch3MilestonesRef.current.hintCockroach = true;
          setRadioTransmission({
            id: 'hint_cockroach',
            speaker: '박 대리',
            role: '현장 사수',
            message:
              '우웩! 거대 해충들이 떼를 지어 자고 있어. 건드리면 떼거지로 덮칠 거다. 생물형 괴물들이 질색하는 지독한 악취 가스를 뿌려 쫓아내!',
            mood: 'annoyed',
          });
          setInGameNotice('🪳 [3구역] 거대 해충 무리: 길을 막고 있는 유기물 해충 떼입니다.');
        }

        // Approaching Plastic-Tree Boss (x: 1390)
        if (plasticTree && !ch3MilestonesRef.current.hintBoss && p.x > 1220 && p.x < 1370) {
          ch3MilestonesRef.current.hintBoss = true;
          setRadioTransmission({
            id: 'hint_boss',
            speaker: '박 대리',
            role: '현장 사수',
            message:
              '저 괴물 나무가 바로 최종 보스야! 유기물 덩어리라 세포벽이 엄청나게 두꺼워. 그냥 불로는 어림도 없지. 불을 붙이기 전에 땔감이 될 고인화성 유기 화합물을 잔뜩 묻혀!',
            mood: 'neutral',
          });
          setInGameNotice('🥀 [4구역] 돌연변이 플라스틱-트리: 두꺼운 유기물 세포벽의 보스입니다.');
        }
      }

      // Chapter 2 Proximity Radio & Notice Hints
      if (currentCh === 2 && !isDeadRef.current) {
        const rustGate = obstaclesRef.current.find((o) => o.id === 'rust_gate' && o.active);
        const greaseMonster = obstaclesRef.current.find((o) => o.id === 'grease_monster' && o.active);
        const heavyBoulder = obstaclesRef.current.find((o) => o.id === 'heavy_boulder' && o.active);
        const acidMoat = obstaclesRef.current.find((o) => o.id === 'acid_moat' && o.active);

        // Approaching Rust Gate (x: 380)
        if (rustGate && !ch2MilestonesRef.current.hintRustGate && p.x > 210 && p.x < 375) {
          ch2MilestonesRef.current.hintRustGate = true;
          setRadioTransmission({
            id: 'hint_rust_gate',
            speaker: '박 대리',
            role: '현장 사수',
            message:
              '신입, 저 앞을 봐. 녹슨 철창이 배관을 꽉 막고 있군. 산화철 층이 두꺼워서 물리력으론 어림도 없어. 금속을 부식시킬 만한 화학 물질을 고민해 봐.',
            mood: 'neutral',
          });
          setInGameNotice('🔒 [1구역] 녹슨 철창: 두꺼운 산화철 금속 장벽이 통로를 차단하고 있습니다.');
        }

        // Approaching Grease Monster (x: 640)
        if (greaseMonster && !ch2MilestonesRef.current.hintGrease && p.x > 440 && p.x < 635) {
          ch2MilestonesRef.current.hintGrease = true;
          setRadioTransmission({
            id: 'hint_grease',
            speaker: '박 대리',
            role: '현장 사수',
            message:
              '웩, 저건 배관에 굳어버린 거대 기름때 슬라임이야! 삼겹살 기름엔 산성이 안 먹힌다고. 지방을 비누처럼 분해해 씻어낼 수 있는 반응이 있었지?',
            mood: 'annoyed',
          });
          setInGameNotice('🧈 [2구역] 기름때 슬라임: 굳은 지방 덩어리가 배관을 막고 있습니다.');
        }

        // Approaching Boulder & Water Puddle (x: 870)
        if (heavyBoulder && !ch2MilestonesRef.current.hintBoulder && p.x > 690 && p.x < 865) {
          ch2MilestonesRef.current.hintBoulder = true;
          setRadioTransmission({
            id: 'hint_boulder',
            speaker: '박 대리',
            role: '현장 사수',
            message:
              '암벽이 너무 두꺼워서 그냥은 못 뚫어. 하지만 바로 앞에 물이 고여있잖아? 물과 만나면 격렬하게 반응하는 알칼리 금속의 특성을 떠올려 봐.',
            mood: 'neutral',
          });
          setInGameNotice('🪨 [3구역] 거대 암벽: 두꺼운 암벽과 고인 수로가 길을 막고 있습니다.');
        }

        // Approaching Acid Moat (x: 990)
        if (acidMoat && !ch2MilestonesRef.current.hintMoat && p.x > 880 && p.x < 985) {
          ch2MilestonesRef.current.hintMoat = true;
          setRadioTransmission({
            id: 'hint_moat',
            speaker: '박 대리',
            role: '현장 사수',
            message:
              '조심해! 저 붉은 액체는 지독한 강산성이야! 빠지면 흔적도 없이 녹는다. 강산성을 무력화시킬 반대 성질의 물질을 투척해 봐!',
            mood: 'alarmed',
          });
          setInGameNotice('🌊 [4구역] 붉은 산성 해자: 치명적인 강산성 액체입니다 (접촉 시 즉사).');
        }
      }

      // Camera follow with smooth lerp
      const targetCamX = p.x - width / 2;
      cameraX.current += (targetCamX - cameraX.current) * 0.08;
      if (cameraX.current < 0) cameraX.current = 0;
      const maxCamX = currentCh === 3 ? 1400 : currentCh === 2 ? 1300 : 720;
      if (cameraX.current > maxCamX) cameraX.current = maxCamX;

      const targetCamY = hasDiscoveredUndergroundRef.current && p.y > 370 ? Math.min(50, p.y - 350) : 0;
      cameraY.current += (targetCamY - cameraY.current) * 0.08;

      // 5. PROJECTILES UPDATE & CHEMICAL REACTIONS
      projectilesRef.current.forEach((proj) => {
        if (!proj.active) return;
        proj.vy += 0.38;
        proj.x += proj.vx;
        proj.y += proj.vy;

        // Sparkle trail
        particlesRef.current.push({
          x: proj.x,
          y: proj.y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          life: 0,
          maxLife: 20,
          color: proj.molecule.color,
          size: 3,
          type: 'spark',
        });

        // (A-0) CHAPTER 3 PROJECTILE CHEMICAL REACTIONS
        if (currentCh === 3) {
          const titaniumCrate = obstaclesRef.current.find((o) => o.id === 'titanium_crate' && o.active);
          const boilingSwamp = obstaclesRef.current.find((o) => o.id === 'boiling_swamp' && o.active);
          const cockroachSwarm = obstaclesRef.current.find((o) => o.id === 'cockroach_swarm' && o.active);
          const plasticTree = obstaclesRef.current.find((o) => o.id === 'plastic_tree');

          // 1. Titanium Crate (초경량/고밀도 티타늄 상자) + CH4 (메탄)
          if (
            titaniumCrate &&
            proj.x >= titaniumCrate.x - 25 &&
            proj.x <= titaniumCrate.x + titaniumCrate.width + 25 &&
            proj.y >= titaniumCrate.y - 20 &&
            proj.y <= titaniumCrate.y + titaniumCrate.height + 20
          ) {
            proj.active = false;
            if (proj.molecule.id === 'CH4') {
              titaniumCrateRef.current.isFloating = true;
              titaniumCrateRef.current.balloonBags += 1;
              sound.balloonFloat();

              for (let i = 0; i < 45; i++) {
                particlesRef.current.push({
                  x: titaniumCrate.x + Math.random() * titaniumCrate.width,
                  y: titaniumCrate.y + Math.random() * titaniumCrate.height,
                  vx: (Math.random() - 0.5) * 5,
                  vy: -Math.random() * 5 - 2,
                  life: 0,
                  maxLife: 40,
                  color: Math.random() > 0.5 ? '#38bdf8' : '#a855f7',
                  size: 4 + Math.random() * 5,
                  type: 'spark',
                });
              }

              setRadioTransmission({
                id: 'cleared_ch4',
                speaker: '박 대리',
                role: '현장 사수',
                message:
                  '하! 그 무거운 티타늄 덩어리에 부양 가스 주머니를 달아서 띄워 올리다니, 제법 머리를 썼군. 상자가 위로 떴으니 열린 아래로 지나가!',
                mood: 'impressed',
              });
              setInGameNotice('🎈 [부력 발생] 초경량 부양 가스낭 부착! 티타늄 격벽이 공중으로 솟아올라 하단 통로가 개방되었습니다!');
              emitLog('[Gimmick] 부양 기체의 양력으로 티타늄 상자 공중 부양 성공.');
              setStep(3);
            } else {
              sound.heavyThud();
              setInGameNotice('⚠️ 티타늄은 단단하고 무거워 부서지지 않습니다. 가스 풍선처럼 띄워 올릴 공기보다 가벼운 부양성 기체가 필요합니다.');
            }
            return;
          }

          // 2. Boiling Swamp (펄펄 끓는 독 늪) + CO2
          if (
            boilingSwamp &&
            proj.x >= boilingSwamp.x - 20 &&
            proj.x <= boilingSwamp.x + boilingSwamp.width + 20 &&
            proj.y >= boilingSwamp.y - 25 &&
            proj.y <= boilingSwamp.y + boilingSwamp.height + 20
          ) {
            proj.active = false;
            if (proj.molecule.id === 'CO2') {
              isSwampFrozenRef.current = true;
              boilingSwamp.active = false;
              boilingSwamp.stateText = '단단하게 언 얼음판';
              sound.freezeShatter();

              // Add solid slippery ice platform
              platformsRef.current.push({ x: 620, y: 380, w: 260, h: 25 });

              for (let i = 0; i < 70; i++) {
                particlesRef.current.push({
                  x: boilingSwamp.x + Math.random() * boilingSwamp.width,
                  y: boilingSwamp.y + 10,
                  vx: (Math.random() - 0.5) * 6,
                  vy: -Math.random() * 5 - 2,
                  life: 0,
                  maxLife: 50,
                  color: Math.random() > 0.4 ? '#67e8f9' : '#e0f2fe',
                  size: 4 + Math.random() * 6,
                  type: 'spark',
                });
              }

              setRadioTransmission({
                id: 'cleared_co2',
                speaker: '박 대리',
                role: '현장 사수',
                message:
                  '급속 흡열 효과로 독 늪을 통째로 얼려버렸군! 미끄러지면서 신나게 슬라이딩해봐!',
                mood: 'impressed',
              });
              setInGameNotice('🧊 [급속 동결] 급격한 흡열 반응으로 독 늪이 단단한 빙판길로 얼어붙었습니다!');
              emitLog('[Gimmick] 급속 흡열 반응으로 독 늪 급속 동결 완료.');
              setStep(4);
            } else {
              sound.steamExtinguish();
              setInGameNotice('⚠️ 끓는 독 늪의 고열을 이기지 못하고 증발했습니다. 급격하게 열을 흡수해 얼려버릴 냉각 물질이 필요합니다.');
            }
            return;
          }

          // 3. Cockroach Swarm (거대 해충 무리) + NH3
          if (
            cockroachSwarm &&
            proj.x >= cockroachSwarm.x - 30 &&
            proj.x <= cockroachSwarm.x + cockroachSwarm.width + 30 &&
            proj.y >= cockroachSwarm.y - 20 &&
            proj.y <= cockroachSwarm.y + cockroachSwarm.height + 20
          ) {
            proj.active = false;
            if (proj.molecule.id === 'NH3') {
              isCockroachScatteredRef.current = true;
              cockroachSwarm.active = false;
              cockroachSwarm.stateText = '도망쳐 흩어짐';
              sound.pestScatter();

              for (let i = 0; i < 60; i++) {
                particlesRef.current.push({
                  x: cockroachSwarm.x + Math.random() * cockroachSwarm.width,
                  y: cockroachSwarm.y + Math.random() * cockroachSwarm.height,
                  vx: (Math.random() - 0.5) * 8,
                  vy: -Math.random() * 6 - 2,
                  life: 0,
                  maxLife: 45,
                  color: Math.random() > 0.4 ? '#fef08a' : '#84cc16',
                  size: 5 + Math.random() * 5,
                  type: 'smoke',
                });
              }

              setRadioTransmission({
                id: 'cleared_nh3',
                speaker: '박 대리',
                role: '현장 사수',
                message:
                  '으악, 이 코를 찌르는 지독한 자극성 악취! 나도 토할 뻔했잖아! 그래도 벌레 놈들은 싹 도망갔군.',
                mood: 'annoyed',
              });
              setInGameNotice('🪳 [악취 퇴치] 지독한 자극성 악취 가스에 해충들이 비명을 지르며 도망쳤습니다!');
              emitLog('[Gimmick] 자극성 악취 가스로 해충 무리 퇴치 완료.');
              setStep(5);
            } else {
              setInGameNotice('⚠️ 해충들이 꿈쩍도 하지 않습니다. 생물형 괴물이 극도로 혐오하는 지독한 자극성 악취 가스가 필요합니다.');
            }
            return;
          }

          // 4. Boss 'Plastic-Tree' (플라스틱-트리) + C2H5OH / Fire / Spark
          if (
            plasticTree &&
            !bossRef.current.isDefeated &&
            proj.x >= plasticTree.x - 40 &&
            proj.x <= plasticTree.x + plasticTree.width + 40 &&
            proj.y >= plasticTree.y - 30 &&
            proj.y <= plasticTree.y + plasticTree.height + 30
          ) {
            proj.active = false;

            if (proj.molecule.id === 'C2H5OH') {
              bossRef.current.isSoaked = true;
              bossRef.current.alcoholStacks = 3;
              bossRef.current.stunTimer = 180; // 3.0s STUN!
              sound.throwFlask();
              sound.bossRoar();

              for (let i = 0; i < 55; i++) {
                particlesRef.current.push({
                  x: plasticTree.x + Math.random() * plasticTree.width,
                  y: plasticTree.y + Math.random() * plasticTree.height,
                  vx: (Math.random() - 0.5) * 6,
                  vy: Math.random() * 4,
                  life: 0,
                  maxLife: 40,
                  color: '#c084fc',
                  size: 4 + Math.random() * 5,
                  type: 'foam',
                });
              }

              plasticTree.stateText = '고인화성 연료 포화 침투 - 스파크 점화기[F]로 대화재 점화!';
              setRadioTransmission({
                id: 'boss_soaked_ready',
                speaker: '박 대리',
                role: '현장 사수',
                message:
                  '완벽해 신입! 고인화성 연료가 괴물 나무에 100% 흠뻑 스며들었어! 저기 스파크 점화기[F]를 당기거나 불씨를 던져서 모조리 태워버려!',
                mood: 'impressed',
              });
              setInGameNotice('🔥 [연료 포화 완료] 보스가 인화성 연료에 완전히 젖었습니다! 스파크 점화기[F]를 당기세요!');
              emitLog('[Boss] 아르보르 플라스티카 고인화성 연료 100% 도포 완료.');
              setStep(6);
            } else if (
              bossRef.current.isSoaked &&
              !bossRef.current.isBurning &&
              (proj.molecule.id === 'H2' || proj.molecule.id === 'O2' || proj.molecule.id === 'Na_pure')
            ) {
              bossRef.current.isBurning = true;
              sound.infernoBlast();
              screenShakeRef.current = 35;
              plasticTree.active = false;
              plasticTree.stateText = '소각 진행 중...';

              for (let i = 0; i < 110; i++) {
                particlesRef.current.push({
                  x: plasticTree.x + Math.random() * plasticTree.width,
                  y: plasticTree.y + Math.random() * plasticTree.height,
                  vx: (Math.random() - 0.5) * 14,
                  vy: -Math.random() * 12 - 3,
                  life: 0,
                  maxLife: 60,
                  color: Math.random() > 0.4 ? '#ff3b30' : '#ffcc00',
                  size: 6 + Math.random() * 10,
                  type: 'fire',
                });
              }

              setRadioTransmission({
                id: 'boss_inferno_proj',
                speaker: '박 대리',
                role: '현장 사수',
                message:
                  '우와아아악! 엄청난 불길이야! 저 질긴 괴물 나무가 단숨에 잿더미가 됐잖아! 신입, 자네 진정한 "분자 건축가"였구만?!',
                mood: 'alarmed',
              });
              setInGameNotice('🔥 [화공 대폭발] 고인화성 화합물 연소 대화재! 플라스틱-트리가 전소되어 퇴근 게이트가 개방되었습니다!');
              emitLog('[Boss] 화공 연소 반응으로 플라스틱-트리 전소 완료!');
              setStep(7);

              setTimeout(() => {
                bossRef.current.isBurning = false;
                bossRef.current.isDefeated = true;
                enemyProjectilesRef.current = [];
                groundHazardsRef.current = [];
                const pt = obstaclesRef.current.find((o) => o.id === 'plastic_tree');
                if (pt) {
                  pt.active = false;
                  pt.stateText = '소각 완료 - 잿더미';
                }
              }, 2200);
            } else {
              sound.heavyThud();
              setInGameNotice('⚠️ 질긴 유기물 세포벽 때문에 반응하지 않습니다! 먼저 땔감이 될 고인화성 유기 화합물을 잔뜩 묻힌 뒤 불을 붙여야 합니다.');
            }
            return;
          }
        }

        // (A-1) CHAPTER 2 PROJECTILE CHEMICAL REACTIONS
        if (currentCh === 2) {
          const rustGate = obstaclesRef.current.find((o) => o.id === 'rust_gate' && o.active);
          const greaseMonster = obstaclesRef.current.find((o) => o.id === 'grease_monster' && o.active);
          const heavyBoulder = obstaclesRef.current.find((o) => o.id === 'heavy_boulder' && o.active);
          const waterPuddle = obstaclesRef.current.find((o) => o.id === 'water_puddle' && o.active);
          const acidMoat = obstaclesRef.current.find((o) => o.id === 'acid_moat' && o.active);

          // 1. Rust Gate (녹슨 철창) + HCl
          if (
            rustGate &&
            proj.x >= rustGate.x - 20 &&
            proj.x <= rustGate.x + rustGate.width + 20 &&
            proj.y >= rustGate.y - 10 &&
            proj.y <= rustGate.y + rustGate.height + 10
          ) {
            proj.active = false;
            if (proj.molecule.id === 'HCl') {
              rustGate.active = false;
              sound.acidSizzle();
              for (let i = 0; i < 45; i++) {
                particlesRef.current.push({
                  x: rustGate.x + Math.random() * rustGate.width,
                  y: rustGate.y + Math.random() * rustGate.height,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  life: 0,
                  maxLife: 35,
                  color: '#22c55e',
                  size: 3 + Math.random() * 5,
                  type: 'steam',
                });
              }
              setRadioTransmission({
                id: 'cleared_rust_gate',
                speaker: '박 대리',
                role: '현장 사수',
                message: '오, 산으로 녹슨 철창을 깨끗하게 녹여버렸군. 잘했어, 다음 배관으로 넘어가자고.',
                mood: 'neutral',
              });
              setInGameNotice('🧪 [부식 용해] 녹슨 철창이 용해되어 사라졌습니다! 통로가 열렸습니다.');
              emitLog('[Gimmick] 녹슨 철창 부식 용해 완료.');
              setStep(3);
            } else {
              sound.heavyThud();
              setInGameNotice('⚠️ 산화철로 녹슨 철창은 반응하지 않습니다. 금속을 부식시킬 강산성 물질이 필요합니다.');
            }
            return;
          }

          // 2. Grease Monster (거대 기름때 지방 괴물) + NaOH
          if (
            greaseMonster &&
            proj.x >= greaseMonster.x - 25 &&
            proj.x <= greaseMonster.x + greaseMonster.width + 25 &&
            proj.y >= greaseMonster.y - 10 &&
            proj.y <= greaseMonster.y + greaseMonster.height + 10
          ) {
            proj.active = false;
            if (proj.molecule.id === 'NaOH') {
              greaseMonster.active = false;
              sound.bubbleFoam();
              sound.craftSuccess();
              for (let i = 0; i < 60; i++) {
                particlesRef.current.push({
                  x: greaseMonster.x + Math.random() * greaseMonster.width,
                  y: greaseMonster.y + Math.random() * greaseMonster.height,
                  vx: (Math.random() - 0.5) * 7,
                  vy: -Math.random() * 6 - 2,
                  life: 0,
                  maxLife: 50,
                  color: Math.random() > 0.4 ? '#fde047' : '#ffffff',
                  size: 4 + Math.random() * 6,
                  type: 'foam',
                });
              }
              setRadioTransmission({
                id: 'cleared_grease',
                speaker: '박 대리',
                role: '현장 사수',
                message:
                  '크으, 삼겹살 기름때 굳은 괴물이 거품이 돼서 씻겨 내려가는 것 좀 봐. 비누화 반응의 미학이지. 이제 막힌 수로가 보일 거다.',
                mood: 'neutral',
              });
              setInGameNotice('🧼 [비누화 반응] 지방 덩어리를 비누거품으로 용해 및 세척 완료!');
              emitLog('[Gimmick] 비누화 반응으로 거대 기름때 제거 완료.');
              setStep(4);
            } else if (proj.molecule.id === 'HCl') {
              sound.throwFlask();
              setInGameNotice('⚠️ 기름때는 산성에 내성이 있습니다. 유기물을 분해할 염기성 비누화 반응이 필요합니다.');
            } else {
              sound.throwFlask();
              setInGameNotice('⚠️ 반응하지 않습니다. 지방 덩어리를 녹일 염기성 물질이 필요합니다.');
            }
            return;
          }

          // 3. Na Pure in Water Puddle / near Heavy Boulder -> Sodium Blast!
          if (
            (waterPuddle || heavyBoulder) &&
            proj.molecule.id === 'Na_pure' &&
            proj.x > 710 &&
            proj.x < 930 &&
            proj.y > 280
          ) {
            proj.active = false;
            sound.flareUp();
            sound.explosion();
            sound.heavyThud();
            screenShakeRef.current = 26;

            if (heavyBoulder) {
              heavyBoulder.active = false;
            }

            shockwavesRef.current.push({
              x: proj.x,
              y: 375,
              radius: 15,
              maxRadius: 220,
              color: '#f97316',
              life: 0,
            });

            // Lethal explosion AoE check for player
            const distToNaBlast = Math.hypot(p.x + p.width / 2 - proj.x, p.y + p.height / 2 - 375);
            if (distToNaBlast < 170 && !isDeadRef.current) {
              triggerPlayerDeath(
                '폭발 사망: 격렬한 폭발 충격파에 휩쓸렸습니다! (안전거리 밖에서 반응시켜야 합니다)',
                true
              );
            }

            for (let i = 0; i < 75; i++) {
              particlesRef.current.push({
                x: proj.x,
                y: 375,
                vx: (Math.random() - 0.5) * 14,
                vy: -Math.random() * 12 - 2,
                life: 0,
                maxLife: 45,
                color: Math.random() > 0.4 ? '#f59e0b' : '#ef4444',
                size: 5 + Math.random() * 7,
                type: 'fire',
              });
            }

            setRadioTransmission({
              id: 'cleared_sodium',
              speaker: '박 대리',
              role: '현장 사수',
              message: '역시 격렬한 화학 폭탄의 손맛이란! 불꽃 축제가 따로 없군. 자, 이제 마지막 하이라이트 구역이다.',
              mood: 'alarmed',
            });
            setInGameNotice('💥 [화학 대폭발] 물과의 격렬한 반응으로 초강력 폭발을 일으켜 암벽을 분쇄했습니다!');
            emitLog('[Gimmick] 격렬한 폭발 반응으로 돌무더기 분쇄 완료.');
            setStep(5);
            return;
          }

          // 4. Acid Moat + NaOH -> Acid-Base Neutralization (산염기 중화)
          if (
            acidMoat &&
            acidMoat.active &&
            proj.molecule.id === 'NaOH' &&
            proj.x >= acidMoat.x - 30 &&
            proj.x <= acidMoat.x + acidMoat.width + 30 &&
            proj.y >= 350
          ) {
            proj.active = false;
            acidMoat.active = false;
            acidMoat.stateText = '중화된 맑은 소금물';
            sound.neutralizationChord();

            // Add salt crystal platforms to platformsRef
            platformsRef.current.push(
              { x: 1040, y: 380, w: 70, h: 20 },
              { x: 1140, y: 355, w: 70, h: 20 },
              { x: 1240, y: 380, w: 70, h: 20 }
            );

            for (let i = 0; i < 60; i++) {
              particlesRef.current.push({
                x: acidMoat.x + Math.random() * acidMoat.width,
                y: acidMoat.y + 20,
                vx: (Math.random() - 0.5) * 4,
                vy: -Math.random() * 6 - 2,
                life: 0,
                maxLife: 60,
                color: Math.random() > 0.5 ? '#fef08a' : '#ffffff',
                size: 4 + Math.random() * 6,
                type: 'spark',
              });
            }

            setRadioTransmission({
              id: 'cleared_neutralization',
              speaker: '박 대리',
              role: '현장 사수',
              message:
                '호오... 강산과 강염기를 섞어서 중화시키다니. 중화반응을 제대로 이해했군! 이 정도면 위아래로 모듈을 붙일 자격이 충분해. 본사에 2급 입체 결합 자격증(C, N 해금)을 신청해 두지.',
              mood: 'neutral',
            });
            setInGameNotice('✨ [산염기 중화 완료] 중화 반응으로 소금 결정 발판이 형성되었습니다. 발판을 밟고 건너가세요.');
            emitLog('[Neutralization] 산염기 중화반응 성공: 소금 결정 발판 형성.');
            return;
          }
        }

        // (A-2) HIT FIRE OBSTACLE REACTIONS (Chapter 1)
        // Fire MUST be extinguished with H2O (물) to pass through!
        if (fireObstacle && fireObstacle.active) {
          if (
            proj.x >= fireObstacle.x - 15 &&
            proj.x <= fireObstacle.x + fireObstacle.width + 15 &&
            proj.y >= fireObstacle.y - 20 &&
            proj.y <= fireObstacle.y + fireObstacle.height
          ) {
            proj.active = false;

            // [1] H2O (물) - 유일한 정석 소화 해법!
            if (proj.molecule.id === 'H2O') {
              fireObstacle.active = false;
              storyMilestoneRef.current.resolvedFire = true;
              if (crackedFloor) {
                crackedFloor.active = true; // 바닥 유지되어 안전하게 통행 가능
              }
              sound.steamExtinguish();
              sound.puzzleSolved();

              // Park Dae-ri Senior Radio: 정석 소화 완료
              setRadioTransmission({
                id: 'cleared_h2o',
                speaker: '박 대리',
                role: '현장 사수',
                message: '오, 완벽하게 불을 껐군! 물(H₂O)로 냉각 소화하는 게 바로 교본의 정석이지. 통로가 열렸으니 어서 지나가자고.',
                mood: 'impressed',
              });

              setInGameNotice('💧 [H₂O 소화 완료] 맹렬한 불길이 완전히 진압되었습니다! 안전해진 통로를 지나 탈출구로 향하세요.');
              emitLog('[Reaction] H₂O 급속 냉각 소화 성공. 박 대리 칭찬 수신.');
              setStep(5);

              for (let i = 0; i < 70; i++) {
                particlesRef.current.push({
                  x: fireObstacle.x + fireObstacle.width / 2 + (Math.random() - 0.5) * 60,
                  y: fireObstacle.y + fireObstacle.height / 2 + (Math.random() - 0.5) * 200,
                  vx: (Math.random() - 0.5) * 5,
                  vy: -Math.random() * 5 - 1,
                  life: 0,
                  maxLife: 65,
                  color: '#e2e8f0',
                  size: 6 + Math.random() * 10,
                  type: 'steam',
                });
              }
            }
            // [2] O2 (산소): 연소 반응을 격렬하게 촉진하여 불길이 치솟고 천장 밧줄 소각 → 500kg 철상자 추락 및 바닥 붕괴!
            else if (proj.molecule.id === 'O2') {
              sound.flareUp();
              isFlameBlueRef.current = true;
              flameIntensityRef.current = 2.4;

              // Spark particles
              for (let i = 0; i < 40; i++) {
                particlesRef.current.push({
                  x: fireObstacle.x + fireObstacle.width / 2 + (Math.random() - 0.5) * 50,
                  y: fireObstacle.y - 40 + Math.random() * (fireObstacle.height + 40),
                  vx: (Math.random() - 0.5) * 8,
                  vy: -Math.random() * 8 - 3,
                  life: 0,
                  maxLife: 50,
                  color: '#38bdf8',
                  size: 5 + Math.random() * 5,
                  type: 'spark',
                });
              }

              // Trigger Crate Drop: Flames roar up to ceiling rope and burn it!
              if (crate.ropeIntact) {
                crate.ropeIntact = false;
                crate.isFalling = true;
                crate.isSuspended = false;
                sound.explosion();
                screenShakeRef.current = 15;

                setRadioTransmission({
                  id: 'cleared_o2_drop',
                  speaker: '박 대리',
                  role: '현장 사수',
                  message:
                    '우와아악!! 산소(O₂)를 불에 던졌더니 불길이 미친 듯이 치솟아 천장 밧줄을 몽땅 태워버렸잖아! 500kg 철상자가 떨어지며 불을 덮쳐 끄고 바닥까지 뚫어버렸어! 지하 통로로 내려가 봐!',
                  mood: 'alarmed',
                });
                setInGameNotice('🔥 [연소 급격 촉진] 산소(O₂)로 불길이 치솟아 밧줄 소각! 500kg 철상자가 추락하여 불을 덮쳐 끄고 바닥을 뚫었습니다!');
                emitLog('[Reaction] O₂ 연소 격화 → 밧줄 소각으로 500kg 철상자 추락! 화재 압쇄 및 바닥 붕괴로 지하 비밀 통로 개방.');
                storyMilestoneRef.current.resolvedFire = true;
                setStep(5);
              }
            }
            // [3] H2 (수소): 가연성 대폭발 충격파로 바닥 붕괴 및 지하 통로 개방!
            else if (proj.molecule.id === 'H2') {
              sound.explosion();
              sound.puzzleSolved();
              screenShakeRef.current = 28;

              shockwavesRef.current.push({
                x: fireObstacle.x + fireObstacle.width / 2,
                y: fireObstacle.y + fireObstacle.height / 2,
                radius: 10,
                maxRadius: 180,
                color: '#f97316',
                life: 0,
              });

              // Break cracked floor into chasm & clear surface fire
              if (crackedFloor && crackedFloor.active) {
                crackedFloor.active = false;
              }
              fireObstacle.active = false;
              storyMilestoneRef.current.resolvedFire = true;

              // Snap rope if suspended
              if (crate.ropeIntact) {
                crate.ropeIntact = false;
                crate.isFalling = true;
                crate.isSuspended = false;
              }

              // Lethal only if player was standing directly inside the fire blast radius (< 75px)
              const distToExplosion = Math.hypot(
                p.x + p.width / 2 - (fireObstacle.x + fireObstacle.width / 2),
                p.y + p.height / 2 - (fireObstacle.y + fireObstacle.height / 2)
              );
              if (distToExplosion < 75 && !isDeadRef.current) {
                triggerPlayerDeath('폭발 사망: 수소 폭발의 초근접 충격파에 휩쓸려 분해되었습니다! 안전거리를 확보하고 투척하세요.', true);
              } else {
                setRadioTransmission({
                  id: 'cleared_h2_explosion',
                  speaker: '박 대리',
                  role: '현장 사수',
                  message:
                    '우와아아악! 수소(H₂)가 불에 닿아 가연성 대폭발을 일으켰어! 폭발 충격파로 금간 바닥이 산산조각 나면서 지하 통로가 뻥 뚫렸잖아! 신입, 다치진 않았지? 아래로 내려가 봐!',
                  mood: 'alarmed',
                });
                setInGameNotice('💥 [가연성 대폭발] 수소(H₂) 폭발 충격파로 금간 바닥이 붕괴되어 지하 비밀 통로가 개방되었습니다!');
                emitLog('[Reaction] H₂ 가연성 대폭발! 충격파로 바닥 붕괴 및 지하 통로 개방.');
                setStep(5);
              }

              for (let i = 0; i < 50; i++) {
                particlesRef.current.push({
                  x: fireObstacle.x + fireObstacle.width / 2,
                  y: fireObstacle.y + Math.random() * fireObstacle.height,
                  vx: (Math.random() - 0.5) * 12,
                  vy: (Math.random() - 0.5) * 12,
                  life: 0,
                  maxLife: 45,
                  color: Math.random() > 0.4 ? '#ff3b30' : '#ffcc00',
                  size: 5 + Math.random() * 7,
                  type: 'fire',
                });
              }
            }
            // [4] H2O2 (과산화수소): 고열 열분해로 대량의 탄성 거품 발판 생성!
            else if (proj.molecule.id === 'H2O2') {
              sound.bubbleFoam();
              // Spawn bouncy foam cushion right in front of the fire
              bouncyFoamsRef.current.push({
                id: 'foam_fire_' + Date.now(),
                x: fireObstacle.x - 60,
                y: 350,
                width: 70,
                height: 35,
                life: 0,
                maxLife: 1200,
              });

              for (let i = 0; i < 35; i++) {
                particlesRef.current.push({
                  x: fireObstacle.x - 30 + (Math.random() - 0.5) * 40,
                  y: 360 + (Math.random() - 0.5) * 20,
                  vx: (Math.random() - 0.5) * 6,
                  vy: -Math.random() * 5 - 2,
                  life: 0,
                  maxLife: 45,
                  color: '#a7f3d0',
                  size: 4 + Math.random() * 6,
                  type: 'foam',
                });
              }

              setRadioTransmission({
                id: 'hint_fire_h2o2',
                speaker: '박 대리',
                role: '현장 사수',
                message:
                  '오호! 과산화수소(H₂O₂)가 고열에 급속 분해되면서 거대한 탄성 거품 발판을 형성했어! 불은 완전히 꺼지지 않지만, 저 거품을 밟고 [Space]로 슈퍼 점프해서 상단의 철상자를 딛고 불길을 뛰어넘어 봐!',
                mood: 'impressed',
              });
              setInGameNotice('🧼 [탄성 거품 발판 형성] 과산화수소가 열분해되어 거품 발판이 생성되었습니다! [Space] 슈퍼 점프로 불길을 뛰어넘으세요!');
              emitLog('[Reaction] H₂O₂ 열분해: 화재 앞 탄성 거품 발판 생성. 공중 도약 가능.');
            }
            // 기타 분자
            else {
              sound.heavyThud();
              setInGameNotice('⚠️ 화재를 진압하려면 냉각 소화 물질이 필요합니다!');
            }
            return;
          }
        }

        // (B-1) H2 HIT CRACKED FLOOR DIRECTLY: Explosive shockwave collapses floor!
        if (proj.molecule.id === 'H2' && crackedFloor && crackedFloor.active) {
          if (
            proj.x >= crackedFloor.x - 20 &&
            proj.x <= crackedFloor.x + crackedFloor.width + 20 &&
            proj.y >= crackedFloor.y - 25 &&
            proj.y <= crackedFloor.y + crackedFloor.height + 25
          ) {
            proj.active = false;
            sound.explosion();
            sound.puzzleSolved();
            screenShakeRef.current = 28;
            crackedFloor.active = false;
            if (fireObstacle) fireObstacle.active = false;
            storyMilestoneRef.current.resolvedFire = true;
            if (crate.ropeIntact) {
              crate.ropeIntact = false;
              crate.isFalling = true;
              crate.isSuspended = false;
            }
            shockwavesRef.current.push({
              x: proj.x,
              y: proj.y,
              radius: 10,
              maxRadius: 180,
              color: '#f97316',
              life: 0,
            });
            setRadioTransmission({
              id: 'cleared_h2_floor',
              speaker: '박 대리',
              role: '현장 사수',
              message:
                '우와아악! 수소(H₂) 폭발 충격파로 금간 바닥이 산산조각 나버렸잖아! 지하 비밀 통로가 뚫렸어! 아래로 내려가 봐!',
              mood: 'alarmed',
            });
            setInGameNotice('💥 [가연성 대폭발] 수소(H₂) 폭발 충격파로 금간 바닥이 붕괴되어 지하 통로가 개방되었습니다!');
            emitLog('[Reaction] H₂ 폭발 충격파로 바닥 붕괴 및 지하 통로 개방.');
            setStep(5);
            return;
          }
        }

        // (B) HIT GROUND / WALL REACTIONS
        if (proj.molecule.id === 'H2O2') {
          const validSurfaces = [...platformsRef.current];
          if (crackedFloor && crackedFloor.active) {
            validSurfaces.push({ x: crackedFloor.x, y: crackedFloor.y, w: crackedFloor.width, h: crackedFloor.height });
          }
          for (const plat of validSurfaces) {
            if (
              proj.x >= plat.x &&
              proj.x <= plat.x + plat.w &&
              proj.y >= plat.y - 15 &&
              proj.y <= plat.y + 25
            ) {
              proj.active = false;
              sound.bubbleFoam();
              bouncyFoamsRef.current.push({
                id: 'foam_' + Date.now(),
                x: proj.x - 30,
                y: plat.y - 30,
                width: 65,
                height: 35,
                life: 0,
                maxLife: 1200,
              });
              setInGameNotice('🧼 [도약 준비] 탄성 거품 발판 생성! 밟고 [Space]를 누르면 높이 도약할 수 있습니다!');
              emitLog('[Reaction] 분해 탄성 거품 발판 생성.');

              for (let i = 0; i < 25; i++) {
                particlesRef.current.push({
                  x: proj.x,
                  y: plat.y - 10,
                  vx: (Math.random() - 0.5) * 3,
                  vy: -Math.random() * 4 - 1,
                  life: 0,
                  maxLife: 30,
                  color: '#a7f3d0',
                  size: 4 + Math.random() * 4,
                  type: 'foam',
                });
              }
              return;
            }
          }
        }

        // O3 (Ozone) Mist effect
        if (proj.molecule.id === 'O3') {
          for (const plat of platformsRef.current) {
            if (
              proj.x >= plat.x &&
              proj.x <= plat.x + plat.w &&
              proj.y >= plat.y &&
              proj.y <= plat.y + 20
            ) {
              proj.active = false;
              sound.ozoneSterilize();
              setInGameNotice('✨ 오존(O₃) 살균 가스 방출: 강력한 산화 가스가 주변을 정화합니다.');
              emitLog('[Reaction] O₃ 오존 살균 가스 방출.');

              for (let i = 0; i < 40; i++) {
                particlesRef.current.push({
                  x: proj.x + (Math.random() - 0.5) * 70,
                  y: plat.y - Math.random() * 30,
                  vx: (Math.random() - 0.5) * 2,
                  vy: -Math.random() * 1.5 - 0.5,
                  life: 0,
                  maxLife: 60,
                  color: '#38bdf8',
                  size: 5 + Math.random() * 6,
                  type: 'ozone',
                });
              }
              return;
            }
          }
        }
      });

      // Filter active projectiles
      projectilesRef.current = projectilesRef.current.filter((p) => p.active && p.y < 700);

      // 6. LETHAL EMBERS UPDATE
      lethalEmbersRef.current.forEach((emb) => {
        emb.life++;
        emb.vy += 0.22;
        emb.x += emb.vx;
        emb.y += emb.vy;

        particlesRef.current.push({
          x: emb.x,
          y: emb.y,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          life: 0,
          maxLife: 15,
          color: '#fbbf24',
          size: 2,
          type: 'ember',
        });

        const dist = Math.hypot(p.x + p.width / 2 - emb.x, p.y + p.height / 2 - emb.y);
        if (dist < 18 && !isDeadRef.current) {
          triggerPlayerDeath('열화 사망: 산소 연소로 튀어나온 고열 불티에 맞아 분자 구조가 붕괴되었습니다!', true);
        }
      });
      lethalEmbersRef.current = lethalEmbersRef.current.filter((e) => e.life < e.maxLife && e.y < 420);

      // 7. SHOCKWAVES UPDATE
      shockwavesRef.current.forEach((sw) => {
        sw.life++;
        sw.radius += (sw.maxRadius - sw.radius) * 0.15;
      });
      shockwavesRef.current = shockwavesRef.current.filter((sw) => sw.life < 25);

      // 8. BOUNCY FOAMS UPDATE
      bouncyFoamsRef.current.forEach((foam) => {
        foam.life++;
        if (Math.random() > 0.7) {
          particlesRef.current.push({
            x: foam.x + Math.random() * foam.width,
            y: foam.y + Math.random() * foam.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -Math.random() * 1.5,
            life: 0,
            maxLife: 20,
            color: '#a7f3d0',
            size: 3,
            type: 'foam',
          });
        }
      });
      bouncyFoamsRef.current = bouncyFoamsRef.current.filter((f) => f.life < f.maxLife);

      // ==========================================
      // 8-B. ENEMY ATTACK PATTERNS & AI BEHAVIOR
      // ==========================================
      const cd = enemyCooldownsRef.current;
      if (cd.playerInvulnerableTimer > 0) {
        cd.playerInvulnerableTimer--;
      }

      // CHAPTER 2: Sebum Gluttony Attack Patterns
      if (currentCh === 2) {
        const grease = obstaclesRef.current.find((o) => o.id === 'grease_monster' && o.active);
        if (grease && !isDeadRef.current) {
          // Check player proximity (Zone 2)
          if (p.x > 380 && p.x < 720) {
            // Pattern 1: Viscous Lipid Sludge Spittle
            cd.greaseAttackTimer--;
            if (cd.greaseAttackTimer <= 0) {
              cd.greaseAttackTimer = 135; // Every ~2.2s
              sound.enemyShoot();
              const dx = p.x + p.width / 2 - (grease.x + 10);
              const spitSpeed = Math.max(-5.5, Math.min(-3.0, dx / 45));
              enemyProjectilesRef.current.push({
                id: 'grease_spit_' + Date.now(),
                x: grease.x + 5,
                y: grease.y + 110 + Math.random() * 40,
                vx: spitSpeed,
                vy: -2.8,
                radius: 7,
                damage: 15,
                color: '#84cc16',
                type: 'grease_spit',
                life: 0,
                maxLife: 150,
                gravity: 0.12,
                slowEffect: true,
              });
            }

            // Pattern 2: Lipid Pulse Shockwave along the ground
            cd.greaseWaveTimer--;
            if (cd.greaseWaveTimer <= 45 && cd.greaseWaveTimer > 0) {
              cd.greaseWarning = cd.greaseWaveTimer;
            } else {
              cd.greaseWarning = 0;
            }

            if (cd.greaseWaveTimer <= 0) {
              cd.greaseWaveTimer = 300; // Every 5s
              sound.flareUp();
              setInGameNotice('⚠️ [세범 글루토니] 지질 펄스 파동 방출! 점프로 회피하세요!');
              enemyProjectilesRef.current.push({
                id: 'grease_wave_' + Date.now(),
                x: grease.x,
                y: 370,
                vx: -3.8,
                vy: 0,
                radius: 12,
                damage: 20,
                color: '#eab308',
                type: 'grease_wave',
                life: 0,
                maxLife: 120,
              });
            }
          }
        }
      }

      // CHAPTER 3: Cockroach Swarm & Boss Arbor Plastica Attack Patterns
      if (currentCh === 3) {
        // 1. Cockroach Swarm (Chitin Brood Necro)
        const cockroach = obstaclesRef.current.find((o) => o.id === 'cockroach_swarm' && o.active);
        if (cockroach && !isCockroachScatteredRef.current && !isDeadRef.current) {
          if (p.x > 840 && p.x < 1180) {
            cd.cockroachAttackTimer--;
            if (cd.cockroachAttackTimer <= 0) {
              cd.cockroachAttackTimer = 110;
              sound.enemyShoot();
              for (let i = 0; i < 2; i++) {
                enemyProjectilesRef.current.push({
                  id: 'chitin_' + Date.now() + '_' + i,
                  x: cockroach.x + 20 + i * 25,
                  y: cockroach.y + 15,
                  vx: -4.5 - i * 0.8,
                  vy: -3.5 - i * 1.2,
                  radius: 5,
                  damage: 18,
                  color: '#d97706',
                  type: 'chitin_stinger',
                  life: 0,
                  maxLife: 130,
                  gravity: 0.16,
                });
              }
            }
          }
        }

        // 2. Grand Boss: Arbor Plastica (비정질 합성고분자 침식수)
        const boss = obstaclesRef.current.find((o) => o.id === 'plastic_tree' && o.active);
        const bState = bossRef.current;
        if (boss && !bState.isDefeated && !bState.isBurning && !isDeadRef.current) {
          if (p.x > 1150) {
            if (bState.stunTimer > 0) {
              bState.stunTimer--;
              if (Math.random() > 0.4) {
                particlesRef.current.push({
                  x: boss.x + Math.random() * boss.width,
                  y: boss.y + Math.random() * boss.height,
                  vx: (Math.random() - 0.5) * 3,
                  vy: -Math.random() * 3 - 1,
                  life: 0,
                  maxLife: 30,
                  color: '#c084fc',
                  size: 4 + Math.random() * 4,
                  type: 'foam',
                });
              }
            } else {
              // PATTERN 1: Microplastic Tri-Volley (미세플라스틱 3연발 산탄)
              cd.bossVolleyTimer--;
              if (cd.bossVolleyTimer <= 0) {
                cd.bossVolleyTimer = 170; // Every ~2.8s
                sound.enemyShoot();
                const angles = [-0.35, 0, 0.35];
                angles.forEach((ang, idx) => {
                  const spd = 6.2;
                  enemyProjectilesRef.current.push({
                    id: 'boss_dart_' + Date.now() + '_' + idx,
                    x: boss.x + 20,
                    y: boss.y + 40,
                    vx: -Math.cos(ang) * spd,
                    vy: Math.sin(ang) * spd,
                    radius: 6,
                    damage: 20,
                    color: '#c084fc',
                    type: 'boss_volley',
                    life: 0,
                    maxLife: 140,
                  });
                });
              }

              // PATTERN 2: Subterranean Resin Thorns (지하 합성수지 가시 급습)
              cd.bossThornTimer--;
              if (cd.bossThornTimer <= 0) {
                cd.bossThornTimer = 260; // Every ~4.3s
                sound.bossRoar();
                setInGameNotice('🚨 [아르보르 플라스티카] 바닥 가시 덩굴 경고! 발밑을 즉시 피하세요!');
                groundHazardsRef.current.push({
                  id: 'thorn_' + Date.now(),
                  x: Math.max(1220, Math.min(1600, p.x - 25)),
                  y: 380,
                  width: 50,
                  height: 48,
                  warnTimer: 55, // 0.9s warning telegraph
                  eruptTimer: 35, // 0.6s lethal eruption
                  damage: 28,
                });
              }

              // PATTERN 3: Viscous Polymer Bile Bomb (부식성 수지 구체 투척)
              cd.bossSprayTimer--;
              if (cd.bossSprayTimer <= 0) {
                cd.bossSprayTimer = 340; // Every ~5.6s
                sound.throwFlask();
                enemyProjectilesRef.current.push({
                  id: 'boss_bomb_' + Date.now(),
                  x: boss.x + 30,
                  y: boss.y + 20,
                  vx: -4.8,
                  vy: -7.5,
                  radius: 11,
                  damage: 24,
                  color: '#ec4899',
                  type: 'boss_spray',
                  life: 0,
                  maxLife: 150,
                  gravity: 0.22,
                  slowEffect: true,
                });
              }
            }
          }
        }
      }

      // ==========================================
      // 8-C. ENEMY PROJECTILES & HAZARDS UPDATE
      // ==========================================
      enemyProjectilesRef.current.forEach((ep) => {
        ep.life++;
        if (ep.gravity) ep.vy += ep.gravity;
        ep.x += ep.vx;
        ep.y += ep.vy;

        // Spark trail
        if (Math.random() > 0.4) {
          particlesRef.current.push({
            x: ep.x,
            y: ep.y,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            life: 0,
            maxLife: 15,
            color: ep.color,
            size: 3,
            type: 'spark',
          });
        }

        // Collision with player
        if (!isDeadRef.current && cd.playerInvulnerableTimer <= 0) {
          const dist = Math.hypot(p.x + p.width / 2 - ep.x, p.y + p.height / 2 - ep.y);
          if (dist < ep.radius + p.width / 2) {
            ep.life = ep.maxLife; // Consume projectile
            damagePlayer(ep.damage, `적 공격 피격: ${ep.type}에 적중당해 나노-외골격이 파괴되었습니다!`);
            if (ep.slowEffect) {
              p.vx *= 0.35;
            }
          }
        }
      });
      enemyProjectilesRef.current = enemyProjectilesRef.current.filter((ep) => ep.life < ep.maxLife && ep.y < 520);

      // Ground Hazards update (Telegraph & Eruption)
      groundHazardsRef.current.forEach((gh) => {
        if (gh.warnTimer > 0) {
          gh.warnTimer--;
          if (gh.warnTimer === 0) {
            sound.flareUp();
          }
        } else if (gh.eruptTimer > 0) {
          gh.eruptTimer--;
          if (!isDeadRef.current && cd.playerInvulnerableTimer <= 0) {
            if (
              p.x + p.width > gh.x &&
              p.x < gh.x + gh.width &&
              p.y + p.height >= gh.y - gh.height &&
              p.y <= gh.y
            ) {
              p.vy = -7.5;
              damagePlayer(gh.damage, '포식 관통: 바닥에서 솟구친 고분자 가시 덩굴에 꿰뚫렸습니다!');
            }
          }
        }
      });
      groundHazardsRef.current = groundHazardsRef.current.filter((gh) => gh.warnTimer > 0 || gh.eruptTimer > 0);

      // 9. FIRE PARTICLES GENERATION
      if (fireObstacle && fireObstacle.active) {
        const fireH = fireObstacle.height * flameIntensityRef.current;
        const fireTop = fireObstacle.y - (fireH - fireObstacle.height);
        const isBlue = isFlameBlueRef.current;

        for (let i = 0; i < (isBlue ? 7 : 3); i++) {
          particlesRef.current.push({
            x: fireObstacle.x + Math.random() * fireObstacle.width,
            y: fireObstacle.y + fireObstacle.height - 10,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * (isBlue ? 6.5 : 3.5) - 1.5,
            life: 0,
            maxLife: isBlue ? 40 : 30,
            color: isBlue
              ? Math.random() > 0.4 ? '#38bdf8' : '#60a5fa'
              : Math.random() > 0.4 ? '#f97316' : '#ef4444',
            size: isBlue ? 5 + Math.random() * 6 : 4 + Math.random() * 5,
            type: 'fire',
          });
        }
      }

      // Update particles
      particlesRef.current.forEach((part) => {
        part.life++;
        part.x += part.vx;
        part.y += part.vy;
        if (part.type === 'steam') {
          part.size += 0.2;
          part.vy *= 0.95;
        }
      });
      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife);

      // 10. RENDERING PASS
      ctx.clearRect(0, 0, width, height);

      // Apply screen shake & camera offset
      const enableShake = settings?.screenShake ?? true;
      const shakePower = enableShake ? screenShakeRef.current : 0;
      const shakeX = (Math.random() - 0.5) * shakePower;
      const shakeY = (Math.random() - 0.5) * shakePower;
      ctx.save();
      ctx.translate(shakeX, shakeY - cameraY.current);

      const cam = cameraX.current;

      // Dark Sci-Fi Background
      ctx.fillStyle = '#060d17';
      ctx.fillRect(0, 0, width, height + 80);

      if (currentCh === 2) {
        // CHAPTER 2: INDUSTRIAL SEWER & FILTRATION CONDUIT WITH CEILING FLOODLIGHTS
        ctx.save();
        // Huge horizontal sewer conduit pipes in background
        const pipeY1 = 80;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, pipeY1, width, 55);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 3;
        ctx.strokeRect(0, pipeY1, width, 55);

        // Flanges and joint rings
        const pipeParallax = -(cam * 0.15) % 180;
        for (let fx = pipeParallax; fx < width; fx += 180) {
          ctx.fillStyle = '#334155';
          ctx.fillRect(fx, pipeY1 - 4, 16, 63);
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(fx, pipeY1 - 4, 16, 63);

          // Rivet dots
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(fx + 6, pipeY1 + 8, 4, 4);
          ctx.fillRect(fx + 6, pipeY1 + 42, 4, 4);
        }

        // Industrial Halogen Work Floodlights hanging from ceiling illuminating key zones
        const workLights = [
          { x: 160, color: 'rgba(56, 189, 248, 0.22)' }, // Element Depot
          { x: 395, color: 'rgba(249, 115, 22, 0.22)' }, // Rust Gate
          { x: 665, color: 'rgba(234, 179, 8, 0.22)' },  // Grease Monster
          { x: 840, color: 'rgba(56, 189, 248, 0.24)' }, // Water Canal & Boulder
          { x: 1165, color: 'rgba(239, 68, 68, 0.22)' }, // Acid Moat
          { x: 1445, color: 'rgba(52, 211, 153, 0.24)' } // Exit Gate
        ];

        workLights.forEach((light) => {
          const lx = light.x - cam;
          if (lx < -150 || lx > width + 150) return;
          // Lamp fixture
          ctx.fillStyle = '#64748b';
          ctx.fillRect(lx - 12, 0, 24, 16);
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(lx, 16, 6, 0, Math.PI * 2);
          ctx.fill();

          // Soft ambient illumination beam cone
          const coneGrad = ctx.createRadialGradient(lx, 16, 8, lx, 260, 250);
          coneGrad.addColorStop(0, light.color);
          coneGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = coneGrad;
          ctx.beginPath();
          ctx.moveTo(lx - 10, 16);
          ctx.lineTo(lx + 10, 16);
          ctx.lineTo(lx + 140, 420);
          ctx.lineTo(lx - 140, 420);
          ctx.closePath();
          ctx.fill();
        });

        // Sector Stencil
        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.textAlign = 'left';
        ctx.fillText('COSMO BOND INC. // SECTOR 03: WASTEWATER & INORGANIC FILTRATION CONDUIT', 40 - cam * 0.2, 55);

        // Overhead warning hazard tape stripe
        ctx.fillStyle = '#eab308';
        ctx.fillRect(0, 140, width, 6);
        ctx.fillStyle = '#0f172a';
        for (let hx = 0; hx < width; hx += 24) {
          ctx.fillRect(hx, 140, 12, 6);
        }

        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = 'rgba(226, 232, 240, 0.75)';
        ctx.fillText('ZONE 1: RUST GATE  ➔  ZONE 2: GREASE BLOB  ➔  ZONE 3: WATER CONDUIT  ➔  ZONE 4: ACID MOAT', 40 - cam * 0.2, 162);
        ctx.restore();
      } else {
        // CHAPTER 1: LABORATORY SPECIMEN & PETRI DISH BENCH
        // Environmental Storytelling Layer 1: Giant Out-of-Focus Microscope Lens / Lab Specimen Ceiling
        const lensParallaxX = width / 2 - cam * 0.04;
        ctx.save();
        const lensGrad = ctx.createRadialGradient(lensParallaxX, -70, 70, lensParallaxX, -70, 340);
        lensGrad.addColorStop(0, 'rgba(56, 189, 248, 0.09)');
        lensGrad.addColorStop(0.5, 'rgba(30, 41, 59, 0.05)');
        lensGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = lensGrad;
        ctx.beginPath();
        ctx.arc(lensParallaxX, -70, 340, 0, Math.PI * 2);
        ctx.fill();

        // Outer microscope objective lens rim
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(lensParallaxX, -70, 260, 0, Math.PI * 2);
        ctx.stroke();

        // Faint giant researcher eye pupil scanning subtly above in the lens reflection
        const eyeTime = Date.now() * 0.001;
        const eyeLookX = lensParallaxX + Math.sin(eyeTime * 0.5) * 15;
        const eyeLookY = 40 + Math.cos(eyeTime * 0.7) * 8;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.035)';
        ctx.beginPath();
        ctx.ellipse(eyeLookX, eyeLookY, 45, 25, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.08)';
        ctx.beginPath();
        ctx.arc(eyeLookX, eyeLookY, 14, 0, Math.PI * 2);
        ctx.fill();

        // Environmental Storytelling Layer 2: Distant Giant Coffee Mug Silhouette on Researcher Desk (Out of focus)
        const cupX = 720 - cam * 0.08;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
        ctx.fillRect(cupX, 130, 110, 190);
        ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
        ctx.lineWidth = 2;
        ctx.strokeRect(cupX, 130, 110, 190);
        // Cup handle
        ctx.beginPath();
        ctx.arc(cupX + 115, 210, 26, -Math.PI * 0.5, Math.PI * 0.5);
        ctx.stroke();
        ctx.font = '7px monospace';
        ctx.fillStyle = 'rgba(100, 116, 139, 0.35)';
        ctx.fillText('[HUMAN CAFFEINE SUPPLY - 350ML]', cupX + 8, 150);
        ctx.restore();

        // Parallax Grid
        ctx.strokeStyle = '#0f2338';
        ctx.lineWidth = 1;
        const gridSize = 32;
        const bgOffsetX = -(cam * 0.3) % gridSize;
        for (let x = bgOffsetX; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height + 80);
          ctx.stroke();
        }
        for (let y = 0; y < height + 80; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Render Petri Dish Rim Specimen Stage at Spawn (x: 20 to 220)
        const petriX = 110 - cam;
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(petriX, 380, 95, 14, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Glass rim refraction
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(petriX, 377, 90, 11, 0, Math.PI * 0.1, Math.PI * 0.9);
        ctx.stroke();

        ctx.font = 'bold 8px monospace';
        ctx.fillStyle = 'rgba(148, 163, 184, 0.55)';
        ctx.textAlign = 'center';
        ctx.fillText('COSMO BOND PETRI STAGE #01', petriX, 372);
        ctx.restore();
      }

      const isFloorBroken = !crackedFloor || !crackedFloor.active;
      const isUndergroundVisible = isFloorBroken && (hasDiscoveredUndergroundRef.current || p.y > 370);

      // Render Underground Chamber Cavity (HIDDEN UNTIL BROKEN/DISCOVERED!)
      if (isUndergroundVisible) {
        const ugX = 560 - cam;
        ctx.fillStyle = '#030712';
        ctx.fillRect(ugX, 380, 530, 115);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.strokeRect(ugX, 380, 530, 115);

        // Ambient cyan laboratory glow
        ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
        ctx.fillRect(ugX, 380, 530, 115);
      } else if (isFloorBroken) {
        const ugX = 620 - cam;
        ctx.fillStyle = '#020617';
        ctx.fillRect(ugX, 380, 200, 115);
      }

      // Ceiling Beam (Where the rope hangs from)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, width, 50);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, 48, width, 2);

      // Render Rope (Ceiling y=50 to crate y)
      const ropeX = crate.x - cam + crate.w / 2;
      if (crate.ropeIntact) {
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(ropeX, 50);
        ctx.lineTo(ropeX, crate.y);
        ctx.stroke();

        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 2;
        for (let ry = 55; ry < crate.y; ry += 12) {
          ctx.beginPath();
          ctx.moveTo(ropeX - 3, ry);
          ctx.lineTo(ropeX + 3, ry + 3);
          ctx.stroke();
        }
      } else {
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(ropeX, 50);
        ctx.lineTo(ropeX, 85);
        ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(ropeX, 85, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render Platforms
      for (const plat of platformsRef.current) {
        if (plat.y > 380 && !isUndergroundVisible) continue;

        const px = plat.x - cam;
        if (px + plat.w < -50 || px > width + 50) continue;

        if (currentCh === 2) {
          // Chapter 2: High-visibility heavy industrial steel platform with glowing cyan edge
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(px, plat.y, plat.w, plat.h);
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(px, plat.y, plat.w, plat.h);

          // Glowing neon cyan runner on top
          ctx.fillStyle = '#00f0ff';
          ctx.fillRect(px, plat.y, plat.w, 4);

          // Steel tread marks
          ctx.fillStyle = '#334155';
          for (let dx = 8; dx < plat.w - 8; dx += 16) {
            ctx.fillRect(px + dx, plat.y + 8, 5, 2);
            ctx.fillRect(px + dx + 3, plat.y + 14, 5, 2);
          }

          // Yellow/Black Hazard warning stripes on cliff edges (e.g. drop into acid moat or water)
          const isLedgeLeft = plat.x === 405 || plat.x === 685 || plat.x === 1340;
          const isLedgeRight = plat.x + plat.w === 380 || plat.x + plat.w === 640 || plat.x + plat.w === 990;

          if (isLedgeLeft) {
            ctx.fillStyle = '#eab308';
            ctx.fillRect(px, plat.y + 4, 14, plat.h - 4);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(px + 4, plat.y + 4, 6, plat.h - 4);
          }
          if (isLedgeRight) {
            ctx.fillStyle = '#eab308';
            ctx.fillRect(px + plat.w - 14, plat.y + 4, 14, plat.h - 4);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(px + plat.w - 10, plat.y + 4, 6, plat.h - 4);
          }
        } else {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(px, plat.y, plat.w, plat.h);
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(px, plat.y, plat.w, 4);

          ctx.fillStyle = '#1e293b';
          for (let dx = 8; dx < plat.w - 8; dx += 24) {
            ctx.fillRect(px + dx, plat.y + 12, 4, 4);
          }
        }
      }

      // Render Central Floor (Camouflaged like normal floor; subtle hairline hint only!)
      if (crackedFloor && crackedFloor.active) {
        const cfx = crackedFloor.x - cam;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cfx, crackedFloor.y, crackedFloor.width, crackedFloor.height);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(cfx, crackedFloor.y, crackedFloor.width, 4);

        ctx.fillStyle = '#1e293b';
        for (let dx = 14; dx < crackedFloor.width - 14; dx += 24) {
          ctx.fillRect(cfx + dx, crackedFloor.y + 12, 4, 4);
        }

        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cfx + 85, crackedFloor.y + 4);
        ctx.lineTo(cfx + 95, crackedFloor.y + 11);
        ctx.lineTo(cfx + 110, crackedFloor.y + 6);
        ctx.stroke();
      } else {
        const cfx = 620 - cam;
        ctx.fillStyle = '#475569';
        ctx.fillRect(cfx - 6, 380, 6, 12);
        ctx.fillRect(cfx + 200, 380, 6, 12);
      }

      // Render Heavy Iron Crate
      const crx = crate.x - cam;
      if (crate.isSuspended || isUndergroundVisible || isFloorBroken) {
        ctx.save();
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(crx, crate.y, crate.w, crate.h);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(crx, crate.y, crate.w, crate.h);

        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(crx + 4, crate.y + 4, crate.w - 8, 6);
        ctx.fillStyle = '#0f172a';
        for (let sx = 6; sx < crate.w - 10; sx += 12) {
          ctx.fillRect(crx + sx, crate.y + 4, 6, 6);
        }

        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(crx + 4, crate.y + 14, 3, 3);
        ctx.fillRect(crx + crate.w - 7, crate.y + 14, 3, 3);
        ctx.fillRect(crx + 4, crate.y + crate.h - 7, 3, 3);
        ctx.fillRect(crx + crate.w - 7, crate.y + crate.h - 7, 3, 3);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('HEAVY 500KG', crx + crate.w / 2, crate.y + 26);
        ctx.restore();
      }

      // Render Bouncy Foams (H2O2)
      for (const foam of bouncyFoamsRef.current) {
        const fx = foam.x - cam;
        ctx.save();
        ctx.fillStyle = 'rgba(167, 243, 208, 0.45)';
        ctx.beginPath();
        ctx.roundRect(fx, foam.y, foam.width, foam.height, 12);
        ctx.fill();
        ctx.strokeStyle = '#6ee7b7';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#065f46';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('BOUNCE FOAM', fx + foam.width / 2, foam.y + foam.height / 2 + 3);
        ctx.restore();
      }

      // Render Interactive Dispensers, Tool Kit & Consoles
      for (const ent of interactivesRef.current) {
        const ex = ent.x - cam;
        if (ex + ent.width < 0 || ex > width) continue;

        if (ent.id === 'work_kit') {
          // Cosmo Bond Work Kit Box on Ground
          ctx.fillStyle = '#b45309';
          ctx.beginPath();
          ctx.roundRect(ex, ent.y + 8, ent.width, ent.height - 8, 6);
          ctx.fill();
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Handle
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 2;
          ctx.strokeRect(ex + 14, ent.y + 2, 16, 6);

          ctx.font = 'bold 7px monospace';
          ctx.fillStyle = '#fef3c7';
          ctx.textAlign = 'center';
          ctx.fillText('COSMO KIT', ex + ent.width / 2, ent.y + 22);

          ctx.font = '8px sans-serif';
          ctx.fillStyle = '#fde68a';
          ctx.fillText('[F] 습득', ex + ent.width / 2, ent.y - 4);
        } else if (ent.type === 'element_dispenser') {
          const elem = ent.elementGranted ? ELEMENTS[ent.elementGranted] : null;
          const elemColor = elem ? elem.color : '#38bdf8';

          // In Chapter 3, render overhead illuminated sign above the 4 dispensers (H, O, C, N)
          if (currentCh === 3 && ent.id === 'dispenser_h') {
            ctx.save();
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.fillRect(ex - 8, ent.y - 48, 258, 22);
            ctx.strokeStyle = '#a855f7';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(ex - 8, ent.y - 48, 258, 22);

            ctx.fillStyle = '#c084fc';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🔬 2급 입체 결합 원소 보급소 // ELEMENT DEPOT (H · O · C · N)', ex + 121, ent.y - 33);
            ctx.restore();
          }

          // In Chapter 2, render overhead illuminated sign above the 4 dispensers
          if (currentCh === 2 && ent.id === 'dispenser_h') {
            ctx.save();
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.fillRect(ex - 8, ent.y - 48, 258, 22);
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(ex - 8, ent.y - 48, 258, 22);

            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🔬 화학 원소 보급소 // ELEMENT SUPPLY DEPOT (H · O · Na · Cl)', ex + 121, ent.y - 33);
            ctx.restore();
          }

          // Main dispenser housing
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(ex, ent.y, ent.width, ent.height);
          ctx.strokeStyle = elemColor;
          ctx.lineWidth = 2.5;
          ctx.strokeRect(ex, ent.y, ent.width, ent.height);

          // Glowing internal liquid/gas cylinder
          const glowGrad = ctx.createLinearGradient(ex, ent.y + 8, ex, ent.y + ent.height - 20);
          glowGrad.addColorStop(0, `${elemColor}aa`);
          glowGrad.addColorStop(1, `${elemColor}22`);
          ctx.fillStyle = glowGrad;
          ctx.fillRect(ex + 6, ent.y + 8, ent.width - 12, ent.height - 24);

          // Atomic Symbol
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 20px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(ent.elementGranted || '', ex + ent.width / 2, ent.y + 42);

          // Dispenser Label Badge
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.fillRect(ex - 4, ent.y - 20, ent.width + 8, 16);
          ctx.strokeStyle = elemColor;
          ctx.lineWidth = 1;
          ctx.strokeRect(ex - 4, ent.y - 20, ent.width + 8, 16);

          ctx.font = 'bold 9px sans-serif';
          ctx.fillStyle = elemColor;
          ctx.fillText(`[F] ${ent.elementGranted}`, ex + ent.width / 2, ent.y - 8);
        } else if (ent.id === 'spark_igniter') {
          ctx.save();
          ctx.fillStyle = '#7c2d12';
          ctx.beginPath();
          ctx.roundRect(ex, ent.y, ent.width, ent.height, 8);
          ctx.fill();
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Spark glow center
          ctx.fillStyle = '#fde047';
          ctx.font = 'bold 18px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('⚡', ex + ent.width / 2, ent.y + 40);

          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.fillRect(ex - 35, ent.y - 28, ent.width + 70, 18);
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(ex - 35, ent.y - 28, ent.width + 70, 18);

          ctx.font = 'bold 9px sans-serif';
          ctx.fillStyle = '#fed7aa';
          ctx.fillText('스파크 점화기 [F]', ex + ent.width / 2, ent.y - 15);
          ctx.restore();
        } else if (ent.id === 'underground_exit') {
          if (!isUndergroundVisible) continue;

          ctx.fillStyle = '#1e1b4b';
          ctx.beginPath();
          ctx.roundRect(ex, ent.y, ent.width, ent.height, 10);
          ctx.fill();
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          const portalPulsing = 0.5 + Math.sin(Date.now() * 0.009) * 0.4;
          ctx.fillStyle = `rgba(192, 132, 252, ${portalPulsing})`;
          ctx.beginPath();
          ctx.arc(ex + ent.width / 2, ent.y + ent.height / 2, 12, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = 'bold 8px monospace';
          ctx.fillStyle = '#e9d5ff';
          ctx.textAlign = 'center';
          ctx.fillText('SECRET ESCAPE', ex + ent.width / 2, ent.y - 6);
        } else if (ent.id === 'gate_terminal') {
          ctx.fillStyle = '#064e3b';
          ctx.beginPath();
          ctx.roundRect(ex, ent.y, ent.width, ent.height, 8);
          ctx.fill();
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = '#10b981';
          ctx.fillRect(ex + 6, ent.y + 12, ent.width - 12, 16);
          ctx.font = 'bold 9px monospace';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText('OPEN', ex + ent.width / 2, ent.y + 24);

          ctx.font = 'bold 8px monospace';
          ctx.fillStyle = '#6ee7b7';
          ctx.fillText('SURFACE EXIT', ex + ent.width / 2, ent.y - 6);
        } else if (ent.id === 'ch2_exit') {
          ctx.save();
          // High-visibility green emergency airlock portal
          ctx.fillStyle = '#064e3b';
          ctx.beginPath();
          ctx.roundRect(ex, ent.y, ent.width, ent.height, 10);
          ctx.fill();
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Rotating hazard beacon light on top
          const beaconTime = Date.now() * 0.008;
          const beaconGlow = (Math.sin(beaconTime) + 1) * 0.5;
          ctx.fillStyle = `rgba(52, 211, 153, ${0.4 + beaconGlow * 0.6})`;
          ctx.beginPath();
          ctx.arc(ex + ent.width / 2, ent.y - 6, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Valve Wheel
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(ex + ent.width / 2, ent.y + 30, 15, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(ex + ent.width / 2 - 15, ent.y + 30);
          ctx.lineTo(ex + ent.width / 2 + 15, ent.y + 30);
          ctx.moveTo(ex + ent.width / 2, ent.y + 15);
          ctx.lineTo(ex + ent.width / 2, ent.y + 45);
          ctx.stroke();

          // Clear illuminated badge
          ctx.fillStyle = '#34d399';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('[EXIT]', ex + ent.width / 2, ent.y + 60);

          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.fillRect(ex - 35, ent.y - 28, ent.width + 70, 18);
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(ex - 35, ent.y - 28, ent.width + 70, 18);

          ctx.font = 'bold 9px sans-serif';
          ctx.fillStyle = '#a7f3d0';
          ctx.fillText('제3 정수 시설 수복 게이트 [F]', ex + ent.width / 2, ent.y - 15);
          ctx.restore();
        } else if (ent.id === 'ch3_exit') {
          ctx.save();
          // High-visibility golden victory gate
          ctx.fillStyle = '#312e81';
          ctx.beginPath();
          ctx.roundRect(ex, ent.y, ent.width, ent.height, 10);
          ctx.fill();
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Golden rotating beacon
          const beaconGlow = (Math.sin(Date.now() * 0.008) + 1) * 0.5;
          ctx.fillStyle = `rgba(251, 191, 36, ${0.4 + beaconGlow * 0.6})`;
          ctx.beginPath();
          ctx.arc(ex + ent.width / 2, ent.y - 6, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Victory Emblem
          ctx.fillStyle = '#fde047';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🏆', ex + ent.width / 2, ent.y + 35);

          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 10px monospace';
          ctx.fillText('[GATE]', ex + ent.width / 2, ent.y + 60);

          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.fillRect(ex - 35, ent.y - 28, ent.width + 70, 18);
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(ex - 35, ent.y - 28, ent.width + 70, 18);

          ctx.font = 'bold 9px sans-serif';
          ctx.fillStyle = '#fef08a';
          ctx.fillText('제4구역 수복 게이트 [F]', ex + ent.width / 2, ent.y - 15);
          ctx.restore();
        }
      }

      // Render Central Bonfire (Alkali Gas Fire - Chapter 1)
      if (fireObstacle) {
        const ox = fireObstacle.x - cam;
        if (fireObstacle.active) {
          const isBlue = isFlameBlueRef.current;
          const fireH = fireObstacle.height * flameIntensityRef.current;
          const fireTop = fireObstacle.y - (fireH - fireObstacle.height);

          ctx.save();
          // Fiery glow background
          const grad = ctx.createLinearGradient(ox, fireTop, ox + fireObstacle.width, fireObstacle.y + fireObstacle.height);
          grad.addColorStop(0, isBlue ? 'rgba(56, 189, 248, 0.45)' : 'rgba(239, 68, 68, 0.55)');
          grad.addColorStop(0.5, isBlue ? 'rgba(14, 165, 233, 0.65)' : 'rgba(249, 115, 22, 0.65)');
          grad.addColorStop(1, isBlue ? 'rgba(3, 105, 161, 0.85)' : 'rgba(185, 28, 28, 0.85)');
          ctx.fillStyle = grad;
          ctx.fillRect(ox, fireTop, fireObstacle.width, fireH);

          // Animated flame pillars / tongues
          const t = Date.now() * 0.006;
          for (let fx = ox + 4; fx < ox + fireObstacle.width - 4; fx += 11) {
            const wave = Math.sin(t + fx * 0.15) * 8;
            ctx.fillStyle = isBlue ? '#7dd3fc' : '#fbbf24';
            ctx.fillRect(fx, fireTop + 10 + wave, 6, fireH - 15);
            ctx.fillStyle = isBlue ? '#38bdf8' : '#ea580c';
            ctx.fillRect(fx + 1, fireTop + 25 + wave, 4, fireH - 30);
          }

          // Wall boundary lines
          ctx.strokeStyle = isBlue ? '#38bdf8' : '#f97316';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(ox, fireTop, fireObstacle.width, fireH);

          // Danger Badge
          const badgeY = fireTop + 24;
          ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
          ctx.fillRect(ox - 55, badgeY, fireObstacle.width + 110, 24);
          ctx.strokeStyle = isBlue ? '#38bdf8' : '#ef4444';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(ox - 55, badgeY, fireObstacle.width + 110, 24);

          ctx.fillStyle = isBlue ? '#7dd3fc' : '#fca5a5';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🔥 맹렬한 불길「파이로-배리어」', ox + fireObstacle.width / 2, badgeY + 16);
          ctx.restore();
        } else if (crackedFloor && crackedFloor.active) {
          ctx.save();
          // Extinguished safe passage marker
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(ox, fireObstacle.y, fireObstacle.width, fireObstacle.height);
          ctx.setLineDash([]);

          ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
          ctx.fillRect(ox - 45, 330, fireObstacle.width + 90, 24);
          ctx.strokeStyle = '#38bdf8';
          ctx.strokeRect(ox - 45, 330, fireObstacle.width + 90, 24);

          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('✓ 화재 진압 완료 (통행 가능)', ox + fireObstacle.width / 2, 346);
          ctx.restore();
        }
      }

      // CHAPTER 2 OBSTACLES RENDERING (HIGH CONTRAST & HIGH VISIBILITY)
      if (currentCh === 2) {
        // 1. Rust Gate (녹슨 철창)
        const rustGate = obstaclesRef.current.find((o) => o.id === 'rust_gate');
        if (rustGate && rustGate.active) {
          const rgx = rustGate.x - cam;
          ctx.save();
          // Metal post base
          ctx.fillStyle = '#292524';
          ctx.fillRect(rgx, rustGate.y, rustGate.width, rustGate.height);
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(rgx, rustGate.y, rustGate.width, rustGate.height);

          // Rust bars with metallic highlights
          for (let bx = rgx + 4; bx < rgx + rustGate.width - 2; bx += 7) {
            ctx.fillStyle = '#78350f';
            ctx.fillRect(bx, rustGate.y, 3, rustGate.height);
            ctx.fillStyle = '#ea580c';
            ctx.fillRect(bx + 1, rustGate.y + 15, 2, 25);
            ctx.fillRect(bx + 1, rustGate.y + 60, 2, 35);
          }

          // Floating High-Visibility Badge at eye level
          const badgeY = 230;
          ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
          ctx.fillRect(rgx - 70, badgeY, rustGate.width + 140, 24);
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(rgx - 70, badgeY, rustGate.width + 140, 24);

          ctx.font = 'bold 10px sans-serif';
          ctx.fillStyle = '#fb923c';
          ctx.textAlign = 'center';
          ctx.fillText('🔒 1구역: 페럼 러스트 게이트', rgx + rustGate.width / 2, badgeY + 16);
          ctx.restore();
        }

        // 2. Grease Monster (불포화 지방산 겔 복합체「세범 글루토니」)
        const greaseMonster = obstaclesRef.current.find((o) => o.id === 'grease_monster');
        if (greaseMonster && greaseMonster.active) {
          const gmx = greaseMonster.x - cam;
          const time = Date.now() * 0.003;
          const wobble = Math.sin(time) * 4;
          ctx.save();

          // Vibrant glowing translucent amber sludge
          ctx.fillStyle = 'rgba(245, 158, 11, 0.92)';
          ctx.beginPath();
          ctx.roundRect(gmx - wobble / 2, greaseMonster.y, greaseMonster.width + wobble, greaseMonster.height, [18, 18, 4, 4]);
          ctx.fill();
          ctx.strokeStyle = enemyCooldownsRef.current.greaseWarning > 0 ? '#ef4444' : '#fde047';
          ctx.lineWidth = enemyCooldownsRef.current.greaseWarning > 0 ? 3.5 : 2.5;
          ctx.stroke();

          // Lipid pulse warning glow
          if (enemyCooldownsRef.current.greaseWarning > 0) {
            ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
            ctx.fillRect(gmx - wobble / 2 - 4, greaseMonster.y - 4, greaseMonster.width + wobble + 8, greaseMonster.height + 8);
          }

          // Lipid bubbles & oily reflections
          ctx.fillStyle = '#fef9c3';
          for (let gy = greaseMonster.y + 15; gy < greaseMonster.y + greaseMonster.height - 10; gy += 20) {
            ctx.beginPath();
            ctx.arc(gmx + 18 + Math.sin(gy + time * 1.5) * 8, gy, 6, 0, Math.PI * 2);
            ctx.fill();
          }

          // Floating High-Visibility Badge at eye level
          const gBadgeY = 230;
          const isWarning = enemyCooldownsRef.current.greaseWarning > 0;
          ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
          ctx.fillRect(gmx - 85, gBadgeY, greaseMonster.width + 170, 24);
          ctx.strokeStyle = isWarning ? '#ef4444' : '#eab308';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(gmx - 85, gBadgeY, greaseMonster.width + 170, 24);

          ctx.font = 'bold 10px sans-serif';
          ctx.fillStyle = isWarning ? '#ef4444' : '#fde047';
          ctx.textAlign = 'center';
          ctx.fillText(
            isWarning ? '⚠ [경고] 지질 펄스 파동 충전 중! (점프 준비)' : '🧈 2구역: 세범 글루토니 (슬러지 사격 중)',
            gmx + greaseMonster.width / 2,
            gBadgeY + 16
          );
          ctx.restore();
        }

        // 3. Water Puddle / Canal (수성 냉각 런웨이)
        const waterPuddle = obstaclesRef.current.find((o) => o.id === 'water_puddle');
        if (waterPuddle && waterPuddle.active) {
          const wpx = waterPuddle.x - cam;
          ctx.save();
          // Basin trough
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(wpx, waterPuddle.y, waterPuddle.width, waterPuddle.height);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.strokeRect(wpx, waterPuddle.y, waterPuddle.width, waterPuddle.height);

          // Animated luminous caustic water surface
          const wavePhase = (Date.now() * 0.003) % (Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let wx = 0; wx < waterPuddle.width; wx += 6) {
            const wy = waterPuddle.y + 3 + Math.sin(wx * 0.1 + wavePhase) * 2;
            if (wx === 0) ctx.moveTo(wpx + wx, wy);
            else ctx.lineTo(wpx + wx, wy);
          }
          ctx.stroke();

          // Floating High-Visibility Sign
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.fillRect(wpx + waterPuddle.width / 2 - 95, waterPuddle.y - 24, 190, 20);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(wpx + waterPuddle.width / 2 - 95, waterPuddle.y - 24, 190, 20);

          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('3구역: 수성 냉각 런웨이', wpx + waterPuddle.width / 2, waterPuddle.y - 10);
          ctx.restore();
        }

        // 4. Heavy Boulder Wall (카보네이트 모놀리스)
        const heavyBoulder = obstaclesRef.current.find((o) => o.id === 'heavy_boulder');
        if (heavyBoulder && heavyBoulder.active) {
          const hbx = heavyBoulder.x - cam;
          ctx.save();
          ctx.fillStyle = '#334155';
          ctx.beginPath();
          ctx.roundRect(hbx, heavyBoulder.y, heavyBoulder.width, heavyBoulder.height, [8, 8, 2, 2]);
          ctx.fill();
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // High-contrast glowing fissure cracks
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(hbx + 12, heavyBoulder.y + 15);
          ctx.lineTo(hbx + 26, heavyBoulder.y + 45);
          ctx.lineTo(hbx + 20, heavyBoulder.y + 85);
          ctx.moveTo(hbx + 32, heavyBoulder.y + 35);
          ctx.lineTo(hbx + 40, heavyBoulder.y + 70);
          ctx.stroke();

          // Floating High-Visibility Badge at eye level
          const bBadgeY = 230;
          ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
          ctx.fillRect(hbx - 85, bBadgeY, heavyBoulder.width + 170, 24);
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(hbx - 85, bBadgeY, heavyBoulder.width + 170, 24);

          ctx.fillStyle = '#f1f5f9';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🪨 3구역: 카보네이트 모놀리스', hbx + heavyBoulder.width / 2, bBadgeY + 16);
        }

        // 5. Acid Moat (하이드로클로릭 애시드 핏)
        const acidMoat = obstaclesRef.current.find((o) => o.id === 'acid_moat');
        if (acidMoat) {
          const amx = acidMoat.x - cam;
          ctx.save();
          if (acidMoat.active) {
            // Lethal boiling reddish-orange hydrochloric acid
            const acidGrad = ctx.createLinearGradient(amx, acidMoat.y, amx, acidMoat.y + acidMoat.height);
            acidGrad.addColorStop(0, '#ef4444');
            acidGrad.addColorStop(0.4, '#b91c1c');
            acidGrad.addColorStop(1, '#450a0a');
            ctx.fillStyle = acidGrad;
            ctx.fillRect(amx, acidMoat.y, acidMoat.width, acidMoat.height);
            ctx.strokeStyle = '#fca5a5';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(amx, acidMoat.y, acidMoat.width, acidMoat.height);

            // Red hazard light poles on left & right banks
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(amx - 6, acidMoat.y - 18, 6, 20);
            ctx.fillRect(amx + acidMoat.width, acidMoat.y - 18, 6, 20);

            const time = Date.now() * 0.005;
            ctx.fillStyle = '#fca5a5';
            for (let i = 0; i < 9; i++) {
              const bx = amx + ((i * 42 + Date.now() * 0.06) % acidMoat.width);
              const by = acidMoat.y + 12 + Math.sin(time + i) * 6;
              ctx.beginPath();
              ctx.arc(bx, by, 4 + (i % 3) * 2, 0, Math.PI * 2);
              ctx.fill();
            }

            // High-visibility Danger Badge
            ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
            ctx.fillRect(amx + acidMoat.width / 2 - 150, acidMoat.y - 32, 300, 26);
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            ctx.strokeRect(amx + acidMoat.width / 2 - 150, acidMoat.y - 32, 300, 26);

            ctx.fillStyle = '#fee2e2';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('⚠ 4구역: 하이드로클로릭 애시드 핏', amx + acidMoat.width / 2, acidMoat.y - 15);
          } else {
            // Neutralized calm blue saltwater pool
            const waterGrad = ctx.createLinearGradient(amx, acidMoat.y, amx, acidMoat.y + acidMoat.height);
            waterGrad.addColorStop(0, '#0284c7');
            waterGrad.addColorStop(1, '#0c4a6e');
            ctx.fillStyle = waterGrad;
            ctx.fillRect(amx, acidMoat.y, acidMoat.width, acidMoat.height);
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(amx, acidMoat.y, acidMoat.width, acidMoat.height);

            // High-visibility Cleared Badge
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.fillRect(amx + acidMoat.width / 2 - 120, acidMoat.y + acidMoat.height - 28, 240, 20);
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(amx + acidMoat.width / 2 - 120, acidMoat.y + acidMoat.height - 28, 240, 20);

            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('중화 완료: 맑은 소금물 수로', amx + acidMoat.width / 2, acidMoat.y + acidMoat.height - 14);

            // 3 Salt Crystal Platforms (x: 1040, 1140, 1240)
            const saltPositions = [1040, 1140, 1240];
            saltPositions.forEach((spX, idx) => {
              const spScreenX = spX - cam;
              const spY = idx === 1 ? 355 : 380;
              // Gleaming white-cyan crystal pedestal
              ctx.fillStyle = '#f8fafc';
              ctx.fillRect(spScreenX, spY, 70, 20);
              ctx.strokeStyle = '#38bdf8';
              ctx.lineWidth = 2.5;
              ctx.strokeRect(spScreenX, spY, 70, 20);

              // Shimmer lines
              ctx.strokeStyle = '#0284c7';
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.moveTo(spScreenX + 5, spY + 5);
              ctx.lineTo(spScreenX + 25, spY + 15);
              ctx.moveTo(spScreenX + 45, spY + 5);
              ctx.lineTo(spScreenX + 65, spY + 15);
              ctx.stroke();

              ctx.fillStyle = '#0f172a';
              ctx.font = 'bold 10px monospace';
              ctx.textAlign = 'center';
              ctx.fillText('NaCl 소금', spScreenX + 35, spY + 14);
            });
          }
          ctx.restore();
        }
      }

      // CHAPTER 3 OBSTACLES RENDERING (HIGH CONTRAST & VISIBILITY)
      if (currentCh === 3) {
        // 1. Titanium Crate (초경량/고밀도 티타늄 상자 + 부양 가스 풍선)
        const titaniumCrate = obstaclesRef.current.find((o) => o.id === 'titanium_crate');
        if (titaniumCrate && titaniumCrate.active) {
          const tcx = titaniumCrate.x - cam;
          const tcy = titaniumCrate.y;
          ctx.save();

          // Heavy ceiling containment bulkhead & guide shaft from y: 0 to tcy
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(tcx - 8, 0, titaniumCrate.width + 16, Math.max(0, tcy));
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 3;
          ctx.strokeRect(tcx - 8, 0, titaniumCrate.width + 16, Math.max(0, tcy));

          // Guide rail warning teeth on bulkhead
          ctx.fillStyle = '#fbbf24';
          for (let ry = 8; ry < tcy - 8; ry += 24) {
            ctx.fillRect(tcx - 6, ry, 6, 10);
            ctx.fillRect(tcx + titaniumCrate.width, ry, 6, 10);
          }

          // Main titanium block with metallic tech lines
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.roundRect(tcx, tcy, titaniumCrate.width, titaniumCrate.height, 6);
          ctx.fill();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Titanium reinforcement ribs
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(tcx + 6, tcy + 8, titaniumCrate.width - 12, titaniumCrate.height - 16);

          // Diagonal lattice cross
          ctx.beginPath();
          ctx.moveTo(tcx + 6, tcy + 8);
          ctx.lineTo(tcx + titaniumCrate.width - 6, tcy + titaniumCrate.height - 8);
          ctx.moveTo(tcx + titaniumCrate.width - 6, tcy + 8);
          ctx.lineTo(tcx + 6, tcy + titaniumCrate.height - 8);
          ctx.stroke();

          // If floating: draw gas balloon bags tethered to top corners
          if (titaniumCrateRef.current.isFloating) {
            const time = Date.now() * 0.005;
            const balloonColors = ['#38bdf8', '#34d399', '#f472b6'];
            const balloonOffsets = [-15, 12, 38];

            balloonOffsets.forEach((bxOff, bIdx) => {
              const sway = Math.sin(time + bIdx * 1.5) * 6;
              const bx = tcx + bxOff + sway;
              const by = tcy - 55 - Math.cos(time + bIdx) * 5;

              // String
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.moveTo(tcx + 10 + bIdx * 20, tcy);
              ctx.quadraticCurveTo(bx, by + 20, bx, by + 12);
              ctx.stroke();

              // Balloon
              ctx.fillStyle = balloonColors[bIdx % balloonColors.length];
              ctx.beginPath();
              ctx.ellipse(bx, by, 14, 18, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 1.5;
              ctx.stroke();

              // Highlight reflection
              ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
              ctx.beginPath();
              ctx.ellipse(bx - 4, by - 6, 4, 6, -0.4, 0, Math.PI * 2);
              ctx.fill();
            });
          }

          // Overhead Badge
          const badgeY = tcy - (titaniumCrateRef.current.isFloating ? 85 : 30);
          ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
          ctx.fillRect(tcx - 45, badgeY, titaniumCrate.width + 90, 24);
          ctx.strokeStyle = titaniumCrateRef.current.isFloating ? '#34d399' : '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(tcx - 45, badgeY, titaniumCrate.width + 90, 24);

          ctx.font = 'bold 10px sans-serif';
          ctx.fillStyle = titaniumCrateRef.current.isFloating ? '#6ee7b7' : '#7dd3fc';
          ctx.textAlign = 'center';
          ctx.fillText(
            titaniumCrateRef.current.isFloating ? '🎈 1구역: 타이탄 블록-X (부유 중)' : '📦 1구역: 타이탄 블록-X',
            tcx + titaniumCrate.width / 2,
            badgeY + 16
          );
          ctx.restore();
        }

        // 2. Boiling Swamp (써멀 톡식 웰)
        const boilingSwamp = obstaclesRef.current.find((o) => o.id === 'boiling_swamp');
        if (boilingSwamp) {
          const bsx = boilingSwamp.x - cam;
          ctx.save();

          if (!isSwampFrozenRef.current) {
            // Boiling toxic bubbling purple/green muck
            const swampGrad = ctx.createLinearGradient(bsx, boilingSwamp.y, bsx, boilingSwamp.y + boilingSwamp.height);
            swampGrad.addColorStop(0, '#581c87');
            swampGrad.addColorStop(0.5, '#3b0764');
            swampGrad.addColorStop(1, '#1e1b4b');
            ctx.fillStyle = swampGrad;
            ctx.fillRect(bsx, boilingSwamp.y, boilingSwamp.width, boilingSwamp.height);
            ctx.strokeStyle = '#a855f7';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(bsx, boilingSwamp.y, boilingSwamp.width, boilingSwamp.height);

            // Rising toxic gas bubbles and steam
            const time = Date.now() * 0.006;
            ctx.fillStyle = '#d8b4fe';
            for (let i = 0; i < 7; i++) {
              const bx = bsx + ((i * 40 + Date.now() * 0.05) % boilingSwamp.width);
              const by = boilingSwamp.y + 10 + Math.sin(time + i) * 6;
              ctx.beginPath();
              ctx.arc(bx, by, 4 + (i % 3) * 2, 0, Math.PI * 2);
              ctx.fill();
            }

            // Danger Badge
            ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
            ctx.fillRect(bsx + boilingSwamp.width / 2 - 140, boilingSwamp.y - 30, 280, 24);
            ctx.strokeStyle = '#c084fc';
            ctx.lineWidth = 2;
            ctx.strokeRect(bsx + boilingSwamp.width / 2 - 140, boilingSwamp.y - 30, 280, 24);

            ctx.fillStyle = '#f3e8ff';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('⚠ 2구역: 써멀 톡식 웰 (급속 흡열 냉각 물질 필요) ⚠', bsx + boilingSwamp.width / 2, boilingSwamp.y - 14);
          } else {
            // Frozen solid crystalline dry-ice sheet
            const iceGrad = ctx.createLinearGradient(bsx, boilingSwamp.y, bsx, boilingSwamp.y + boilingSwamp.height);
            iceGrad.addColorStop(0, '#e0f2fe');
            iceGrad.addColorStop(0.5, '#7dd3fc');
            iceGrad.addColorStop(1, '#0284c7');
            ctx.fillStyle = iceGrad;
            ctx.fillRect(bsx, boilingSwamp.y, boilingSwamp.width, boilingSwamp.height);
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3;
            ctx.strokeRect(bsx, boilingSwamp.y, boilingSwamp.width, boilingSwamp.height);

            // Frost crystal shimmer lines
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            for (let ix = bsx + 10; ix < bsx + boilingSwamp.width - 10; ix += 35) {
              ctx.beginPath();
              ctx.moveTo(ix, boilingSwamp.y + 4);
              ctx.lineTo(ix + 18, boilingSwamp.y + 20);
              ctx.stroke();
            }

            // Slide Cleared Badge
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.fillRect(bsx + boilingSwamp.width / 2 - 130, boilingSwamp.y - 30, 260, 24);
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(bsx + boilingSwamp.width / 2 - 130, boilingSwamp.y - 30, 260, 24);

            ctx.fillStyle = '#bae6fd';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🧊 2구역: 써멀 톡식 웰 (급속 동결 빙판길)', bsx + boilingSwamp.width / 2, boilingSwamp.y - 14);
          }
          ctx.restore();
        }

        // 3. Cockroach Swarm (키틴 브루드 네크로)
        const cockroachSwarm = obstaclesRef.current.find((o) => o.id === 'cockroach_swarm');
        if (cockroachSwarm && cockroachSwarm.active) {
          const csx = cockroachSwarm.x - cam;
          ctx.save();
          const time = Date.now() * 0.008;

          // Animated creepy scurrying cockroach bugs
          for (let i = 0; i < 9; i++) {
            const bx = csx + 10 + (i % 3) * 30 + Math.sin(time + i) * 4;
            const by = cockroachSwarm.y + 15 + Math.floor(i / 3) * 16 + Math.cos(time + i * 2) * 3;

            // Bug body
            ctx.fillStyle = '#451a03';
            ctx.beginPath();
            ctx.ellipse(bx, by, 9, 6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Antennae
            ctx.strokeStyle = '#b45309';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(bx + 7, by);
            ctx.lineTo(bx + 14, by - 5 + Math.sin(time * 2 + i) * 3);
            ctx.moveTo(bx + 7, by);
            ctx.lineTo(bx + 14, by + 5 + Math.cos(time * 2 + i) * 3);
            ctx.stroke();
          }

          // Danger Badge
          ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
          ctx.fillRect(csx - 45, cockroachSwarm.y - 28, cockroachSwarm.width + 90, 22);
          ctx.strokeStyle = '#eab308';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(csx - 45, cockroachSwarm.y - 28, cockroachSwarm.width + 90, 22);

          ctx.font = 'bold 10px sans-serif';
          ctx.fillStyle = '#fde047';
          ctx.textAlign = 'center';
          ctx.fillText('🪳 3구역: 키틴 브루드 네크로', csx + cockroachSwarm.width / 2, cockroachSwarm.y - 13);
          ctx.restore();
        }

        // 4. Boss 'Plastic-Tree' (비정질 합성고분자 침식수「아르보르 플라스티카」)
        const plasticTree = obstaclesRef.current.find((o) => o.id === 'plastic_tree');
        if (plasticTree) {
          const ptx = plasticTree.x - cam;
          const pty = plasticTree.y;
          ctx.save();

          if (bossRef.current.isBurning) {
            // Raging inferno firestorm consuming the entire tree!
            const fireH = plasticTree.height + 40;
            ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
            ctx.fillRect(ptx - 20, pty - 40, plasticTree.width + 40, fireH);

            // Flashing fire pillars
            for (let fx = ptx - 15; fx < ptx + plasticTree.width + 15; fx += 18) {
              const h = fireH * (0.7 + Math.random() * 0.3);
              ctx.fillStyle = Math.random() > 0.4 ? '#f97316' : '#eab308';
              ctx.fillRect(fx, pty + plasticTree.height - h, 14, h);
            }

            // High-visibility burning badge
            ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
            ctx.fillRect(ptx - 65, pty - 60, plasticTree.width + 130, 26);
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            ctx.strokeRect(ptx - 65, pty - 60, plasticTree.width + 130, 26);

            ctx.fillStyle = '#fee2e2';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🔥 APEX: 아르보르 플라스티카 전신 소각 중!! 🔥', ptx + plasticTree.width / 2, pty - 43);
          } else if (plasticTree.active) {
            // Boss trunk & predatory vines
            const time = Date.now() * 0.003;
            const sway = Math.sin(time) * 5;

            // Thick fibrous mutant trunk
            ctx.fillStyle = '#14532d';
            ctx.beginPath();
            ctx.roundRect(ptx + 20, pty + 50, plasticTree.width - 40, plasticTree.height - 50, 10);
            ctx.fill();
            ctx.strokeStyle = '#15803d';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Writhing pitcher-plant carnivorous maw on top
            ctx.fillStyle = '#831843';
            ctx.beginPath();
            ctx.ellipse(ptx + plasticTree.width / 2 + sway, pty + 40, 48, 36, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#db2777';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Tooth-like jagged spikes inside maw
            ctx.fillStyle = '#fce7f3';
            for (let i = 0; i < 7; i++) {
              ctx.fillRect(ptx + 20 + i * 11, pty + 35, 4, 10);
            }

            // Writhing vine tendrils on left and right
            ctx.strokeStyle = '#16a34a';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(ptx + 25, pty + 100);
            ctx.quadraticCurveTo(ptx - 20 + sway * 2, pty + 140, ptx - 10, pty + 180);
            ctx.moveTo(ptx + plasticTree.width - 25, pty + 100);
            ctx.quadraticCurveTo(ptx + plasticTree.width + 20 - sway * 2, pty + 140, ptx + plasticTree.width + 10, pty + 180);
            ctx.stroke();

            // If soaked with ethanol: glowing violet/amber iridescent shimmer and dripping fuel!
            if (bossRef.current.isSoaked) {
              ctx.fillStyle = 'rgba(192, 132, 252, 0.45)';
              ctx.fillRect(ptx - 10, pty, plasticTree.width + 20, plasticTree.height);
              ctx.strokeStyle = '#c084fc';
              ctx.lineWidth = 2.5;
              ctx.strokeRect(ptx - 10, pty, plasticTree.width + 20, plasticTree.height);

              // Fuel dripping droplets
              ctx.fillStyle = '#e9d5ff';
              for (let d = 0; d < 4; d++) {
                const dy = (Date.now() * 0.08 + d * 45) % plasticTree.height;
                ctx.beginPath();
                ctx.arc(ptx + 15 + d * 25, pty + dy, 3, 0, Math.PI * 2);
                ctx.fill();
              }
            }

            // High-visibility Boss Badge
            const isSoaked = bossRef.current.isSoaked;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
            ctx.fillRect(ptx - 70, pty - 28, plasticTree.width + 140, 24);
            ctx.strokeStyle = isSoaked ? '#c084fc' : '#22c55e';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(ptx - 70, pty - 28, plasticTree.width + 140, 24);

            ctx.font = 'bold 10px sans-serif';
            ctx.fillStyle = isSoaked ? '#e9d5ff' : '#86efac';
            ctx.textAlign = 'center';
            ctx.fillText(
              isSoaked ? '🥀 APEX: 아르보르 플라스티카 [연료 포화 완료! 점화 대기]' : '🥀 APEX: 아르보르 플라스티카',
              ptx + plasticTree.width / 2,
              pty - 13
            );
          } else {
            // Defeated white ash pile with glowing embers
            ctx.fillStyle = '#475569';
            ctx.beginPath();
            ctx.ellipse(ptx + plasticTree.width / 2, pty + plasticTree.height - 10, 55, 15, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Glowing ember spots
            ctx.fillStyle = '#f97316';
            ctx.fillRect(ptx + plasticTree.width / 2 - 20, pty + plasticTree.height - 12, 6, 4);
            ctx.fillRect(ptx + plasticTree.width / 2 + 10, pty + plasticTree.height - 10, 5, 3);

            // Cleared Badge
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.fillRect(ptx - 45, pty + plasticTree.height - 45, plasticTree.width + 90, 20);
            ctx.strokeStyle = '#34d399';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(ptx - 45, pty + plasticTree.height - 45, plasticTree.width + 90, 20);

            ctx.font = 'bold 10px sans-serif';
            ctx.fillStyle = '#6ee7b7';
            ctx.textAlign = 'center';
            ctx.fillText('✓ 아르보르 플라스티카 전신 소각 완료', ptx + plasticTree.width / 2, pty + plasticTree.height - 31);
          }
          ctx.restore();
        }
      }

      // Render Shockwaves
      shockwavesRef.current.forEach((sw) => {
        ctx.save();
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(sw.x - cam, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // Render Flying Lethal Embers
      lethalEmbersRef.current.forEach((emb) => {
        ctx.save();
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(emb.x - cam, emb.y, emb.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Render Particles
      particlesRef.current.forEach((part) => {
        const px = part.x - cam;
        const alpha = 1 - part.life / part.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = part.color;
        ctx.beginPath();
        ctx.arc(px, part.y, part.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Render Ground Hazards (Boss Thorns & Telegraph)
      groundHazardsRef.current.forEach((gh) => {
        const ghx = gh.x - cam;
        ctx.save();
        if (gh.warnTimer > 0) {
          // Warning Telegraph (Blinking Red Strip on ground)
          const blink = Math.sin(Date.now() * 0.02) * 0.5 + 0.5;
          ctx.fillStyle = `rgba(239, 68, 68, ${0.3 + blink * 0.4})`;
          ctx.fillRect(ghx, gh.y - 12, gh.width, 16);
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.strokeRect(ghx, gh.y - 12, gh.width, 16);

          ctx.fillStyle = '#fee2e2';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('⚠ 가시 급습 경고 ⚠', ghx + gh.width / 2, gh.y - 18);
        } else if (gh.eruptTimer > 0) {
          // Erupted lethal jagged resin spikes!
          const spikeH = gh.height * Math.min(1, (35 - gh.eruptTimer) / 6);
          ctx.fillStyle = '#15803d';
          ctx.beginPath();
          ctx.moveTo(ghx, gh.y);
          ctx.lineTo(ghx + gh.width * 0.25, gh.y - spikeH);
          ctx.lineTo(ghx + gh.width * 0.5, gh.y - 6);
          ctx.lineTo(ghx + gh.width * 0.75, gh.y - spikeH * 1.15);
          ctx.lineTo(ghx + gh.width, gh.y);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#86efac';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Spikes tip glow
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(ghx + gh.width * 0.25 - 2, gh.y - spikeH - 2, 4, 4);
          ctx.fillRect(ghx + gh.width * 0.75 - 2, gh.y - spikeH * 1.15 - 2, 4, 4);
        }
        ctx.restore();
      });

      // Render Enemy Projectiles
      enemyProjectilesRef.current.forEach((ep) => {
        const epx = ep.x - cam;
        ctx.save();

        if (ep.type === 'grease_spit') {
          // Bubbly viscous green/yellow sludge blob
          ctx.fillStyle = ep.color;
          ctx.beginPath();
          ctx.arc(epx, ep.y, ep.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#bef264';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.beginPath();
          ctx.arc(epx - 2, ep.y - 2, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (ep.type === 'grease_wave') {
          // Rolling ground energy shockwave
          ctx.fillStyle = 'rgba(234, 179, 8, 0.85)';
          ctx.beginPath();
          ctx.arc(epx, ep.y, ep.radius, Math.PI * 0.5, Math.PI * 1.5);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        } else if (ep.type === 'chitin_stinger') {
          // Sharp chitin dart with speed trail
          ctx.fillStyle = ep.color;
          ctx.beginPath();
          ctx.moveTo(epx - ep.radius * 2, ep.y);
          ctx.lineTo(epx + ep.radius, ep.y - ep.radius);
          ctx.lineTo(epx + ep.radius, ep.y + ep.radius);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#fef3c7';
          ctx.lineWidth = 1;
          ctx.stroke();
        } else if (ep.type === 'boss_volley') {
          // Crystalline polymer purple diamond
          ctx.fillStyle = '#c084fc';
          ctx.beginPath();
          ctx.moveTo(epx - ep.radius * 1.8, ep.y);
          ctx.lineTo(epx, ep.y - ep.radius);
          ctx.lineTo(epx + ep.radius * 1.8, ep.y);
          ctx.lineTo(epx, ep.y + ep.radius);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#f472b6';
          ctx.lineWidth = 1.8;
          ctx.stroke();
        } else if (ep.type === 'boss_spray') {
          // Heavy pulsating toxic orb
          ctx.fillStyle = '#db2777';
          ctx.beginPath();
          ctx.arc(epx, ep.y, ep.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fbcfe8';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.restore();
      });

      // Render Projectiles
      projectilesRef.current.forEach((proj) => {
        const prx = proj.x - cam;
        ctx.save();
        ctx.fillStyle = proj.molecule.color;
        ctx.beginPath();
        ctx.arc(prx, proj.y, proj.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(proj.molecule.formula, prx, proj.y - 10);
        ctx.restore();
      });

      // Render Player Character - only if alive
      if (!isDeadRef.current) {
        const plx = p.x - cam;
        ctx.save();

        // Flash opacity when taking damage / in i-frames
        if (enemyCooldownsRef.current.playerInvulnerableTimer > 0) {
          if (Math.floor(Date.now() / 60) % 2 === 0) {
            ctx.globalAlpha = 0.35;
          }
        }

        // Personal Headlight / Flashlight Aura in Chapter 2 for high visibility
        if (currentCh === 2) {
          const torchGrad = ctx.createRadialGradient(
            plx + p.width / 2,
            p.y + p.height / 2,
            10,
            plx + p.width / 2,
            p.y + p.height / 2,
            165
          );
          torchGrad.addColorStop(0, 'rgba(56, 189, 248, 0.32)');
          torchGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.10)');
          torchGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = torchGrad;
          ctx.beginPath();
          ctx.arc(plx + p.width / 2, p.y + p.height / 2, 165, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.beginPath();
        ctx.arc(plx + p.width / 2, p.y + p.height / 2, 20, 0, Math.PI * 2);
        ctx.fill();

        // Blue-collar nano-robot body with Cosmo Bond yellow hardhat/visor
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(plx + 4, p.y + 6, p.width - 8, p.height - 12);

        // Yellow worker visor
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(plx + 2, p.y + 3, p.width - 4, 5);

        ctx.fillStyle = '#38bdf8';
        const eyeX = p.facing === 'right' ? plx + p.width - 9 : plx + 3;
        ctx.fillRect(eyeX, p.y + 11, 6, 6);

        const orbitAngle = Date.now() * 0.006;
        const elX = plx + p.width / 2 + Math.cos(orbitAngle) * 16;
        const elY = p.y + p.height / 2 + Math.sin(orbitAngle) * 10;
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(elX, elY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Trajectory Arc when Aiming (Hold R)
        if (p.isAiming) {
          ctx.save();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]);

          const startX = p.x + (p.facing === 'right' ? p.width + 4 : -4);
          const startY = p.y + p.height / 2 - 6;
          const vx = Math.cos(p.aimAngle) * p.aimPower;
          const vy = Math.sin(p.aimAngle) * p.aimPower;
          const simGravity = 0.38;

          ctx.beginPath();
          ctx.moveTo(startX - cam, startY);

          let simX = startX;
          let simY = startY;
          let simVy = vy;

          for (let step = 0; step < 28; step++) {
            simX += vx;
            simVy += simGravity;
            simY += simVy;
            ctx.lineTo(simX - cam, simY);
            if (simY > 440) break;
          }
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(simX - cam, simY, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = 'bold 11px monospace';
          ctx.fillStyle = '#38bdf8';
          ctx.fillText(`RELEASE [R] TO THROW`, plx + p.width / 2, p.y - 16);
          ctx.restore();
        }

        // Render Prompt for Interaction if in range
        if (p.canInteractWith && !p.isAiming) {
          const ent = p.canInteractWith;
          ctx.save();
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1;

          const promptW = ctx.measureText(ent.promptText).width + 24;
          const promptX = ent.x - cam + ent.width / 2 - promptW / 2;
          const promptY = ent.y - 32;

          ctx.fillRect(promptX, promptY, promptW, 24);
          ctx.strokeRect(promptX, promptY, promptW, 24);

          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(ent.promptText, ent.x - cam + ent.width / 2, promptY + 16);
          ctx.restore();
        }

        // Render In-World [Z] 자세히 보기 Tactical Prompt when within close range
        if (nearbyInspectableRef.current && !p.isAiming) {
          const obs = nearbyInspectableRef.current.obstacle;
          ctx.save();
          const obsScreenX = obs.x - cam;
          const promptY = Math.max(35, obs.y - 10);
          const pulse = Math.sin(Date.now() * 0.007) * 0.15 + 0.85;

          ctx.fillStyle = `rgba(15, 23, 42, ${0.94 * pulse})`;
          const shortName = obs.name.includes('「') ? obs.name.split('「')[1].replace('」', '') : obs.name;
          const labelText = `🔍 [Z] ${shortName} 자세히 보기`;
          const pWidth = ctx.measureText(labelText).width + 24;
          const pLeft = obsScreenX + obs.width / 2 - pWidth / 2;

          ctx.beginPath();
          ctx.roundRect(pLeft, promptY - 24, pWidth, 22, 6);
          ctx.fill();
          ctx.strokeStyle = '#22d3ee';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#67e8f9';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(labelText, obsScreenX + obs.width / 2, promptY - 9);
          ctx.restore();
        }
      } else {
        // Render Death Screen Overlay on Canvas
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.fillRect(0, 0, width, height + 80);

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.strokeRect(10, 10, width - 20, height - 20);

        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('⚠ COSMO BOND: NANO INTEGRITY FAILURE ⚠', width / 2, height / 2 - 25);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(deathReasonRef.current || deathOverlay?.reason || '원자 구조가 붕괴되었습니다.', width / 2, height / 2 + 10);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px monospace';
        ctx.fillText('공장에서 신입 나노-직원이 즉시 재조립 중입니다...', width / 2, height / 2 + 40);
        ctx.restore();
      }

      ctx.restore();

      // CHAPTER 3: HIGH-VISIBILITY SECTOR PROGRESS OVERLAY HUD (TOP OF SCREEN)
      if (currentCh === 3) {
        ctx.save();
        const crateDone = titaniumCrateRef.current.isFloating;
        const swampDone = isSwampFrozenRef.current;
        const bugsDone = isCockroachScatteredRef.current;
        const bossDone = bossRef.current.isBurning || !obstaclesRef.current.find((o) => o.id === 'plastic_tree')?.active;

        const zones = [
          { name: '1.티타늄 격벽', done: crateDone },
          { name: '2.부패 유기 늪', done: swampDone },
          { name: '3.해충 군집', done: bugsDone },
          { name: '4.플라스틱-트리', done: bossDone },
          { name: '5.퇴근 게이트', done: currentStepRef.current >= 8 },
        ];

        // Background Bar
        const barW = 560;
        const barH = 26;
        const barX = width / 2 - barW / 2;
        const barY = 8;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(barX, barY, barW, barH);

        let curActiveFound = false;
        zones.forEach((z, idx) => {
          const zx = barX + 32 + idx * 108;
          const isCurrent = !z.done && !curActiveFound;
          if (isCurrent) curActiveFound = true;

          ctx.font = isCurrent ? 'bold 11px sans-serif' : '10px sans-serif';
          ctx.textAlign = 'center';
          if (z.done) {
            ctx.fillStyle = '#4ade80';
            ctx.fillText(`✓ ${z.name}`, zx, barY + 17);
          } else if (isCurrent) {
            ctx.fillStyle = '#fde047';
            ctx.fillText(`▶ ${z.name}`, zx, barY + 17);
            ctx.fillStyle = '#fde047';
            ctx.fillRect(zx - 40, barY + 21, 80, 2);
          } else {
            ctx.fillStyle = '#64748b';
            ctx.fillText(z.name, zx, barY + 17);
          }

          if (idx < zones.length - 1) {
            ctx.fillStyle = '#334155';
            ctx.font = '10px monospace';
            ctx.fillText('›', zx + 54, barY + 16);
          }
        });
        ctx.restore();
      }

      // CHAPTER 2: HIGH-VISIBILITY SECTOR PROGRESS OVERLAY HUD (TOP OF SCREEN)
      if (currentCh === 2) {
        ctx.save();
        const rustDone = !obstaclesRef.current.find((o) => o.id === 'rust_gate')?.active;
        const greaseDone = !obstaclesRef.current.find((o) => o.id === 'grease_monster')?.active;
        const boulderDone = !obstaclesRef.current.find((o) => o.id === 'heavy_boulder')?.active;
        const moatDone = !obstaclesRef.current.find((o) => o.id === 'acid_moat')?.active;

        const zones = [
          { name: '1.녹슨 철창', done: rustDone },
          { name: '2.기름때', done: greaseDone },
          { name: '3.수로 암벽', done: boulderDone },
          { name: '4.산성 해자', done: moatDone },
          { name: '5.출구', done: false },
        ];

        // Background Bar
        const barW = 550;
        const barH = 26;
        const barX = width / 2 - barW / 2;
        const barY = 8;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(barX, barY, barW, barH);

        let curActiveFound = false;
        zones.forEach((z, idx) => {
          const zx = barX + 32 + idx * 105;
          const isCurrent = !z.done && !curActiveFound;
          if (isCurrent) curActiveFound = true;

          ctx.font = isCurrent ? 'bold 11px sans-serif' : '10px sans-serif';
          ctx.textAlign = 'center';
          if (z.done) {
            ctx.fillStyle = '#4ade80';
            ctx.fillText(`✓ ${z.name}`, zx, barY + 17);
          } else if (isCurrent) {
            ctx.fillStyle = '#fde047';
            ctx.fillText(`▶ ${z.name}`, zx, barY + 17);
            ctx.fillStyle = '#fde047';
            ctx.fillRect(zx - 38, barY + 21, 76, 2);
          } else {
            ctx.fillStyle = '#64748b';
            ctx.fillText(z.name, zx, barY + 17);
          }

          if (idx < zones.length - 1) {
            ctx.fillStyle = '#334155';
            ctx.font = '10px monospace';
            ctx.fillText('›', zx + 53, barY + 16);
          }
        });
        ctx.restore();
      }

      // NANO-WORKER INTEGRITY HEALTH GAUGE (Top Left Screen Space)
      ctx.save();
      const hpBarW = 140;
      const hpBarH = 14;
      const hpX = 14;
      const hpY = 12;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.fillRect(hpX - 4, hpY - 4, hpBarW + 68, hpBarH + 8);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(hpX - 4, hpY - 4, hpBarW + 68, hpBarH + 8);

      const hpRatio = Math.max(0, Math.min(1, p.hp / p.maxHp));
      const hpFillColor = hpRatio > 0.5 ? '#22c55e' : hpRatio > 0.25 ? '#eab308' : '#ef4444';
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(hpX, hpY, hpBarW, hpBarH);
      ctx.fillStyle = hpFillColor;
      ctx.fillRect(hpX, hpY, hpBarW * hpRatio, hpBarH);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`NANO-HP: ${p.hp}%`, hpX + 4, hpY + 11);
      ctx.restore();

      // CHAPTER 3: APEX BOSS OVERLAY GAUGE (When in Boss Arena x > 1150)
      if (currentCh === 3 && p.x > 1150) {
        const boss = obstaclesRef.current.find((o) => o.id === 'plastic_tree');
        if (boss && !bossRef.current.isDefeated) {
          ctx.save();
          const bbW = 430;
          const bbH = 34;
          const bbX = width / 2 - bbW / 2;
          const bbY = 38;

          ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
          ctx.fillRect(bbX, bbY, bbW, bbH);
          ctx.strokeStyle = bossRef.current.isSoaked ? '#c084fc' : '#dc2626';
          ctx.lineWidth = 1.8;
          ctx.strokeRect(bbX, bbY, bbW, bbH);

          // Boss Title
          ctx.font = 'bold 10px sans-serif';
          ctx.fillStyle = '#fca5a5';
          ctx.textAlign = 'center';
          ctx.fillText('APEX BOSS: 비정질 합성고분자 침식수「아르보르 플라스티카」', width / 2, bbY + 13);

          // Stun indicator or Ethanol saturation bar
          if (bossRef.current.stunTimer > 0) {
            ctx.fillStyle = '#fde047';
            ctx.font = 'bold 10px sans-serif';
            ctx.fillText('⚡ STUNNED (알코올 용매 과부하로 행동 마비 중!) ⚡', width / 2, bbY + 28);
          } else {
            const stacks = bossRef.current.alcoholStacks;
            const segW = 100;
            const segGap = 6;
            const totalSegW = segW * 3 + segGap * 2;
            const segStartX = width / 2 - totalSegW / 2;
            const segY = bbY + 18;

            for (let i = 0; i < 3; i++) {
              const sx = segStartX + i * (segW + segGap);
              const filled = i < stacks;
              ctx.fillStyle = filled ? '#a855f7' : '#334155';
              ctx.fillRect(sx, segY, segW, 10);
              ctx.strokeStyle = filled ? '#e9d5ff' : '#475569';
              ctx.lineWidth = 1;
              ctx.strokeRect(sx, segY, segW, 10);
            }

            ctx.font = 'bold 8px monospace';
            ctx.fillStyle = stacks >= 3 ? '#6ee7b7' : '#bae6fd';
            ctx.fillText(
              stacks >= 3
                ? '🔥 [포화 100%] 인화성 에탄올 도포 완료! 스파크 점화기[F] 작동 가능!'
                : `C₂H₅OH 에탄올 침투율: ${stacks * 33}% (${stacks}/3 중첩) - 추가 투척 필요`,
              width / 2,
              segY + 8
            );
          }
          ctx.restore();
        }
      }

      // CRT Scanline Overlay (Screen Space)
      if (settings?.scanlines ?? true) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.09)';
        for (let sy = 0; sy < height; sy += 4) {
          ctx.fillRect(0, sy, width, 1.5);
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [triggerPlayerDeath, settings?.scanlines, settings?.screenShake]);

  return (
    <div className="relative w-full flex flex-col gap-2">
      {/* Walkie-Talkie Radio Transmission Header Widget */}
      <RadioComm
        transmission={radioTransmission}
        onDismiss={() => setRadioTransmission(null)}
      />

      {/* Main Game Viewport Canvas */}
      <div className="relative w-full overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-950 shadow-2xl">
        <canvas
          ref={canvasRef}
          className="w-full h-auto block aspect-[860/480] cursor-crosshair select-none"
        />

        {/* Floating Guidance Banner (Bottom Center) */}
        {inGameNotice && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 max-w-lg px-4 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/50 shadow-lg text-cyan-300 text-xs sm:text-sm font-medium flex items-center gap-2 backdrop-blur-xs transition-all pointer-events-none text-center">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0"></span>
            <span>{inGameNotice}</span>
          </div>
        )}

        {/* Top-Right Hotkey Controls: Inspect [Z] & Work Kit [C] */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {/* Detailed Inspection (자세히 보기) Button */}
          <button
            onClick={toggleInspect}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold shadow-lg backdrop-blur-xs transition-all cursor-pointer ${
              nearbyInspectable
                ? 'bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-400 text-cyan-300 ring-2 ring-cyan-500/40 animate-pulse hover:scale-105 active:scale-95'
                : 'bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="물질 자세히 보기 (Z / Tab)"
          >
            <span className={`px-1.5 py-0.5 rounded text-[10px] ${nearbyInspectable ? 'bg-cyan-400 text-slate-950 font-black' : 'bg-slate-700 text-slate-300'}`}>
              Z
            </span>
            <span>{nearbyInspectable ? '자세히 보기' : '물질 분석 (Z)'}</span>
          </button>

          {/* Quick Crafting Hotkey Button on Game Viewport */}
          <button
            onClick={() => {
              if (!hasPickedWorkKit) {
                sound.locked();
                setInGameNotice('🔒 [C 봉인] 전방 바닥의 [코스모 본드 작업용 키트]를 먼저 습득([F])하세요!');
                return;
              }
              onOpenCrafting();
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold shadow-lg backdrop-blur-xs transition-all cursor-pointer ${
              hasPickedWorkKit
                ? 'bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-300 hover:scale-105 active:scale-95'
                : 'bg-slate-900/90 border border-slate-700 text-slate-400 opacity-90'
            }`}
          >
            <span className={`px-1.5 py-0.5 rounded text-[10px] ${hasPickedWorkKit ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}>
              {hasPickedWorkKit ? 'C' : '🔒'}
            </span>
            <span>{hasPickedWorkKit ? '작업 키트' : '키트 미습득'}</span>
          </button>
        </div>

        {/* On-screen quick keys reminder bar */}
        <div className="absolute bottom-3 left-4 z-20 flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-950/85 px-3 py-1.5 rounded-lg border border-slate-800 backdrop-blur-xs pointer-events-none">
          <span className="text-amber-400 font-bold">A/D</span> 이동
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-bold">SPACE</span> 점프
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400 font-bold">Z</span> 자세히 보기
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-bold">F</span> 상호작용
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-bold">C</span> 결합창 {hasPickedWorkKit ? '' : '(봉인)'}
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-bold">Q/E</span> 전환
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-bold">R</span> 투척
        </div>

        {/* Material Detailed Inspection Modal (자세히 보기) */}
        <InspectionModal
          isOpen={!!inspectedTarget}
          target={inspectedTarget}
          onClose={() => setInspectedTarget(null)}
        />
      </div>
    </div>
  );
};

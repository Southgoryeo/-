import { ChemicalElement, MoleculeRecipe, ElementType } from '../types/game';

export const ELEMENTS: Record<ElementType, ChemicalElement> = {
  H: {
    id: 'H',
    symbol: 'H',
    name: 'Hydrogen',
    koreanName: '수소 (H)',
    atomicNumber: 1,
    valency: 1,
    color: '#38BDF8', // Sky blue
    textColor: '#082F49',
    category: 'nonmetal',
  },
  O: {
    id: 'O',
    symbol: 'O',
    name: 'Oxygen',
    koreanName: '산소 (O)',
    atomicNumber: 8,
    valency: 2,
    color: '#F43F5E', // Rose / Red
    textColor: '#881337',
    category: 'nonmetal',
  },
  C: {
    id: 'C',
    symbol: 'C',
    name: 'Carbon',
    koreanName: '탄소 (C)',
    atomicNumber: 6,
    valency: 4,
    color: '#64748B', // Slate
    textColor: '#0F172A',
    category: 'nonmetal',
  },
  Na: {
    id: 'Na',
    symbol: 'Na',
    name: 'Sodium',
    koreanName: '나트륨 (Na)',
    atomicNumber: 11,
    valency: 1,
    color: '#F59E0B', // Amber
    textColor: '#78350F',
    category: 'alkali',
  },
  Cl: {
    id: 'Cl',
    symbol: 'Cl',
    name: 'Chlorine',
    koreanName: '염소 (Cl)',
    atomicNumber: 17,
    valency: 1,
    color: '#10B981', // Emerald
    textColor: '#064E3B',
    category: 'halogen',
  },
  N: {
    id: 'N',
    symbol: 'N',
    name: 'Nitrogen',
    koreanName: '질소 (N)',
    atomicNumber: 7,
    valency: 3,
    color: '#818CF8', // Indigo / violet-blue
    textColor: '#1E1B4B',
    category: 'nonmetal',
  },
};

export const MOLECULE_RECIPES: MoleculeRecipe[] = [
  {
    id: 'H2O',
    formula: 'H₂O',
    name: 'Water',
    koreanName: '물 (Dihydrogen Monoxide)',
    bondType: 'covalent',
    elements: { H: 2, O: 1, C: 0, Na: 0, Cl: 0, N: 0 },
    validStructures: [['H', 'O', 'H']], // H-H-O is invalid!
    description: '수소 2개와 산소 1개가 단일 공유결합(H-O-H)으로 연결된 굽은형 극성 분자입니다.',
    chemicalKnowledge: '높은 비열(4.184 J/g·°C)과 기화열(40.65 kJ/mol)을 가져 화염의 열에너지를 빠르게 흡수하여 소화합니다.',
    gameEffect: '높은 비열과 냉각 효과로 고온의 화염을 급속 소화시킵니다.',
    color: '#0EA5E9',
    flameInteraction: 'extinguish',
  },
  {
    id: 'O2',
    formula: 'O₂',
    name: 'Oxygen Gas',
    koreanName: '산소 분자 (Dioxygen)',
    bondType: 'covalent',
    elements: { H: 0, O: 2, C: 0, Na: 0, Cl: 0, N: 0 },
    validStructures: [['O', 'O']],
    description: '산소 원자 2개가 강력한 이중 공유결합(O=O)으로 결합된 무색 기체입니다.',
    chemicalKnowledge: '가연물이 아니지만 연소를 강렬하게 촉진하는 조연성(Oxidizer)을 띱니다.',
    gameEffect: '조연성 가스로 불꽃의 온도를 급격히 높이고 위로 치솟게 만듭니다.',
    color: '#EF4444',
    flameInteraction: 'flare',
  },
  {
    id: 'H2',
    formula: 'H₂',
    name: 'Hydrogen Gas',
    koreanName: '수소 분자 (Dihydrogen)',
    bondType: 'covalent',
    elements: { H: 2, O: 0, C: 0, Na: 0, Cl: 0, N: 0 },
    validStructures: [['H', 'H']],
    description: '우주에서 가장 가볍고 흔한 분자로, 단일 공유결합(H-H)을 가집니다.',
    chemicalKnowledge: '매우 높은 가연성을 지녀 고온의 불꽃과 접촉하면 급격한 연소/폭발(2H₂ + O₂ → 2H₂O)을 일으킵니다.',
    gameEffect: '불꽃과 접촉 시 급격한 가연성 폭발 충격파를 일으킵니다! (근접 시 위험)',
    color: '#818CF8',
    flameInteraction: 'explode',
  },
  {
    id: 'H2O2',
    formula: 'H₂O₂',
    name: 'Hydrogen Peroxide',
    koreanName: '과산화 수소 (Hydrogen Peroxide)',
    bondType: 'covalent',
    elements: { H: 2, O: 2, C: 0, Na: 0, Cl: 0, N: 0 },
    validStructures: [['H', 'O', 'O', 'H']], // H-O-O-H linear chain
    description: '산소-산소 단일 결합(과산화 결합, H-O-O-H)을 가진 불안정하고 반응성이 큰 액체입니다.',
    chemicalKnowledge: '열이나 촉매와 만나면 물과 산소로 분해되며 엄청난 기포 거품을 뿜어냅니다 (코끼리 치약 반응).',
    gameEffect: '급속 분해 반응으로 기포 거품을 분출하여 탄성 거품 발판을 형성합니다.',
    color: '#A7F3D0',
    flameInteraction: 'extinguish',
  },
  {
    id: 'O3',
    formula: 'O₃',
    name: 'Ozone',
    koreanName: '오존 (Ozone)',
    bondType: 'covalent',
    elements: { H: 0, O: 3, C: 0, Na: 0, Cl: 0, N: 0 },
    validStructures: [['O', 'O', 'O']],
    description: '산소 원자 3개가 공명 결합을 이루고 있는 굽은형 구조의 푸른빛 기체입니다.',
    chemicalKnowledge: '강력한 산화력을 가져 유기물 분해 및 강력한 살균/소독 작용을 합니다.',
    gameEffect: '바닥이나 벽에 푸른 살균 가스 장판을 생성하여 유기물 오염을 분해합니다.',
    color: '#38BDF8',
    flameInteraction: 'none',
  },
  {
    id: 'NaCl',
    formula: 'NaCl',
    name: 'Sodium Chloride',
    koreanName: '염화 나트륨 (소금)',
    bondType: 'ionic',
    elements: { H: 0, O: 0, C: 0, Na: 1, Cl: 1, N: 0 },
    validStructures: [['Na', 'Cl'], ['Cl', 'Na']],
    description: '나트륨 양이온(Na⁺)과 염화 음이온(Cl⁻)이 정전기적 인력으로 결합한 이온 결정입니다.',
    chemicalKnowledge: '전기 음성도 차이가 커서 전자가 완전히 이동하며 강한 격자 에너지를 지닙니다.',
    gameEffect: '단단한 이온 결정 물질. 물에 용해되거나 결정 상태로 단단한 구조를 형성합니다.',
    color: '#FEF08A',
    flameInteraction: 'none',
  },
  {
    id: 'HCl',
    formula: 'HCl',
    name: 'Hydrogen Chloride',
    koreanName: '염화수소 / 염산 (Hydrochloric Acid)',
    bondType: 'covalent',
    elements: { H: 1, O: 0, C: 0, Na: 0, Cl: 1, N: 0 },
    validStructures: [['H', 'Cl']],
    description: '수소와 염소가 단일 극성 결합(H-Cl)한 강산성 분자입니다.',
    chemicalKnowledge: '수용액에서 100% 해리되어 금속 결합을 급격히 산화/부식시킵니다.',
    gameEffect: '강력한 산성 부식액! 금속 결합과 산화물 층을 치이익 소리와 함께 부식 및 용해시킵니다.',
    color: '#22C55E',
    flameInteraction: 'none',
  },
  {
    id: 'NaOH',
    formula: 'NaOH',
    name: 'Sodium Hydroxide',
    koreanName: '수산화 나트륨 / 양잿물 (Caustic Soda)',
    bondType: 'ionic',
    elements: { H: 1, O: 1, C: 0, Na: 1, Cl: 0, N: 0 },
    validStructures: [['Na', 'O', 'H']],
    description: '나트륨 이온과 수산화 이온(OH⁻)이 결합한 강력한 부식성 강염기 물질입니다.',
    chemicalKnowledge: '지방산과 반응하여 비누를 만드는 비누화 반응(Saponification)으로 유기물을 분해하고, 염산을 중화합니다.',
    gameEffect: '강염기성 용액! 유기물 및 지방을 비누화 분해하여 씻어내며, 강산을 중화시킵니다.',
    color: '#EAB308',
    flameInteraction: 'none',
  },
  {
    id: 'Cl2',
    formula: 'Cl₂',
    name: 'Chlorine Gas',
    koreanName: '염소 기체 (Dichlorine)',
    bondType: 'covalent',
    elements: { H: 0, O: 0, C: 0, Na: 0, Cl: 2, N: 0 },
    validStructures: [['Cl', 'Cl']],
    description: '염소 원자 2개가 단일 결합(Cl-Cl)한 무거운 황록색 유독 가스입니다.',
    chemicalKnowledge: '공기보다 약 2.5배 무거워 지표면 바닥으로 가라앉는 특성이 있습니다.',
    gameEffect: '바닥으로 가라앉는 무거운 황록색 독가스 장판을 형성하여 오염 물질을 소멸시킵니다.',
    color: '#84CC16',
    flameInteraction: 'none',
  },
  {
    id: 'Na_pure',
    formula: 'Na',
    name: 'Elemental Sodium',
    koreanName: '순수 나트륨 덩어리 (Sodium Grenade)',
    bondType: 'ionic',
    elements: { H: 0, O: 0, C: 0, Na: 1, Cl: 0, N: 0 },
    validStructures: [['Na']],
    description: '결합하지 않은 고반응성 알칼리 금속 나트륨 홑원소 덩어리입니다.',
    chemicalKnowledge: '물과 접촉하면 격렬한 발열 반응과 함께 수소 기체를 뿜어내며 폭발(2Na + 2H₂O → 2NaOH + H₂↑)합니다.',
    gameEffect: '물과 접촉 시 격렬한 발열 반응과 함께 강력한 폭발 충격파를 발생시킵니다.',
    color: '#F97316',
    flameInteraction: 'explode',
  },
  // CHAPTER 3: ORGANIC CHEMISTRY MOLECULES
  {
    id: 'CO2',
    formula: 'CO₂',
    name: 'Carbon Dioxide',
    koreanName: '이산화탄소 (Carbon Dioxide)',
    bondType: 'covalent',
    elements: { H: 0, O: 2, C: 1, Na: 0, Cl: 0, N: 0 },
    validStructures: [['O', 'C', 'O'], ['C', 'O', 'O']],
    description: '탄소 1개와 산소 2개가 이중 결합(O=C=O)을 이룬 무색의 무극성 직선형 분자입니다.',
    chemicalKnowledge: '상온에서 기체이나 압축·냉각 시 드라이아이스(-78.5°C)가 되며 승화열을 급격히 흡수하는 냉각 효과를 냅니다.',
    gameEffect: '급격한 흡열 반응으로 펄펄 끓는 액체나 늪을 꽝꽝 얼려 미끄러지는 빙판길로 만듭니다!',
    color: '#94A3B8',
    flameInteraction: 'extinguish',
  },
  {
    id: 'CH4',
    formula: 'CH₄',
    name: 'Methane',
    koreanName: '메탄 (Methane)',
    bondType: 'covalent',
    elements: { H: 4, O: 0, C: 1, Na: 0, Cl: 0, N: 0 },
    validStructures: [
      ['H', 'C', 'H', 'H', 'H'],
      ['H', 'H', 'C', 'H', 'H'],
      ['C', 'H', 'H', 'H', 'H'],
    ],
    description: '탄소 1개를 중심으로 4개의 수소가 십자(정사면체) 구조로 결합한 가장 단순한 탄화수소입니다.',
    chemicalKnowledge: '공기보다 가벼운 비중(0.554)을 가져 강력한 부력을 제공하며 인화성이 높습니다.',
    gameEffect: '물체에 가스 주머니로 달라붙어 열기구처럼 공중으로 두둥실 띄워 올립니다!',
    color: '#38BDF8',
    flameInteraction: 'flare',
  },
  {
    id: 'NH3',
    formula: 'NH₃',
    name: 'Ammonia',
    koreanName: '암모니아 (Ammonia)',
    bondType: 'covalent',
    elements: { H: 3, O: 0, C: 0, Na: 0, Cl: 0, N: 1 },
    validStructures: [
      ['H', 'N', 'H', 'H'],
      ['N', 'H', 'H', 'H'],
      ['H', 'H', 'N', 'H'],
    ],
    description: '질소 1개에 수소 3개가 결합하고 비공유 전자쌍 1개를 가진 자극성 염기 기체입니다.',
    chemicalKnowledge: '특유의 지독한 자극성 악취를 풍기며 생체 점막에 강한 기피 반응을 유발합니다.',
    gameEffect: '자극성 악취 가스를 방출하여 뭉쳐있는 생체 유기물 괴물 무리를 혼비백산 도망치게 만듭니다!',
    color: '#A855F7',
    flameInteraction: 'none',
  },
  {
    id: 'C2H5OH',
    formula: 'C₂H₅OH',
    name: 'Ethanol',
    koreanName: '에탄올 / 알코올 (Ethanol)',
    bondType: 'covalent',
    elements: { H: 6, O: 1, C: 2, Na: 0, Cl: 0, N: 0 },
    validStructures: [
      ['C', 'C', 'O', 'H', 'H', 'H', 'H', 'H', 'H'],
      ['H', 'C', 'C', 'O', 'H'],
      ['C', 'C', 'O'],
    ],
    description: '두 개의 탄소 사슬(C-C)에 수소들과 하이드록시기(-OH)가 결합한 고인화성 유기 화합물입니다.',
    chemicalKnowledge: '낮은 인화점(13°C)과 높은 휘발성을 가져 점화원과 접촉 시 폭발적인 연쇄 화염을 지속 방출합니다.',
    gameEffect: '목표물에 휘발성 연료를 흠뻑 적시며, 불씨가 닿는 즉시 거대한 연쇄 화염 폭풍을 일으켜 전소시킵니다!',
    color: '#F43F5E',
    flameInteraction: 'flare',
  },
];

// Helper to check combination of elements by total counts
export function matchRecipe(elementCounts: Record<ElementType, number>): MoleculeRecipe | null {
  for (const recipe of MOLECULE_RECIPES) {
    let match = true;
    const allKeys = Object.keys(ELEMENTS) as ElementType[];
    for (const key of allKeys) {
      const required = recipe.elements[key] || 0;
      const actual = elementCounts[key] || 0;
      if (required !== actual) {
        match = false;
        break;
      }
    }
    if (match) return recipe;
  }
  return null;
}

// Strict chemical structural validation: ensures proper Lewis sequence (e.g. H-O-H is valid, H-H-O is strictly invalid)
export interface StructureMatchResult {
  recipe: MoleculeRecipe | null;
  structuralError?: string;
  suggestedCorrection?: string;
}

export function matchStructuralRecipe(sequence: ElementType[]): StructureMatchResult {
  if (sequence.length === 0) return { recipe: null };

  // 1. Count elements
  const counts: Record<ElementType, number> = { H: 0, O: 0, C: 0, Na: 0, Cl: 0, N: 0 };
  for (const el of sequence) counts[el] = (counts[el] || 0) + 1;

  // 2. Match counts
  const countMatchedRecipe = matchRecipe(counts);
  if (!countMatchedRecipe) {
    return { recipe: null };
  }

  // 3. For Chapter 3 molecules (CH4, NH3, C2H5OH, CO2), if all counts match, validate!
  if (
    countMatchedRecipe.id === 'CH4' ||
    countMatchedRecipe.id === 'NH3' ||
    countMatchedRecipe.id === 'C2H5OH' ||
    countMatchedRecipe.id === 'CO2'
  ) {
    return { recipe: countMatchedRecipe };
  }

  // 4. Match strict sequence (or symmetrical reverse) for linear molecules
  const isValidSequence = countMatchedRecipe.validStructures.some((validSeq) => {
    if (validSeq.length !== sequence.length) return false;
    // Direct match
    const direct = validSeq.every((el, i) => el === sequence[i]);
    // Symmetrical reverse match
    const reversed = validSeq.slice().reverse().every((el, i) => el === sequence[i]);
    return direct || reversed;
  });

  if (isValidSequence) {
    return { recipe: countMatchedRecipe };
  }

  // 5. Counts matched, but sequence is physically/chemically impossible!
  let errorMsg = '옥텟 및 듀엣 규칙 위반: 결합 순서가 화학적으로 불가능합니다.';
  let suggestion = '';

  if (countMatchedRecipe.id === 'H2O') {
    // User placed H-H-O or O-H-H
    errorMsg = '수소(H)는 원자가 전자가 1개뿐이므로 중심 원자가 되어 2개의 결합을 할 수 없습니다 (듀엣 규칙 위반).';
    suggestion = '산소(O)가 중심에 오도록 [ H - O - H ] 순서로 결합하세요!';
  } else if (countMatchedRecipe.id === 'H2O2') {
    // User placed H-H-O-O or other illegal isomer
    errorMsg = '과산화수소는 산소-산소 단일 결합(O-O)을 중심으로 양 끝에 수소가 결합해야 합니다.';
    suggestion = '[ H - O - O - H ] 순서로 결합하세요!';
  } else if (countMatchedRecipe.id === 'NaOH') {
    errorMsg = '수산화나트륨은 산소(O)를 매개로 나트륨(Na)과 수소(H)가 순차 결합하는 구조여야 합니다.';
    suggestion = '[ Na - O - H ] 순서로 결합하세요!';
  }

  return {
    recipe: null,
    structuralError: errorMsg,
    suggestedCorrection: suggestion,
  };
}

// 2D Lewis Grid validator for Chapter 3 Cross-Bonding (상하좌우 결합)
export function matchGridRecipe(grid: (ElementType | null)[][]): StructureMatchResult {
  const counts: Record<ElementType, number> = { H: 0, O: 0, C: 0, Na: 0, Cl: 0, N: 0 };
  let totalAtoms = 0;

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const atom = grid[r][c];
      if (atom) {
        counts[atom] = (counts[atom] || 0) + 1;
        totalAtoms++;
      }
    }
  }

  if (totalAtoms === 0) return { recipe: null };

  const countMatchedRecipe = matchRecipe(counts);
  if (!countMatchedRecipe) {
    return { recipe: null };
  }

  // If 2D organic or cross molecule, check basic adjacency
  if (countMatchedRecipe.id === 'CH4') {
    // Center Carbon should have 4 Hydrogens adjacent in grid
    let hasValidCarbon = false;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c] === 'C') {
          let hCount = 0;
          const neighbors = [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
          ];
          for (const [dr, dc] of neighbors) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length) {
              if (grid[nr][nc] === 'H') hCount++;
            }
          }
          if (hCount >= 3) hasValidCarbon = true; // forgiving topology
        }
      }
    }
    if (hasValidCarbon || totalAtoms === 5) {
      return { recipe: countMatchedRecipe };
    }
  }

  if (countMatchedRecipe.id === 'NH3') {
    return { recipe: countMatchedRecipe };
  }

  if (countMatchedRecipe.id === 'CO2') {
    return { recipe: countMatchedRecipe };
  }

  if (countMatchedRecipe.id === 'C2H5OH') {
    // 2 Carbons, 6 Hydrogens, 1 Oxygen (Standard full Lewis structure)
    return { recipe: countMatchedRecipe };
  }

  // Also support organic shorthand/condensed Ethanol (2 Carbons, 1 Oxygen, 4-6 Hydrogens)
  if (counts.C === 2 && counts.O === 1 && counts.H >= 4 && counts.Na === 0 && counts.Cl === 0 && counts.N === 0) {
    const ethanolRecipe = MOLECULE_RECIPES.find((r) => r.id === 'C2H5OH');
    if (ethanolRecipe) return { recipe: ethanolRecipe };
  }

  // If linear molecules (e.g. H2O, HCl, NaOH, NaCl) are built in grid:
  const flatSequence: ElementType[] = [];
  // Read row-by-row or column-by-row
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c]) flatSequence.push(grid[r][c]!);
    }
  }
  return matchStructuralRecipe(flatSequence);
}

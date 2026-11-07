export type ElementType = 'H' | 'O' | 'C' | 'Na' | 'Cl' | 'N';

export interface ChemicalElement {
  id: string;
  symbol: ElementType;
  name: string;
  koreanName: string;
  atomicNumber: number;
  valency: number; // 결합 가용 손 수 (H:1, O:2, C:4, Na:1, Cl:1)
  color: string;
  textColor: string;
  category: 'nonmetal' | 'alkali' | 'halogen';
}

export interface MoleculeRecipe {
  id: string;
  formula: string; // e.g., "H2O"
  name: string;
  koreanName: string;
  bondType: 'covalent' | 'ionic';
  elements: Record<ElementType, number>;
  validStructures: ElementType[][]; // 올바른 루이스 결합 순서 (예: [['H', 'O', 'H']])
  description: string;
  chemicalKnowledge: string;
  gameEffect: string;
  color: string;
  flameInteraction: 'extinguish' | 'flare' | 'explode' | 'none';
}

export interface PlayerInventory {
  elements: Record<ElementType, number>;
  flasks: {
    moleculeId: string;
    count: number;
  }[];
  activeFlaskIndex: number;
}

export interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  molecule: MoleculeRecipe;
  active: boolean;
  bounces: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'fire' | 'steam' | 'spark' | 'water' | 'bubble' | 'foam' | 'ozone' | 'ember' | 'smoke';
}

export interface BouncyFoam {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  life: number;
  maxLife: number;
}

export interface LethalEmber {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  maxLife: number;
}

export interface EnemyProjectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  color: string;
  type: 'grease_spit' | 'grease_wave' | 'chitin_stinger' | 'boss_volley' | 'boss_spray';
  life: number;
  maxLife: number;
  gravity?: number;
  slowEffect?: boolean;
}

export interface GroundHazard {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  warnTimer: number;
  eruptTimer: number;
  damage: number;
}

export interface LevelObstacle {
  id: string;
  type:
    | 'thermal_flame'
    | 'acid_pool'
    | 'locked_gate'
    | 'sensor_switch'
    | 'cracked_wall'
    | 'overhead_vine'
    | 'germ_slime'
    | 'cracked_floor'
    | 'iron_crate'
    | 'rust_gate'
    | 'grease_monster'
    | 'water_puddle'
    | 'heavy_boulder'
    | 'acid_moat'
    | 'salt_platform'
    | 'titanium_crate'
    | 'boiling_swamp'
    | 'frozen_ice'
    | 'cockroach_swarm'
    | 'plastic_tree';
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
  health?: number;
  name: string;
  stateText: string;
  category?: string;
  analysisDetail?: string;
}

export interface InteractiveEntity {
  id: string;
  type: 'element_dispenser' | 'crafting_bench' | 'door_console' | 'checkpoint' | 'info_sign';
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  promptText: string;
  elementGranted?: ElementType;
}

export interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isGrounded: boolean;
  facing: 'left' | 'right';
  isAiming: boolean;
  aimAngle: number;
  aimPower: number;
  canInteractWith: InteractiveEntity | null;
  hp: number;
  maxHp: number;
}

export interface GameSettings {
  masterVolume: number; // 0 to 100
  isMuted: boolean;
  screenShake: boolean;
  scanlines: boolean;
  particleQuality: 'high' | 'normal' | 'low';
}

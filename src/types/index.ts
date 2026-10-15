export type BeverageType = 
  | 'water'
  | 'green_tea'
  | 'coffee'
  | 'juice'
  | 'electrolyte'
  | 'soda';

export interface DrinkLog {
  id: string;
  type: BeverageType;
  amountMl: number;
  timestamp: string; // ISO string
  caffeineMg?: number;
}

export interface BeverageConfig {
  type: BeverageType;
  label: string;
  icon: string;
  color: string;
  lightColor: string;
  hydrationFactor: number; // e.g. water = 1.0, coffee = 0.8
  defaultAmount: number;
}

export interface DayProgress {
  currentMl: number;
  goalMl: number;
  logs: DrinkLog[];
  streakDays: number;
}


export interface GeneratorSettings {
  min: number;
  max: number;
  count: number;
  unique: boolean;
  sorted: boolean;
}

export interface AIInsight {
  analysis: string;
  funFact: string;
  patternObserved: string;
}

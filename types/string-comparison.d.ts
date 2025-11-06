declare module 'string-comparison' {
  export interface SortMatchResultType {
    member: string;
    index: number;
    rating: number;
  }

  export abstract class Similarity {
    sortMatch(thanos: string, avengers: string[]): SortMatchResultType[];
    abstract similarity(thanos: string, rival: string): number;
    abstract distance(thanos: string, rival: string): number;
  }

  export class DiceCoefficient extends Similarity {
    similarity(thanos: string, rival: string): number;
    distance(thanos: string, rival: string): number;
  }

  export class Cosine extends Similarity {
    similarity(thanos: string, rival: string): number;
    distance(thanos: string, rival: string): number;
  }

  export class Levenshtein extends Similarity {
    similarity(thanos: string, rival: string): number;
    distance(thanos: string, rival: string): number;
  }

  const comparison: {
    diceCoefficient: typeof DiceCoefficient;
    cosine: typeof Cosine;
    levenshtein: typeof Levenshtein;
  };

  export default comparison;
}

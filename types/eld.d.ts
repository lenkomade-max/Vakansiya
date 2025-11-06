declare module 'eld' {
  export interface LanguageResult {
    language: string;
    getScores(): Record<string, number>;
    isReliable(): boolean;
  }

  export interface ELD {
    detect(text: string): LanguageResult;
    cleanText(text: string): string;
    dynamicLangSubset(languages: string[]): void;
  }

  const eld: ELD;
  export default eld;
}

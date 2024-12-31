export interface WordInfo {
  original_word: string;
  found_in_vocabulary: boolean;
  match_type: string;
  vocabulary_entry: {
    word: string;
    language: string;
    translation: string | null;
    state: number;
    due: string | null;
    stability: number;
    difficulty: number;
    last_review: string | null;
    step: number;
  } | null;
}

export interface SentenceData {
  original: string;
  translated: string;
  src_tokenized: string[];
  trg_tokenized: string[];
  alignment: Array<[number, number]>;
  wordInfo: WordInfo[];
}

export interface TranslationResponse {
  originalText: string;
  translatedText: string;
  alignment: Array<Array<[number, number]>> | Array<[number, number]>;
  sentences?: SentenceData[];
}

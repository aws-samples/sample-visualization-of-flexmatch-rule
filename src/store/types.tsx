import { 
  RuleSet
} from "../utils/definitions.tsx";

/**
 * 解析済み構造の型定義
 */
export interface ParsedStructure {
  teams: {
    [teamName: string]: {
      players: {
        [playerName: string]: {
          attributes: {
            [attributeName: string]: string;
          }[];
        };
      }[];
    };
  }[];
}

/**
 * ストア状態の型定義
 */
export interface StoreState {
  enrichedTeamStructure: ParsedStructure;
  typedStructure: RuleSet;
}

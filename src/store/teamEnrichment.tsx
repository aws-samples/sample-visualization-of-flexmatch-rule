import { ParsedStructure } from "./types.tsx";
import { PlayerAttribute, Team, RuleSet } from "../utils/definitions.tsx";

// 定数
const DEFAULT_PLAYERS_PER_TEAM = 3;

export function enrichTeamsForVisualization(input: RuleSet): ParsedStructure {
  // チームインスタンスを作成
  const teamInstances = createTeamInstances(input.teams);  
  // チームにプレイヤーと属性を追加
  const enrichedTeams = addPlayersAndAttributesToTeams(teamInstances, input.playerAttributes);
  return { teams: enrichedTeams };
}

function createTeamInstances(teams?: Team[]): Record<string, Record<string, unknown>>[] {
  const results: Record<string, Record<string, unknown>>[] = [];

  if (!teams || !Array.isArray(teams)) {
    return results;
  }

  teams.forEach((team) => {
    if (team.quantity && team.quantity > 1) {
      // quantity > 1 のチームに対して複数のインスタンスを作成
      for (let i = 0; i < team.quantity; i++) {
        const key = `${team.name}${i}`;
        results.push({ [key]: {} });
      }
    } else {
      // 単一のチームインスタンスを作成
      const key = team.name;
      results.push({ [key]: {} });
    }
  });

  return results;
}

function addPlayersAndAttributesToTeams(
  teamInstances: Record<string, Record<string, unknown>>[],
  playerAttributes?: PlayerAttribute[]
): {[key: string]: {players: {[key: string]: {attributes: {[key: string]: string}[]}}[]}}[] {
  return teamInstances.map((teamInstance) => {
    return Object.keys(teamInstance).map((teamKey) => {
      return {
        [teamKey]: {
          players: createPlayersWithAttributes(playerAttributes)
        }
      };
    });
  }).flat();
}

function createPlayersWithAttributes(playerAttributes?: PlayerAttribute[]): {[key: string]: {attributes: {[key: string]: string}[]}}[] {
  return Array.from({ length: DEFAULT_PLAYERS_PER_TEAM }, (_, i) => {
    const playerName = `user${i + 1}`;
    return {
      [playerName]: {
        attributes: playerAttributes 
          ? playerAttributes.map((attr) => ({
              [attr.name]: attr.type
            }))
          : []
      }
    };
  });
}

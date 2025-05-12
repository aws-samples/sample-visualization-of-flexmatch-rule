export type PlayerAttributeType = "string" | "number" | "string_list" | "string_number_map";

export interface PlayerAttribute {
    name: string;
    type: PlayerAttributeType;
    default: string;
}

export type BatchingPreference = "random" | "sorted";
export type ExpansionAgeSelection = "newest" | "oldest";
export type BackfillPriority = "normal" | "low" | "high";

export interface Algorithm {
    strategy: string;  // "exhaustiveSearch"など
    batchingPreference: BatchingPreference;
    sortByAttributes: string[];
    expansionAgeSelection: ExpansionAgeSelection;
    backfillPriority: BackfillPriority;
    balancedAttribute: string;
}

export interface Team {
    name: string;
    maxPlayers: number;
    minPlayers: number;
    quantity: number;
}

export interface BaseRule {
    type: string;
    name: string;
    description: string;
}

export type PartyAggregation = "avg" | "min" | "max";
export type ComparisonOperation = "<" | "<=" | "=" | "!=" | ">" | ">=";
export type CollectionOperation = "intersection" | "contains" | "reference_intersection_count";
export type SortDirection = "ascending" | "descending";
export type MapKey = "minValue" | "maxValue";

export interface DistanceRule extends BaseRule {
    type: "distance";
    measurements: string;
    referenceValue: number;
    maxDistance: number;
    minDistance: number;
    partyAggregation: PartyAggregation;
}

export interface ComparisonRule extends BaseRule {
    type: "comparison";
    measurements: string;
    referenceValue: number;
    operation: ComparisonOperation;
    partyAggregation: PartyAggregation;
}

export interface CollectionRule extends BaseRule {
    type: "collection";
    measurements: string;
    referenceValue: number;
    operation: CollectionOperation;
    maxCount: number;
    minCount: number;
    partyAggregation: "union" | "intersection";
}

export interface LatencyRule extends BaseRule {
    type: "latency";
    maxLatency: number;
    maxDistance: number;
    distanceReference: number;
    partyAggregation: PartyAggregation;
}

export interface DistanceSortRule extends BaseRule {
    type: "distanceSort";
    sortDirection: SortDirection;
    sortAttribute: string;
    mapKey: MapKey;
    partyAggregation: PartyAggregation;
}

export interface AbsoluteSortRule extends BaseRule {
    type: "absoluteSort";
    sortDirection: SortDirection;
    sortAttribute: string;
    mapKey: MapKey;
    partyAggregation: PartyAggregation;
}

export interface CompoundRule extends BaseRule {
    type: "compound";
    statement: string;
}

export interface BatchDistanceRule extends BaseRule {
    type: "batchDistance";
    batchAttribute: string;
    maxDistance: number;
    partyAggregation: PartyAggregation;
}


// ルール型のユニオン型定義
export type Rule =
    | DistanceRule
    | BatchDistanceRule
    | ComparisonRule
    | CollectionRule
    | LatencyRule
    | DistanceSortRule
    | AbsoluteSortRule
    | CompoundRule;

export interface ExpansionStep {
    waitTimeSeconds: number;
    value: number;
}

export interface Expansion {
    target: string;
    steps: ExpansionStep[];
}


export interface RuleSet {
    name?: string;
    ruleLanguageVersion: string;
    playerAttributes?: PlayerAttribute[];
    algorithm?: Algorithm;
    teams: Team[];
    rules?: Rule[];
    expansions?: Expansion[];
}

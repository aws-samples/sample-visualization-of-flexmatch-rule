import { PlayerAttribute } from "../../../utils/definitions";
import { ParsedStructure } from "../../../store/types";
import { NestedArray } from "../../../utils/displayPropertyExpression";

export interface CollectionRule {
    measurements: unknown;
    operation: string;
    referenceValue: unknown;
    minCount?: number;
    maxCount?: number;
    partyAggregation?: string;
}

export interface StringListItem {
    name: string;
    value?: string[];
}

export interface ProcessedData {
    stringLists: StringListItem[];
    referenceValueStringLists?: StringListItem[];
    measurementdisplay: {
        label: string;
        labelType: string;
        operations: string[];
        structure: NestedArray[];
    };
    referenceDisplay: {
        label: string;
        labelType: string;
        operations: string[];
        structure: NestedArray[];
    };
}

export interface OperationProcessorProps {
    rule: CollectionRule;
    structure: ParsedStructure;
    attributes: PlayerAttribute[] | undefined;
}

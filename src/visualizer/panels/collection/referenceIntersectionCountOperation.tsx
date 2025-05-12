import { ProcessedData, OperationProcessorProps, StringListItem } from "./types";
import { processBaseData } from "./utils";
import { createRawExtractedData } from "../../../utils/displayPropertyExpression";
import { generateName } from "./generateSampleData";
import { DataType } from "../../../utils/ruleExpressionParser";

// reference_intersection_count操作に対応する処理
export const processReferenceIntersectionCountOperation = (props: OperationProcessorProps): ProcessedData => {
    const { rule, structure } = props;
    const baseData = processBaseData(props);
    const { stringLists } = baseData;
    
    // referenceValueからデータを抽出
    const refOut = createRawExtractedData(rule.referenceValue as string | DataType, structure) || { extractedData: [] };
    
    // refOut.extractedDataを使用し、配列でない場合は空配列をデフォルト値として使用
    const refOutputData = Array.isArray(refOut.extractedData) ? refOut.extractedData : [];
    const referenceValueStringLists = refOutputData.map(() => {
        return { name: generateName() } as StringListItem;
    });

    let l = rule.minCount || rule.maxCount || 0;
    if (l > stringLists.length) {
        l = stringLists.length;
    }

    const randomString = referenceValueStringLists && referenceValueStringLists.length > 0 
        ? referenceValueStringLists[0].name 
        : generateName();
    const addedIndices = new Set<number>();

    // stringListsが空でないことを確認してから処理を行う
    if (stringLists.length > 0) {
        while (addedIndices.size < l) {
            const randomIndex = Math.floor(Math.random() * stringLists.length);
            if (!addedIndices.has(randomIndex)) {
                if (stringLists[randomIndex].value) {
                    stringLists[randomIndex].value!.unshift(randomString);
                } else {
                    stringLists[randomIndex].value = [randomString];
                }
                addedIndices.add(randomIndex);
            }
        }
    }
    
    return {
        ...baseData,
        stringLists,
        referenceValueStringLists
    };
};

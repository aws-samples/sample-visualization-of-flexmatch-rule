import { ProcessedData, OperationProcessorProps } from "./types";
import { processBaseData } from "./utils";

// contains操作に対応する処理
export const processContainsOperation = (props: OperationProcessorProps): ProcessedData => {
    const { rule } = props;
    const baseData = processBaseData(props);
    const { stringLists } = baseData;
    
    const l = rule.minCount || rule.maxCount || 1;
    // unknown型をstring型に変換
    const randomString = typeof rule.referenceValue === 'string' ? rule.referenceValue :
        typeof rule.referenceValue === 'number' ? rule.referenceValue.toString() : '';
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
        stringLists
    };
};

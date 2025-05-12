import { ProcessedData, OperationProcessorProps } from "./types";
import { processBaseData } from "./utils";

// intersection操作に対応する処理
export const processIntersectionOperation = (props: OperationProcessorProps): ProcessedData => {
    const { rule } = props;
    const baseData = processBaseData(props);
    let { stringLists } = baseData;
    
    const num = rule.minCount || rule.maxCount || 1;
    
    // stringListsが空でない場合のみ処理を行う
    if (stringLists.length > 0) {
        for (let i = 0; i < num; i++) {
            const ad = generateName();
            stringLists = stringLists.map((item) => {
                return { ...item, value: [ad, ...(item.value || [])] };
            });
        }
    }
    
    return {
        ...baseData,
        stringLists
    };
};

// generateName関数をローカルで定義（utils.tsxからインポートしても良い）
function generateName(): string {
    return Math.random().toString(36).substring(2, 8);
}

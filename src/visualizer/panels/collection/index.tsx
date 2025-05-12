import { OperationProcessorProps, ProcessedData } from "./types";
import { processBaseData } from "./utils";
import { processIntersectionOperation } from "./intersectionOperation";
import { processContainsOperation } from "./containsOperation";
import { processReferenceIntersectionCountOperation } from "./referenceIntersectionCountOperation";

// 各operationタイプに応じた処理を行うファクトリ関数
export const processCollectionRule = (props: OperationProcessorProps): ProcessedData => {
    const { rule } = props;
    
    switch (rule.operation) {
        case "intersection":
            return processIntersectionOperation(props);
        case "contains":
            return processContainsOperation(props);
        case "reference_intersection_count":
            return processReferenceIntersectionCountOperation(props);
        default:
            // デフォルトは基本処理のみ
            return processBaseData(props);
    }
};

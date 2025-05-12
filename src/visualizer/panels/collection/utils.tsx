import { 
    createDisplayJSONfromRuleExpression, 
    createRawExtractedData 
} from "../../../utils/displayPropertyExpression";
import { generateName, generateRandomStringListValue } from "./generateSampleData";
import { ProcessedData, OperationProcessorProps } from "./types";

// 基本的なデータ処理を行う共通関数
export const processBaseData = ({ rule, structure, attributes }: OperationProcessorProps): ProcessedData => {
    const measurements = (Array.isArray(rule.measurements)) ? rule.measurements[0] : rule.measurements;
    
    // unknown型をstring型に変換（または空文字列をデフォルト値として使用）
    const measurementStr = typeof measurements === 'string' ? measurements : '';
    const output = createRawExtractedData(measurementStr, structure) || { extractedData: [] };
    
    const measurementdisplay = createDisplayJSONfromRuleExpression(measurementStr, structure, attributes || []) || {
        label: '',
        labelType: '',
        operations: [],
        structure: []
    };
    
    // unknown型をstring型に変換（または空文字列をデフォルト値として使用）
    const referenceValueStr = typeof rule.referenceValue === 'string' ? rule.referenceValue : '';
    const referenceDisplay = createDisplayJSONfromRuleExpression(referenceValueStr, structure, attributes || []) || {
        label: '',
        labelType: '',
        operations: [],
        structure: []
    };

    // output.extractedDataを使用し、配列でない場合は空配列をデフォルト値として使用
    const outputData = Array.isArray(output.extractedData) ? output.extractedData : [];
    const stringLists = outputData.map(() => {
        return { name: generateName(), value: generateRandomStringListValue(2) };
    });

    return {
        stringLists,
        referenceValueStringLists: [],
        measurementdisplay,
        referenceDisplay
    };
};

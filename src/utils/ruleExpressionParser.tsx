import { extractPartStructureByExpression } from './partStructureExtractor';
import { ParsedStructure } from '../store/types';

// データ型の定義
export type DataValue = string | number | boolean | null;
export type DataArray = DataValue[] | DataValue[][] | string[][];
export type DataType = DataValue | DataArray | Record<string, unknown> | DataType[];

export type PropertyExpressionResult = {
    extractedData: DataType;
    operations: string[];
    propertySelectors: string[];
    displayLabel: string;
};

// サポートされている操作の型
export type PropertyOperation = 
    | "flatten" 
    | "min" 
    | "max" 
    | "avg" 
    | "sum" 
    | "count"
    | "set_intersection";


function extractOperations(expression: string): PropertyOperation[] {
    const operations: PropertyOperation[] = [];
    let remainingExpression = expression;

    while (true) {
        const match = remainingExpression.match(/^(\w+)\((.*)\)$/);
        if (!match) break;

        operations.push(match[1] as PropertyOperation);
        remainingExpression = match[2];
    }

    return operations;
}

function extractAndNormalizePropertyKeys(expression: string): string {
    let normalizedExpression = expression;
    
    // まず操作部分を取り除く
    while (true) {
        const match = normalizedExpression.match(/^(\w+)\((.*)\)$/);
        if (!match) break;
        normalizedExpression = match[2];
    }

    // normalizedExpression 内の各 segment をチェックし、キーのみの場合に `[*]` を追加
    const segments = normalizedExpression.split(".");
    normalizedExpression = segments
        .map((segment) => {
            const isKeyOnly = /^[a-zA-Z_]\w*$/.test(segment); // キーのみの場合
            return isKeyOnly ? `${segment}[*]` : segment; // キーのみなら `[*]` を追加
        })
        .join(".");

    return normalizedExpression;
}

// データがネストしている場合、操作を適用し次元を減らす
function applyOperation(operation: PropertyOperation, data: DataType): DataType {
    // flattenの場合は特別処理
    if (operation === "flatten") {
        return Array.isArray(data) ? data.flat() : data;
    }

    // データが2次元配列の場合
    if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
        return data.map(() => {
            return getOperationResultType(operation);
        });
    } 
    // データが1次元配列または単一値の場合
    else {
        return getOperationResultType(operation);
    }
}

// 操作に基づいて結果の型を返す
function getOperationResultType(operation: PropertyOperation): DataType {
    switch (operation) {
        case "min":
        case "max":
        case "avg":
        case "sum":
        case "count":
            return "num";
        case "set_intersection":
            return ["string", "string", "string"];
        default:
            throw new Error(`サポートされていない操作: ${operation}`);
    }
}

function applyOperations(data: DataType, operations: PropertyOperation[]): DataType {
    let result = data;
    operations.forEach((operation) => {
        result = applyOperation(operation, result);
    });
    return result;
}



function isExpressionSingleValue(expression: string): boolean {
    return (expression.split(".").length == 1);
}

// FlexMatch式を解決し、データ構造から値を抽出して処理する関数
export function resolveFlexMatchExpression(expression: string | DataType, enrichedTeamStructure: ParsedStructure): PropertyExpressionResult {
    // 文字列でない場合は直接値を返す
    if (typeof expression !== 'string') {
        return { 
            extractedData: expression, 
            operations: [], 
            propertySelectors: [], 
            displayLabel: JSON.stringify(expression) 
        };
    }

    // 単一値の場合はそのまま返す
    if (isExpressionSingleValue(expression)) {
        return { 
            extractedData: expression, 
            operations: [], 
            propertySelectors: [], 
            displayLabel: expression 
        };
    }

    // 式を解析
    const operations = extractOperations(expression);
    const normalizedExpression = extractAndNormalizePropertyKeys(expression);
    operations.reverse();

    // enrichedTeamStructure から、normalizedExpression が指し示すデータ構造を抽出する
    const { extractedData, keysList } = extractPartStructureByExpression(enrichedTeamStructure, normalizedExpression);

    // 操作を適用
    const processedData = applyOperations(extractedData, operations);

    return { 
        extractedData: processedData, 
        operations: operations, 
        propertySelectors: keysList, 
        displayLabel: keysList[keysList.length - 1] || '' 
    };
}

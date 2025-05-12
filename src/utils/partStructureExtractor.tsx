import { DataType, DataArray } from './ruleExpressionParser';
import { ParsedStructure } from '../store/types';

// 内部処理用の型定義
type NestedData = Record<string, DataType> | DataArray | null;

/**
 * ネストされたデータ構造から指定されたキーとインデックスに基づいてデータを抽出する関数
 * 
 * @param data 処理対象のデータ（オブジェクトまたは配列）
 * @param key 抽出するプロパティのキー
 * @param indexSelector インデックスセレクタ（"*"=全て、"a,b,c"=複数指定、"a"=単一指定）
 * @returns 抽出されたデータ
 */
function extractNestedData(data: NestedData, key: string, indexSelector: string): DataType {
    // 配列の場合、各要素に対して再帰的に処理
    if (Array.isArray(data)) {
        return data.map((item) => extractNestedData(item as NestedData, key, indexSelector));
    }

    // オブジェクトの場合、キーとインデックスに基づいてデータを抽出
    if (typeof data === "object" && data !== null) {
        // インデックスセレクタの解析
        const indices: string[] = parseIndexSelector(data, key, indexSelector);
        
        // データの抽出
        const extractedValues = (data as Record<string, DataArray>)[key]
            .flatMap((item) => {
                // itemがオブジェクトの場合のみインデックスアクセスを行う
                if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
                    return indices.map(idx => (item as Record<string, DataType>)[idx]);
                }
                return [];
            })
            .filter((item) => item !== undefined); // undefined の要素を除外

        // 単一インデックスの場合は配列から取り出す
        return indices.length === 1 ? extractedValues[0] : extractedValues;
    }

    // それ以外の場合はそのまま返す
    return data;
}

function parseIndexSelector(data: Record<string, DataType>, key: string, indexSelector: string): string[] {
    if (indexSelector === "*") {
        // "*" の場合、全ての子要素のキーを取得
        return (data[key] as Array<unknown>).flatMap((item) => {
            // itemがオブジェクトの場合のみキーを取得
            if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
                return Object.keys(item as Record<string, unknown>);
            }
            return [];
        });
    } else if (indexSelector.includes(",")) {
        // カンマ区切りの場合、複数のインデックスとして分割
        return indexSelector.split(",");
    } else {
        // それ以外の場合は単一のインデックスとして扱う
        return [indexSelector];
    }
}

/**
 * プロパティパス（ドット区切りの"key[index]"形式）に従ってデータを階層的に探索・抽出する関数
 * 
 * @param dataSource 探索元となるデータオブジェクト
 * @param propertyPath ドット区切りのプロパティパス（例: "players[*].attributes[score]"）
 * @returns {
 *   extractedData: プロパティパスに基づいて抽出されたデータ
 *     - 例えば "players[*].attributes[score]" の場合、全プレイヤーのスコア値が返される
 *     - 配列や単一値など、パスの解決結果に応じた形式のデータが含まれる
 *   propertySelectors: パス内の各セグメントで使用されたセレクタの配列
 *     - 例えば ["*", "score"] のように、各セグメントの [] 内の値が格納される
 *     - これらは後でラベル表示などに使用される
 * }
 */
export function extractPartStructureByExpression(dataSource: ParsedStructure | Record<string, DataType>, propertyPath: string): { extractedData: DataType; keysList: string[] } {
    const segments = propertyPath.split(".");
    let extractedData: NestedData = dataSource as NestedData;
    const keysList: string[] = [];

    for (const segment of segments) {
        const match = segment.match(/(\w+)\[(.*?)\]/); // "key[index]"形式にマッチ
        if (!match) continue;
        const [, key, indexSelector] = match;

        extractedData = extractNestedData(extractedData, key, indexSelector) as NestedData;
        keysList.push(indexSelector);
    }

    return { extractedData, keysList };
}

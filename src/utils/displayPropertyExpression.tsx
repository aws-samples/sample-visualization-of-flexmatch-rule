import { Container, Icon, SpaceBetween } from "@cloudscape-design/components";
import React from "react";
import { DataTypeBadge } from "../components/common/badges/DataTypeBadge.tsx";
import { resolveFlexMatchExpression, DataType } from "./ruleExpressionParser.tsx";
import { ParsedStructure } from "../store/types.tsx";
import { PlayerAttribute } from "./definitions.tsx";

// 文字列または文字列の配列を要素として持つ階層構造データ配列
export type NestedArray = Array<string | string[]>;

// 表示用のJSON結果
export interface DisplayJSONResult {
  label: string;
  labelType: string;
  operations: string[];
  structure: NestedArray[];
}

// キー文字列からキーの数を計算する（"*"の場合は特別に10を返す）
function countKeys(keyString: string): number {
  if (keyString === "*") {
    return 10;
  }
  return keyString.split(",").length;
}

// チームデータからプレイヤー数を取得する
function getPlayerCount(team: Record<string, unknown>): number {
  const teamValues = Object.values(team)[0] as { 
    players: { [playerName: string]: { attributes: { [attributeName: string]: string }[] } }[] 
  };
  return teamValues.players.length;
}

// 単一キーの場合のデータ配列を作成する
function createSingleKeyArray(structure: ParsedStructure, labelValue: string): NestedArray {
  const result: NestedArray = [];
  
  for (const team of structure.teams) {
    const playerCount = getPlayerCount(team);
    for (let i = 0; i < playerCount; i++) {
      result.push(labelValue);
    }
  }
  
  return result;
}

// 複数キーの場合のデータ配列を作成する
function createMultiKeyArray(structure: ParsedStructure, labelValue: string): NestedArray {
  const result: NestedArray = [];
  
  for (const team of structure.teams) {
    const innerArray: string[] = [];
    result.push(innerArray);
    
    const playerCount = getPlayerCount(team);
    for (let i = 0; i < playerCount; i++) {
      innerArray.push(labelValue);
    }
  }
  
  return result;
}

// パース済み構造からネストされた配列を作成する
function convertStructuredJSONToNestedArray(
  structure: ParsedStructure,
  labelValue: string,
  operations: string[],
  keys: string[] | undefined
): NestedArray[] {
  // キーがない場合は空配列を返す
  if (!keys || keys.length === 0) {
    return [];
  }

  // キーの数に基づいて適切な配列を作成
  const keysNum = countKeys(keys[0]);
  const initialArray = keysNum === 1
    ? createSingleKeyArray(structure, labelValue)
    : createMultiKeyArray(structure, labelValue);

  // 表示用の配列を初期化し、最初のデータを追加
  const displayArray: NestedArray[] = [initialArray];

  // 各操作を順番に適用
  operations.forEach((operation) => {
    const lastArray = displayArray[displayArray.length - 1];
    displayArray.push(applyOperation(lastArray, operation));
  });

  return displayArray;
}

// データ配列に操作を適用する
function applyOperation(data: NestedArray, operation: string): NestedArray {
  // 集計操作のリスト
  const aggregationOperations = ["stddev", "sum", "median", "std", "avg", "min", "max", "count"];
  
  if (aggregationOperations.includes(operation)) {
    return applyAggregationOperation(data, operation);
  } else if (operation === "flatten") {
    return data.flat() as NestedArray;
  }
  
  return data;
}

// 集計操作をデータ配列に適用する
function applyAggregationOperation(data: NestedArray, operation: string): NestedArray {
  // 2次元配列の場合
  if (Array.isArray(data[0])) {
    return data.map((d: string | string[]) => {
      return `${operation} ${Array.isArray(d) ? d[0] : d}`;
    }) as NestedArray;
  } 
  // 1次元配列の場合
  else {
    return [`${operation} ${data[0]}`];
  }
}

// データを再帰的にJSX要素に変換する
function generateVisualElement(data: string | string[] | NestedArray): JSX.Element {
  if (Array.isArray(data)) {
    return (
      <Container disableContentPaddings>
        <div style={{ margin: "5px" }}>
          <SpaceBetween size="xxxs" direction="vertical" alignItems="center">
            {data.map((item: string | string[], index: number) => (
              <React.Fragment key={index}>
                {generateVisualElement(item)}
              </React.Fragment>
            ))}
          </SpaceBetween>
        </div>
      </Container>
    );
  } else {
    return <DataTypeBadge dataType={data} id={data}>{data}</DataTypeBadge>;
  }
}

// FlexMatchの構造データから視覚的な表現を作成する
export function createVisualRepresentationFromFlexMatch(structure: NestedArray[], operations: string[]) {
  return (
    <SpaceBetween size="s" direction="horizontal" alignItems="center" key={"1"}>
      {structure.map((data: NestedArray, index: number) => {
        // 操作の矢印と名前を表示（最後の要素以外）
        const operationArrow = index < structure.length - 1 && (
          <SpaceBetween size="xxxs" key={index} direction="vertical" alignItems="center">
            <Icon name="arrow-right" size="small" key={"icon-arrow"} />
            <div key={"operations"}>{operations[index]}</div>
          </SpaceBetween>
        );
        
        return (
          <div key={index}>
            <SpaceBetween size="xs" direction="horizontal" alignItems="center">
              {generateVisualElement(data)}
              {operationArrow}
            </SpaceBetween>
          </div>
        );
      })}
    </SpaceBetween>
  );
}

// ルール表現から生データを抽出する
export function createRawExtractedData(ruleExpression: string | DataType, structure: ParsedStructure) {
  if (ruleExpression === "undefined" || ruleExpression === undefined) {
    return undefined;
  }
  return resolveFlexMatchExpression(ruleExpression, structure);
}

// ルール表現から表示用JSONを作成する
export function createDisplayJSONfromRuleExpression(
  ruleExpression: string | undefined, 
  structure: ParsedStructure, 
  attributes: PlayerAttribute[]
): DisplayJSONResult | undefined {
  // 無効な表現の場合はundefinedを返す
  if (ruleExpression === "undefined" || ruleExpression === undefined) {
    return undefined;
  }

  // ルール表現を解析
  const rawObject = resolveFlexMatchExpression(ruleExpression as DataType, structure);
  
  // ラベルタイプを決定
  const labelType = determineLabelType(rawObject, attributes);
  
  // 構造化配列を作成
  const structuredArray = convertStructuredJSONToNestedArray(
    structure,
    labelType, 
    rawObject.operations, 
    rawObject.propertySelectors
  );

  // 結果を返す
  return {
    label: rawObject.displayLabel,
    labelType: labelType,
    operations: rawObject.operations,
    structure: structuredArray
  };
}

// 解析されたオブジェクトからラベルタイプを決定する
function determineLabelType(
  rawObject: { displayLabel: string; propertySelectors?: string[]; operations?: string[] }, 
  attributes: PlayerAttribute[]
): string {
  // 属性からラベルタイプを検索
  let labelType = attributes?.find(
    (attribute: PlayerAttribute) => attribute.name === rawObject.displayLabel
  )?.type || "string";

  // プロパティセレクタが2つだけの場合（players までの指定）
  if (rawObject.propertySelectors && rawObject.propertySelectors.length === 2) {
    labelType = "string";
  }

  // count操作の場合は数値として扱う
  if (rawObject.operations && rawObject.operations[0] === "count") {
    labelType = "number";
    rawObject.displayLabel = "count";
  }

  return labelType;
}

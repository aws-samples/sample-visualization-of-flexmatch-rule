import { FC, ReactNode } from "react";
import * as awsui from "@cloudscape-design/design-tokens";

// データ型の定義
export type DataType = "number" | "string" | "string_list" | "string_number_map" | "unknown";

// コンポーネントのプロパティ定義
interface DataTypeBadgeProps {
  dataType: DataType | string;
  children: ReactNode;
  id?: string;
}

// 共通スタイル
const baseStyle = {
  borderRadius: awsui.borderRadiusBadge,
  paddingInline: awsui.spaceScaledXs,
  color: "white",
  fontSize: awsui.fontSizeBodyS,
  display: "inline-block",
};

// データ型ごとの色定義
const typeColors = {
  number: awsui.colorChartsBlue2300,
  string: awsui.colorChartsGreen500,
  string_list: awsui.colorChartsGreen300,
  string_number_map: awsui.colorChartsPurple300,
  default: awsui.colorBackgroundNotificationGrey
};

// string_list用のドットスタイル
const dotStyle = {
  borderRadius: awsui.borderRadiusBadge ,
  color: "white",
  fontSize: awsui.fontSizeBodyS,
  backgroundColor: awsui.colorChartsGreen500,
  margin: 1,
  padding: "5px 6px 5px 6px",
  display: "inline"
};

export const DataTypeBadge: FC<DataTypeBadgeProps> = ({ dataType, children, id }) => {
  // 型に基づいて背景色を決定
  const backgroundColor = typeColors[dataType as keyof typeof typeColors] || typeColors.default;
  
  // 基本スタイルに背景色を適用
  const badgeStyle = { ...baseStyle, backgroundColor };
  
  // string_list型の場合は特殊な表示
  if (dataType === "string_list") {
    return (
      <div key={id}>
        <div style={badgeStyle}>
          {children}
          <div style={{ paddingLeft: 6, display: "inline-flex", alignItems: "center", gap: 2 }}>
            {[...Array(3)].map((_, index) => (
              <div key={`dot-${index}`} style={dotStyle} ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // その他の型の場合は通常のバッジ表示
  return <div style={badgeStyle} key={id}>{children}</div>;
};

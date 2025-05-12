import { Header, Button, SpaceBetween, CopyToClipboard } from "@cloudscape-design/components";

interface EditorCustomHeaderProps {
  value: string;
  handleVisualizeButtonClick: () => void;
  handlePresetRuleButtonClick: () => void;
}

export function EditorCustomHeader({ value, handleVisualizeButtonClick, handlePresetRuleButtonClick }: EditorCustomHeaderProps) {
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
      <div><Header variant="h2">{"Rule Editor"}</Header></div>
      <SpaceBetween size={"s"} direction={"horizontal"}>
        <Button key={"start"} onClick={handlePresetRuleButtonClick}> Load FlexMatch preset rule </Button>
        <Button key={"visualize"} onClick={handleVisualizeButtonClick} iconName={"grid-view"}> Visualize</Button>
        <CopyToClipboard
          variant={"icon"}
          copyButtonText="Copy to Clipboard"
          copyErrorText="failed to copy"
          copySuccessText="copied"
          textToCopy={value}
        />
      </SpaceBetween>
    </div>
  );
}

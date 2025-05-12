import {
  Alert,
  Container,
  Button,
  Box,
  SpaceBetween,
} from "@cloudscape-design/components";
import PresetFlexMatchRuleLoaderModal from "../../components/editor/PresetFlexMatchRuleLoaderModal.tsx";
import { loadPresetFlexMatchRule } from "../../components/editor/PresetFlexMatchRuleLoader.tsx";
import { useEditorValueManager } from "./useEditorValueManager.tsx";
import { useAceEditor } from "./useAceEditor";
import { EditorCustomHeader } from "./EditorCustomHeader.tsx";
import { CodeEditor } from "@cloudscape-design/components";
import { useState } from "react";

function CloudScapeEditor() {
  // このコンポーネントのレンダリングの際に呼び出し。値の管理と、Redux ステートの更新を行う
  const {
    value,
    updateValue,
    validateAndUpdateReduxState,
    alertDismissed,
    setAlertDismissed,
    alertText
  } = useEditorValueManager();

  // このコンポーネントのレンダリングの際に呼び出し。Aceエディタのロードを行う
  const {
    ace,
    loading,
    preferences,
    setPreferences,
    error,
    errorMessage,
    retryLoading
  } = useAceEditor();

  // FlexMatchプリセットルールモーダルの表示状態を管理
  const [presetFlexMatchModalVisible, setPresetFlexMatchModalVisible] = useState(false);

  // 指定された名前のプリセットルールを取得してエディタに設定する
  function fetchJsonRule(name: string) {
    loadPresetFlexMatchRule(name)
      .then((data) => {
        updateValue(JSON.stringify(data, null, 2));
      })
      .catch(error => {
        console.error("Error loading JSON file:", error);
      });
  }

  return (
    <Container
      disableContentPaddings={true}
      header={
        <EditorCustomHeader
          value={value}
          handleVisualizeButtonClick={validateAndUpdateReduxState}
          handlePresetRuleButtonClick={() => setPresetFlexMatchModalVisible(true)}
        />
      }
    >

      {/* FlexMatchプリセットルールを選択するモーダル */}
      <PresetFlexMatchRuleLoaderModal
        setJsonRule={fetchJsonRule}
        setModalVisible={setPresetFlexMatchModalVisible}
        modalVisible={presetFlexMatchModalVisible}
      />

      {/* JSON検証エラー時のアラート表示 */}
      {alertDismissed && (
        <Alert
          type="error"
          dismissible={true}
          onDismiss={() => setAlertDismissed(false)}
        >
          {alertText}
        </Alert>
      )}

      {/* Aceエディタ読み込みエラー時のアラート表示 */}
      {error && (
        <Alert
          type="error"
          header="エディタの読み込みエラー"
        >
          <SpaceBetween direction="vertical" size="s">
            <div>
              Aceエディタの読み込み中にエラーが発生しました。
              {errorMessage && <Box variant="p">{errorMessage}</Box>}
            </div>
            <Button onClick={retryLoading}>再読み込み</Button>
          </SpaceBetween>
        </Alert>
      )}

      {/* CloudScapeのコードエディタコンポーネント */}
      <CodeEditor
        controlId={"CodeEditor"}
        ace={ace}
        value={value}
        language="json"
        onDelayedChange={event => updateValue(event.detail.value)}
        loading={loading || error !== null}
        themes={{
          light: ["cloud_editor", "clouds"],
          dark: ["cloud_editor_dark", "chaos"]
        }}
        preferences={preferences}
        onPreferencesChange={event => {
          setPreferences(event.detail);
        }}
      />
    </Container>
  );
}

export default CloudScapeEditor;

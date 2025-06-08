import './App.css'
import {
    AppLayout, AppLayoutProps,
    ContentLayout,
    Header,
    HelpPanel,
    Icon,
    SplitPanel,
} from '@cloudscape-design/components';
import { I18nProvider } from "@cloudscape-design/components/i18n";
import messages from '@cloudscape-design/components/i18n/messages/all.en';
import Visualize from './visualizer/main'
import { useState } from "react";
import CloudScapeEditor from "./visualizer/editor/CloudScapeEditor.tsx";
import RepoExplanation from './components/repo/RepoExplanation';

import { Theme, applyTheme } from '@cloudscape-design/components/theming';

const theme: Theme = {...};

const { reset } = applyTheme({ theme });
// Use the reset method to remove the custom theme

const LOCALE = 'en';

function App() {
    const [splitPanelPreferencesState, setSplitPanelPreference]
        = useState<AppLayoutProps.SplitPanelPreferences>({ position: import.meta.env.VITE_EXAMPLE_DOC_FEATURE === 'true' ? "bottom" : "side" });
    const [splitPanelOpen, setSplitPanelOpen] = useState(!(import.meta.env.VITE_EXAMPLE_DOC_FEATURE === 'true'));

    return (
        <div style={{ width: "100vw" }}>
            <I18nProvider locale={LOCALE} messages={[messages]}>
                {import.meta.env.VITE_EXAMPLE_DOC_FEATURE === 'true' &&
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: "#bf80ff", padding: "10px 50px 10px 50px" }}>
                            <h2 style={{ color: "white", margin: "0", display: "flex", gap: "10px" }}> <Icon name="edit" size="inherit" /> FlexMatch Rule Visualizer Example</h2>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", background: "#0f141a", }}>
                            <div style={{ maxWidth:"1280px", display: "flex", justifyContent: "space-between", alignItems: "center",gap: "20px", padding: "50px 20px", }}>
                            <div style={{ flex: 1}}>
                                <h1 style={{ fontSize: "60px" }}>
                                    Accelerate matchmaking developments
                                </h1>
                                <h1>for developers, designers, and producers.</h1>
                                A sample tool to visualize Amazon GameLift FlexMatch matchmaking rules.
                            </div>
                            <div style={{ flex: 1 }}>
                                <img src="./screenshot.png" alt="Screenshot" style={{ maxWidth: "100%", height: "auto" }} />
                            </div>
                            </div>
                        </div>
                    </div>
                }

                <AppLayout
                    navigationHide={true}
                    toolsHide={true}
                    tools={<HelpPanel header={<h2>Overview</h2>}>Help contfsent</HelpPanel>}
                    content={
                        <ContentLayout
                            header={import.meta.env.VITE_EXAMPLE_DOC_FEATURE !== 'true' && <Header variant="h1">FlexMatch Rule Visualizer</Header>}

                        >
                            {import.meta.env.VITE_EXAMPLE_DOC_FEATURE === 'true' && <RepoExplanation />}
                            <CloudScapeEditor />
                        </ContentLayout>
                    }
                    splitPanelOpen={splitPanelOpen}
                    splitPanelPreferences={splitPanelPreferencesState}
                    splitPanel={
                        <SplitPanel header="Visualize">
                            <Visualize />
                        </SplitPanel>
                    }
                    onSplitPanelPreferencesChange={event => {
                        setSplitPanelPreference(event.detail)
                    }}
                    onSplitPanelToggle={event => {
                        setSplitPanelOpen(event.detail.open)
                    }}
                />
            </I18nProvider>
        </div>
    )
}

export default App

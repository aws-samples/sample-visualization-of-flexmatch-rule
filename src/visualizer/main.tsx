import {
    SpaceBetween,
} from "@cloudscape-design/components";
import Teams from "./panels/teams.tsx";
import Attributes from "./panels/attributes.tsx";
import jsonObjectStore from "../store/reduxJsonObjectStore.tsx";
import { useState } from "react";
import { Provider } from "react-redux";
import Latency from "./panels/latency.tsx";
import Expansions from "./panels/expansions.tsx";
import Algorithms from "./panels/algorithms.tsx";
import BatchDistance from "./panels/batchDistance.tsx";
import AbsoluteSort from "./panels/absoluteSort.tsx";
import DistanceSort from "./panels/distanceSort.tsx";
import Collection from "./panels/collection.tsx";
import Compound from "./panels/compound.tsx";
import Comparison from "./panels/comparison.tsx";
import Distance from "./panels/distance.tsx";
import Overview from "./panels/overview.tsx";
import { SectionPanelContainer } from "../components/common/panels/SectionPanelContainer.tsx";
import { Expansion, Rule } from "../utils/definitions.tsx";

function Visualize() {
    const [rules, setRules] = useState<Rule[]| undefined>([]);
    const [expansions, setExpansions] = useState<Expansion[] | undefined>(undefined);

    jsonObjectStore.subscribe(() => {
        const val = jsonObjectStore.getState().typedStructure;
        setRules(val.rules)
        setExpansions(val.expansions)
    })

    return (
        <>
            <Provider store={jsonObjectStore}>
                <SpaceBetween direction="horizontal" size="xs">
                    <SectionPanelContainer key={"overview"} title="Match overview">
                        <Overview></Overview>
                    </SectionPanelContainer>

                    <SectionPanelContainer key={"teams"} title="Teams">
                        <Teams></Teams>
                    </SectionPanelContainer>

                    <SectionPanelContainer key={"attributes"} title="Player attributes">
                        <Attributes></Attributes>
                    </SectionPanelContainer>

                    <SectionPanelContainer key={"algorithm"} title="Algorithms">
                        <Algorithms></Algorithms>
                    </SectionPanelContainer>


                    {rules?.map((rule, index) => (
                        <SectionPanelContainer key={`rule-${index}`} title={`${rule.name} Rule`} subtitle={`type: ${rule.type}`}>
                            {rule.type === "latency" && <Latency latency={rule} />}
                            {rule.type === "batchDistance" && <BatchDistance batchDistance={rule} />}
                            {rule.type === "absoluteSort" && <AbsoluteSort absoluteSort={rule} />}
                            {rule.type === "distanceSort" && <DistanceSort distanceSort={rule} />}
                            {rule.type === "collection" && <Collection rule={rule} />}
                            {rule.type === "compound" && <Compound CompoundRule={rule} />}
                            {rule.type === "comparison" && <Comparison comparisonRule={rule} />}
                            {rule.type === "distance" && <Distance distanceRule={rule} />}

                        </SectionPanelContainer>
                    ))}

                    {expansions !== undefined && (
                        <SectionPanelContainer key={"expansions"} title="Expansions">
                            <Expansions></Expansions>
                        </SectionPanelContainer>
                    )}


                </SpaceBetween>
            </Provider>
        </>
    )
}

export default Visualize;

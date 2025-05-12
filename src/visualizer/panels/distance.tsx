import React from 'react';
import {KeyValuePairs, SpaceBetween} from "@cloudscape-design/components";
import { useSelector } from "react-redux";
import { StoreState } from "../../store/types";
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';
import {
    createDisplayJSONfromRuleExpression,
    createVisualRepresentationFromFlexMatch
} from "../../utils/displayPropertyExpression.tsx";

interface DistanceRule {
    measurements: string;
    referenceValue: number;
    minDistance?: number;
    maxDistance?: number;
    partyAggregation?: 'min' | 'max' | 'avg';
}

interface DistanceProps {
    distanceRule: DistanceRule;
}



const Distance: React.FC<DistanceProps> = ({ distanceRule }) => {
    const structure = useSelector((state: StoreState) => state.enrichedTeamStructure );
    const attributes = useSelector((state: StoreState) => state.typedStructure.playerAttributes);
    const measurementExpression = Array.isArray(distanceRule.measurements) 
        ? distanceRule.measurements[0] 
        : distanceRule.measurements;
    const measurementdisplay = createDisplayJSONfromRuleExpression(measurementExpression, structure, attributes || []);
    const referenceDisplay = createDisplayJSONfromRuleExpression(distanceRule.referenceValue.toString(), structure, attributes || []);




    return (
        <div style={{minWidth: "400px" }}>
            <SpaceBetween size="xs" direction="vertical">
                <KeyValuePairs
                    key={"kv"}
                    columns={1}
                    items={[
                        {
                        label: "Reference Value (Value for criteria)",
                        value:  (<>
                            {JSON.stringify(distanceRule.referenceValue)}
                            {referenceDisplay && createVisualRepresentationFromFlexMatch(referenceDisplay.structure, referenceDisplay.operations)}
                        </>),
                    },
                        {
                            label: "Measurements Value(s) (multi value)",
                            value:  (<>
                                {JSON.stringify(distanceRule.measurements)}
                                {measurementdisplay && createVisualRepresentationFromFlexMatch(measurementdisplay.structure, measurementdisplay.operations)}
                            </>),
                        },
                        {
                            label: "Min Distance",
                            value: (<>
                                {distanceRule.minDistance ?
                                    <>
                                        <div>distanceRule.minDistance</div>
                                        <div>
                                            <p>Measurements values are in a following range</p>
                                            <Slider
                                                range
                                                count={3}
                                                min={0}
                                                max={100}
                                                marks={{
                                                    20: ' - ' + distanceRule.minDistance,
                                                    50: 'Refarence value',
                                                    80: ' + ' + distanceRule.minDistance,
                                                }}
                                                defaultValue={[0, 20, 80, 100]}
                                            />
                                        </div>
                                    </>
                                    : "N/A"}
                            </>
                            ),
                        },
                        {
                            label: "Max Distance",
                            value: (<>
                                {distanceRule.maxDistance ?
                                    <>
                                        <div>{distanceRule.maxDistance}</div>
                                        <div>
                                            <p>Measurements values are in a following range</p>
                                            <Slider
                                                range
                                                min={0}
                                                max={100}
                                                marks={{
                                                    20: ' - ' + distanceRule.maxDistance,
                                                    50: 'Refarence value',
                                                    80: ' + ' + distanceRule.maxDistance,
                                                }}
                                                defaultValue={[20, 80]}
                                            />
                                        </div>
                                    </>
                                    : "N/A"}
                            </>)
                        },
                    ]}
                >
                </KeyValuePairs>


            </SpaceBetween>
        </div>
    );
};

export default Distance;

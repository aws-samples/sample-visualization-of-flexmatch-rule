import React from 'react';
import {KeyValuePairs, SpaceBetween} from "@cloudscape-design/components";
import {useSelector} from "react-redux";
import IconNode from "../../components/flow/IconNode.tsx";
import IconEdge from "../../components/flow/IconEdge.tsx";
import {Edge} from "@xyflow/react";
import {
    createDisplayJSONfromRuleExpression,
    createVisualRepresentationFromFlexMatch
} from "../../utils/displayPropertyExpression.tsx";
import ReactFlowCanvas from "../../components/flow/ReactFlowCanvas.tsx";
import {ComparisonRule} from "../../utils/definitions.tsx";
import { StoreState } from "../../store/types";
import SimpleNode from "../../components/flow/SimpleNode.tsx";

interface ComparisonProps {
    comparisonRule: ComparisonRule
}

const Comparison: React.FC<ComparisonProps> = ({comparisonRule}) => {

    const structure = useSelector((state: StoreState) => state.enrichedTeamStructure );
    const attributes = useSelector((state: StoreState) => state.typedStructure.playerAttributes);

    const measurementExpression = Array.isArray(comparisonRule.measurements) 
        ? comparisonRule.measurements[0] 
        : comparisonRule.measurements;
    const measurementdisplay = createDisplayJSONfromRuleExpression(measurementExpression, structure, attributes || []);
    if (measurementdisplay === undefined) {
        return <></>
    }
    const referenceDisplay = createDisplayJSONfromRuleExpression(String(comparisonRule.referenceValue), structure, attributes || []);

    const nodeTypes = {
        IconNode: IconNode,
        SimpleNode: SimpleNode
    };


    const lastStructure = measurementdisplay.structure[measurementdisplay.structure.length - 1];

    const nodeCount = Math.min( (Array.isArray(lastStructure)? lastStructure.length: 1), 7); // Change this value to adjust the number of nodes
    const radius = 100;
    const centerX = 110;
    const centerY = 120;

    console.log("nodeCount ", nodeCount)
    

    //  ここもおかしい measurementdisplay.label を label に渡しているけど渡すべきは最終的に parsed された label だと思われる

    const initialNodes = [];

    Array.from({ length: nodeCount }, (_, i) => {
        const angle = (i / nodeCount) * 2 * Math.PI + 0.3;
        let x = centerX + radius * Math.cos(angle);
        let y = centerY + radius * Math.sin(angle);

        if (comparisonRule.referenceValue != undefined) {
            x = 10 ;
            y = 10 + i * 30;
        }

        initialNodes.push( {
            id: (i + 1).toString(),
            type: "IconNode",
            position: { x, y },
            data: { label: '',
                size: "small",
                isCenter: true,
                badgelabel: measurementdisplay.label || measurementExpression,
                type: measurementdisplay.labelType,
                parentId: 'measurements',
                extent: 'parent' as const,
            },
        })
    });

    // initialNodes.push({
    //     id: "measurements",
    //     type: "SimpleNode",
    //     position: { x: 5, y: 5 },
    //     data: {
    //         style: { width: 140, height: 50 * 4 + 35 },
    //         title: "measurements"
    //     }
    // });


    if (referenceDisplay != undefined) {
        initialNodes.push({
            id: "reference",
            type: "IconNode",
            position: { x: centerX + 120, y: centerY },
            data: { label: '',
                // name: "user-profile",
                size: "small",
                isCenter: true,
                badgelabel: referenceDisplay?.label || String(comparisonRule.referenceValue),
                type: referenceDisplay?.labelType,
            },
        });
    }

    const edgeTypes = {
        'icon-edge': IconEdge,
    };
    const edges: Edge[] = [];


    if (referenceDisplay != null) {
        for (let i = 0; i < nodeCount; i++) {
            edges.push({
                type: 'icon-edge',
                id: `e${i + 1}-reference`,
                source: (i + 1).toString(),
                target: "reference",
                sourceHandle: "c",
                targetHandle: "c"
            });
        }
    } else {
        for (let i = 0; i < nodeCount; i++) {
            for (let j = i + 1; j < nodeCount; j++) {
                let label="";
                if (i == 0 && j == 1) {
                    label = comparisonRule.operation;
                } 
                edges.push({
                    type: 'icon-edge',
                    id: `e${i + 1}-${j + 1}`,
                    source: (i + 1).toString(),
                    target: (j + 1).toString(),
                    label: label,
                    sourceHandle: "c",
                    targetHandle: "c"
                });
            }
        }
    }





    return (
        <div style={{minWidth: "400px" }}>
            <SpaceBetween size="xxxs" direction="vertical">
                <KeyValuePairs
                    key={"kv"}
                    columns={1}
                    items={[
                        {
                            label: "Reference Value (single value)",
                            value:  (<>{referenceDisplay && 
                            <>
                            {JSON.stringify(comparisonRule.referenceValue)}
                            {referenceDisplay.labelType && createVisualRepresentationFromFlexMatch(referenceDisplay.structure, referenceDisplay.operations)}
                            </>
                            }    
                            </>),
                        },{
                            label: "Measurements Value(s) (multi value)",
                            value:  (<>
                                {JSON.stringify(comparisonRule.measurements)}
                                {measurementdisplay && measurementdisplay.labelType && createVisualRepresentationFromFlexMatch(measurementdisplay.structure, measurementdisplay.operations)}
                            </>),
                        },{
                            label: "Operation",
                            value: (<>
                                {comparisonRule.operation}
                            </>),
                        }

                        ]}
                    >
                </KeyValuePairs>


                <ReactFlowCanvas
                    key={"reactflow"}
                    nodes={initialNodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    width="400px"
                    height="260px"
                />


            </SpaceBetween>
        </div>
);
};

export default Comparison;

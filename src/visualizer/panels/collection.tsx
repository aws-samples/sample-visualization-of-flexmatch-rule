import React from "react";
import {
    Badge,
    ColumnLayout,
    Container,
    Header,
    KeyValuePairs,
    SpaceBetween
} from "@cloudscape-design/components";
import { useSelector } from "react-redux";
import IconNode from "../../components/flow/IconNode.tsx";
import { Edge } from "@xyflow/react";
import ReactFlowCanvas from "../../components/flow/ReactFlowCanvas.tsx";
import SimpleNode from "../../components/flow/SimpleNode.tsx";
import { StoreState } from "../../store/types";
import { createVisualRepresentationFromFlexMatch } from "../../utils/displayPropertyExpression.tsx";
import { CollectionRule, StringListItem } from "./collection/types";
import { processCollectionRule } from "./collection/index";

interface CollectionProps {
    rule: CollectionRule;
}

const Collection: React.FC<CollectionProps> = ({ rule }) => {
    const structure = useSelector((state: StoreState) => state.enrichedTeamStructure);
    const attributes = useSelector((state: StoreState) => state.typedStructure.playerAttributes);

    // 各operationタイプに応じた処理を行う
    const { stringLists, referenceValueStringLists, measurementdisplay, referenceDisplay } = processCollectionRule(
        {
            rule,
            structure,
            attributes
        });

    
    const num = rule.minCount || rule.maxCount || 1;

    const exampleElementsList = stringLists.map((item: StringListItem) => {
        if (!item.value) return []; // 値がない場合は空の配列を返す
        return item.value.map((value: string, index: number) => {
            if (rule.operation == "contains") {
                if (value == rule.referenceValue) {
                    return {value:value, isMatch: true};
                }
            }
            if (rule.operation == "intersection") {
                if (index < num) {
                    return {value:value, isMatch: true};
                }
            }
            if (rule.operation == "reference_intersection_count" && referenceValueStringLists && referenceValueStringLists.length > 0) {
                if (value == referenceValueStringLists[0].name) {
                    return {value:value, isMatch: true};
                }
            }
            return {value:value, isMatch: false};
        });
    });
    // ReactFlowのノードとエッジの設定
    const nodeTypes = {
        IconNode: IconNode,
        SimpleNode: SimpleNode
    };
    const initialNodes = [];

    initialNodes.push({
        id: "measurements",
        type: "SimpleNode",
        position: { x: 10, y: 5 },
        data: {
            style: { width: 180, height: 50 * 6 + 35 },
            title: "measurements"
        }
    });

    for (let i = 0; i < 6; i++) {
        initialNodes.push({
            id: i.toString(),
            type: "IconNode",
            position: { x: 10, y: i * 50 + 25 },
            data: {
                size: "small",
                badgelabel: measurementdisplay.label,
                type: measurementdisplay.labelType,
            },
            parentId: 'measurements',
            extent: 'parent' as const,
        });
    }

    initialNodes.push({
        id: "referencevalue",
        type: "SimpleNode",
        position: { x: 250, y: 5 },
        data: {
            style: { width: 145, height: 50 * 6 + 15 },
            title: "referencevalue"
        }
    });

    for (let i = 0; i < 4; i++) {
        initialNodes.push({
            id: (6 + i).toString(),
            type: "IconNode",
            position: { x: 260, y: (i + 1) * 50 },
            data: {
                label: "",
                size: "small",
                isCenter: true,
                badgelabel: referenceDisplay.label,
                type: referenceDisplay.labelType,
            },
        });
    }

    const edgeTypes = {};
    const edges: Edge[] = [];

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 4; j++) {
            edges.push({
                id: `e${i + 1}-${j + 1}`,
                source: (i).toString(),
                target: (6 + j).toString(),
                sourceHandle: 'r',
                targetHandle: 'l',
            });
        }
    }




    return (
        <div style={{ width: '450px' }}>
            <SpaceBetween size="xs" direction="vertical">

                <KeyValuePairs
                    key={"kv"}
                    columns={1}
                    items={[
                        {
                            label: `Operation type : ${rule.operation}`,
                            value: (<>
                                {rule.operation == "contains" && "This operation counts a number of elements in measurements that is equal to reference value"}
                                {rule.operation == "intersection" && "This operation counts a number of elements that appear in every sublists in measurement values"}
                                {rule.operation == "reference_intersection_count" && "This operation counts a number of elements that appear in referencevalues for each measurements"}
                            </>),
                        },

                        {
                            label: "Reference Value (Value for criteria)",
                            value: (<>
                                {JSON.stringify(rule.referenceValue)}
                                {createVisualRepresentationFromFlexMatch(referenceDisplay.structure as Array<string | string[]>[], referenceDisplay.operations)}
                                {!rule.referenceValue && "N/A"}
                            </>),
                        }, {
                            label: "Measurements Value(s) (multi value)",
                            value: (<>
                                {JSON.stringify(rule.measurements)}
                                {createVisualRepresentationFromFlexMatch(measurementdisplay.structure as Array<string | string[]>[], measurementdisplay.operations)}
                                {!rule.measurements && "N/A"}
                            </>),
                        }, {
                            label: "MinCount",
                            value: (<>{rule.minCount ?? "N/A"}</>),
                        }, {
                            label: "maxCount",
                            value: (<>{rule.maxCount ?? "N/A"}</>),
                        }

                    ]}
                >
                </KeyValuePairs>


                <div key={"key"} style={{ marginTop: "50px" }}>
                    <Container>
                        <Header variant={"h3"}>Example visualization</Header>

                        <h3>measurements</h3>
                            {exampleElementsList.map((item: {value: string, isMatch: boolean}[], itemIndex: number) => {
                                if (!item || item.length === 0) return null;
                                return (<Container disableContentPaddings key={`container-${itemIndex}`}>
                                <ColumnLayout key={`${itemIndex}-columnLayout`} columns={6} disableGutters>
                                    {
                                        item.map((valueObj: {value: string, isMatch: boolean}, index: number) => {
                                            const badgeColor = valueObj.isMatch ? "green" : "grey";
                                            return (
                                                <div style={{ padding: "3px" }} key={`${itemIndex}-${index}`}>
                                                    <Badge color={badgeColor}>{valueObj.value}</Badge>
                                                </div>
                                            );
                                        })
                                    }
                                </ColumnLayout></Container>
                                );
                            })
                            }

                        <h3>reference values</h3>
                        <ColumnLayout key={"columenlayout-referenceValues-col"} columns={6} disableGutters>
                            {referenceValueStringLists && referenceValueStringLists.length > 0 && referenceValueStringLists.map((item: StringListItem) => {
                                return (
                                    <div style={{ padding: "3px" }} key={item.name}>
                                        <Badge
                                            color={"green"}>{
                                                item.name
                                            }</Badge>
                                    </div>
                                );
                            })
                            }
                        </ColumnLayout>
                    </Container>
                </div>


                {
                    (rule.operation == "reference_intersection_count") &&
                    <>
                        <ReactFlowCanvas
                            key={"reactflow"}
                            nodes={initialNodes}
                            edges={edges}
                            nodeTypes={nodeTypes}
                            edgeTypes={edgeTypes}
                            width="400px"
                            height="370px"
                        />
                        <div>For all elements in measurements,
                            the number of elements that match the reference value must be larger than {rule.minCount ?? "N/A"} and be lower than {rule.maxCount ?? "N/A"}.
                        </div>
                    </>

                }
            </SpaceBetween>
        </div>
    );
};

export default Collection;

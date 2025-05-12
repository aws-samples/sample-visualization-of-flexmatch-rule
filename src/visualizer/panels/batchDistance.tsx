import React from "react";
import { Edge} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import IconNode from "../../components/flow/IconNode.tsx";
import { Box, Icon, KeyValuePairs, SpaceBetween} from "@cloudscape-design/components";
import {useSelector} from "react-redux";
import IconEdge from "../../components/flow/IconEdge.tsx";
import { DataTypeBadge } from "../../components/common/badges/DataTypeBadge.tsx";
import ReactFlowCanvas from "../../components/flow/ReactFlowCanvas.tsx";
import { StoreState } from "../../store/types";

interface BatchDistanceProps {
    name: string;
    type: string;
    batchAttribute: string;
    maxDistance: number;
}

interface BatchDistanceGraphProps {
    batchDistance: BatchDistanceProps;
}


const BatchDistanceGraph: React.FC<BatchDistanceGraphProps> = ({ batchDistance }) => {
    // Hooksは常にコンポーネントのトップレベルで呼び出す
    const attributeType = useSelector((state: StoreState) => {
        // batchDistanceが存在しない場合や、batchAttributeが存在しない場合は空文字を返す
        if (!batchDistance || !batchDistance.batchAttribute) return "";
        
        const attribute = state.typedStructure.playerAttributes?.find(attr => attr.name === batchDistance.batchAttribute);
        return attribute ? attribute.type : "";
    });

    if (!batchDistance) {
        return <div>No batch distance rule found</div>;
    }

    // 両方の変数で同じ値を使用
    const badgeattributeType = attributeType;


    const nodeTypes = {
        IconNode: IconNode,
    };

    const nodeCount = 7; // Change this value to adjust the number of nodes
    const radius = 100;
    const centerX = 110;
    const centerY = 120;
    const randomBase = Math.floor(Math.random() * 100);

    const initialNodes = Array.from({ length: nodeCount }, (_, i) => {
        const angle = (i / nodeCount) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const maxDist = batchDistance.maxDistance !== undefined ? batchDistance.maxDistance : 100;
        const r = Math.floor(Math.random() * 100) % maxDist;
        const v = randomBase + r;
        const badgelabel =  (badgeattributeType == "number")? batchDistance.batchAttribute + " : " + v.toString()  : batchDistance.batchAttribute + " : " + "foo";

        return {
            id: (i + 1).toString(),
            type: "IconNode",
            position: { x, y },
            data: { label: '',
                name: "user-profile-active",
                size: "small",
                isCenter: true,
                badgelabel: badgelabel,
                value: v,
                type: badgeattributeType,
            },
        };
    });




    const edgeTypes = {
        'icon-edge': IconEdge,
    };

    const edges: Edge[] = [];
    for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {

            if (i == 0 && j == 1 && batchDistance.maxDistance !== undefined) {
                edges.push({
                    type: 'icon-edge',
                    id: `e${i + 1}-${j + 1}`,

                    source: (i + 1).toString(),
                    target: (j + 1).toString(),
                    label: `absolute(${initialNodes[i].data.value} - ${initialNodes[j].data.value}) <= ${batchDistance.maxDistance}`
                });
            } else {
                edges.push({
                    type: 'icon-edge',
                    id: `e${i + 1}-${j + 1}`,
                    source: (i + 1).toString(),
                    target: (j + 1).toString(),
                });
            }
        }
    }

    return (
        <SpaceBetween size={"xs"} direction={"vertical"}>
            <SpaceBetween size={"xs"} direction={"horizontal"} alignItems="center">
            <KeyValuePairs
            columns={2}
            items={[
                { 
                    label: "Target Attribute", value: (<>{batchDistance.batchAttribute} <DataTypeBadge dataType={badgeattributeType} id={"z"} >{badgeattributeType}</DataTypeBadge></>)
                },
                ...(batchDistance.maxDistance !== undefined ? [{
                    label: "Max Distance", value: batchDistance.maxDistance
                }] : [])
            ]}
            />

                
                <SpaceBetween size={"xs"} direction={"vertical"} key={"space-vertical-attributes"}>
                    <Box key={"box2-attributes"} textAlign="center">
                        <Icon
                        key="user-profile-active-1"
                        name="user-profile-active"
                        size="medium"
                    />
                    </Box>
                    <Box key={"box-attributes"}> 
                        <DataTypeBadge dataType={badgeattributeType} id={""} >sample value</DataTypeBadge>
                         </Box>
                </SpaceBetween>
            </SpaceBetween>

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
    );
};

export default BatchDistanceGraph;

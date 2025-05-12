import React from "react";
import {KeyValuePairs, SpaceBetween} from "@cloudscape-design/components";
import {MarkerType} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import LatencyNode from "../../components/flow/latencyNode.tsx";
import ReactFlowCanvas from "../../components/flow/ReactFlowCanvas.tsx";
import {LatencyRule} from "../../utils/definitions.tsx";

interface LatencyItemProps {
    latency: LatencyRule
}

const Latency: React.FC<LatencyItemProps> = ({latency}) => {
    console.log(latency)

    const nodeTypes = {
        IconNode: LatencyNode,
    };

    const maxLatency = latency.maxLatency || Infinity;


    const initialNodes = [
        { id: '1',type: "IconNode", position: { x: 0, y: 10 }, data: { label: 'player', name: "playerA", latency: [100,50,10], maxLatency: maxLatency } },
        { id: '2',type: "IconNode", position: { x: 0, y: 100 }, data: { label: 'player' , name: "playerB", latency: [200,60,20], maxLatency: maxLatency }},
        { id: '3',type: "IconNode", position: { x: 0, y: 190 }, data: { label: 'player', name: "playerC", latency: [300,70,30], maxLatency: maxLatency } },

        { id: '4',type: "IconNode", position: { x: 220, y: 10 }, data: { label: 'region', name: "regionA", latency: [100,200,300], maxLatency: maxLatency }  },
        { id: '5',type: "IconNode", position: { x: 220, y: 100 }, data: { label: 'region' , name: "regionB", latency: [50,60,70], maxLatency: maxLatency }  },
        { id: '6',type: "IconNode", position: { x: 220, y: 190 }, data: { label: 'region' , name: "regionC", latency: [10,20,30], maxLatency: maxLatency } },
    ];


    // nodes 1,2,3 と 4,5,6 を相互に接続する
    const initialEdges = [];
    const playerIds = ['1', '2', '3'];
    const regionIds = ['4', '5', '6'];
    for (let i = 0; i < playerIds.length; i++) {
        for (let j = 0; j < regionIds.length; j++) {
            initialEdges.push({
                id: `e${playerIds[i]}-${regionIds[j]}`,
                source: playerIds[i],
                target: regionIds[j],
                type: 'simplebezier',
                sourceHandle: "r",
                targetHandle: "l",
                markerEnd: { type: MarkerType.Arrow, width: 20, height: 20 },
            });
        }
    }



    return (
        <div>
            <SpaceBetween size={"xs"} direction={"vertical"}>
                <KeyValuePairs
                    key={"kv"}
                    columns={1}
                    items={[
                        {
                            label: "maxLatency (mmsec)",
                            value: (<>
                                {latency.maxLatency}
                            </>),
                        },{
                            label: "maxDistance (mmsec)",
                            value: (<>
                                {latency.maxDistance}
                            </>),
                        }
                    ]}
                >
                </KeyValuePairs>

                <ReactFlowCanvas
                    key={"reactflow"}
                    nodes={initialNodes}
                    edges={initialEdges}
                    nodeTypes={nodeTypes}
                    width="400px"
                    height="280px"
                />




            </SpaceBetween>
        </div>
    );
};

export default Latency;

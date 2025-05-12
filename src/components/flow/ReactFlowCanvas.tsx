import "@xyflow/react/dist/style.css";
import {FC} from "react";
import {
    ReactFlow,
    EdgeTypes,
    NodeTypes,
    type Node,
    type Edge,
} from '@xyflow/react';
import {Container, Header} from "@cloudscape-design/components";

interface ReactFlowCanvasProps {
    key: string;
    nodes: Node[];                // ノードの配列
    edges: Edge[];                // エッジの配列
    nodeTypes?: NodeTypes | undefined;         // カスタムノードの型
    edgeTypes?: EdgeTypes | undefined;         // カスタムエッジの型
    width: string;                // 幅
    height: string;               // 高さ
}

const ReactFlowCanvas: FC<ReactFlowCanvasProps> = ({key ,nodes, edges, nodeTypes, edgeTypes, width, height}) => {
    return (
        <div key={key} style={{marginTop:"50px"}}>
            <Container>
            <Header variant={"h3"}>Example visualization</Header>
                <div style={{width: width, height: height}}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        zoomOnDoubleClick={false}
                        minZoom={1}
                        maxZoom={1}
                        draggable={false}
                        panOnDrag={false}
                        elementsSelectable={false}
                        onlyRenderVisibleElements={false}
                        proOptions={{hideAttribution: true}}
                        nodesDraggable={false}
                    />
                </div>
            </Container>
        </div>
    );
}
export default ReactFlowCanvas;

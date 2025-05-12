import React from 'react';
import BooleanNode from "../../components/flow/BooleanNode.tsx";
import { Edge, MarkerType, Node } from '@xyflow/react';
import { Icon, SpaceBetween } from '@cloudscape-design/components';
import ReactFlowCanvas from "../../components/flow/ReactFlowCanvas.tsx";


interface CompoundRule {
    name: string;
    type: string;
    statement: string;
}

interface CompoundRuleProps {
    CompoundRule: CompoundRule;
}

interface TreeNode {
    left?: TreeNode;
    right?: TreeNode;
    value: string;
    depth: number;
    depth_idx: number;
    id: string;
}




// let depth_idx:number[] =  [];
function parseStatement(statement: string, depth: number, depth_idx: number[]): TreeNode {
    const andRegExp = /^\s*and\((.*\(.*\)|\w*)\s*,\s*(.*\(.*\)|\w*)\)\s*$/;
    const orRegExp = /^\s*or\((.*\(.*\)|\w*)\s*,\s*(.*\(.*\)|\w*)\)\s*$/;
    const xorRegExp = /^\s*xor\((.*\(.*\)|\w*)\s*,\s*(.*\(.*\)|\w*)\)\s*$/;
    const notRegExp = /^\s*not\((.*\(.*\)|\w*)\s*,\s*(.*\(.*\)|\w*)\)\s*$/;

    if (depth >= depth_idx.length) {
        depth_idx.push(0);
    }

    const match = statement.match(andRegExp) || statement.match(orRegExp) || statement.match(xorRegExp) || statement.match(notRegExp);
    if (match) {
        const dpt = depth_idx[depth];
        depth_idx[depth]++;

        // console.log(match[0])
        let value;
        if (match[0].startsWith('and(')) {
            value = 'and';
        } else if (match[0].startsWith('or(')) {
            value = 'or';
        } else if (match[0].startsWith('xor(')) {
            value = 'xor';
        } else if (match[0].startsWith('not(')) {
            value = 'not';
        } else {
            value = 'undefined';
        }

        return {
            value: value,
            left: parseStatement(match[1], depth + 1, depth_idx),
            right: parseStatement(match[2], depth + 1, depth_idx),
            depth: depth,
            depth_idx: dpt,
            id: Math.random().toString(36),
        };
    }

    const dpt = depth_idx[depth];
    depth_idx[depth]++;
    return {
        value: statement,
        depth: depth,
        depth_idx: dpt,
        id: Math.random().toString(36),
    };


}



function traverseRuleTreeFromRoot(
    node: TreeNode,
    nodes: Node[],
    onNodeVisit: (node: TreeNode, nodes: Node[]) => void) {
    onNodeVisit(node, nodes);

    if (node.left) {
        traverseRuleTreeFromRoot(node.left, nodes, onNodeVisit);
    }
    if (node.right) {
        traverseRuleTreeFromRoot(node.right, nodes, onNodeVisit);
    }
}




const Compound: React.FC<CompoundRuleProps> = ({ CompoundRule }) => {

    const p = [0];

    const ruleTree = parseStatement(
        CompoundRule.statement, 0, p);

    const nodeTypes = { compoundNode: BooleanNode };
    const centerX = 350;
    const centerY = 30;

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // 上から下へ
    traverseRuleTreeFromRoot(ruleTree, nodes, (node, nodes) => {
        const isLeaf = !node.left && !node.right;

        const x = centerX - node.depth * 100 - (isLeaf ? 150 : 0);
        const y = centerY + node.depth_idx * 240 / (Math.pow(2, node.depth));


        nodes.push(
            {
                id: node.id,
                type: "compoundNode",
                position: { x, y },
                data: {
                    label: (
                        (isLeaf) ?
                            <>
                                <Icon name="filter" /> {node.value} rule
                            </> :
                            <>
                                {node.value}
                            </>
                    ),
                    name: "user-profile-active",
                    size: "small",
                    isLogicNode: isLeaf,
                    logicType: node.value,
                },
            }
        );

        if (node.left) {
            edges.push(
                {
                    // type: 'icon-edge',
                    id: `e${node.id}-${node.left.id}-reference`,
                    source: node.left.id,
                    target: node.id,
                    targetHandle: 'left',
                    sourceHandle: 'source',
                    markerEnd: { type: MarkerType.Arrow, },
                    style: { strokeWidth: 2, },
                }
            )
        }
        if (node.right) {
            edges.push(
                {
                    // type: 'icon-edge',
                    id: `e${node.id}-${node.right.id}-reference`,
                    source: node.right.id,
                    target: node.id,
                    targetHandle: 'right',
                    sourceHandle: 'source',
                    markerEnd: {
                        type: MarkerType.Arrow,
                    },
                    style: { strokeWidth: 2, },
                }
            )
        }

    });


    return (
        <div style={{ minWidth: "400px" }}>
            <SpaceBetween size="xxxs" direction="vertical">

                <ReactFlowCanvas
                    key={"reactflow"}
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}

                    width="400px"
                    height="260px"
                />

            </SpaceBetween>

        </div>
    );
};

export default Compound;

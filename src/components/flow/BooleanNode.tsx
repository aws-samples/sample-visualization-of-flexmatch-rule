import {Handle, Position} from "@xyflow/react";
import {FC, memo} from "react";
import './IconNodeCenter.css';
import * as awsui from "@cloudscape-design/design-tokens";

interface DataProps {
    label: JSX.Element,
    isLogicNode: boolean,
    logicType: string,
}

// https://cloudscape.design/foundation/visual-foundation/design-tokens/
// https://cloudscape.design/foundation/visual-foundation/colors/
const styleBase = {
    borderColor: awsui.colorBorderButtonNormalActive, // Replace with the actual value or variable
    border: "solid 2px",
    padding: awsui.spaceScaledXxs,
    width: "10px",
}

const lowerStyle = {
    ...styleBase,
    borderEndStartRadius: awsui.borderRadiusContainer,
    borderEndEndRadius: awsui.borderRadiusContainer,
    // backgroundColor: awsui.colorBackgroundButtonPrimaryActive,
    height: "1px",
}
const middleStyle = {
    ...styleBase,
    height: "4px",
}
const upperStyle = {
    ...styleBase,
    borderStartEndRadius: awsui.borderRadiusContainer,
    borderStartStartRadius: awsui.borderRadiusContainer,
    // backgroundColor: awsui.colorBackgroundButtonPrimaryActive,
    height: "1px",
}

const handleStyle = {
    width: 5,
    height: 5,
};

const handleLowerStyle = {
    ...handleStyle,
    top: 35,
}

const handleUpperStyle = {
    ...handleStyle,
    top: 7,
}

interface colorStyle {
    topColor: string,
    middleColor: string,
    bottomColor: string,
}

// https://reactflow.dev/learn/customization/custom-nodes
const BooleanNode: FC<{ data: DataProps }> = ({data}) => {


    const style: colorStyle = {
        topColor: awsui.colorBackgroundButtonPrimaryActive,
        middleColor: awsui.colorBackgroundButtonPrimaryActive,
        bottomColor: awsui.colorBackgroundButtonPrimaryActive,
    }
    switch (data.logicType) {
        case "and":
            style.topColor = "transparent";
            style.bottomColor = "transparent";
            break;
        case "or":
            break;
        case "not":
            style.topColor = "transparent";
            style.middleColor = "transparent";
            style.bottomColor = "transparent";
            break;
        case "xor":
            style.middleColor = "transparent";
        break;
        default:
            break;
    }




    return (
        <div style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{position: 'relative'}} >

                {data.isLogicNode ?
                    <>
                        <div style={{borderColor:awsui.colorBorderButtonNormalActive,
                            borderRadius:5,
                            border:"solid 2px",
                            padding:awsui.spaceScaledXxs,
                        }}
                        >{data.label}
                        </div>
                        <Handle style={handleStyle} type="source" position={Position.Right} id="source"/>
                    </>
                    :
                    <>
                        <div style={{...upperStyle,backgroundColor:style.topColor}}>
                            <Handle style={handleUpperStyle} type="target" position={Position.Left} id="left"/>
                        </div>
                        <div style={{...middleStyle,backgroundColor:style.middleColor}}>
                            <Handle style={handleStyle} type="source" position={Position.Right} id="source"/>
                        </div>
                        <div style={{...lowerStyle,backgroundColor:style.bottomColor}}>
                            <Handle style={handleLowerStyle} type="target" position={Position.Left} id="right"/>
                        </div>
                    </>
                }
            </div>
            {data.isLogicNode ? <> </> : <>{data.label}</>}
        </div>

    );
};

export default memo(BooleanNode);
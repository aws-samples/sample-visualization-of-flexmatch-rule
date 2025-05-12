import {Handle, Position} from "@xyflow/react";
import {FC, memo} from "react";
import {Icon, IconProps} from "@cloudscape-design/components";
import './IconNodeCenter.css';
import { DataTypeBadge } from "../../components/common/badges/DataTypeBadge.tsx";

interface DataProps {
    label: string,
    name:  IconProps.Name,
    size: "medium",
    isCenter: false,
    badgelabel?: string,
    type?: string,
}
const handleStyle = {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
};

const IconNode: FC<{ data: DataProps }> = ({data}) => {
    const handleClass = data.isCenter ? 'centered-handle' : '';


    return (
        <div style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Handle style={handleStyle} type="target" position={Position.Left}  id="l"/>
            <Handle style={handleStyle} type="source" position={Position.Left}  id="l"/>
            <div style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}  className={handleClass}>
                <>
                    {data.name && <Icon name={data.name} size={data.size}/>}   
                    {data.badgelabel && <DataTypeBadge id={"ValueTypeBadge"} dataType={data.type ? data.type : "string_number_map"}  >
                        {data.badgelabel}
                    </DataTypeBadge>}
                </>

                <Handle style={handleStyle} type="source" position={Position.Left} id="c"/>
                <Handle style={handleStyle} type="target" position={Position.Left} id="c"/>
                
                <Handle style={handleStyle} type="source" position={Position.Right} id="r"/>
                <Handle style={handleStyle} type="target" position={Position.Right} id="r"/>
                <Handle style={handleStyle} type="source" position={Position.Top}   id="t"/>
                <Handle style={handleStyle} type="source" position={Position.Bottom} id="b"/>
                <Handle style={handleStyle} type="target" position={Position.Top}    id="t"/>
                <Handle style={handleStyle} type="target" position={Position.Bottom} id="b"/>
            </div>
            <div>{data.label}</div>
        </div>

    );
};

export default memo(IconNode);

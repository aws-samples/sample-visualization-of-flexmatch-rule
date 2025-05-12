import {Handle, Position} from "@xyflow/react";
import {FC, memo} from "react";
import './IconNodeCenter.css';
import {Container, Icon, SpaceBetween} from "@cloudscape-design/components";
import {DataTypeBadge} from "../../components/common/badges/DataTypeBadge.tsx";


interface DataProps {
    label: string,
    name: boolean,
    latency: number[],
    maxLatency: number,
    minLatency: number,
}

const handleStyle = {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
};

function changeValidBadgeColor(latency: number, maxLatency: number, minLatency: number) {

    if (latency <= maxLatency && latency >= minLatency) {
        return "string";
    } else {
        return "number"
    }
}

const LatencyNode: FC<{ data: DataProps }> = ({data}) => {
    console.log(data)

    const isSelectableRegion = (data.label === "region" &&
        changeValidBadgeColor(data.latency[0], data.maxLatency,data.minLatency) == "string" &&
        changeValidBadgeColor(data.latency[1], data.maxLatency,data.minLatency) == "string" &&
        changeValidBadgeColor(data.latency[2], data.maxLatency,data.minLatency) == "string");


        return (
            <div style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <SpaceBetween size={"xs"} direction={"horizontal"}>
                    <div key={"div"} style={{alignItems: "center", display: 'flex', flexDirection: 'column'}}>
                        {data.label === "player" ? <Icon name={"user-profile"} size={"medium"}/> :
                            <img src="./Region_32.svg" alt="logo"/>
                        }
                        <div style={{alignItems: "center"}}>{data.name}</div>

                        {isSelectableRegion &&
                            <div style={{alignItems: "center"}}>selectable</div>}

                    </div>
                    <Container key={"container"} disableContentPaddings={true}>
                        <div style={{margin: 5}}>
                            <SpaceBetween size={"xxxs"} direction={"vertical"}>
                                <DataTypeBadge dataType={changeValidBadgeColor(data.latency[0], data.maxLatency,data.minLatency)} id={"1"}>latency {data.latency[0]} ms</DataTypeBadge>
                                <DataTypeBadge dataType={changeValidBadgeColor(data.latency[1], data.maxLatency,data.minLatency)} id={"2"}>latency {data.latency[1]} ms</DataTypeBadge>
                                <DataTypeBadge dataType={changeValidBadgeColor(data.latency[2], data.maxLatency,data.minLatency)} id={"3"}>latency {data.latency[2]} ms</DataTypeBadge>
                            </SpaceBetween>
                        </div>
                    </Container>
                </SpaceBetween>

                <Handle style={handleStyle} type="target" position={Position.Left} id="l"/>
                <Handle style={handleStyle} type="source" position={Position.Left} id="l"/>
                <Handle style={handleStyle} type="source" position={Position.Right} id="r"/>
                <Handle style={handleStyle} type="target" position={Position.Right} id="r"/>
            </div>
        );
};

export default memo(LatencyNode);

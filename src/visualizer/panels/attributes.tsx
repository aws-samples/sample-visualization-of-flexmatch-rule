import {Box, Icon, SpaceBetween, Table} from "@cloudscape-design/components";
import {useSelector} from "react-redux";
import {DataTypeBadge} from "../../components/common/badges/DataTypeBadge.tsx";
import { StoreState } from "../../store/types";
import { PlayerAttribute } from "../../utils/definitions.tsx";




function Attributes() {

    const playerAttributes: PlayerAttribute[]|undefined = useSelector((state: StoreState) => {
        return state.typedStructure.playerAttributes;
    });

    if (playerAttributes == undefined) {
        return <></>
    }

    return (
        <div style={{minWidth: "400px"}}>
            <SpaceBetween size={"xs"} direction={"horizontal"} alignItems="center">
                <SpaceBetween size={"xs"} direction={"vertical"} key={"space-vertical-attributes"}>

                    <Box key={"box2-attributes"} textAlign="center">
                        <Icon
                        key="user-profile-active-1"
                        name="user-profile-active"
                        size="medium"
                    />
                    </Box>
                    <Box key={"box-attributes"}>Player</Box>
                </SpaceBetween>


                <Table key={"table-1-attributes"}
                    columnDefinitions={[
                        {
                            id: "name",
                            header: "name",
                            cell: item => item.name,
                        },
                        {
                            id: "type",
                            header: "type",
                            cell: item => (
                                <SpaceBetween size={"xxxs"} direction={"vertical"}>
                                    <DataTypeBadge dataType={item.type} id={item.name}>
                                        {item.type}
                                    </DataTypeBadge>
                                    {item.type == "string_list" && <p key={"b-attributes-2"}>(multi values)</p>}
                                    {item.type == "string_number_map" && <p key={"b-attributes-3"}>(multi values)</p>}
                                </SpaceBetween>
                            ),
                        },
                        {
                            id: "default",
                            header: "default",
                            cell: item => (
                                <>{item.default == "" ? "none" : JSON.stringify(item.default) }</>
                            ),
                        }
                    ]}
                    items={playerAttributes || []}
                />



            </SpaceBetween>
        </div>
    )
}


export default Attributes;

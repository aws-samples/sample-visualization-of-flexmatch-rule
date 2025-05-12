import "@xyflow/react/dist/style.css";
import {Header, KeyValuePairs, SpaceBetween, Table} from "@cloudscape-design/components";
import { useSelector } from "react-redux";
import {generateSampleUsersData, getDistance} from "./collection/generateSampleData.tsx";
import React from "react";
import {DataTypeBadge} from "../../components/common/badges/DataTypeBadge.tsx";
import { StoreState } from "../../store/types";

interface DistanceSort {
    sortDirection: "ascending" | "descending";
    sortAttribute: string;
    mapKey?: "minValue" | "maxValue";
    partyAggregation?: "min" | "max" | "avg";
}

interface DistanceSortProps {
    distanceSort: DistanceSort;
}


function culcDistance(a: number|string, b: number|string) {
    if (typeof a === "string" && typeof b === "string") {
        // 辞書順における距離の差を出す
        return Math.abs(a.localeCompare(b));
    } else if (typeof a === "number" && typeof b === "number") {
        return Math.abs(a - b);
    } else {
        return -1;
    }
}


const DistanceSort: React.FC<DistanceSortProps> = ({ distanceSort }) => {
    if (!distanceSort) return <div>No absolute sort rule found</div>;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const sortattributeType = useSelector((state: StoreState) => {
        const attribute = state.typedStructure.playerAttributes?.find(attr => attr.name === distanceSort.sortAttribute);
        return attribute ? attribute.type : "string";
    });

    const userData = generateSampleUsersData(5, sortattributeType as string, distanceSort.mapKey);
    const userDataBase = generateSampleUsersData(1, sortattributeType as string, distanceSort.mapKey);
    const baseKey = userDataBase[0].keyAttribute;



    userData.sort((left, right) => {
        const leftDistance = getDistance(left.keyAttribute, baseKey);
        const rightDistance = getDistance(right.keyAttribute, baseKey);
        return distanceSort.sortDirection === "ascending" ? leftDistance - rightDistance : rightDistance - leftDistance;
    });



    return (
        <div style={{width: '450px'}}>
            <SpaceBetween size="xs" direction="vertical">
                <KeyValuePairs
                    key={"kv"}
                    columns={1}
                    items={[
                        {
                            label: "Sort Attribute",
                            value: (<>
                                <DataTypeBadge dataType={sortattributeType as string} id={"Badge"}>
                                    {distanceSort.sortAttribute + " (" + sortattributeType + ")"}
                                </DataTypeBadge>
                            </>),
                        }
                        , {
                            label: "Map Key (Determining a Value (Max/Min))",
                            value: (<>
                                {distanceSort.mapKey || "N/A"}
                            </>),
                        },
                        {
                            label: "Sort direction",
                            value: (<>
                                {distanceSort.sortDirection}
                            </>),
                        },
                    ]}
                >
                </KeyValuePairs>

                <hr></hr>
                <Header variant={"h3"}>Application Example</Header>
                <Table
                    header={<>base player (Sort criterion player)</>}
                    columnDefinitions={[
                        {id: "name", header: "player", cell: (item) => item.id},
                        {id: "key", header: "sort value", cell: () => <>-</>},
                        {id: "attribute", header: distanceSort.sortAttribute, cell: (item) => <>{JSON.stringify(item.attribute)}</>}
                    ]}
                    items={userDataBase}
                />
                <Table
                    header={<>example players</>}
                    columnDefinitions={[
                        {id: "name", header: "player", cell: (item) => item.id},
                        {id: "key", header: "sort value", cell: (item) => <>{
                                culcDistance(userDataBase[0].keyAttribute,item.keyAttribute)
                        }</>},
                        {id: "attribute", header: distanceSort.sortAttribute, cell: (item) => <>{JSON.stringify(item.attribute)}</>}
                    ]}
                    items={userData}
                />
            </SpaceBetween>
        </div>
    );
}

export default DistanceSort;

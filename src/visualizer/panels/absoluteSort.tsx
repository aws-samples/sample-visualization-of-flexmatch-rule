import React from "react";
import "@xyflow/react/dist/style.css";
import {Header, KeyValuePairs, SpaceBetween, Table} from "@cloudscape-design/components";
import { useSelector } from "react-redux";
import { generateSampleUsersData } from "./collection/generateSampleData.tsx";
import {DataTypeBadge} from "../../components/common/badges/DataTypeBadge.tsx";
import {AbsoluteSortRule} from "../../utils/definitions.tsx";
import { StoreState } from "../../store/types";

interface AbsoluteSortProps {
    absoluteSort: AbsoluteSortRule;
}

const AbsoluteSort: React.FC<AbsoluteSortProps> = ({ absoluteSort }) => {

    const sortattributeType = useSelector((state: StoreState) => {
        const attribute = state.typedStructure.playerAttributes?.find((attr: { name: string; }) => attr.name === absoluteSort.sortAttribute);
        return attribute ? attribute.type : "string";
    });

    const userData = generateSampleUsersData(5, sortattributeType, absoluteSort.mapKey);

    userData.sort((left, right) => {
        const leftValue = left.keyAttribute;
        const rightValue = right.keyAttribute;
        return absoluteSort.sortDirection === "ascending" ?
            (leftValue > rightValue ? 1 : -1) :
            (leftValue < rightValue ? 1 : -1);
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
                            value: (
                                <DataTypeBadge dataType={sortattributeType} id={"Badge"}>
                                    {absoluteSort.sortAttribute + " (" + sortattributeType + ")"}
                                </DataTypeBadge>
                            ),
                        }
                        , {
                            label: "Map Key (Determining a Value (Max/Min))",
                            value: (<>
                                {absoluteSort.mapKey || "N/A"}
                            </>),
                        },
                        {
                            label: "Sort direction",
                            value: (<>
                                {absoluteSort.sortDirection}
                            </>),
                        },
                    ]}
                >
                </KeyValuePairs>

                <hr></hr>
                <Header variant={"h3"}>Application Example</Header>
                <Table
                    columnDefinitions={[
                        {id: "name", header: "player", cell: item => item.id},
                        {id: "key", header: "criteria", cell: item => <>{JSON.stringify(item.keyAttribute)}</>},
                        {
                            id: "attribute",
                            header: absoluteSort.sortAttribute,
                            cell: item => <>{JSON.stringify(item.attribute)}</>
                        }
                    ]}
                    items={userData}
                />
            </SpaceBetween>
        </div>
    );
};

export default AbsoluteSort;

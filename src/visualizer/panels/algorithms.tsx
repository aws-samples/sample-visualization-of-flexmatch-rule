import React from "react";
import {Badge, SpaceBetween, Table} from "@cloudscape-design/components";
import {useSelector} from "react-redux";
import { StoreState } from "../../store/types";
import { Algorithm } from "../../utils/definitions.tsx";


const AlgorithmPanel: React.FC = () => {
    const algorithm: Algorithm | undefined = useSelector((state: StoreState) => state.typedStructure.algorithm);

    const algorithmFields: [string, string | string[], string][] = [
        ["strategy", algorithm?.strategy || "exhaustiveSearch", algorithm?.strategy === undefined ? "default" : "override"],
        ["batchingPreference", algorithm?.batchingPreference || "random", algorithm?.batchingPreference === undefined ? "default" : "override"],
        ["backfillPriority", algorithm?.backfillPriority || "normal", algorithm?.backfillPriority === undefined ? "default" : "override"],
        ["expansionAgeSelection", algorithm?.expansionAgeSelection || "newest", algorithm?.expansionAgeSelection === undefined ? "default" : "override"],
    ];

    if (algorithm?.batchingPreference == "sorted") {
        algorithmFields.push(["sortByAttributes", algorithm?.sortByAttributes || "", algorithm?.sortByAttributes ? "override" : "default"]);
    }
    if (algorithm?.strategy == "balanced") {
        algorithmFields.push(["balancedAttribute", algorithm?.balancedAttribute || "", algorithm?.balancedAttribute ? "override" : "default"]);
    }

    

    return (
        <div>
            <SpaceBetween size={"xs"} direction={"vertical"}>
                <Table
                    key={"table-2"}
                    columnDefinitions={[
                        {
                            id: "name",
                            header: "Name",
                            cell: (item) => item[0],
                        },
                        {
                            id: "value",
                            header: "Value",
                            cell: (item) => {
                                return (
                                    <>{item[1]} <Badge color={item[2] == "default" ? "grey" : "red"}>{item[2]}</Badge></>
                                )
                            },
                        }
                    ]}
                    items={algorithmFields}
                />
            </SpaceBetween>
        </div>
    );
};

export default AlgorithmPanel;

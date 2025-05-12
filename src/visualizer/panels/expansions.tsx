import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import { KeyValuePairs,  Steps} from "@cloudscape-design/components";
import { StoreState } from "../../store/types";

// カスタムステップ型（value が null を許容）
interface CustomStep {
    waitTimeSeconds: number;
    value: number | null;
}

// カスタム拡張型（steps が CustomStep[] 型）
interface CustomExpansion {
    target: string;
    steps: CustomStep[];
}

function Expansions () {
    const expansionsFromState = useSelector((state: StoreState) => state.typedStructure.expansions);
    const [expansions, setExpansions] = useState<CustomExpansion[]>([]);

    useEffect(() => {
        if (expansionsFromState) {
            const updatedExpansions = expansionsFromState.map(expansion => ({
                target: expansion.target,
                steps: [{ waitTimeSeconds: 0, value: null } as CustomStep, 
                       ...expansion.steps.map(step => ({ 
                           waitTimeSeconds: step.waitTimeSeconds, 
                           value: step.value 
                       } as CustomStep))]
            }));
            setExpansions(updatedExpansions);
        }
    }, [expansionsFromState]);

    return (
        <div style={{minWidth: "400px"}}>

            <KeyValuePairs
                columns={1}
                items={
                    expansions.map((expansion) => (
                        {
                            label: expansion.target,
                            value: (
                                <Steps
                                    steps={
                                        expansion.steps.map((step) => ({
                                            status: "pending",
                                            header: (
                                                <>
                                                    {step.waitTimeSeconds} secs passed...
                                                    <ul>
                                                        <li style={{listStyle: "none"}}>
                                                            {step.value != null ? "New value is " + step.value : "default"}
                                                        </li>
                                                    </ul>
                                                    <br/>
                                                </>
                                            ),
                                        }))
                                    }
                                />
                            )
                        }
                    ))
                }
            />




        </div>
    );
}

export default Expansions;

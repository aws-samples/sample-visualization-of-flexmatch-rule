import {
    Badge,
    Box,
    Container,
    Icon,
    KeyValuePairs,
    SpaceBetween
} from "@cloudscape-design/components";
import { useSelector } from "react-redux";
import { StoreState } from "../../store/types";
import { Team } from "../../utils/definitions";


function Overview() {
    const teams: Team[] = useSelector((state: StoreState) => state.typedStructure.teams);
    const rules = useSelector((state: StoreState) => state.typedStructure.rules);

    const totalPlayerNum = (Array.isArray(teams)) ? teams.reduce((acc, team) => {
        const quantity = team.quantity || 1;
        return acc + team.maxPlayers * quantity;
    }, 0) : 0;

    const matchTypeName = (totalPlayerNum <= 40) ? "standard" : "large";
    const totalRuleNum = (Array.isArray(rules)) ? rules.length : 0;
    const isPlayershouldSubmitLatency =
        (Array.isArray(rules)) ? rules.find((rule) => rule.type === "latency") : false;
    ;
    const ruleName = useSelector((state: StoreState) => state.typedStructure.name);


    return (
        <div style={{ minWidth: "400px" }}>
            <Container>
                <KeyValuePairs

                    columns={2}
                    items={[
                        {
                            label: "Rule Name",
                            value: ruleName || "-",
                        },
                        {
                            label: "Match type",
                            value: (
                                <SpaceBetween size={"xxxs"} direction={"vertical"}>
                                    <div>
                                        <Badge color={"green"}>{matchTypeName}</Badge>{" "}
                                        <Box variant={"small"}>{totalPlayerNum} {"players"} {totalPlayerNum <= 40 ? "<=" : ">"} {"40"}</Box>
                                    </div>


                                    <Box variant={"small"}>
                                        {totalPlayerNum <= 40 ? "You can use all rules" : "You can use restricted rules"}
                                        </Box>
                                </SpaceBetween>
                            )
                        },
                        {
                            label: "Players in match",
                            value: (
                                <>
                                    <Icon name="user-profile-active" /> {totalPlayerNum} players
                                </>
                            ),
                        },
                        {
                            label: "Latency data required?",
                            value: isPlayershouldSubmitLatency ? "Yes" : "No",
                        },
                        {
                            label: "Rule secions in this rule",
                            value: (
                                <>
                                    <Icon name="filter" /> {totalRuleNum} rules
                                </>
                            ),
                        },
                    ]} />
            </Container>
        </div>
    )
}

export default Overview;

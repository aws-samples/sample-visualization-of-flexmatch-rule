import {Icon, PieChart} from "@cloudscape-design/components";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import { StoreState } from "../../store/types";
import { Team } from "../../utils/definitions";

interface decomposedTeam {
    title: string;
    maxPlayers: number;
    minPlayers: number;
}


function Teams() {
    const teams: Team[] = useSelector((state: StoreState) => state.typedStructure.teams );
    const [decomposedTeams, setDecomposedTeams] = useState<decomposedTeam[]>([]);

    useEffect(() => {
        function decomposeTeams(teams: Team[]): decomposedTeam[] {
            const result: decomposedTeam[] = [];
            if (!teams) {
                return result;
            }

            teams.forEach(team => {
                if (team.quantity) {
                    for (let i = 0; i < team.quantity; i++) {
                        result.push({ ...team, title: `${team.name}-${i + 1}`, maxPlayers: team.maxPlayers , minPlayers: team.minPlayers });
                    }
                } else {
                    result.push({ ...team, title: `${team.name}`, maxPlayers: team.maxPlayers , minPlayers: team.minPlayers });
                }
            });
            return result;
        }

        setDecomposedTeams(decomposeTeams(teams));
    }, [teams]);


    return (
        <div style={{minWidth: "400px"}}>
            <PieChart

                size={"medium"}
                hideFilter
                hideLegend
                variant="donut"
                data={
                    decomposedTeams.map(team => {
                        return {
                            title: team.title,
                            value: team.maxPlayers,
                            description: team.maxPlayers.toString(),
                            minPlayers: team.minPlayers,
                        };
                    })
                }
                detailPopoverContent={(datum) => [
                    {key: "Team Name", value: datum.title},
                    {
                        key: "max player",
                        value: datum.value
                    },
                    {key: "min player", value: datum.minPlayers}
                ]}
                detailPopoverFooter={
                    (segment) => (
                        <div>
                            {Array.from({length: segment.minPlayers}).map((_, index) => (
                                <Icon key={`active-${index}`} name="user-profile-active"/>
                            ))}
                            {Array.from({length: segment.value - segment.minPlayers}).map((_, index) => (
                                <Icon key={`inactive-${index}`} name="user-profile"/>
                            ))}
                        </div>
                    )
                }
                segmentDescription={(datum) =>
                    `${datum.minPlayers} ~ ${datum.value} players `
                }
                innerMetricValue={`${decomposedTeams.reduce((sum, team) => sum + team.minPlayers, 0)} ~ ${decomposedTeams.reduce((sum, team) => sum + team.maxPlayers, 0)}`}
                innerMetricDescription="total players"

            />
        </div>
    )
}

export default Teams;

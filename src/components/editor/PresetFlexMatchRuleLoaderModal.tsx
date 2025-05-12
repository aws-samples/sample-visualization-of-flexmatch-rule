import {FC, useState} from "react";
import {Box, Button, Cards, Link, Modal, SpaceBetween} from "@cloudscape-design/components";

interface RuleItem {
    name: string;
    description: string;
    filepath: string;
}

interface JsonRuleSelectModalProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    setJsonRule: (name: string) => void; // Adjust the type of rule as needed
}

const PresetFlexMatchRuleLoaderModal: FC<JsonRuleSelectModalProps> = ({ modalVisible, setModalVisible, setJsonRule }) => {
    const [selectedItems, setSelectedItems] = useState<RuleItem[]>([]);

    return(
        <Modal size={"large"}
               onDismiss={() => setModalVisible(false)}
               visible={modalVisible}
               footer={
                   <Box float="right">
                       <SpaceBetween direction="horizontal" size="xs">
                           <Button variant="link" onClick={
                               () => setModalVisible(false)
                           }>Cancel</Button>
                           <Button variant="primary" onClick={
                               () => {
                                   setJsonRule(selectedItems[0].filepath);
                                   setModalVisible(false);
                               }
                           }>Ok</Button>
                       </SpaceBetween>
                   </Box>
               }
               header="Load FlexMatch Preset Rule"
        >
            <Cards
                onSelectionChange={({ detail }) =>{
                    setSelectedItems(detail?.selectedItems ?? [])
                }
                }
                selectedItems={selectedItems}
                cardDefinition={{
                    header: item => (
                        <Link fontSize="heading-m">
                            {item.name}
                        </Link>
                    ),
                    sections: [
                        {
                            id: "description",
                            header: "description",
                            content: item => item.description
                        }
                    ]
                }}
                cardsPerRow={[
                    { cards: 2 },
                    { minWidth: 500, cards: 3 }
                ]}
                items={[
                    {
                        name: "Evenly matched teams",
                        description: "This rule set that creates two equally matched teams.",
                        filepath: "aliens_vs_cowboys.json"
                    },
                    {
                        name: "Player's block list",
                        description: "This ule set that lets players avoid being matched with certain other players",
                        filepath: "blocklist.json"
                    },
                    {
                        name: "Match players with compound Rule",
                        description: "This rule set that creates two equally matched teams.",
                        filepath: "compound.json"
                    },
                ]}
                selectionType="single"
                trackBy="name"
                visibleSections={["name", "description"]}
            />
        </Modal>
    )
}

export default PresetFlexMatchRuleLoaderModal;

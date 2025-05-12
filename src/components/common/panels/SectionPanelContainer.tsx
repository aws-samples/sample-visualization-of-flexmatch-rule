import { FC, ReactNode } from "react";
import { Container, Header } from "@cloudscape-design/components";

interface ElementContainerProps {
    key: string;
    title: string;
    children: ReactNode;
    subtitle?: string;
}

export const SectionPanelContainer: FC<ElementContainerProps> = ({ key, title, children, subtitle = "" }) => {
    return (
        <Container
            key={key}
            header={
                <>
                    <Header variant="h1"
                    >{title}</Header>
                    {subtitle}
                </>
            }
        >
            <div style={{ width: '450px' }}>
                {children}
            </div>
        </Container>
    )
}

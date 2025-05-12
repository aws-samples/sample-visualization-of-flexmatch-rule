import {CSSProperties, FC, memo} from "react";

interface DataProps {
    style: CSSProperties,
    title: string
}
const handleStyle = {
    backgroundColor: 'transparent',
    borderColor: '#aaa',
    borderWidth: '1px',
    borderStyle: 'dotted',
    borderRadius: '10px',
    width: "100%",
    height: "100%",
};

const SimpleNode: FC<{ data: DataProps }> = ({ data }) => {
    return (
        <div style={data.style}>
                <div style={handleStyle} >
                </div>
                <div style={{ textAlign: 'center' }}>
                    {data.title}
                </div>
        </div>
    );
};

export default memo(SimpleNode);

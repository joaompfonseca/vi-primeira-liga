type BarLabelProps = {
    name: string;
    fontSize: number;
    fontWeight: number;
    x: number;
    y: number;
};

export const BarLabel = (props: BarLabelProps) => {
    const {name, fontSize, fontWeight, x, y} = props;

    return (
        <g>
            <text
                x={x}
                y={y}
                textAnchor="middle"
                fontSize={fontSize}
                fontWeight={fontWeight}
            >{name}</text>
        </g>
    );
};

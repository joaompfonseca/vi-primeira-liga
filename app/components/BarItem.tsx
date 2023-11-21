type BarItemProps = {
    name: string;
    value: number;
    barHeight: number;
    barWidth: number;
    strokeColor: string;
    fillColor: string;
    x: number;
    y: number;
};

export const BarItem = (props: BarItemProps) => {
    const {name, value, barHeight, barWidth, strokeColor, fillColor, x, y} = props;

    return (
        <g>
            <rect
                x={x}
                y={y - barHeight}
                width={barWidth}
                height={barHeight}
                opacity={0.7}
                stroke={strokeColor}
                fill={fillColor}
                fillOpacity={0.3}
                strokeWidth={1}
                rx={1}
            />
            <text
                x={x + barWidth - barWidth / 2}
                y={y - barHeight - 7}
                textAnchor="middle"
                alignmentBaseline="central"
                fontSize={12}
            >
                {value.toFixed(0)}
            </text>
            <g
                transform={` translate(${x + 7}, ${y + 7}) rotate(45)`}
            >
                <text
                    x={0}
                    y={0}
                    textAnchor="start"
                    alignmentBaseline="central"
                    fontSize={12}
                >
                    {name}
                </text>
            </g>
        </g>
    );
};

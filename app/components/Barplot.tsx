import * as d3 from "d3";
import {BarItem} from "@/app/components/BarItem";
import {AxisBottom} from "@/app/components/AxisBottom";
import {AxisLeft} from "@/app/components/AxisLeft"; // we will need d3.js
import {BarLabel} from "./BarLabel";

type BarplotProps = {
    width: number | string;
    height: number | string;
    xScale: d3.ScaleBand<number>;
    yScale: d3.ScaleLinear<number, number>;
    ySpacing: number;
    data: { group: string; data: { label: string, value: number, color: string }[][] }[];
};

export const Barplot = ({width, height, xScale, yScale, ySpacing, data}: BarplotProps) => {

    const yPixelsPerTick = Math.abs(ySpacing * (yScale.range()[1] - yScale.range()[0]) / (yScale.domain()[1] - yScale.domain()[0]));

    const allShapes = [];
    if (data !== undefined && data.length > 0 && data[0].data.length > 0) {
        const numberOfMatches = data[0].data.length;
        for (let i = 0; i < numberOfMatches; i++) {
            // Match labels
            allShapes.push(<BarLabel
                key={i}
                name={(numberOfMatches > 1) ? "Match-day " + (i + 1) : "Season Total"}
                fontSize={15}
                fontWeight={700}
                x={xScale(i) as number + xScale.bandwidth() / 2}
                y={yScale.range()[1] + 125}
            />);
            const xGroupScale = d3.scaleBand()
                .domain(data.map((d) => d.group))
                .range([0, xScale.bandwidth()])
                .padding(0.05)
            // Group labels
            xGroupScale.domain().forEach((group, j) => {
                allShapes.push(<BarLabel
                    key={i + group + j}
                    name={group}
                    fontSize={15}
                    fontWeight={400}
                    x={xScale(i) as number + xGroupScale(group)! as number + xGroupScale.bandwidth() / 2}
                    y={yScale.range()[1] + 100}
                />);
            });
            for (let d of data) {
                const xStatScale = d3.scaleBand()
                    .domain(d.data[i].map((stat) => stat.label))
                    .range([0, xGroupScale.bandwidth()]);
                const match = d.data[i];
                allShapes.push(match.map((stat) => {
                    return (<BarItem
                        key={i + d.group + stat.label}
                        name={stat.label}
                        value={stat.value}
                        barHeight={yScale(stat.value)}
                        barWidth={xStatScale.bandwidth()}
                        strokeColor={stat.color}
                        fillColor={stat.color}
                        x={xScale(i) as number + xGroupScale(d.group)! as number + xStatScale(stat.label)! as number}
                        y={yScale.range()[1]}
                    />);
                }));
            }
        }
    }

    return (
        <svg width={width} height={height}>
            <g transform={`translate(50, ${yScale.range()[1] + 30})`}>
                <AxisLeft yScale={yScale} pixelsPerTick={yPixelsPerTick} width={100}></AxisLeft>
            </g>
            <g transform={`translate(50, 30)`}>
                {allShapes}
            </g>
        </svg>
    );
};
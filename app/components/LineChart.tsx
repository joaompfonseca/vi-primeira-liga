import * as d3 from "d3";
import {AxisLeft} from "@/app/components/AxisLeft";
import {AxisBottom} from "@/app/components/AxisBottom";
import {Point2D} from "@/app/structs/Point2D";
import {useState} from "react";
import {Card} from "@mui/material";

type LineChartProps = {
    width: number | string;
    height: number | string;
    xScale: d3.ScaleLinear<number, number>;
    yScale: d3.ScaleLinear<number, number>;
    xSpacing: number;
    ySpacing: number;
    data: { label: string, points: Point2D[], color: string }[];
};

type TooltipProps = {
    xMouse: number;
    yMouse: number;
    values: { label: string, point: Point2D, color: string }[];
}

export const LineChart = ({width, height, xScale, yScale, xSpacing, ySpacing, data}: LineChartProps) => {

    const [tooltip, setTooltip] = useState<TooltipProps | null>(null);

    const showTooltip = (xValue: number, xMouse: number, yMouse: number) => {
        const values = data.map(d => {
            const point = d.points.find(p => p.x === xValue);
            return {label: d.label, point: point as Point2D, color: d.color};
        });
        setTooltip({xMouse, yMouse, values});
    }

    const hideTooltip = () => {
        setTooltip(null);
    }

    const xPixelsPerTick = Math.abs(xSpacing * (xScale.range()[1] - xScale.range()[0]) / (xScale.domain()[1] - xScale.domain()[0]));
    const yPixelsPerTick = Math.abs(ySpacing * (yScale.range()[1] - yScale.range()[0]) / (yScale.domain()[1] - yScale.domain()[0]));

    // build the lines

    const lineBuilder = d3
        .line<Point2D>()
        .x((d: Point2D) => xScale(d.x))
        .y((d: Point2D) => yScale.range()[1] - yScale(d.y));

    // render the chart

    return (
        <>
            {tooltip &&
                <Card
                    sx={{
                        position: "absolute",
                        left: tooltip.xMouse + 10,
                        top: tooltip.yMouse - 10,
                        backgroundColor: "white",
                        padding: 1,
                        borderRadius: 1,
                        boxShadow: 1
                    }}
                >
                    {tooltip.values.map((v, i) =>
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center"
                            }}
                        >
                            <div
                                style={{
                                    width: 10,
                                    height: 10,
                                    backgroundColor: v.color,
                                    marginRight: 5,
                                    borderRadius: "50%"
                                }}
                            />
                            <div>{v.label}: {v.point.y}</div>
                        </div>
                    )}
                </Card>
        }
            <svg width={width} height={height}>
                <g transform={`translate(50, ${yScale.range()[1] + 30})`}>
                    <AxisBottom xScale={xScale} pixelsPerTick={xPixelsPerTick}></AxisBottom>
                    <AxisLeft yScale={yScale} pixelsPerTick={yPixelsPerTick} width={100}></AxisLeft>
                </g>
                <g transform={`translate(50, 30)`}>
                    {data.map((d, i) =>
                        <g
                            key={d.label}
                        >
                            <path
                                d={lineBuilder(d.points) as string}
                                fill={"none"}
                                stroke={d.color}
                                strokeWidth={2}
                            />
                            {d.points.map((p, i) =>
                                <g
                                    key={i}
                                >
                                    <circle
                                        cx={xScale(p.x)}
                                        cy={yScale.range()[1] - yScale(p.y)}
                                        r={4}
                                        fill={d.color}
                                        onMouseOver={(event) => {
                                            showTooltip(p.x, event.pageX, event.pageY);
                                        }}
                                        onMouseOut={() => {
                                            hideTooltip();
                                        }}
                                    />
                                    {tooltip && tooltip.values[0].point.x === p.x &&
                                        <path
                                            d={lineBuilder(
                                                [
                                                    {x: p.x, y: 0},
                                                    {x: p.x, y: yScale.domain()[1]}
                                                ]
                                            ) as string}
                                            fill={"none"}
                                            stroke={"gray"}
                                            strokeWidth={1}
                                        />
                                    }
                                </g>
                            )}
                            <text
                                x={xScale(d.points[d.points.length - 1].x) + 10}
                                y={yScale.range()[1] - yScale(d.points[d.points.length - 1].y)}
                                textAnchor="start"
                                alignmentBaseline="central"
                                fontSize={12}
                            >
                                {d.label}
                            </text>
                        </g>
                    )}
                </g>
            </svg>
        </>
    )
        ;
};
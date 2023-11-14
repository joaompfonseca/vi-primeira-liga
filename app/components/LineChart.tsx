import * as d3 from "d3";
import {AxisLeft} from "@/app/components/AxisLeft";
import {AxisBottom} from "@/app/components/AxisBottom";
import {Point2D} from "@/app/structs/Point2D";

type LineChartProps = {
    width: number | string;
    height: number | string;
    xScale: d3.ScaleLinear<number, number>;
    yScale: d3.ScaleLinear<number, number>;
    xSpacing: number;
    ySpacing: number;
    data: { label: string, points: Point2D[], color: string }[];
};

export const LineChart = ({width, height, xScale, yScale, xSpacing, ySpacing, data}: LineChartProps) => {

    const xPixelsPerTick = xSpacing*(xScale.range()[1] - xScale.range()[0]) / (xScale.domain()[1] - xScale.domain()[0]);
    const yPixelsPerTick = ySpacing*(yScale.range()[1] - yScale.range()[0]) / (yScale.domain()[1] - yScale.domain()[0]);


    // build the lines

    const lineBuilder = d3
        .line<Point2D>()
        .x((d: Point2D) => xScale(d.x))
        .y((d: Point2D) => yScale.range()[1] - yScale(d.y));

    // render the chart

    return (
        <svg width={width} height={height}>
            <g transform={`translate(50, ${yScale.range()[1] + 30})`}>
                <AxisBottom xScale={xScale} pixelsPerTick={xPixelsPerTick}></AxisBottom>
                <AxisLeft yScale={yScale} pixelsPerTick={yPixelsPerTick} width={100}></AxisLeft>
            </g>
            <g transform={`translate(50, 30)`}>
                {data.map((d, i) =>
                    <path
                        key={d.label}
                        d={lineBuilder(d.points) as string}
                        fill={"none"}
                        stroke={d.color}
                        strokeWidth={2}
                    />
                )}
            </g>
        </svg>
    );
};
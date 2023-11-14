import * as d3 from "d3";
import {useMemo} from "react";
import {Point2D} from "@/app/structs/Point2D";
import {AxisVertical} from "@/app/components/AxisVertical"; // we will need d3.js

type DataItem = {
    [variable: string]: number;
} & {
    group: string
};


type ParallelCoordinateProps = {
    width: number | string;
    height: number | string;
    xScale: d3.ScalePoint<string>;
    yScales: {[name: string]: d3.ScaleLinear<number, number, never>};
    ySpacings: {[name: string]: number};
    data: { [key: string]: any }[];
    variables: string[];
};

export const ParallelCoordinate = ({width, height, xScale, yScales, ySpacings, data, variables}: ParallelCoordinateProps) => {

    // build color scales
    // loop through variables to add axes
    // loop through data items and through variables to draw lines

    const allLines = data.map((d, i) => {
        const points = variables.map((variable) => {
            const yScale = yScales[variable];
            const x = xScale(variable) ?? 0; // I don't understand the type of scalePoint. IMO x cannot be undefined since I'm passing it something of type Variable.
            // @ts-ignore
            const y = yScale(d[variable]);
            return {x, y};
        });

        const lineBuilder = d3
            .line<Point2D>()
            .x((d: Point2D) => d.x)
            .y((d: Point2D) => d.y);

        return <path
            key={i}
            d={lineBuilder(points) as string}
            fill={"none"}
            stroke={d.color}
            strokeWidth={2}
        />;
    });

    const allAxes = variables.map((variable, i) => {
        const yScale = yScales[variable];
        const ySpacing = ySpacings[variable];

        const yPixelsPerTick = Math.abs(ySpacing*(yScale.range()[1] - yScale.range()[0]) / (yScale.domain()[1] - yScale.domain()[0]));

        return (
            <g key={i} transform={`translate(${xScale(variable)}, 0)`}>
                <AxisVertical yScale={yScale} pixelsPerTick={yPixelsPerTick} name={variable}/>
            </g>
        );
    });

    return (
        <svg width={width} height={height}>
            <g transform={`translate(50,50)`}>
                {allAxes}
                {allLines}
            </g>
        </svg>
    );
};
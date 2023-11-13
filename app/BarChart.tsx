"use client"

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import {Game} from "@/app/structs/Game";

interface BarChartProps {
    data: number[];
    width: number;
    height: number;
}

const BarChart: React.FC<BarChartProps> = ({ data, width, height }) => {
    const ref = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", height);

        svg.selectAll("rect")
            .data(data)
            .join('rect')
            .attr("x", (d, i) => i * 70)
            .attr("y", (d) => height - 10 * d)
            .attr("width", 65)
            .attr("height", (d) => d * 10)
            .attr("fill", "green");
    }, [data]);

    return (
        <svg ref={ref}>
        </svg>
    );
}

export default BarChart;
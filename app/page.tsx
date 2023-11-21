"use client";

import React from "react";
import ResponsiveAppBar from './components/ResponsiveAppBar';
import {ButtonGroup, Grid, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import Link from "next/link";
import * as d3 from "d3";
import LoadingComponent from "@/app/components/LoadingComponent";
import {LineChart} from "@/app/components/LineChart";
import {max} from "d3";

export default function Home() {

    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [data, setData] = React.useState<{[id:string] : {team:string,points:number}[]}>({});

    const colors: {
        [id: string]: string
    } = {
        "Benfica": "#FF0000",
        "Porto": "#0000FF",
        "Sp Braga": "#FF4630",
        "Sp Lisbon": "#0E8600",
    };

    const fetchdata = async () => {
        await d3.csv(`total.csv`)
            .then(data => {
                let seasons: {[id:string] : {season:number,points:number}[]} = {};
                data.map((e, i) => {
                        if (seasons[e.Team] === undefined) {
                            seasons[e.Team] = [{"season": parseInt(e.Season), "points": parseInt(e.Points)}];
                        }
                        else {
                            seasons[e.Team].push({"season": parseInt(e.Season), "points": parseInt(e.Points)});
                        }
                    }
                );
                setData(seasons);
            }
        );
    }

    React.useEffect(() => {
        setIsLoading(true);
        fetchdata();
        setIsLoading(false);
    }, []);


    /*
    Points per season
    */

    const ppsData = Object.entries(data)
        .map(([key, value]) => {
            return {
                label: value.team,
                points: {x: parseInt(key), y: value.points},
                color: colors[value.team]
            };
        })
        .filter(({label}) => selected.includes(label));

    const ppsWidth = 480;
    const ppsHeight = 250;

    const ppsXScale = d3.scaleLinear()
        .domain([
            1,
            2 * Object.keys(info).length
        ])
        .range([0, ppjWidth]);

    const ppsYScale = d3.scaleLinear()
        .domain([
            0,
            (ppjData.length > 0) ?
                max(ppjData, d => max(d.points, (p) => p.y)) as number
                : 3 * 2 * Object.keys(info).length
        ])
        .range([0, ppjHeight]);

    if (isLoading) {
        return (
            <div style={{height: "90vh"}}>
                <ResponsiveAppBar
                    pages={[
                        {label: "22/23", link: "/season?y=22-23"},
                        {label: "21/22", link: "/season?y=21-22"},
                        {label: "20/21", link: "/season?y=20-21"},
                        {label: "19/20", link: "/season?y=19-20"},
                        {label: "18/19", link: "/season?y=18-19"},
                        {label: "17/18", link: "/season?y=17-18"},
                    ]}
                />
                <LoadingComponent/>
            </div>
        )
    }
    return (
        <div style={{minHeight: "90vh"}}>
            <ResponsiveAppBar
                pages={[
                    {label: "22/23", link: "/season?y=22-23"},
                    {label: "21/22", link: "/season?y=21-22"},
                    {label: "20/21", link: "/season?y=20-21"},
                    {label: "19/20", link: "/season?y=19-20"},
                    {label: "18/19", link: "/season?y=18-19"},
                    {label: "17/18", link: "/season?y=17-18"},
                ]}
            />
            <Grid container
                  paddingY={2}
                  paddingX={40}
                  alignItems="center"
                  justifyContent="center"
                  style={{height: "100%"}}
            >
                <Grid item xs={12} paddingY={2} textAlign={"center"}>
                    <Typography variant="h3">Welcome to the Gateway of Primeira Liga Glory!</Typography>
                </Grid>
                <Grid item xs={12} paddingY={1}>
                    <Typography variant="body1" textAlign={"justify"}>
                        Step into the thrilling world of Portugal&apos;s top-flight football league, where every match
                        unfolds a
                        saga of skill, passion, and unyielding determination. Our platform stands as a timeless archive,
                        chronicling the historic moments, standout performances, and statistical wonders that have
                        adorned
                        the illustrious seasons of the Primeira Liga.
                    </Typography>
                </Grid>
                <Grid item xs={12} paddingY={1}>
                    <Typography variant="body1" textAlign={"justify"}>
                        Embark on a journey through the annals of footballing excellence, reliving the triumphs,
                        heart-stopping encounters, and the rise of legends that have graced the lush fields. From the
                        breathtaking goals to the tactical masterstrokes, dive deep into the comprehensive array of
                        statistics, charts, and insights meticulously curated from the annals of this prestigious
                        league.
                    </Typography>
                </Grid>
                <Grid item xs={12} paddingY={1}>
                    <Typography variant="body1" textAlign={"justify"}>
                        Whether you&apos;re a die-hard fan seeking statistical marvels, an enthusiast exploring the
                        evolution
                        of
                        tactics, or a curious mind delving into the league&apos;s rich history, our platform is your
                        gateway
                        to
                        the captivating world of Primeira Liga football.
                    </Typography>
                </Grid>
                <Grid item xs={12} paddingY={1}>
                    <Typography variant="body1" textAlign={"justify"}>
                        Join us as we celebrate the spirit of the beautiful game, where each click unlocks a treasure
                        trove
                        of stats, stories, and the everlasting magic of football&apos;s finest moments. Let the journey
                        begin!
                    </Typography>
                </Grid>
                <Grid item xs={12} paddingY={1}>
                    <Typography variant={"h5"}>Point Evolution per Season</Typography>
                    <LineChart
                        width={ppsWidth + 75}
                        height={ppsHeight + 75}
                        xScale={ppsXScale}
                        yScale={ppsYScale}
                        xSpacing={1}
                        ySpacing={5}
                        data={ppsData}
                    ></LineChart>
                </Grid>
                <Grid item xs={4} paddingY={1} textAlign={"center"}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        component="a"
                    >
                        <Link href={"/season?y=22-23"}>
                            Season 22/23
                        </Link>
                    </Button>
                </Grid>
                <Grid item xs={4} paddingY={1} textAlign={"center"}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        component="a"
                    >
                        <Link href={"/season?y=21-22"}>
                            Season 21/22
                        </Link>
                    </Button>
                </Grid>
                <Grid item xs={4} paddingY={1} textAlign={"center"}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        component="a"
                    >
                        <Link href={"/season?y=20-21"}>
                            Season 20/21
                        </Link>
                    </Button>
                </Grid>
                <Grid item xs={4} paddingY={1} textAlign={"center"}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        component="a"
                    >
                        <Link href={"/season?y=19-20"}>
                            Season 19/20
                        </Link>
                    </Button>
                </Grid>
                <Grid item xs={4} paddingY={1} textAlign={"center"}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        component="a"
                    >
                        <Link href={"/season?y=18-19"}>
                            Season 18/19
                        </Link>
                    </Button>
                </Grid>
                <Grid item xs={4} paddingY={1} textAlign={"center"}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        component="a"
                    >
                        <Link href={"/season?y=17-18"}>
                            Season 17/18
                        </Link>
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}

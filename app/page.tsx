"use client";

import React from "react";
import ResponsiveAppBar from './components/ResponsiveAppBar';
import {Box, ButtonGroup, Checkbox, Grid, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import Link from "next/link";
import * as d3 from "d3";
import LoadingComponent from "@/app/components/LoadingComponent";
import {LineChart} from "@/app/components/LineChart";
import {max} from "d3";

export default function Home() {

    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [data, setData] = React.useState<{
        [id: string]: {
            season: number,
            points: number
        }[]
    }>({});

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
                let teams: {
                    [id: string]: {
                        season: number,
                        points: number
                    }[]
                } = {};
                data.map((e, i) => {
                        if (teams[e.Team] === undefined) {
                            teams[e.Team] = [{"season": parseInt(e.Season), "points": parseInt(e.Points)}];
                        } else {
                            teams[e.Team].push({"season": parseInt(e.Season), "points": parseInt(e.Points)});
                        }
                    }
                );
                setData(teams);
            });
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
                label: key,
                points: value.map(({season, points}) => {
                    return {
                        x: season,
                        y: points
                    }
                }).sort((a, b) => a.x - b.x),
                color: colors[key]
            }
        });

    const ppsWidth = 480;
    const ppsHeight = 250;

    const ppsXScale = d3.scaleLinear()
        .domain([2017, 2022])
        .range([0, ppsWidth]);

    const ppsYScale = d3.scaleLinear()
        .domain([
            0,
            (ppsData.length > 0) ?
                max(ppsData, d => max(d.points, (p) => p.y)) as number
                : 3 * 2 * Object.keys(data).length
        ])
        .range([0, ppsHeight]);

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
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant={"h5"}>Point Evolution per Season</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            {Object.entries(colors).map(([key, value]) => {
                                return (
                                    <Grid container paddingY={1} alignItems={"center"} key={key}>
                                        <Grid item xs={2}>
                                            <Box
                                                paddingRight={2}
                                                style={{
add                                                    height: 30,
                                                    width: 30,
                                                    borderRadius: "50%",
                                                    backgroundColor: value
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={10} textAlign={"start"}>
                                            <Typography>{key}</Typography>
                                        </Grid>
                                    </Grid>
                                )
                            })}
                        </Grid>
                        <Grid item xs={9}>
                            <LineChart
                                width={ppsWidth + 75}
                                height={ppsHeight + 75}
                                xScale={ppsXScale}
                                yScale={ppsYScale}
                                xSpacing={1}
                                ySpacing={5}
                                data={ppsData}
                            />
                        </Grid>
                    </Grid>
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

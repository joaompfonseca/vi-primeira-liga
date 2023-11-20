"use client";

import React from "react";
import ResponsiveAppBar from './components/ResponsiveAppBar';
import {ButtonGroup, Grid, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import Link from "next/link";
import * as d3 from "d3";

export default function Home() {

    const [data, setData] = React.useState<{[id:string] : {team:string,points:number}[]}>({});

    const fetchdata = async () => {
        await d3.csv(`total.csv`)
            .then(data => {
                let seasons: {[id:string] : {team:string,points:number}[]} = {};
                data.map((e, i) => {
                        if (seasons[e.Season] === undefined) {
                            seasons[e.Season] = [{"team": e.Team, "points": parseInt(e.Points)}];
                        }
                        else {
                            seasons[e.Season].push({"team": e.Team, "points": parseInt(e.Points)});
                        }
                    }
                );
                setData(seasons);
            }
        );
    }

    React.useEffect(() => {
        fetchdata();
    }, []);

    console.log(data);

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

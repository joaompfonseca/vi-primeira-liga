"use client"

import React, {ChangeEvent, useEffect} from "react";
import {Game} from "@/app/structs/Game";
import * as d3 from "d3";
import {VictoryDrawLoss} from "@/app/structs/VictoryDrawLoss";
import MyTable from "@/app/components/Table";
import {Stat} from "@/app/structs/Stat";
import {Matchday} from "@/app/structs/Matchday";
import {
    Box,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Grid,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography
} from "@mui/material";
import {LineChart} from "@/app/components/LineChart";
import {max} from "d3";
import {ParallelCoordinate} from "@/app/components/ParallelCoordinatesChart";
import {Info} from "../structs/Info";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import {Barplot} from "@/app/components/Barplot";
import LoadingComponent from "@/app/components/LoadingComponent";
import {useSearchParams} from "next/navigation";

export default function Home() {
    const searchParams = useSearchParams();

    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [data, setData] = React.useState<Game[]>([]);
    const [results, setResults] = React.useState<VictoryDrawLoss[]>([]);
    const [selected, setSelected] = React.useState<string[]>([]);
    const [stats, setStats] = React.useState<Stat[]>([]);
    const [points, setPoints] = React.useState<{
        [id: string]: Matchday[]
    }>({});

    const [info, setInfo] = React.useState<{
        [id: string]: Info
    }>({});

    /* Type of match stats */

    const [typeMatchStats, setTypeMatchStats] = React.useState<string>("all");

    const changeTypeMatchStats = (event: SelectChangeEvent) => {
        setTypeMatchStats(event.target.value as string);
    }

    /* Selected stats */

    const [selectedStats, setSelectedStats] = React.useState<string[]>(
        ["goalscored", "goalsconceded", "shots", "shotstarget", "corners", "fouls", "yellows", "reds"]
    );

    const updateSelectedStats = (event: ChangeEvent<HTMLInputElement>) => {
        const stat = event.target.value;
        if (event.target.checked && !selectedStats.includes(stat)) {
            setSelectedStats((prev) => {
                return [...prev, stat];
            });
        }
        if (!event.target.checked && selectedStats.includes(stat)) {
            setSelectedStats((prev) => {
                return prev.filter((e) => e !== stat);
            });
        }
    }

    /*
    Color palette
     */

    const colors: {
        [id: string]: string
    } = {
        "Benfica": "#FF0000",
        "Porto": "#0000FF",
        "Sp Braga": "#FF4630",
        "Sp Lisbon": "#0E8600",
        "Arouca": "#FFF700",
        "Guimaraes": "#B0B0B0",
        "Famalicao": "#FFC900",
        "Chaves": "#0080FF",
        "Boavista": "#000000",
        "Rio Ave": "#68FF00",
        "Casa Pia": "#2E2E2E",
        "Gil Vicente": "#BF0000",
        "Vizela": "#00E0FF",
        "Estoril": "#FFFB00",
        "Portimonense": "#000000",
        "Maritimo": "#164A00",
        "Pacos Ferreira": "#FBFF81",
        "Santa Clara": "#FF4E01",
    };

    useEffect(() => {
        setIsLoading(true)
        fetchdata();
    }, [searchParams.get("y")]);

    useEffect(() => {
        treatData();
        setIsLoading(false);
    }, [data]);

    const fetchdata = async () => {
        await d3.csv(`${searchParams.get("y")}.csv`)
            .then(data => {
                let games: Game[] = [];
                data.map((e, i) => {
                    const game = new Game(e["HomeTeam"],
                        e["AwayTeam"],
                        parseInt(e["FTHG"]),
                        parseInt(e["FTAG"]),
                        e["FTR"],
                        parseInt(e["HS"]),
                        parseInt(e["AS"]),
                        parseInt(e["HST"]),
                        parseInt(e["AST"]),
                        parseInt(e["HHW"]),
                        parseInt(e["AHW"]),
                        parseInt(e["HC"]),
                        parseInt(e["AC"]),
                        parseInt(e["HF"]),
                        parseInt(e["AF"]),
                        parseInt(e["HY"]),
                        parseInt(e["AY"]),
                        parseInt(e["HR"]),
                        parseInt(e["AR"]));
                    games = [...games, game];
                });
                setData(() => games);
                setSelected([]);
                setSelectedStats(["goalscored", "goalsconceded", "shots", "shotstarget", "corners", "fouls", "yellows", "reds"]);
            })
            .catch(err => {
                console.log(err);
            });
    }

    const treatData = () => {
        let dict: {
            [id: string]: VictoryDrawLoss;
        } = {};
        let dicth: {
            [id: string]: VictoryDrawLoss;
        } = {};
        let dicta: {
            [id: string]: VictoryDrawLoss;
        } = {};
        let dics: {
            [id: string]: Stat[];
        } = {};
        let dicsh: {
            [id: string]: Stat[];
        } = {};
        let dicsa: {
            [id: string]: Stat[];
        } = {};
        let dicp: {
            [id: string]: Matchday[]
        } = {};
        for (let i = 0; i < data.length; i++) {
            const game = data[i];

            // Get Points and Victories

            if (game.fulltimeresult === "H") {
                if (dict[game.hometeam] === undefined) {
                    dict[game.hometeam] = {victories: 1, draws: 0, losses: 0, points: 3};
                } else {
                    dict[game.hometeam].victories += 1;
                    dict[game.hometeam].points += 3;
                }

                if (dict[game.awayteam] === undefined) {
                    dict[game.awayteam] = {victories: 0, draws: 0, losses: 1, points: 0};
                } else {
                    dict[game.awayteam].losses += 1;
                }

                if (dicth[game.hometeam] === undefined) {
                    dicth[game.hometeam] = {victories: 1, draws: 0, losses: 0, points: 3};
                } else {
                    dicth[game.hometeam].victories += 1;
                    dicth[game.hometeam].points += 3;
                }

                if (dicta[game.awayteam] === undefined) {
                    dicta[game.awayteam] = {victories: 0, draws: 0, losses: 1, points: 0};
                } else {
                    dicta[game.awayteam].losses += 1;
                }

            } else if (game.fulltimeresult === "D") {
                if (dict[game.hometeam] === undefined) {
                    dict[game.hometeam] = {victories: 0, draws: 1, losses: 0, points: 1};
                } else {
                    dict[game.hometeam].draws += 1;
                    dict[game.hometeam].points += 1;
                }

                if (dict[game.awayteam] === undefined) {
                    dict[game.awayteam] = {victories: 0, draws: 1, losses: 0, points: 1};
                } else {
                    dict[game.awayteam].draws += 1;
                    dict[game.awayteam].points += 1;
                }

                if (dicth[game.hometeam] === undefined) {
                    dicth[game.hometeam] = {victories: 0, draws: 1, losses: 0, points: 1};
                } else {
                    dicth[game.hometeam].draws += 1;
                    dicth[game.hometeam].points += 1;
                }

                if (dicta[game.awayteam] === undefined) {
                    dicta[game.awayteam] = {victories: 0, draws: 1, losses: 0, points: 1};
                } else {
                    dicta[game.awayteam].draws += 1;
                    dicta[game.awayteam].points += 1;
                }

            } else if (game.fulltimeresult === "A") {
                if (dict[game.hometeam] === undefined) {
                    dict[game.hometeam] = {victories: 0, draws: 0, losses: 1, points: 0};
                } else {
                    dict[game.hometeam].losses += 1;
                }

                if (dict[game.awayteam] === undefined) {
                    dict[game.awayteam] = {victories: 1, draws: 0, losses: 0, points: 3};
                } else {
                    dict[game.awayteam].victories += 1;
                    dict[game.awayteam].points += 3;
                }

                if (dicth[game.hometeam] === undefined) {
                    dicth[game.hometeam] = {victories: 0, draws: 0, losses: 1, points: 0};
                } else {
                    dicth[game.hometeam].losses += 1;
                }

                if (dicta[game.awayteam] === undefined) {
                    dicta[game.awayteam] = {victories: 1, draws: 0, losses: 0, points: 3};
                } else {
                    dicta[game.awayteam].victories += 1;
                    dicta[game.awayteam].points += 3;
                }

            }

            // Get Stats
            const ht = game.hometeam;
            const at = game.awayteam;

            if (dics[ht] === undefined) {
                dics[ht] = [{
                    jornada: 1,
                    goalscored: game.homescore,
                    goalsconceded: game.awayscore,
                    shots: game.homeshots,
                    shotstarget: game.homeshotstarget,
                    shotswoodwork: game.homeshotswoodwork,
                    corners: game.homecorners,
                    fouls: game.homefouls,
                    yellows: game.homeyellows,
                    reds: game.homered
                }]
            } else {
                dics[ht].push({
                    jornada: dics[ht].length + 1,
                    goalscored: game.homescore,
                    goalsconceded: game.awayscore,
                    shots: game.homeshots,
                    shotstarget: game.homeshotstarget,
                    shotswoodwork: game.homeshotswoodwork,
                    corners: game.homecorners,
                    fouls: game.homefouls,
                    yellows: game.homeyellows,
                    reds: game.homered
                });
            }

            if (dicsh[ht] === undefined) {
                dicsh[ht] = [{
                    jornada: dics[ht].length,
                    goalscored: game.homescore,
                    goalsconceded: game.awayscore,
                    shots: game.homeshots,
                    shotstarget: game.homeshotstarget,
                    shotswoodwork: game.homeshotswoodwork,
                    corners: game.homecorners,
                    fouls: game.homefouls,
                    yellows: game.homeyellows,
                    reds: game.homered
                }]
            } else {
                dicsh[ht].push({
                    jornada: dics[ht].length,
                    goalscored: game.homescore,
                    goalsconceded: game.awayscore,
                    shots: game.homeshots,
                    shotstarget: game.homeshotstarget,
                    shotswoodwork: game.homeshotswoodwork,
                    corners: game.homecorners,
                    fouls: game.homefouls,
                    yellows: game.homeyellows,
                    reds: game.homered
                });
            }

            if (dics[at] === undefined) {
                dics[at] = [{
                    jornada: 1,
                    goalscored: game.awayscore,
                    goalsconceded: game.homescore,
                    shots: game.awayshots,
                    shotstarget: game.awayshotstarget,
                    shotswoodwork: game.awayshotswoodwork,
                    corners: game.awaycorners,
                    fouls: game.awayfouls,
                    yellows: game.awayyellows,
                    reds: game.awayred
                }]
            } else {
                dics[at].push({
                    jornada: dics[at].length + 1,
                    goalscored: game.awayscore,
                    goalsconceded: game.homescore,
                    shots: game.awayshots,
                    shotstarget: game.awayshotstarget,
                    shotswoodwork: game.awayshotswoodwork,
                    corners: game.awaycorners,
                    fouls: game.awayfouls,
                    yellows: game.awayyellows,
                    reds: game.awayred
                });
            }

            if (dicsa[at] === undefined) {
                dicsa[at] = [{
                    jornada: dics[at].length,
                    goalscored: game.awayscore,
                    goalsconceded: game.homescore,
                    shots: game.awayshots,
                    shotstarget: game.awayshotstarget,
                    shotswoodwork: game.awayshotswoodwork,
                    corners: game.awaycorners,
                    fouls: game.awayfouls,
                    yellows: game.awayyellows,
                    reds: game.awayred
                }]
            } else {
                dicsa[at].push({
                    jornada: dics[at].length,
                    goalscored: game.awayscore,
                    goalsconceded: game.homescore,
                    shots: game.awayshots,
                    shotstarget: game.awayshotstarget,
                    shotswoodwork: game.awayshotswoodwork,
                    corners: game.awaycorners,
                    fouls: game.awayfouls,
                    yellows: game.awayyellows,
                    reds: game.awayred
                });
            }

            // Get Points for each jornada
            const r = game.fulltimeresult;

            if (r === "H") {
                if (dicp[ht] === undefined) {
                    dicp[ht] = [{jornada: 1, points: 3}];
                } else {
                    dicp[ht].push({jornada: dicp[ht].length + 1, points: dicp[ht][dicp[ht].length - 1].points + 3});
                }
                if (dicp[at] === undefined) {
                    dicp[at] = [{jornada: 1, points: 0}];
                } else {
                    dicp[at].push({jornada: dicp[at].length + 1, points: dicp[at][dicp[at].length - 1].points});
                }
            } else if (r === "D") {
                if (dicp[ht] === undefined) {
                    dicp[ht] = [{jornada: 1, points: 1}];
                } else {
                    dicp[ht].push({jornada: dicp[ht].length + 1, points: dicp[ht][dicp[ht].length - 1].points + 1});
                }
                if (dicp[at] === undefined) {
                    dicp[at] = [{jornada: 1, points: 1}];
                } else {
                    dicp[at].push({jornada: dicp[at].length + 1, points: dicp[at][dicp[at].length - 1].points + 1});
                }
            } else {
                if (dicp[ht] === undefined) {
                    dicp[ht] = [{jornada: 1, points: 0}];
                } else {
                    dicp[ht].push({jornada: dicp[ht].length + 1, points: dicp[ht][dicp[ht].length - 1].points});
                }
                if (dicp[at] === undefined) {
                    dicp[at] = [{jornada: 1, points: 3}];
                } else {
                    dicp[at].push({jornada: dicp[at].length + 1, points: dicp[at][dicp[at].length - 1].points + 3});
                }
            }
        }

        setPoints(dicp);

        let temp: {
            [id: string]: Info;
        } = {};

        for (const [key, value] of Object.entries(dicp)) {
            if (temp[key] === undefined) {
                temp[key] = {
                    color: "",
                    results: {victories: 0, draws: 0, losses: 0, points: 0},
                    resultshome: {victories: 0, draws: 0, losses: 0, points: 0},
                    resultsaway: {victories: 0, draws: 0, losses: 0, points: 0},
                    stats: [],
                    statshome: [],
                    statsaway: [],
                    points: [],
                    position: 0
                }
            }
            temp[key].points = value;
        }


        for (const [key, value] of Object.entries(dics)) {

            temp[key].stats = value;

            setStats(value);
        }

        for (const [key, value] of Object.entries(dicsh)) {

            temp[key].statshome = value;
        }

        for (const [key, value] of Object.entries(dicsa)) {

            temp[key].statsaway = value;
        }

        results.splice(0)
        for (const [key, value] of Object.entries(dict)) {

            temp[key].results = value;

            results.push(value);
        }

        for (const [key, value] of Object.entries(dicth)) {
            temp[key].resultshome = value;
        }

        for (const [key, value] of Object.entries(dicta)) {
            temp[key].resultsaway = value;
        }


        // sort results by points
        results.sort((a, b) => {
            return b.points - a.points;
        });

        for (const [key, value] of Object.entries(colors)) {
            if (Object.keys(temp).includes(key)) {
                temp[key].color = value;
            }
        }

        let temp2: {
            [id: string]: number
        } = {};

        for (let key in temp) {
            temp2[key] = temp[key].points[temp[key].points.length - 1].points;
        }

        // sort temp2 by points
        let sortable: [string, number][] = [];
        for (let key in temp2) {
            sortable.push([key, temp2[key]]);
        }
        sortable.sort((a, b) => {
            return b[1] - a[1];
        });

        for (let i = 0; i < sortable.length; i++) {
            let key = sortable[i][0];
            let value = sortable[i][1];
            temp[key].position = i + 1;
        }

        setInfo(temp);
    }

    const updateSelected = (selected: string[]) => {
        setSelected(selected);
    }


    /*
    Points per match day
    */

    const ppjData = Object.entries(info)
        .map(([key, value]) => {
            return {
                label: key,
                points: value.points.map((m) => {
                    return {x: m.jornada, y: m.points};
                }),
                color: value.color
            };
        })
        .filter(({label}) => selected.includes(label));

    const ppjWidth = 480;
    const ppjHeight = 250;

    const ppjXScale = d3.scaleLinear()
        .domain([
            1,
            2 * Object.keys(info).length
        ])
        .range([0, ppjWidth]);

    const ppjYScale = d3.scaleLinear()
        .domain([
            0,
            (ppjData.length > 0) ?
                max(ppjData, d => max(d.points, (p) => p.y)) as number
                : 3 * 2 * Object.keys(info).length
        ])
        .range([0, ppjHeight]);

    /*
    Parallel Coordinates Chart
     */

    const pccVars = ["position", "points", "wins", "losses", "draws"];

    const pccData = Object.entries(info).map(([key, value]) => {
        return {
            position: value.position,
            points: value.results.points,
            wins: value.results.victories,
            draws: value.results.draws,
            losses: value.results.losses,
            label: key,
            color: value.color
        }
    }).filter(({label}) => selected.includes(label));

    const pccWidth = 480;
    const pccHeight = 250;

    const pccXScale = d3
        .scalePoint<string>()
        .range([0, pccWidth])
        .domain(pccVars);

    const pccYScales = {
        position: d3.scaleLinear()
            .domain([Object.keys(info).length, 1])
            .range([pccHeight, Object.keys(info).length]),
        points: d3.scaleLinear()
            .domain([
                0,
                (pccData.length > 0) ?
                    max(pccData, d => d.points) as number
                    : 3 * 2 * Object.keys(info).length
            ])
            .range([pccHeight, 0]),
        wins: d3.scaleLinear()
            .domain([
                0,
                (pccData.length > 0) ?
                    max(pccData, d => d.wins) as number
                    : 2 * Object.keys(info).length
            ])
            .range([pccHeight, 0]),
        draws: d3.scaleLinear()
            .domain([
                0,
                (pccData.length > 0) ?
                    max(pccData, d => d.draws) as number
                    : 2 * Object.keys(info).length
            ])
            .range([pccHeight, 0]),
        losses: d3.scaleLinear()
            .domain([
                0,
                (pccData.length > 0) ?
                    max(pccData, d => d.losses) as number
                    : 2 * Object.keys(info).length
            ])
            .range([pccHeight, 0])
    };

    const pccYSpacings = {
        position: 1,
        points: 5,
        wins: 2,
        draws: 2,
        losses: 2
    }

    /*
    Bar Plot Stats
     */

    const typeMatchStatsKey = (typeMatchStats === "home") ? "statshome" : (typeMatchStats === "away") ? "statsaway" : "stats";

    const bpData = Object.entries(info)
        .map(([key, value]) => {
            return {
                group: key,
                data: value[typeMatchStatsKey].map((stat) => {
                    return Object.entries(stat).map(([statKey, statValue]) => {
                        return {
                            label: statKey,
                            value: statValue as number,
                            color: value.color
                        }
                    }).filter(({label}) => selectedStats.includes(label))
                })
            };
        })
        .sort((a, b) => info[a.group].position - info[b.group].position)
        .filter(({group}) => selected.includes(group));

    const bpWidth = (typeMatchStats === "all")
        ? 10000 * (bpData.length)
        : 10000 * (bpData.length) / 2;
    const bpHeight = 300;

    // For each match
    const bpXScale = d3.scaleBand<number>()
        .domain(
            (bpData.length > 0)
                ? d3.range(bpData[0].data.length)
                : d3.range(0))
        .range([0, bpWidth])
        .paddingInner(0.05);

    const bpYScale = d3.scaleLinear()
        .domain([
            0,
            (bpData.length > 0) ?
                max(bpData, d => max(d.data, (p) => max(p, (q) => q.value))) as number
                : 10
        ])
        .range([0, bpHeight]);

    const bpAllData = bpData
        .map(({group, data}) => {
            // Calculate sum of values for each label
            const sumOfValues = data.reduce((acc: {
                [key: string]: number
            }, item) => {
                item.forEach(({label, value}) => {
                    acc[label] = (acc[label] || 0) + value;
                });
                return acc;
            }, {});

            // Create a new element containing the sum of values
            const sumElement = Object.entries(sumOfValues).map(([label, value]) => ({
                label,
                value,
                color: data[0][0].color, // Assuming the color is consistent for all elements
            }));

            return {
                group,
                data: [sumElement]
            }
        });

    const bpAllWidth = 250 * (bpAllData.length);
    const bpAllHeight = 300;

    // For each match
    const bpAllXScale = d3.scaleBand<number>()
        .domain(
            (bpAllData.length > 0)
                ? d3.range(bpAllData[0].data.length)
                : d3.range(0))
        .range([0, bpAllWidth]);

    const bpAllYScale = d3.scaleLinear()
        .domain([
            0,
            (bpAllData.length > 0) ?
                max(bpAllData, d => max(d.data, (p) => max(p, (q) => q.value))) as number
                : 10
        ])
        .range([0, bpAllHeight]);

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
            <Grid container padding={2}>
                <Grid item xs={4} padding={2}>
                    {Object.keys(info).length &&
                        <MyTable
                            data={info}
                            updateSelected={updateSelected}/>
                    }
                </Grid>
                <Grid container xs={8} padding={2}>
                    <Grid item xs={12}>
                        <Typography variant={"h5"}>Point evolution per matchday</Typography>
                        <LineChart
                            width={ppjWidth + 75}
                            height={ppjHeight + 75}
                            xScale={ppjXScale}
                            yScale={ppjYScale}
                            xSpacing={1}
                            ySpacing={5}
                            data={ppjData}
                        ></LineChart>
                        <Typography variant={"h5"}>Final Results Correlation</Typography>
                        <ParallelCoordinate
                            width={pccWidth + 75}
                            height={pccHeight + 75}
                            xScale={pccXScale}
                            yScales={pccYScales}
                            ySpacings={pccYSpacings}
                            data={pccData}
                            variables={pccVars}
                        ></ParallelCoordinate>
                        <Typography variant={"h5"}>Matches</Typography>
                        <Grid container direction={"row"} alignItems={"center"}>
                            <Typography
                                paddingRight={2}
                            >
                                Matches Stats
                            </Typography>
                            <Select
                                value={typeMatchStats}
                                onChange={changeTypeMatchStats}
                            >
                                <MenuItem value={"all"}>All</MenuItem>
                                <MenuItem value={"home"}>Home</MenuItem>
                                <MenuItem value={"away"}>Away</MenuItem>
                            </Select>
                        </Grid>
                        <Grid container direction={"row"} alignItems={"center"}>
                            <Grid item xs={3}>
                                <FormGroup>
                                    <FormControlLabel control={
                                        <Checkbox
                                            defaultChecked
                                            value={"goalscored"}
                                            onChange={updateSelectedStats}
                                        />
                                    } label="Goals Scored"/>
                                    <FormControlLabel control={
                                        <Checkbox
                                            defaultChecked
                                            value={"goalsconceded"}
                                            onChange={updateSelectedStats}
                                        />
                                    } label="Goals Conceeded"/>
                                    <FormControlLabel control={
                                        <Checkbox
                                            defaultChecked
                                            value={"shots"}
                                            onChange={updateSelectedStats}
                                        />
                                    } label="Shots"/>
                                    <FormControlLabel control={
                                        <Checkbox
                                            defaultChecked
                                            value={"shotstarget"}
                                            onChange={updateSelectedStats}
                                        />
                                    } label="Shots (on target)"/>
                                    <FormControlLabel control={
                                        <Checkbox
                                            defaultChecked
                                            value={"corners"}
                                            onChange={updateSelectedStats}
                                        />
                                    } label="Corners"/>
                                    <FormControlLabel control={
                                        <Checkbox
                                            defaultChecked
                                            value={"fouls"}
                                            onChange={updateSelectedStats}
                                        />
                                    } label="Commited Fouls"/>
                                    <FormControlLabel control={
                                        <Checkbox
                                            defaultChecked
                                            value={"yellows"}
                                            onChange={updateSelectedStats}
                                        />
                                    } label="Yellow Cards"/>
                                    <FormControlLabel control={
                                        <Checkbox
                                            defaultChecked
                                            value={"reds"}
                                            onChange={updateSelectedStats}
                                        />
                                    } label="Red Cards"/>
                                </FormGroup>
                            </Grid>
                            <Grid item xs={9}>
                                <Box
                                    sx={{
                                        width: "100%",
                                        overflowX: "scroll",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    <Barplot
                                        width={bpAllWidth + 50}
                                        height={bpAllHeight + 175}
                                        xScale={bpAllXScale}
                                        yScale={bpAllYScale}
                                        ySpacing={25}
                                        data={bpAllData}
                                    ></Barplot>
                                </Box>
                                <Box
                                    sx={{
                                        width: "100%",
                                        overflowX: "scroll",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    <Barplot
                                        width={bpWidth + 50}
                                        height={bpHeight + 175}
                                        xScale={bpXScale}
                                        yScale={bpYScale}
                                        ySpacing={1}
                                        data={bpData}
                                    ></Barplot>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

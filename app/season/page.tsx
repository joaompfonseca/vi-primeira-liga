"use client"

import React, {useEffect} from "react";
import {Game} from "@/app/structs/Game";
import * as d3 from "d3";
import {VictoryDrawLoss} from "@/app/structs/VictoryDrawLoss";
import MyTable from "@/app/components/Table";
import {Stat} from "@/app/structs/Stat";
import {Matchday} from "@/app/structs/Matchday";
import {Box, Grid, MenuItem, Select, SelectChangeEvent, Typography} from "@mui/material";
import {LineChart} from "@/app/components/LineChart";
import {max} from "d3";
import {ParallelCoordinate} from "@/app/components/ParallelCoordinatesChart";
import {Info} from "../structs/Info";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import {Barplot} from "@/app/components/Barplot";

export default function Home() {

    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [data, setData] = React.useState<Game[]>([]);
    const [results, setResults] = React.useState<VictoryDrawLoss[]>([]);
    const [selected, setSelected] = React.useState<string[]>([]);
    const [stats, setStats] = React.useState<Stat[]>([]);
    const [points, setPoints] = React.useState<{
        [id: string]: Matchday[]
    }>({});

    const [info, setInfo] = React.useState<{ [id: string]: Info }>({});

    /* Type of match stats */

    const [typeMatchStats, setTypeMatchStats] = React.useState<string>("all");

    const changeTypeMatchStats = (event: SelectChangeEvent) => {
        setTypeMatchStats(event.target.value as string);
    }

    /*
    Color palette
     */

    const colors: { [id: string]: string } = {
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
        fetchdata();
        if (!isLoading) {
            treatData();
        }
    }, [isLoading]);

    const fetchdata = async () => {
        setIsLoading(true)
        await d3.csv('data.csv')
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
            })
            .catch(err => {
                console.log(err);
            });
        setIsLoading(false);
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

            temp[key].stats = value;

            setStats(value);
        }

        for (const [key, value] of Object.entries(dicsh)) {
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

            temp[key].statshome = value;
        }

        for (const [key, value] of Object.entries(dicsa)) {
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

            temp[key].statsaway = value;
        }

        results.splice(0)
        for (const [key, value] of Object.entries(dict)) {
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

            temp[key].results = value;

            results.push(value);
        }

        for (const [key, value] of Object.entries(dicth)) {
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

            temp[key].resultshome = value;
        }

        for (const [key, value] of Object.entries(dicta)) {
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

            temp[key].resultsaway = value;
        }


        // sort results by points
        results.sort((a, b) => {
            return b.points - a.points;
        });

        for (const [key, value] of Object.entries(colors)) {
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

            temp[key].color = value;
        }

        let temp2: { [id: string]: number } = {};

        for (let key in info) {
            temp2[key] = info[key].points[info[key].points.length - 1].points;
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

    console.log(info);


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
                            color: value.color // TODO: change to stat color
                        }
                    })
                    //.filter(({label}) => label !== "jornada") // TODO: filter based on selected stats
                })
            };
        })
        .sort((a, b) => info[a.group].position - info[b.group].position)
        .filter(({group}) => selected.includes(group));

    const bpWidth = (typeMatchStats === "all")
        ? 10000 * bpData.length
        : 10000 * bpData.length / 2;
    const bpHeight = 300;

    // For each match
    const bpXScale = d3.scaleBand<number>()
        .domain(
            (bpData.length > 0)
                ? d3.range(bpData[0].data.length)
                : d3.range(0))
        .range([0, bpWidth])
        .paddingInner(0.1);

    const bpYScale = d3.scaleLinear()
        .domain([
            0,
            (bpData.length > 0) ?
                max(bpData, d => max(d.data, (p) => max(p, (q) => q.value))) as number
                : 10
        ])
        .range([0, bpHeight]);

    return (
        <>
            <ResponsiveAppBar
                pages={[
                    {label: "Tudo", link: "/"},
                    {label: "Temporada", link: "/season"},
                ]}
            />
            <Grid container padding={2}>
                <Grid item xs={4} padding={2}>
                    {info !== undefined && Object.keys(info).length &&
                        <MyTable
                            data={info}
                            updateSelected={updateSelected}/>
                    }
                </Grid>
                <Grid container xs={8} padding={2}>
                    <Grid item xs={12}>
                        <Typography variant={"h5"}>Evolução de Pontos por jornada</Typography>
                        <LineChart
                            width={ppjWidth + 75}
                            height={ppjHeight + 75}
                            xScale={ppjXScale}
                            yScale={ppjYScale}
                            xSpacing={1}
                            ySpacing={5}
                            data={ppjData}
                        ></LineChart>
                        <Typography variant={"h5"}>Parallel Coordinates Plot</Typography>
                        <ParallelCoordinate
                            width={pccWidth + 75}
                            height={pccHeight + 75}
                            xScale={pccXScale}
                            yScales={pccYScales}
                            ySpacings={pccYSpacings}
                            data={pccData}
                            variables={pccVars}
                        ></ParallelCoordinate>
                        <Typography variant={"h5"}>Partidas</Typography>
                        <Grid container direction={"row"} alignItems={"center"}>
                            <Typography
                                paddingRight={2}
                            >
                                Estatísticas das partidas
                            </Typography>
                            <Select
                                value={typeMatchStats}
                                onChange={changeTypeMatchStats}
                            >
                                <MenuItem value={"all"}>Todas</MenuItem>
                                <MenuItem value={"home"}>Casa</MenuItem>
                                <MenuItem value={"away"}>Fora</MenuItem>
                            </Select>
                        </Grid>
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
        </>
    );
}

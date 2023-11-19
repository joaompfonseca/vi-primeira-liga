"use client"

import React, {useEffect} from "react";
import {Game} from "@/app/structs/Game";
import * as d3 from "d3";
import {VictoryDrawLoss} from "@/app/structs/VictoryDrawLoss";
import MyTable from "@/app/components/Table";
import {Stat} from "@/app/structs/Stat";
import {Matchday} from "@/app/structs/Matchday";
import {Grid, MenuItem, Select, SelectChangeEvent, Typography} from "@mui/material";
import {LineChart} from "@/app/components/LineChart";
import {max} from "d3";
import {ParallelCoordinate} from "@/app/components/ParallelCoordinatesChart";
import {Info} from "../structs/Info";
import ResponsiveAppBar from "../components/ResponsiveAppBar";

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
            [id: string]: Stat;
        } = {};
        let dicsh: {
            [id: string]: Stat;
        } = {};
        let dicsa: {
            [id: string]: Stat;
        } = {};
        let dicp: {
            [id: string]: Matchday[]
        } = {};
        for (let i = 0; i < data.length; i++) {
            const game = data[i];

            // Get Points and Victories

            if (game.fulltimeresult === "H") {
                if (dict[game.hometeam] === undefined) {
                    dict[game.hometeam] = {team: game.hometeam, victories: 1, draws: 0, losses: 0, points: 3};
                } else {
                    dict[game.hometeam].victories += 1;
                    dict[game.hometeam].points += 3;
                }

                if (dict[game.awayteam] === undefined) {
                    dict[game.awayteam] = {team: game.awayteam, victories: 0, draws: 0, losses: 1, points: 0};
                } else {
                    dict[game.awayteam].losses += 1;
                }

                if (dicth[game.hometeam] === undefined) {
                    dicth[game.hometeam] = {team: game.hometeam, victories: 1, draws: 0, losses: 0, points: 3};
                } else {
                    dicth[game.hometeam].victories += 1;
                    dicth[game.hometeam].points += 3;
                }

                if (dicta[game.awayteam] === undefined) {
                    dicta[game.awayteam] = {team: game.awayteam, victories: 0, draws: 0, losses: 1, points: 0};
                } else {
                    dicta[game.awayteam].losses += 1;
                }

            } else if (game.fulltimeresult === "D") {
                if (dict[game.hometeam] === undefined) {
                    dict[game.hometeam] = {team: game.hometeam, victories: 0, draws: 1, losses: 0, points: 1};
                } else {
                    dict[game.hometeam].draws += 1;
                    dict[game.hometeam].points += 1;
                }

                if (dict[game.awayteam] === undefined) {
                    dict[game.awayteam] = {team: game.awayteam, victories: 0, draws: 1, losses: 0, points: 1};
                } else {
                    dict[game.awayteam].draws += 1;
                    dict[game.awayteam].points += 1;
                }

                if (dicth[game.hometeam] === undefined) {
                    dicth[game.hometeam] = {team: game.hometeam, victories: 0, draws: 1, losses: 0, points: 1};
                } else {
                    dicth[game.hometeam].draws += 1;
                    dicth[game.hometeam].points += 1;
                }

                if (dicta[game.awayteam] === undefined) {
                    dicta[game.awayteam] = {team: game.awayteam, victories: 0, draws: 1, losses: 0, points: 1};
                } else {
                    dicta[game.awayteam].draws += 1;
                    dicta[game.awayteam].points += 1;
                }

            } else if (game.fulltimeresult === "A") {
                if (dict[game.hometeam] === undefined) {
                    dict[game.hometeam] = {team: game.hometeam, victories: 0, draws: 0, losses: 1, points: 0};
                } else {
                    dict[game.hometeam].losses += 1;
                }

                if (dict[game.awayteam] === undefined) {
                    dict[game.awayteam] = {team: game.awayteam, victories: 1, draws: 0, losses: 0, points: 3};
                } else {
                    dict[game.awayteam].victories += 1;
                    dict[game.awayteam].points += 3;
                }

                if (dicth[game.hometeam] === undefined) {
                    dicth[game.hometeam] = {team: game.hometeam, victories: 0, draws: 0, losses: 1, points: 0};
                } else {
                    dicth[game.hometeam].losses += 1;
                }

                if (dicta[game.awayteam] === undefined) {
                    dicta[game.awayteam] = {team: game.awayteam, victories: 1, draws: 0, losses: 0, points: 3};
                } else {
                    dicta[game.awayteam].victories += 1;
                    dicta[game.awayteam].points += 3;
                }

            }

            // Get Stats
            const ht = game.hometeam;
            const at = game.awayteam;

            if (dics[ht] === undefined) {
                dics[ht] = {
                    team: ht,
                    goalscored: game.homescore,
                    goalsconceded: game.awayscore,
                    shots: game.homeshots,
                    shotstarget: game.homeshotstarget,
                    shotswoodwork: game.homeshotswoodwork,
                    corners: game.homecorners,
                    fouls: game.homefouls,
                    yellows: game.homeyellows,
                    reds: game.homered
                }
            } else {
                dics[ht].goalscored += game.homescore;
                dics[ht].goalsconceded += game.awayscore;
                dics[ht].shots += game.homeshots;
                dics[ht].shotstarget += game.homeshotstarget;
                dics[ht].shotswoodwork += game.homeshotswoodwork;
                dics[ht].corners += game.homecorners;
                dics[ht].fouls += game.homefouls;
                dics[ht].yellows += game.homeyellows;
                dics[ht].reds += game.homered;
            }

            if (dicsh[ht] === undefined) {
                dicsh[ht] = {
                    team: ht,
                    goalscored: game.homescore,
                    goalsconceded: game.awayscore,
                    shots: game.homeshots,
                    shotstarget: game.homeshotstarget,
                    shotswoodwork: game.homeshotswoodwork,
                    corners: game.homecorners,
                    fouls: game.homefouls,
                    yellows: game.homeyellows,
                    reds: game.homered
                }
            } else {
                dicsh[ht].goalscored += game.homescore;
                dicsh[ht].goalsconceded += game.awayscore;
                dicsh[ht].shots += game.homeshots;
                dicsh[ht].shotstarget += game.homeshotstarget;
                dicsh[ht].shotswoodwork += game.homeshotswoodwork;
                dicsh[ht].corners += game.homecorners;
                dicsh[ht].fouls += game.homefouls;
                dicsh[ht].yellows += game.homeyellows;
                dicsh[ht].reds += game.homered;
            }

            if (dics[at] === undefined) {
                dics[at] = {
                    team: at,
                    goalscored: game.awayscore,
                    goalsconceded: game.homescore,
                    shots: game.awayshots,
                    shotstarget: game.awayshotstarget,
                    shotswoodwork: game.awayshotswoodwork,
                    corners: game.awaycorners,
                    fouls: game.awayfouls,
                    yellows: game.awayyellows,
                    reds: game.awayred
                }
            } else {
                dics[at].goalscored += game.awayscore;
                dics[at].goalsconceded += game.homescore;
                dics[at].shots += game.awayshots;
                dics[at].shotstarget += game.awayshotstarget;
                dics[at].shotswoodwork += game.awayshotswoodwork;
                dics[at].corners += game.awaycorners;
                dics[at].fouls += game.awayfouls;
                dics[at].yellows += game.awayyellows;
                dics[at].reds += game.awayred;
            }

            if (dicsa[at] === undefined) {
                dicsa[at] = {
                    team: at,
                    goalscored: game.awayscore,
                    goalsconceded: game.homescore,
                    shots: game.awayshots,
                    shotstarget: game.awayshotstarget,
                    shotswoodwork: game.awayshotswoodwork,
                    corners: game.awaycorners,
                    fouls: game.awayfouls,
                    yellows: game.awayyellows,
                    reds: game.awayred
                }
            } else {
                dicsa[at].goalscored += game.awayscore;
                dicsa[at].goalsconceded += game.homescore;
                dicsa[at].shots += game.awayshots;
                dicsa[at].shotstarget += game.awayshotstarget;
                dicsa[at].shotswoodwork += game.awayshotswoodwork;
                dicsa[at].corners += game.awaycorners;
                dicsa[at].fouls += game.awayfouls;
                dicsa[at].yellows += game.awayyellows;
                dicsa[at].reds += game.awayred;
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
            temp[key] = {
                color: "",
                results: [],
                resultshome: [],
                resultsaway: [],
                stats: [],
                statshome: [],
                statsaway: [],
                points: []
            }

            temp[key].points = value;
        }


        for (const [key, value] of Object.entries(dics)) {
            if (temp[key] === undefined) {
                temp[key] = {
                    color: "",
                    results: [],
                    resultshome: [],
                    resultsaway: [],
                    stats: [],
                    statshome: [],
                    statsaway: [],
                    points: []
                }
            }

            temp[key].stats.push(value);

            stats.push(value);
        }

        for (const [key, value] of Object.entries(dicsh)) {
            if (temp[key] === undefined) {
                temp[key] = {
                    color: "",
                    results: [],
                    resultshome: [],
                    resultsaway: [],
                    stats: [],
                    statshome: [],
                    statsaway: [],
                    points: []
                }
            }

            temp[key].statshome.push(value);
        }

        for (const [key, value] of Object.entries(dicsa)) {
            if (temp[key] === undefined) {
                temp[key] = {
                    color: "",
                    results: [],
                    resultshome: [],
                    resultsaway: [],
                    stats: [],
                    statshome: [],
                    statsaway: [],
                    points: []
                }
            }

            temp[key].statsaway.push(value);
        }

        results.splice(0)
        for (const [key, value] of Object.entries(dict)) {
            if (temp[key] === undefined) {
                temp[key] = {
                    color: "",
                    results: [],
                    resultshome: [],
                    resultsaway: [],
                    stats: [],
                    statshome: [],
                    statsaway: [],
                    points: []
                }
            }

            temp[key].results.push(value);

            results.push(value);
        }

        for (const [key, value] of Object.entries(dicth)) {
            if (temp[key] === undefined) {
                temp[key] = {
                    color: "",
                    results: [],
                    resultshome: [],
                    resultsaway: [],
                    stats: [],
                    statshome: [],
                    statsaway: [],
                    points: []
                }
            }

            temp[key].resultshome.push(value);
        }

        for (const [key, value] of Object.entries(dicta)) {
            if (temp[key] === undefined) {
                temp[key] = {
                    color: "",
                    results: [],
                    resultshome: [],
                    resultsaway: [],
                    stats: [],
                    statshome: [],
                    statsaway: [],
                    points: []
                }
            }

            temp[key].resultsaway.push(value);
        }


        // sort results by points
        results.sort((a, b) => {
            return b.points - a.points;
        });

        for (const [key, value] of Object.entries(colors)) {
            if (temp[key] === undefined) {
                temp[key] = {
                    color: "",
                    results: [],
                    resultshome: [],
                    resultsaway: [],
                    stats: [],
                    statshome: [],
                    statsaway: [],
                    points: []
                }
            }

            temp[key].color = value;
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

    const ppjXScale = d3.scaleLinear()
        .domain([
            1,
            2 * Object.keys(info).length
        ])
        .range([0, 480]);

    const ppjYScale = d3.scaleLinear()
        .domain([
            0,
            (ppjData.length > 0) ?
                max(ppjData, d => max(d.points, (p) => p.y)) as number
                : 3 * 2 * Object.keys(info).length
        ])
        .range([0, 250]);

    /*
    Parallel Coordinates Chart
     */

    const pccVars = ["position", "points", "wins", "losses", "draws"];

    const pccData = results.map((d, i) => {
        return {
            position: i + 1,
            points: d.points,
            wins: d.victories,
            draws: d.draws,
            losses: d.losses,
            label: d.team,
            color: colors[d.team]
        }
    }).filter(({label}) => selected.includes(label));

    const pccXScale = d3
        .scalePoint<string>()
        .range([0, 480])
        .domain(pccVars);

    const pccYScales = {
        position: d3.scaleLinear()
            .domain([18, 1]) // TODO: Alterar para Número de equipas na temporada
            .range([250, 18]),
        points: d3.scaleLinear()
            .domain([
                0,
                (pccData.length > 0) ?
                    max(pccData, d => d.points) as number
                    : 3 * 2 * 18 // TODO: Alterar para 3 pontos*2 jogos*Número de equipas na temporada)
            ])
            .range([250, 0]),
        wins: d3.scaleLinear()
            .domain([
                0,
                (pccData.length > 0) ?
                    max(pccData, d => d.wins) as number
                    : 2 * 18 // TODO: Alterar para 2*Número de equipas na temporada
            ])
            .range([250, 0]),
        draws: d3.scaleLinear()
            .domain([
                0,
                (pccData.length > 0) ?
                    max(pccData, d => d.draws) as number
                    : 2 * 18 // TODO: Alterar para 2*Número de equipas na temporada
            ])
            .range([250, 0]),
        losses: d3.scaleLinear()
            .domain([
                0,
                (pccData.length > 0) ?
                    max(pccData, d => d.losses) as number
                    : 2 * 18 // TODO: Alterar para 2*Número de equipas na temporada
            ])
            .range([250, 0])
    };

    const pccYSpacings = {
        position: 1,
        points: 5,
        wins: 2,
        draws: 2,
        losses: 2
    }

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
                            width={"100%"}
                            height={"100%"}
                            xScale={ppjXScale}
                            yScale={ppjYScale}
                            xSpacing={1}
                            ySpacing={5}
                            data={ppjData}
                        ></LineChart>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={"h5"}>Parallel Coordinates Plot</Typography>
                        <ParallelCoordinate
                            width={"100%"}
                            height={"100%"}
                            xScale={pccXScale}
                            yScales={pccYScales}
                            ySpacings={pccYSpacings}
                            data={pccData}
                            variables={pccVars}
                        ></ParallelCoordinate>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography>Estatísticas das partidas</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Select
                            value={typeMatchStats}
                            onChange={changeTypeMatchStats}
                        >
                            <MenuItem value={"all"}>Todas</MenuItem>
                            <MenuItem value={"home"}>Casa</MenuItem>
                            <MenuItem value={"away"}>Fora</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12}>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

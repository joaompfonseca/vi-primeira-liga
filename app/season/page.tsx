"use client"

import BarChart from "@/app/BarChart";
import React, {useEffect} from "react";
import {Game} from "@/app/structs/Game";
import * as d3 from "d3";
import {Vdl} from "@/app/structs/Vdl";
import MyTable from "@/app/components/Table";
import {Stat} from "@/app/structs/Stat";
import {Jorn} from "@/app/structs/Jorn";
import {Container, Grid, Typography} from "@mui/material";
import {LineChart} from "@/app/components/LineChart";
import {Point2D} from "@/app/structs/Point2D";
import {max} from "d3";

export default function Home() {

    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [data, setData] = React.useState<Game[]>([]);
    const [results, setResults] = React.useState<Vdl[]>([]);
    const [selected, setSelected] = React.useState<string[]>([]);
    const [stats, setStats] = React.useState<Stat[]>([]);
    const [points, setPoints] = React.useState<{ [id: string]: Jorn[] }>({});

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
        let dict: { [id: string]: Vdl; } = {};
        let dics: { [id: string]: Stat; } = {};
        let dicp: { [id: string]: Jorn[] } = {};
        for (let i = 0; i < data.length; i++) {
            const game = data[i];

            // Get Points and Victories

            if (game.fulltimeresult === "H") {
                if (dict[game.hometeam] === undefined) {
                    dict[game.hometeam] = {team: game.hometeam, victories: 1, draws: 0, losses: 0, points: 3};
                } else if (dict[game.awayteam] === undefined) {
                    dict[game.awayteam] = {team: game.awayteam, victories: 0, draws: 0, losses: 1, points: 0};
                } else {
                    dict[game.hometeam].victories += 1;
                    dict[game.hometeam].points += 3;
                    dict[game.awayteam].losses += 1;
                }
            } else if (game.fulltimeresult === "D") {
                if (dict[game.hometeam] === undefined) {
                    dict[game.hometeam] = {team: game.hometeam, victories: 0, draws: 1, losses: 0, points: 1};
                } else if (dict[game.awayteam] === undefined) {
                    dict[game.awayteam] = {team: game.awayteam, victories: 0, draws: 1, losses: 0, points: 1};
                } else {
                    dict[game.hometeam].draws += 1;
                    dict[game.hometeam].points += 1;
                    dict[game.awayteam].draws += 1;
                    dict[game.awayteam].points += 1;
                }
            } else if (game.fulltimeresult === "A") {
                if (dict[game.hometeam] === undefined) {
                    dict[game.hometeam] = {team: game.hometeam, victories: 0, draws: 0, losses: 1, points: 0};
                } else if (dict[game.awayteam] === undefined) {
                    dict[game.awayteam] = {team: game.awayteam, victories: 1, draws: 0, losses: 0, points: 3};
                } else {
                    dict[game.hometeam].losses += 1;
                    dict[game.awayteam].victories += 1;
                    dict[game.awayteam].points += 3;
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

        for (const [key, value] of Object.entries(dics)) {
            stats.push(value);
        }

        results.splice(0)
        for (const [key, value] of Object.entries(dict)) {
            results.push(value);
        }
        // sort results by points
        results.sort((a, b) => {
            return b.points - a.points;
        });
    }

    const updateSelected = (selected: string[]) => {
        setSelected(selected);
    }

    console.log(points);

    /*
    Color palette
     */

    const colors = [
        "#FF0000", // Red
        "#00FF00", // Lime
        "#0000FF", // Blue
        "#FFFF00", // Yellow
        "#FF00FF", // Magenta
        "#00FFFF", // Cyan
        "#C0C0C0", // Silver
        "#808080", // Gray
        "#800000", // Maroon
        "#008000", // Green
        "#000080", // Navy
        "#FFA500", // Orange
        "#A52A2A", // Brown
        "#800080", // Purple
        "#008080", // Teal
        "#F0E68C", // Khaki
        "#FFC0CB", // Pink
        "#ADD8E6", // LightBlue
        "#20B2AA", // LightSeaGreen
        "#7FFF00"  // Chartreuse
    ];

    /*
    Points per Jornada
    */

    // TODO: Criar função getPointsPerJornada que retorna os pontos Point2D[] (foi uma interface que criei) por
    //  jornada passando como argumento "selected", que contém os nomes das equipas selecionadas
    const ppjData = Object.keys(points)
        .map((key, i) => {
            return {
                label: key,
                points: points[key].map((j) => {
                    return {x: j.jornada, y: j.points};
                }),
                color: colors[i]
            };
        })
        .filter(({label}) => selected.includes(label));

    const ppjXScale = d3.scaleLinear()
        .domain([
            1,
            2*18 // TODO: Alterar para 2*Número de equipas na temporada
        ])
        .range([0, 1000]);


    const ppjYScale = d3.scaleLinear()
        .domain([
            0,
            (ppjData.length > 0) ?
                max(ppjData, d => max(d.points, (p) => p.y)) as number
                : 3*2*18 // TODO: Alterar para 3 pontos*2 jogos*Número de equipas na temporada
        ])
        .range([0, 500]);

    return (
        <Grid container spacing={2} padding={2}>
            <Grid item xs={3}>
                {data !== undefined && data.length > 0 &&
                    <MyTable
                        data={results}
                        updateSelected={updateSelected}/>
                }
            </Grid>
            <Grid item xs={9}>
                <Typography variant={"h4"}>Evolução de Pontos por Jornada</Typography>
                <LineChart
                    width={"100%"}
                    height={"100%"}
                    xScale={ppjXScale}
                    yScale={ppjYScale}
                    data={ppjData}
                ></LineChart>
            </Grid>
        </Grid>
    );
}

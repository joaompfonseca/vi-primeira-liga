"use client"

import BarChart from "@/app/BarChart";
import React, {useEffect} from "react";
import {Game} from "@/app/structs/Game";
import * as d3 from "d3";
import {Vdl} from "@/app/structs/Vdl";
import MyTable from "@/app/components/Table";

export default function Home() {

    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [data, setData] = React.useState<Game[]>([]);
    const [results, setResults] = React.useState<Vdl[]>([]);
    const [selected, setSelected] = React.useState<string[]>([]);

    useEffect(() => {
        fetchdata();
        if (!isLoading) {
            getVictories();
        }
    }, [isLoading]);

    const fetchdata = async () => {
        setIsLoading(true)
        await d3.csv('data.csv')
            .then(data => {
                const games: Game[] = [];
                const t: string[] = [];
                for (let i = 0; i < data.length; i++) {
                    const e = data[i];
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
                    if (!t.includes(game.hometeam)) {
                        t.push(game.hometeam);
                    }
                    if (!t.includes(game.awayteam)) {
                        t.push(game.awayteam);
                    }
                    games.push(game);
                }
                setData(games);
            })
            .catch(err => {
                console.log(err);
            });
        setIsLoading(false);
    }

    const getVictories = () => {
        let dict: { [id: string] : Vdl; } = {};
        for (let i = 0; i < data.length; i++) {
            const game = data[i];
            if (game.fulltimeresult === "H") {
                if (dict[game.hometeam] === undefined) {
                    dict[game.hometeam] = {team: game.hometeam, victories: 1, draws: 0, losses: 0};
                } else if (dict[game.awayteam] === undefined) {
                    dict[game.awayteam] = {team: game.awayteam, victories: 0, draws: 0, losses: 1};
                }
                else {
                    dict[game.hometeam].victories += 1;
                    dict[game.awayteam].losses += 1;
                }
            } else if (game.fulltimeresult === "D") {
                if (dict[game.hometeam] === undefined) {
                    dict[game.hometeam] = {team: game.hometeam, victories: 0, draws: 1, losses: 0};
                } else if (dict[game.awayteam] === undefined) {
                    dict[game.awayteam] = {team: game.awayteam, victories: 0, draws: 1, losses: 0};
                }
                else {
                    dict[game.hometeam].draws += 1;
                    dict[game.awayteam].draws += 1;
                }
            } else if (game.fulltimeresult === "A") {
                if (dict[game.hometeam] === undefined) {
                    dict[game.hometeam] = {team: game.hometeam, victories: 0, draws: 0, losses: 1};
                } else if (dict[game.awayteam] === undefined) {
                    dict[game.awayteam] = {team: game.awayteam, victories: 1, draws: 0, losses: 0};
                }
                else {
                    dict[game.hometeam].losses += 1;
                    dict[game.awayteam].victories += 1;
                }
            }
        }
        results.splice(0)
        for (const [key, value] of Object.entries(dict)) {
            results.push(value);
        }
        // sort results by victories
        results.sort((a, b) => {
            return b.victories - a.victories;
        });
    }

    const getSelected = (selected:string[]) => {
        setSelected(selected);
    }

    //console.log(results)

  return (
      <div>
          { data !== undefined && data.length > 0 && <MyTable data={results} sendSelected={getSelected}/> }
      </div>
  );
}

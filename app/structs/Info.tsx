import { Matchday } from "./Matchday";
import { Stat } from "./Stat";
import { VictoryDrawLoss } from "./VictoryDrawLoss";

export interface Info{
    color: string;
    results: VictoryDrawLoss[];
    resultshome: VictoryDrawLoss[];
    resultsaway: VictoryDrawLoss[];
    stats: Stat[];
    statshome: Stat[];
    statsaway: Stat[];
    points: Matchday[];
}
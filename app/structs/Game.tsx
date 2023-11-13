export class Game {
    hometeam: string;
    awayteam: string;
    homescore: number;
    awayscore: number;
    fulltimeresult: string;
    homeshots: number;
    awayshots: number;
    homeshotstarget: number;
    awayshotstarget: number;
    homeshotswoodwork: number;
    awayshotswoodwork: number;
    homecorners: number;
    awaycorners: number;
    homefouls: number;
    awayfouls: number;
    homeyellows: number;
    awayyellows: number;
    homered: number;
    awayred: number;

    constructor(
        hometeam: string,
        awayteam: string,
        homescore: number,
        awayscore: number,
        fulltimeresult: string,
        homeshots: number,
        awayshots: number,
        homeshotstarget: number,
        awayshotstarget: number,
        homeshotswoodwork: number,
        awayshotswoodwork: number,
        homecorners: number,
        awaycorners: number,
        homefouls: number,
        awayfouls: number,
        homeyellows: number,
        awayyellows: number,
        homered: number,
        awayred: number
    ) {
        this.hometeam = hometeam;
        this.awayteam = awayteam;
        this.homescore = homescore;
        this.awayscore = awayscore;
        this.fulltimeresult = fulltimeresult;
        this.homeshots = homeshots;
        this.awayshots = awayshots;
        this.homeshotstarget = homeshotstarget;
        this.awayshotstarget = awayshotstarget;
        this.homeshotswoodwork = homeshotswoodwork;
        this.awayshotswoodwork = awayshotswoodwork;
        this.homecorners = homecorners;
        this.awaycorners = awaycorners;
        this.homefouls = homefouls;
        this.awayfouls = awayfouls;
        this.homeyellows = homeyellows;
        this.awayyellows = awayyellows;
        this.homered = homered;
        this.awayred = awayred;
    }

}
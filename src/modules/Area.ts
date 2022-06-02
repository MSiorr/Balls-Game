import { config } from "./Conf";
import { ballsColorsDecorator } from "./Decorators";

import { Board } from "./Board";
import { Ball } from "./Ball";

export interface IArea {
    /** Main div */
    div: HTMLDivElement
    /** Array with colors for the future balls  */
    ballPrevColor: String[][]
    /** The number of spawning balls  */
    ballSpawnerCount: number
    /** Current player score  */
    score: number

    /** Top Div with future balls and score info  */
    gameInfo: HTMLDivElement
    /** Div showing future balls  */
    ballInfo: HTMLDivElement
    /** Div showing current player score  */
    scoreDiv: HTMLDivElement

    /** Game {@link Board}  */
    board?: Board,

    /** 
     * Create future balls, and check if the game is over 
     * @param joker determines whether a joker will be created
    */
    ballManage(joker?: boolean): void
    /** 
     * Add Score for broken balls 
     * @param val number of points to be added
     */
    addScore(val: number): void
    /** 
     * Create end game overlay 
    */
    endGame(): void
}

/**
 * Main class where it all starts 
 */
export class Area implements IArea {
    div: HTMLDivElement
    ballPrevColor: String[][]
    ballSpawnerCount: number
    score: number

    gameInfo: HTMLDivElement
    ballInfo: HTMLDivElement
    scoreDiv: HTMLDivElement

    board?: Board

    constructor() {
        this.div = document.createElement("div");
        this.div.id = "mainDiv";

        this.gameInfo = document.createElement('div');
        this.gameInfo.id = "gameInfo";

        this.ballInfo = document.createElement("div");
        this.ballInfo.id = 'ballInfo';

        this.scoreDiv = document.createElement('div');
        this.scoreDiv.id = 'scoreDiv';

        this.score = 0;
        this.board = new Board(config.board_length, config.board_height);
        this.board.parent = this;

        this.ballSpawnerCount = config.ballSpawnerCount;
        this.ballPrevColor = new Array(this.ballSpawnerCount).fill(null).map(x => new Array(config.colors[Math.floor(Math.random() * config.colors.length)]));

        this.init();
    }

    /** Initialization Area class */
    private init() {
        document.body.appendChild(this.div);
        this.gameInfo.appendChild(this.ballInfo)
        this.gameInfo.appendChild(this.scoreDiv);
        this.div.appendChild(this.gameInfo);
        this.div.appendChild(this.board.mainDiv);

        this.scoreDiv.innerHTML = `Score: ${this.score.toString()}`;

        this.ballPrevColor.map(e => {
            let ball: Ball = new Ball(e);
            ball.addClass('prev');
            ball.removeClass('ball');
            this.ballInfo.appendChild(ball.div);
        })

        this.ballManage();
    }

    @ballsColorsDecorator
    /** @inheritdoc */
    public ballManage(joker = false) {
        this.board.createBalls(this.ballPrevColor);
        this.board.slideEffectBool = true;

        config.fastGame == false ? this.gameInfo.style.borderColor = 'red' : null;
        setTimeout(() => {
            this.gameInfo.style.borderColor = 'white';
            this.board.slideEffectBool = false;
            this.board.boardScan();
            if (this.board.fieldsList.flatMap((cV, i) => { return cV.map((e, j) => { return e }) }).filter((e) => { if (e.free) { return e } }).length == 0) { this.endGame() };

            this.ballPrevColor = new Array(this.ballSpawnerCount).fill(null).map(x => new Array(config.colors[Math.floor(Math.random() * config.colors.length)]));
            this.ballInfo.innerHTML = '';
            this.ballPrevColor.map((e, i, a) => {
                let ball: Ball;
                if (i == 0 && joker == true) {
                    ball = new Ball([...config.colors]);
                    a[i] = [...config.colors];
                } else {
                    ball = new Ball(e);
                }
                ball.addClass('prev');
                ball.removeClass('ball');
                this.ballInfo.appendChild(ball.div);

            })
        }, config.fastGame ? 1 : 1000)
    }

    /** @inheritdoc */
    public addScore(val: number): void {
        this.score += val;
        this.scoreDiv.innerHTML = `Score: ${this.score.toString()}`;
    }

    /** @inheritdoc */
    public endGame() {
        let overlay: HTMLDivElement = document.createElement('div'); overlay.id = 'overlay'; document.body.appendChild(overlay); overlay.style.opacity = `0`;
        let endGameInfo: HTMLDivElement = document.createElement('div'); endGameInfo.id = 'endGameInfo'; overlay.appendChild(endGameInfo);

        let spanTitle: HTMLSpanElement = document.createElement('span'); spanTitle.id = "spanTitle"; spanTitle.innerHTML = "YOU LOSE"; endGameInfo.appendChild(spanTitle);
        let spanScoreTitle: HTMLSpanElement = document.createElement('span'); spanScoreTitle.id = "spanScoreTitle"; spanScoreTitle.innerHTML = "Score"; endGameInfo.appendChild(spanScoreTitle);
        let spanScore: HTMLSpanElement = document.createElement('span'); spanScore.id = "spanScore"; spanScore.innerHTML = `${this.score}`; endGameInfo.appendChild(spanScore);

        let btn: HTMLButtonElement = document.createElement('button'); btn.classList.add('btn'); btn.innerHTML = 'RESTART'; endGameInfo.appendChild(btn);
        btn.onclick = () => {
            document.body.innerHTML = '';
            this.div.innerHTML = '';
            this.board = new Board(config.board_length, config.board_height);
            this.board.parent = this;
            this.score = 0;
            this.init();
        }

        setTimeout(() => { overlay.style.opacity = `1` }, 10);
    }
}
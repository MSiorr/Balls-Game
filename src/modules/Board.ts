import { config } from "./Conf"
import { Field } from "./Field"
import { PathFind } from "./PathFind"
import { Ball } from "./Ball"

import { Area } from "./Area"
import { BallSmasher } from "./BallSmasher"
import { gameSpeedDecorator } from "./Decorators"

export interface IBoard {
    /** Main {@link Board} Div */
    mainDiv: HTMLDivElement
    /** Board Width */
    readonly width: number
    /** Board Height */
    readonly height: number
    /** Two-dimensional {@link Field | Fields} array */
    fieldsList: Field[][]
    /** {@link Ball | Balls} array */
    ballList: Ball[]
    /** A variable that holds an instance of the {@link PathFind} class */
    pathFinder: PathFind
    /** A boolean telling if a path search is currently occurring */
    pathFindingProc: boolean
    /** {@link Field | Fields} Array with shortest path */
    path: Array<Field>
    /** A variable that holds an instance of the {@link BallSmasher} class */
    ballSmasher: BallSmasher
    /** A boolean telling if a slide effect is currently occurring */
    slideEffectBool: Boolean
    /** Starting {@link Field} when searching for a path */
    startField?: Field
    /** End {@link Field} when searching for a path */
    endField?: Field
    /** {@link Board} parent */
    parent: Area
    /** How much time does the game freeze after making a move */
    afterMoveTime?: number

    /**
     * Method for adding balls to the {@link Board}
     * @param colors Two-dimensional colors array
     */
    createBalls(colors: String[][]): void
    /**
     * Method that calls the {@link BallSmasher} and destroys the given {@link Ball | Balls} 
     * @returns Method result
     */
    boardScan(): boolean
    /**
     * Method that checks if there are still any {@link Ball | Balls} on the board 
     * @returns Method result
     */
    anyBallOnBoard(): boolean
}

@gameSpeedDecorator
/**
 * Class that manages the board 
 */
export class Board implements IBoard {
    mainDiv: HTMLDivElement
    readonly width: number
    readonly height: number
    fieldsList: Field[][]
    ballList: Ball[]

    pathFinder: PathFind
    pathFindingProc: boolean
    path: Array<Field>

    ballSmasher: BallSmasher

    slideEffectBool: Boolean

    startField?: Field
    endField?: Field

    parent: Area

    afterMoveTime?: number

    /**
     * @param width Board width
     * @param height Board height
     */
    constructor(width: number, height: number) {
        this.mainDiv = document.createElement("div");
        this.mainDiv.id = "board";

        this.width = width;
        this.height = height;
        this.fieldsList = [];
        this.ballList = [];

        this.pathFinder = new PathFind();
        this.pathFindingProc = false;
        this.path = [];

        this.ballSmasher = new BallSmasher();

        this.slideEffectBool = false;

        this.init();
    }

    /**
     * {@link Board} class initialization. Adding {@link Field | Fields} events
     */
    private init() {
        for (let i: number = 0; i < this.width; i++) {
            let columnDiv: HTMLDivElement = document.createElement("div");
            columnDiv.classList.add('boardColumn');
            this.fieldsList[i] = [];
            for (let j: number = 0; j < this.height; j++) {
                let field: Field = new Field(i, j)

                field.div.onclick = (async (e: MouseEvent) => {
                    if (this.slideEffectBool == false) {
                        if (field.child) {
                            if (field.child.isActive == false) {
                                let canActive: Boolean = false;
                                config.pos.forEach(e => {
                                    if (field.x + e.x >= 0 && field.x + e.x < this.width && field.y + e.y >= 0 && field.y + e.y < this.height) {
                                        if (this.fieldsList[field.x + e.x][field.y + e.y].free == true) { canActive = true; }
                                    }
                                })
                                if (canActive) {
                                    this.ballList.forEach(e => e.removeClass('activeBall'))
                                    field.child.addClass('activeBall')
                                    field.child.isActive = true;
                                    if (this.startField && this.startField.child) {
                                        this.startField.child.isActive = false
                                    }
                                    this.startField = field;
                                }
                            } else {
                                field.child.removeClass('activeBall');
                                field.child.isActive = false;
                                this.startField = undefined;
                            }
                        } else {
                            if (this.pathFindingProc == true) {
                                if (this.startField && this.startField.child && this.path.length > 0) {
                                    this.startField.child.removeClass('activeBall');
                                    this.startField.child.isActive = false;

                                    await this.slideBall();
                                    setTimeout(() => {
                                        this.slideEffectBool = false;

                                        this.fieldsList.forEach(e => e.forEach(x => {
                                            x.removeClass('pathDisplay');
                                            x.restartField();
                                        }));

                                        let boardScan: Boolean = this.boardScan();

                                        boardScan == false ? this.parent.ballManage() : this.anyBallOnBoard() == false ? this.parent.ballManage() : null

                                    }, this.afterMoveTime ? this.afterMoveTime : 0)
                                }
                            }
                        }
                    }
                })

                field.div.onmouseover = (e) => {
                    this.fieldsList.forEach(e => e.forEach(x => {
                        if (this.slideEffectBool == false) {
                            x.removeClass('pathDisplay');
                            x.restartField();
                        }
                    }));
                    if (this.startField && this.startField != field) {
                        this.endField = field;
                        this.pathFinding();
                    } else {
                        this.pathFindingProc = false;
                    }
                }
                this.fieldsList[i][j] = field;

                columnDiv.appendChild(field.div);
            }
            this.mainDiv.appendChild(columnDiv)
        }
    }

    /** @inheritdoc */
    public createBalls(colors: String[][]) {
        let allPlaces: Field[] = this.fieldsList.flatMap((cV, i) => {
            return cV.map((e, j) => { return e })
        }).filter((e) => { if (e.free) { return e } });
        if (allPlaces.length >= colors.length) {
            for (let i: number = 0; i < colors.length; i++) {
                let field: Field = allPlaces.splice(Math.floor(Math.random() * allPlaces.length), 1)[0];

                let ball: Ball = new Ball(colors[i])
                field.addBall(ball);
                this.ballList.push(ball);
            }
        } else {
            this.parent.endGame();
        }
    }

    /**
     * Method calling {@link PathFind}
     */
    private pathFinding() {

        if (this.startField && this.endField) {

            this.pathFindingProc = true;

            this.path = this.pathFinder.find(this.startField, this.endField, this.fieldsList)

            this.path.forEach(e => {
                e.addClass("pathDisplay")
            })
        }

    }

    /**
     * Method for managing the animation of the {@link Ball}
     * @returns Method result
     */
    private async slideBall(): Promise<Boolean> {
        this.slideEffectBool = true;

        let ball: Ball = this.startField.child
        this.startField = undefined;
        this.endField = undefined;
        this.pathFindingProc = false;
        if (ball != null) {
            let slideEff: Boolean = await this.slideEffect(ball);
            if (slideEff == true) { return true }
        }
        return false
    }

    /**
     * Method of moving the {@link Ball} across each {@link Field} of the {@link Board.path | path}
     * @param ball {@link Ball} to move
     * @returns Method result
     */
    private slideEffect(ball: Ball): Promise<Boolean> {
        return new Promise((resolv) => {
            let i: number = this.path.length - 1;
            let slideInterval: NodeJS.Timer = setInterval(() => {
                if (i < this.path.length - 1) { this.path[i + 1].removeBall(); this.path[i + 1].child = undefined }
                this.path[i].addBall(ball);
                i--;
                if (i < 0) {
                    clearInterval(slideInterval);
                    resolv(true)
                }
            }, 20)
        })
    }

    /** @inheritdoc */
    public boardScan(): boolean {
        let toDestroy: Field[] = this.ballSmasher.checkTab(this.fieldsList);
        toDestroy.forEach(e => { e.removeBall(); e.child = undefined })
        this.parent.addScore(toDestroy.length);
        return toDestroy.length > 0
    }

    /** @inheritdoc */
    public anyBallOnBoard(): boolean {
        return this.fieldsList.filter(e => { if (e.filter(x => { if (x.child) { return x } }).length > 0) { return e } }).length > 0
    }
}
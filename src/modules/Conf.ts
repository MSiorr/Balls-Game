import { ColorsArray } from "./Interfaces"

/**
 * Interface for {@link config}
 */
export interface IConf {
    /** Colors Array */
    colors: ColorsArray,
    /** Array with positions used to inspect {@link Field | Fields} around the selected {@link Field} */
    pos: Array<{ x: number, y: number }>,
    /** How many minimum {@link Ball | Balls} of one color must exist to be destroyed */
    destroyCount: number,
    /** The number of spawning {@link Ball | Balls}  */
    ballSpawnerCount: number,
    /** Variable that determines whether a freeze occurs after a move is made */
    fastGame: boolean,
    /** A variable that tells what the chance of creating a joker is (0-1) */
    chanceForJoker: number,
    /** {@link Board} length */
    board_length: number,
    /** {@link Board} height */
    board_height: number
}

/**
 * Main game config
 */
export let config: IConf = {
    // colors: ["#240046", "#70e000"],
    colors: ["#e63946", "#ffba08", "#c77dff", "#00b4d8", "#40916c", "#240046", "#70e000"],
    pos: [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }],
    destroyCount: 3,
    ballSpawnerCount: 3,
    fastGame: true,
    chanceForJoker: 0.1,


    board_length: 9,
    board_height: 9,
}
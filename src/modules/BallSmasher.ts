import { Field } from "./Field";
import { config } from "./Conf";

/**
 * Enum with direct types used in checking arrays
 */
export enum Direct {
    VERTICAL = "VERTICAL",
    HORIZONTAL = "HORIZONTAL",
    DIAGONAL_LEFT = "DIAGONAL_LEFT",
    DIAGONAL_RIGHT = "DIAGONAL_RIGHT",
}


export interface IBallSmasher {
    /** Array with {@link Field | Fields} to destroy */
    toDestroy: Field[]
    /** How many minimum balls of one color must exist to be destroyed */
    minCountToDestroy: number

    /** 
     * A function that executes the appropriate commands to check the entire given array 
     * @param fieldList An array of all the {@link Field | Fields} on the {@link Board} 
     * @returns List of {@link Field | Fields} with {@link Ball | Balls} to be destroyed
     */
    checkTab(fieldList: Field[][]): Field[]
}

/**
 * A class that inspects an array to find {@link Field | Fields} with {@link Ball | Balls} to destroy
 */
export class BallSmasher implements IBallSmasher {
    toDestroy: Field[]
    minCountToDestroy: number

    constructor() {
        this.toDestroy = [];
        this.minCountToDestroy = config.destroyCount;
    }

    /** @inheritdoc */
    public checkTab(fieldList: Field[][]): Field[] {
        this.toDestroy = [];
        this.checkingLoop(fieldList, Direct.VERTICAL);
        this.checkingLoop(fieldList, Direct.HORIZONTAL);
        this.checkingLoop(fieldList, Direct.DIAGONAL_LEFT);
        this.checkingLoop(fieldList, Direct.DIAGONAL_RIGHT);
        return Array.from(this.toDestroy);
    }

    /**
     * A method that checks a list of {@link Field | Fields} in a given {@link Direct | direction}
     * @param list Two-dimensional {@link Field} list
     * @param direct the {@link Direct | direction} of the check
     */
    private checkingLoop(list: Field[][], direct: Direct): void {
        let tempFields: Field[] = []
        let lastColor: String = '';
        if (direct == "VERTICAL" || direct == "HORIZONTAL") {
            for (let i: number = 0; i < list.length; i++) {
                for (let j: number = 0; j < list[i].length; j++) {
                    let field: Field = direct == "VERTICAL" ? list[i][j] : list[j][i]
                    if (field.child) {
                        if (field.child.color != lastColor && field.child.color != 'all') {
                            if (lastColor != '') {
                                tempFields = this.clearTempFields(tempFields, false);
                            }
                            lastColor = field.child.color;
                        }
                        tempFields.push(field);
                    } else {
                        tempFields = this.clearTempFields(tempFields);
                    }
                }
                tempFields = this.clearTempFields(tempFields);
                lastColor = ''
            }
        } else {
            for (let x: number = 0; x < (list.length * 2 - 1 - (2 * (this.minCountToDestroy - 1))); x++) {
                for (let i: number = direct == "DIAGONAL_LEFT" ? Math.abs(Math.min(0, list.length - 1 - (this.minCountToDestroy - 1) - x)) : list.length - 1 - Math.abs(Math.min(0, list.length - 1 - (this.minCountToDestroy - 1) - x)), j = Math.abs(Math.max(0, list.length - 1 - (this.minCountToDestroy - 1) - x)); direct == "DIAGONAL_LEFT" ? i < list.length && j < list.length : i >= 0 && j < list.length; direct == "DIAGONAL_LEFT" ? i++ : i--, j++) {
                    let field: Field = list[i][j];
                    if (field.child) {
                        if (field.child.color != lastColor && field.child.color != 'all') {
                            if (lastColor != '') {
                                tempFields = this.clearTempFields(tempFields, false);
                            }
                            lastColor = field.child.color;
                        }
                        tempFields.push(field);
                    } else {
                        tempFields = this.clearTempFields(tempFields);
                    }
                }
                tempFields = this.clearTempFields(tempFields);
                lastColor = ''
            }
        }

        this.removeDuplicats();
    }

    /**
     * A function that cleans the given array of {@link Field | Fields}. If there are enough {@link Field | Fields}, they are added to be destroyed
     * @param tempFields Array with Fields
     * @param blank The condition whether the function was called because of a color change (false) or because of an empty {@link Field} (true)
     * @returns Empty Array, or {@link Field} array with jokers
     */
    private clearTempFields(tempFields: Field[], blank: boolean = true): Field[] {
        if (tempFields.length >= this.minCountToDestroy) {
            this.toDestroy.push(...tempFields);
        }
        let temp: Field[] = [];
        if (blank == false) {
            for (let i: number = tempFields.length - 1; i >= 0; i--) {
                if (tempFields[i].child.color == 'all') {
                    temp.push(tempFields[i])
                } else {
                    break;
                }
            }
        }
        return temp;
    }

    /**
     * A function for removing duplicates from the Array
     */
    private removeDuplicats() {
        this.toDestroy = this.toDestroy.filter((e, i, a) => { if (a.indexOf(e) == i) { return e } })
    }
}
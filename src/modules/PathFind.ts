import { Field } from "./Field";
import { config } from "./Conf"
import { Costs } from "./Interfaces";

export interface IPathFind {
    /** {@link Field} array with {@link Field | Fields} to check */
    openList: Array<Field>
    /** {@link Field} array with checked {@link Field | Fields} */
    closedList: Array<Field>
    /** Variable that tells if a target has been found */
    targetFound: Boolean

    /**
     * Method finding the shortest path to the goal by A *
     * @param start Start {@link Field}
     * @param end End {@link Field}
     * @param fieldsList Two-dimenisonal {@link Field | Fields} array
     * @returns {@link Field} array that are path
     */
    find(start: Field, end: Field, fieldsList: Array<Array<Field>>): Array<Field>
}

/**
 * Class used to find shortest path to target
 */
export class PathFind implements IPathFind {
    openList: Array<Field>
    closedList: Array<Field>

    targetFound: Boolean

    constructor() {
        this.openList = [];
        this.closedList = [];

        this.targetFound = false;
    }

    /** @inheritdoc */
    public find(start: Field, end: Field, fieldsList: Array<Array<Field>>): Array<Field> {
        let maxX: number = fieldsList.length;
        let maxY: number = fieldsList[0].length;

        this.openList = [start]
        this.closedList = [];
        this.targetFound = false;

        let pathFields: Array<Field> = [];
        let pos: Array<{ x: number, y: number }> = config.pos;

        do {
            let list: Field[] = this.openList.sort((a, b) => { return a.cost - b.cost }).filter((e, i, a) => { if (e.cost === a[0].cost) { return e } }).sort((a, b) => { return a.costs.distanceCost - b.costs.distanceCost });
            let curr: Field = list[0];
            this.openList.splice(this.openList.indexOf(curr), 1);
            this.closedList.push(curr);

            if (curr == end) { this.targetFound = true; this.openList = []; }

            if (this.targetFound == false) {
                pos.forEach(e => {
                    if (curr.x + e.x >= 0 && curr.x + e.x < maxX && curr.y + e.y >= 0 && curr.y + e.y < maxY) {
                        let newX: number = curr.x + e.x;
                        let newY: number = curr.y + e.y;

                        if (fieldsList[newX][newY].free == true && this.closedList.includes(fieldsList[newX][newY]) == false) {
                            let tempField: Field = fieldsList[newX][newY];
                            // tempField.setCost(this.end, this.start, curr);
                            let costs: Costs = tempField.calculateCost(end, curr);
                            let sum: number = costs.roadCost + costs.distanceCost;
                            if (!tempField.parent || (tempField.parent && tempField.cost > sum)) {
                                tempField.setCost(costs);
                                tempField.parent = curr;
                            }
                            if (this.openList.includes(tempField) == false) { this.openList.push(tempField) }
                        }
                    }
                })
            }
        } while (this.openList.length > 0)

        if (this.targetFound) {
            let field: Field = end;
            while (field.parent) {
                pathFields.push(field);
                field = field.parent
            }
            pathFields.push(start);
        }

        return pathFields;
    }
}
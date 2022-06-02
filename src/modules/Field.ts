import { Ball } from "./Ball"
import { Costs } from "./Interfaces"

export interface IField {
    /** X position in {@link Board.fieldsList | Fields list} */
    readonly x: number
    /** Y position in {@link Board.fieldsList | Fields list} */
    readonly y: number
    /** Costs descibed in {@link Costs} */
    costs: Costs
    /** Current sum of costs from {@link Costs} */
    cost: number
    /** Variable telling if the {@link Field} is free */
    free: boolean
    /** Main {@link Field} Div */
    div: HTMLDivElement
    /** Current {@link Field} parent, used in {@link PathFind | PathFinding} */
    parent?: Field
    /** {@link Ball} that is a child of the {@link Field} */
    child?: Ball

    /** Method of removing the {@link Field.parent | parent} and cleaning {@link Field.costs | costs} */
    restartField(): void
    /**
     * Method calculating the cost of the road towards the destination
     * @param target {@link Field} target
     * @param parent The {@link Field} calling this MEthod
     * @returns Object with calculated {@link Costs}
     */
    calculateCost(target: Field, parent?: Field): Costs
    /**
     * Method of setting costs
     * @param costs {@link Costs} to set
     */
    setCost(costs: Costs): void
    /**
     * Method for adding {@link Ball} child
     * @param ball {@link Ball} to add
     */
    addBall(ball: Ball): void
    /**
     * Method for remove {@link Ball}
     * @returns Removed {@link Ball} or null
     */
    removeBall(): Ball | null
    /** 
     * Add class to Field {@link Field.div | Div}
     * @param className Class name
     */
    addClass(className: string): void
    /** 
     * Remove class from Field {@link Field.div | Div}
     * @param className Class name
     */
    removeClass(className: string): void
}

/**
 * The class representing the {@link Ball}
 */
export class Field implements IField {
    readonly x: number
    readonly y: number
    costs: Costs
    cost: number
    free: boolean

    div: HTMLDivElement

    parent?: Field
    child?: Ball

    /**
     * Field position
     * @param x X position
     * @param y Y position
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.costs = { roadCost: 0, distanceCost: 0 }
        this.cost = 0;
        this.free = true;

        this.div = document.createElement("div");
        this.div.classList.add("field");
    }

    /** @inheritdoc */
    public restartField() {
        this.costs = { roadCost: 0, distanceCost: 0 }
        this.cost = 0;
        this.parent = undefined;
    }

    /** @inheritdoc */
    public calculateCost(target: Field, parent?: Field): Costs {
        let distanceToStart: number
        if (parent) { distanceToStart = parent.costs.roadCost + 1; }
        else { distanceToStart = 1 }
        let distanceToTarget: number = this.calculateDistance(target);

        return { roadCost: distanceToStart, distanceCost: distanceToTarget }
    }

    /** @inheritdoc */
    public setCost(costs: Costs) {
        this.cost = costs.roadCost + costs.distanceCost;
        this.costs = costs;
    }

    /** @inheritdoc */
    public addBall(ball: Ball) {
        this.child = ball;
        ball.parent = this;
        this.free = false;
        this.div.appendChild(ball.div);
    }

    /** @inheritdoc */
    public removeBall(): Ball | null {
        if (this.child) {
            this.div.removeChild(this.child.div)
            this.free = true;
            return this.child
        } else {
            return null
        }
    }

    /** @inheritdoc */
    public addClass(className: string) {
        this.div.classList.add(className);
    }

    /** @inheritdoc */
    public removeClass(className: string) {
        this.div.classList.remove(className);
    }

    /**
     * Method to calculate the distance between the current {@link Field} and the target {@link Field}
     * @param target Target {@link Field}
     * @returns Distance between {@link Field | Fields}
     */
    private calculateDistance(target: Field): number {
        return Math.abs(target.x - this.x) + Math.abs(target.y - this.y)
    }
}
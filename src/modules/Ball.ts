import { Field } from "./Field";

export interface IBall {
    /** Color of the ball or 'all' if joker */
    readonly color: String,
    /** Ball Div */
    div: HTMLDivElement,
    /** Variable telling whether the selected ball is active  */
    isActive: boolean

    /** Ball parent {@link Field | Field} */
    parent?: Field

    /** 
     * Add class to Ball {@link Ball.div | Div}
     * @param className Class name
     */
    addClass(className: String): void

    /** 
     * Remove class from Ball {@link Ball.div | Div}
     * @param className Class name
     */
    removeClass(className: String): void
}

/**
 * The class representing the {@link Ball}
 */
export class Ball implements IBall {
    readonly color: String
    div: HTMLDivElement
    isActive: boolean

    parent?: Field

    /**
     * @param colors Colors Tab
     */
    constructor(colors: String[]) {
        this.color = colors.length == 1 ? colors[0] : 'all';
        this.div = document.createElement('div');
        this.div.classList.add('ball');

        this.div.style.background = `conic-gradient(${colors.map((e, i, a) => a.length > 1 ? e : `${e}, ${e}`)})`;

        this.isActive = false;
    }

    /** @inheritdoc */
    public addClass(className: string) {
        this.div.classList.add(className);
    }

    /** @inheritdoc */
    public removeClass(className: string) {
        this.div.classList.remove(className);
    }
}
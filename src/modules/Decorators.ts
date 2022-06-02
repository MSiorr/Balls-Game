import { config } from "./Conf";
import { IBallsColorsDecorator } from "./Interfaces";

/**
 * Decorator that randomizes if a joker will be created
 * @param ob Object
 * @param name Function name
 * @param desc Function base items and values
 * @returns Decorated function
 */
export const ballsColorsDecorator: IBallsColorsDecorator = ballsColorsDecoratorFun

/**
 * Decorator setting the game freeze time after the player's move
 * @param target Target class
 * @returns Decorated constructor
 */
export const gameSpeedDecorator = (target: Function) => {
    const original = target;

    const construct = (constructor: Function, args: any[]) => {
        const c: any = function () {
            this.afterMoveTime = config.fastGame ? 0 : 1000;
            return constructor.apply(this, args);
        }

        c.prototype = constructor.prototype;

        return new c();
    }

    const newConstructor: any = function (...args: any[]) {
        console.log("New: " + original.name + " " + args);
        return construct(original, args);
    }

    newConstructor.prototype = original.prototype;

    return newConstructor;
}

function ballsColorsDecoratorFun(ob: Object, name: String, desc: PropertyDescriptor): PropertyDescriptor {
    let oryg = desc.value;

    desc.value = function (...args: any[]) {
        let rand: number = Math.random();
        rand < config.chanceForJoker ? args[0] = true : null
        return oryg.apply(this, args)
    }

    return desc
}
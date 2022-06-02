/**
 * Interface for Array with colors
 */
export interface ColorsArray extends Array<String> {
    /** Set types in Array */
    [index: number]: String
}

/**
 * Interface for Costs
 */
export interface Costs {
    /**
     * Cost of the distance already traveled (1 for each traffic)
     */
    roadCost: number
    /**
     * Cost of the road needed to get to your destination
     */
    distanceCost: number
}

/**
 * Interface for {@link ballsColorsDecorator}
 */
export interface IBallsColorsDecorator {
    /**
     * Decorator that randomizes if a joker will be created
     * @param ob Object
     * @param name Function name
     * @param desc Function base items and values
     * @returns Decorated function
     */
    (ob: Object, name: String, desc: PropertyDescriptor): PropertyDescriptor
}
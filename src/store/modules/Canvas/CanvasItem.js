import { ImageObject } from "./Interface/ImageObject";
import State from "../../State";

export default class extends State {

    constructor() {
        
        super();

        // config defaults

        this.params = {

            ...this.params,

            locked              : false,

            draggable           : true,
            x                   : 100,
            y                   : 100,
            rotation            : 0,
            scale               : [1, 1],
            scaleX              : 1,
            scaleY              : 1,
            skewX               : 0,
            skewY               : 0,

            fill                : 'none',
            fillPatternImage    : new ImageObject(),
            fillEnabled         : true,
            fillPriority        : 'color',
            
            fillPatternRotation : 0,
            fillPatternScale    : [1, 1],
            fillPatternScaleX   : 1,
            fillPatternScaleY   : 1,

            stroke              : 'none',
            strokeWidth         : 0,

        }
        
    }

}
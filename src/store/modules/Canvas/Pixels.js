import CanvasItem from "./CanvasItem";

export default class extends CanvasItem {

    // @will : this state type is TODO!

    constructor() {
        
        super();

        this.type = 'pixels'

        this.params = {
            ...this.params,
            canvas          : null,
            x               : 0,
            y               : 0,
            clipX           : null,
            clipY           : null
        }

    }

}
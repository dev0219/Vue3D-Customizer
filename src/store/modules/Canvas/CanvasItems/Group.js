import CanvasItem from "../CanvasItem";

export default class extends CanvasItem {

    constructor() {
        
        super();
        this.type = 'group'

        this.children = []


        this.params = {
            ...this.params,
            x           : 0,
            y           : 0,
            clipX       : null,
            clipY       : null
        }

    }

}
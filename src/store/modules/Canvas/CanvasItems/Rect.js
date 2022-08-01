import CanvasItem from "../CanvasItem";

export default class extends CanvasItem {

    constructor() {
        
        super();

        this.type = 'rect'

        this.params = {
            ...this.params,
            width           : 125,
            height          : 125,
        }
        
    }

}
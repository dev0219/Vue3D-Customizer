import CanvasItem from "../CanvasItem";

export default class extends CanvasItem {

    constructor() {
        
        super();

        this.type = 'circle'

        this.params = {
            ...this.params,
            radius          : 50,
        }
        
    }

}

import CanvasItem from "../CanvasItem";

export default class extends CanvasItem {

    constructor() {
        
        super();

        this.type = 'text'

        this.params = {
            ...this.params,
            width           : null,
            height          : null,
            
            text            : 'New Text',
            fontSize        : 35,
            fontStyle       : 'normal',
            fontFamily      : 'Arial'
        }
        
    }

}
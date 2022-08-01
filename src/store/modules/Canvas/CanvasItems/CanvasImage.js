import CanvasItem from "../CanvasItem";
import { ImageObject } from "../Interface/ImageObject";

export default class extends CanvasItem {

    constructor() {
        
        super();
        
        this.type = 'image'

        this.params = {
            ...this.params,
            image       : new ImageObject()

        }
        
    }

}
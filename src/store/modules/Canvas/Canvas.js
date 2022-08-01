import BaseModule from "../../BaseModule";
import CanvasImage from "./CanvasItems/CanvasImage";
import CanvasText from "./CanvasItems/CanvasText";
import Circle from "./CanvasItems/Circle";
import Rect from "./CanvasItems/Rect";
import Group from "./CanvasItems/Group";

export default class extends BaseModule {

    constructor() {
        super()

        this.actions = {

            ...this.actions,

            createState: (context, payload) => {

                return new Promise((resolve, reject)=> {

                    var { type, params, children, parentId } = payload
                    var state;

                    switch(type) {

                        case 'group':
                            state = new Group();
                            break

                        case 'rect':
                            state = new Rect();
                            break

                        case 'circle':
                            state = new Circle();
                            break
                        
                        case 'text':
                            state = new CanvasText();
                            break
                        
                        case 'image':
                            state = new CanvasImage()
                            break
                        
                        case 'pixels':
                            state = new Pixels()
                            break
                        
                        default:
                            console.warn('unrecognized state type for Canvas!')
                            return undefined                

                    }

                    context.dispatch('handleStateCreation', { state, type, params, children, parentId })
                    .then(()=> {
                        resolve()
                    })
                })
            },   
        }
    }
}
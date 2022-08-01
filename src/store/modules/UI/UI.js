import BaseModule from "../../BaseModule";
import Block from "./Block";
import Button from "./UIItems/Button";
import Selector from "./UIItems/Selector";
import Slider from "./UIItems/Slider";
import UIFile from "./UIItems/UIFile";
import UIImage from "./UIItems/UIImage";
import UINumber from "./UIItems/UINumber";
import UIText from "./UIItems/UIText";

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

                        case 'block':
                            state = new Block();
                            break

                        case 'text':
                            state = new UIText();
                            break

                        case 'number':
                            state = new UINumber();
                            break
                        
                        case 'slider':
                            state = new Slider();
                            break
                        
                        case 'selector':
                            state = new Selector()
                            break
                        
                        case 'file':
                            state = new UIFile()
                            break
                        
                        case 'image':
                            state = new UIImage()
                            break
                    
                        case 'swatch':
                            state = new Pixels()
                            break

                        case 'button':
                            state = new Button()
                            break
                        
                        default:
                            console.warn('unrecognized state type for UI!', type)
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
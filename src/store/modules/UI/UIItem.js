import State from "../../State";

export default class extends State {

    constructor() {
        
        super();

        this.params = {
            ...this.params,
            
            value       : null,

            label       : '',
            className   : [],
            route       : [],            

        }        

    }

}
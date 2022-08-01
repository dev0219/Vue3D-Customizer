import State from "../../State";

export default class extends State {

    constructor() {
        
        super();
        this.type = 'block'
        
        this.children = []

        this.params = {
            ...this.params,
            label       : '',
            className   : [],
            collapsible : false,

        }
        
    }

}

import State from "../../State";

export default class extends State {

    constructor() {
        
        super();

        this.type = 'yarn'

        this.params = {
            ...this.params,
            options         : [],
            yarnId          : null,
            unique          : false,
            value           : null,
            label           : null,
        }        

    }

}
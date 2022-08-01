import UIItem from "../UIItem";

export default class extends UIItem {

    constructor() {
        
        super();

        this.type = 'text'

        this.params = {
            ...this.params,
            max     : null,
            min     : null
        }
        
    }

}

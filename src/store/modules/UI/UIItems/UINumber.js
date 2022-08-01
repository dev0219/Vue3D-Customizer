import UIItem from "../UIItem";

export default class extends UIItem {

    constructor() {
        
        super();

        this.type = 'number'

        this.params = {
            ...this.params,
            max       : null,
            min       : null,
        }
        
    }

}

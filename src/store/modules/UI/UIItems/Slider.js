import UIItem from "../UIItem";

export default class extends UIItem {

    constructor() {
        
        super();

        this.type = 'slider'

        this.params = {
            ...this.params,
            max       : null,
            min       : null,
        }
        
    }

}

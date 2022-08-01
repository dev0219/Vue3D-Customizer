import UIItem from "../UIItem";

export default class extends UIItem {

    constructor() {
        
        super();

        this.type = 'button'

        this.params = {
            ...this.params,
            options: []
        }
        
    }

}

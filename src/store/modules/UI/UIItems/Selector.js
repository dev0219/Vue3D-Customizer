import UIItem from "../UIItem";

export default class extends UIItem {

    constructor() {
        
        super();

        this.type = 'selector'

        this.params = {
            ...this.params,
            options: []
        }
        
    }

}

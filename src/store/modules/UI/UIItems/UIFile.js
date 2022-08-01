import UIItem from "../UIItem";

export default class extends UIItem {

    constructor() {
        
        super();

        this.type = 'file'

        this.params = {
            ...this.params,
        }
        
    }

}

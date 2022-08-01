import UIItem from "../UIItem";

export default class extends UIItem {

    constructor() {
        
        super();

        this.type = 'image'

        this.params = {
            ...this.params,
            width : null,
            height: null,
        }
        
    }

}

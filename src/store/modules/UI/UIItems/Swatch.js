import UIItem from "../UIItem";

export default class extends UIItem {

    constructor() {
        
        super();

        this.type = 'swatch'

        this.params = {
            ...this.params,
        }
        
    }

}

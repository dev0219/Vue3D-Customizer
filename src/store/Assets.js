// this class is very much to do, will have to migrate AssetManager.js
// to here so that it's all in vuex

export default class {

    constructor() {

        this.state = {

            all         : {},

        }

        this.getters = {

            getAssets: (state) => (name) => {

                return state.all[name]
                
            },

            getAll: (state) => () => {

                return state.all
                
            }

        }

        this.actions = {
            
        }

        this.mutations = {

            registerAssets: (state, allAssets) => {
                
                for(const key in allAssets) {
                    state.all[key] = allAssets[key]
                }

            }              

        }

    }

    // how to get modules
    getModule() {

        return {
            
            namespaced  : true,
            state       : this.state,
            getters     : this.getters,
            actions     : this.actions,
            mutations   : this.mutations,
            modules     : this.modules,
        
        };

    }

}
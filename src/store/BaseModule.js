/*

This is the base class for all other state modules, except for Assets.

*/

import { isDefined } from "../helpers/helpers";

export default class {

    constructor() {

        this.state = {

            all         : [],
            activeId    : '',   

        }

        this.getters = {

            getAll      : state => () => {  return state.all; },

            getStateById: (state) => (id) => {

                var target = []
                var cascade = function(array) {

                    array.forEach(function(e) {

                        if (e.hasOwnProperty('children')) {
                            
                            cascade(e.children)
    
                        }
    
                        if (e.id == id) target = target.concat(e)
    
                    });

                }

                cascade(state.all)

                return target[0]
                
            },

            getAllIds   : (state) => () => {

                var all = []

                var cascade = function(array) {
                    array.forEach(function(e) {
                        if (e.hasOwnProperty('children')) {
                            cascade(e.children)
                        }
                        all.push(e.id)
                    });
                }
                cascade(state.all)

                return all

            },

            getActiveState  : (state, getters) => () => {

                let activeState = getters['getStateById'](state.activeId)
                return activeState
                
            },

            getActiveId: (state) => () => {
                return state.activeId
            }

        }

        this.actions = {

            handleStateCreation: async (context, payload) => {

                // individual methods for State Creation exists
                // in the different module (Yarns, Canvas, etc)
                return new Promise((resolve, reject) => {

                    var { state, type, params, children, parentId } = payload 
                    
                    context.dispatch('generateId', type)
                    .then((id) => {

                        state.id = id;
                        // var newState = state;
                        // var stateGetter = context.getters.getStateById

                        // context.commit('addState', {newState, parentId, stateGetter})
                        // console.log('just added', id)
                        context.dispatch('initState', { state , params, parentId }).then(async ()=>{

                            var { state, type, params, children, parentId } = payload 
                            let _children = children

                            if (isDefined(_children)) {

                                for (var i = 0; i < _children.length; i++) {

                                    let element = _children[i]
    
                                    var type    = element.type
                                    var params  = element.params
                                    var children = isDefined(element.children) ? element.children : [];                            
                                    var parentId = id

                                    await context.dispatch('createState', {type, params, children, parentId})
    
                                }
    
                            }

                            resolve()

                        })

                    })

                })

            },

            inject: async (context, payload) => {

                return new Promise((resolve, reject)=> {                

                    var { id , params, reprocessCanvas } = payload
                    if (reprocessCanvas == undefined) reprocessCanvas = true
                    var target   = context.getters.getStateById(id)
                    target.injectParameters(params)
                    .then((newParams) => {
                        context.commit('injectParams', {target, newParams, reprocessCanvas})
                    })
                    .then(()=> {
                        if (reprocessCanvas==true) {
                            context.dispatch('utils/reprocess', {}, {root:true})
                        }
                        resolve()  
                    })

                })

            },

            initState: async (context, payload) => {

                return new Promise((resolve, reject)=> {                
                    var {state, params, parentId} = payload

                    state.injectParameters(params).then((newParams) => {
                        
                        for (const key in newParams) {
                            state.params[key] = newParams[key]
                        }

                        var newState = state;
                        var stateGetter = context.getters.getStateById

                        context.commit('addState', {newState, parentId, stateGetter})
                        resolve()
                        
                    })
                })

            },

            deleteState: (context, id) => {
                var stateGetter = context.getters.getStateById
                context.commit('deleteState', {id, stateGetter})
            },

            generateId: ({context, state}, type) => {

                // generate a new ID for a state based on its type
                return new Promise((resolve, reject) => {

                    var startingId = type;
    
                    var verify = function(array, currentId) {
                            
                        array.forEach(element => {
                            
                            if (element.id == currentId) {
        
                                var digits = element.id.match(/\d+/);
            
                                if (digits) {
                
                                    var digit = digits[digits.length - 1]
                                    var newDigit = Number(digit) + 1
                                    var pos = currentId.lastIndexOf(digit);
                                    currentId = currentId.substring(0,pos) + String(newDigit)
                
                                } else {
                
                                    currentId = element.id + '_2'
                                }
                
                            }
                            
                            if (element.type == 'group' ||
                            element.type == 'block') {
                                
                                currentId = verify(element.children, currentId)
        
                            }    
            
                        });

                        return currentId
                    }

                    
                    var newId = verify(state.all, startingId)
                    resolve( newId ) 

                })
    
            },
    

        }

        this.mutations = {

            addState : (state, payload) => {

                var {newState, parentId, stateGetter} = payload

                if (isDefined(parentId)) {

                    var stateTarget = stateGetter(parentId)
                    stateTarget.children.push( newState )

                } else {

                    state.all.push( newState )

                }

            },

            deleteState: (state, id) => {

                var searchAndDelete = function(array) {
                    var index = array.findIndex(el => el.id == id)
                    if (index == 0) {
                        array.shift()
                    }
                    else if (index) {
                        array.splice(index, 1)
                    }
                    array.forEach(function(e) {
                        if (e.hasOwnProperty('children')) {
                            cascade(e.children)
                        }                        
                    });
                }
                searchAndDelete(state.all)

            },

            injectParams : (state, payload) => {

                let {target, newParams, reprocessCanvas} = payload
                for (const key in newParams) {
                    target.params[key] = newParams[key]
                }
            },

            updateAllStates : (state, newStates) => {

                state.all = newStates

            },

            setActiveId: (state, id) => {

                state.activeId = id


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
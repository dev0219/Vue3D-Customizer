<template>
    
    <div class="layer-container editor-component">
        <h3>Layers</h3>

    <!-- Add UI button -->
        <div class="header-utility">

            <button
                @click="showAddCanvas = true"
                class="ui-utility-button add-canvas">
                <font-awesome-icon :icon="['fas', 'plus']" />
            </button>
            <transition name="modal">
                <AddCanvasItem v-if="showAddCanvas"
                    @close  ="showAddCanvas = false">
                </AddCanvasItem>
            </transition>

            <button
                @click="duplicateLayer"
                class="ui-utility-button duplicate-layer">
                <font-awesome-icon :icon="['fas', 'copy']" />
            </button>

        </div>
        <div v-if    ="allItems.length > 0">
        <draggable 
            
            v-model ="allItems" 
            group   ="layers" 
            @start  ="drag=true" 
            @end    ="drag=false" 
            item-key="id">

            <template #item="{element}">
                <div class="layer-item"             
                    @click  ="setActiveId(element.id)"
                    v-bind:class="{ active: currentActiveId == element.id }"
                >
                    <div class="type">

                        <div v-if="element.type == 'rect'">         
                            <font-awesome-icon :icon="['fas', 'square']" />
                        </div>
                        <div v-else-if="element.type == 'circle'"> 
                            <font-awesome-icon :icon="['fas', 'circle']" />
                        </div>
                        <div v-else-if="element.type == 'text'">    
                            <font-awesome-icon :icon="['fas', 'font']" />
                        </div>
                        <div v-else-if="element.type == 'image'">   
                            <font-awesome-icon :icon="['fas', 'image']" />
                        </div>

                    </div>

                    <div> {{element.id}} </div>


                    <div class="details">

                        <div  v-if="element.params.locked == true" 
                            class="ui-utility lock">
                            <font-awesome-icon :icon="['fas', 'lock']" />
                        </div>

                        <button v-if="element.params.locked == false" class="ui-utility ui-utility-button delete-layer"
                            @click="deleteItem(element.id)"
                        >
                            <font-awesome-icon :icon="['fas', 'times']" />
                            
                        </button>

                    </div>                    

                </div>
            </template>

        </draggable>
        </div>

    </div>

</template>

<script>

    // This component displays all the active items and layers in
    // konva, and allows for reconfiguration of layers and such.

    import draggable from 'vuedraggable'
    import AddCanvasItem from '../Customizer/AddCanvasItem.vue'

    import { library } from '@fortawesome/fontawesome-svg-core'
    import { faTimes, faSquare, faCircle, faImage, faFont, faPlus, faCopy, faLock, faUserLock} from '@fortawesome/free-solid-svg-icons'

    library.add(faTimes)
    library.add(faSquare)
    library.add(faCircle)
    library.add(faImage)
    library.add(faFont)
    library.add(faPlus)
    library.add(faCopy)
    library.add(faLock)

	export default {

        name: 'LayerDetail',
        components: { draggable, AddCanvasItem },

        data() {
            return {
                drag            : false,
                showAddCanvas   : false,
            }
        },

        computed: {

            allItems: {

                get() {

                    return this.$store.getters['canvas/getAll']().slice().reverse()

                },

                set(newStates) {

                    var reorderedStates = newStates.slice().reverse()
                    this.$store.commit('canvas/updateAllStates', reorderedStates)
				    this.$store.dispatch('utils/reprocess')
                    
                }


            },

            currentActiveId() {
                
                return this.$store.getters['canvas/getActiveId']()

            }

        },

        methods: {

            setActiveId(id) {
                console.log('changing active ID to', id)
                this.$store.commit('canvas/setActiveId', id)
            },

            deleteItem(id) {
                this.$store.commit('canvas/deleteState', id)
				this.$store.dispatch('utils/reprocess')
            },

            duplicateLayer(id) {

            }

        }

    }

</script>

<style>

    .layer-item {
        padding     : 5px;
        margin      : 2px;
        background  : #ffffff40;
        position    : relative;
        display     : flex;
    }

    .layer-item .type {
        opacity     : 1;
        margin-right: 10px;
        bottom      : 0;
        right       : 0;
        width       : 25px;
        text-align  : center;
    }

    .layer-item.active {
        border: 1px solid red;
    }

    .layer-item .details {

        position: absolute;
        height: 100%;
        right: 0;
        top: 0;
        display:flex;

    }

    .layer-item .details > * {
        border: none;
        height: 100%;
    }

    .layer-item .lock > * {
        transform: translateY(24%);
        opacity: 0.25;
        fill: black;
        padding: 0px 5px;
    }

    .layer-item .details .delete-layer {
        background: none;
        filter: grayscale(1)
    }

</style>
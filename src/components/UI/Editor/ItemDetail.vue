<template>
    <transition name="fade">

        <div class="item-detail-container editor-component"
        v-if="activeState">

            <div class="title-header">
                <h3>{{getTypeName(activeState.type)}}</h3>
                <input class="detail"
                        v-model="idValue"
                        >
            </div>
            
            <UIComponent
                v-bind:key  ="component.id"
                :config     ="component"
                v-for       ="component in currentComponents"
            ></UIComponent>

        </div>
        
    </transition>

</template>

<script>

    // This component generates all the necessary UI for an active 
    // canvas state, and it takes in parameters as defined in
    // item.schema.js

    import UIComponent from '../UIComponent.vue'
    import { itemSchema } from '../../../schema/item.schema'
    import { isDefined } from '../../../helpers/helpers'
    import { reactive } from '@vue/reactivity'

    const schema = itemSchema;

    export default {

        components: { UIComponent },

        name: 'ItemDetail',

        methods: {
            getTypeName(type) {
                return schema[type].name
            },
        },

        computed: {

            activeState() {

                var active = this.$store.getters['canvas/getActiveState']()
                if (isDefined(active)) {
                    this.idValue = active.id
                    return active
                }

            },

            currentComponents() {

                var active      = this.$store.getters['canvas/getActiveState']()

                if (isDefined(active)) {

                    let type    = active.type
                    let id      = active.id
                    var path    = ['canvas', id]
                    var uiParam = [...schema[type].ui]

                    // this is to inject routing
                    function cascadeAndInject(param) {

                        var newParam = reactive(param)
                        newParam.forEach(element => {

                            if (isDefined(element.params.route)) {
                                if (element.params.route.length > 0) {
                                    element.params.route[0]['path'] = reactive(path)
                                }
                            }

                            if (element.type == 'block') {
                                element.children = reactive(cascadeAndInject(element.children))
                            }

                        });

                        return newParam

                    }

                    uiParam = cascadeAndInject(uiParam)
                    console.log(uiParam)
                    return uiParam

                } else {

                    return undefined

                }

            }

        }

    }

</script>

<style>
.detail-container {
}
</style>
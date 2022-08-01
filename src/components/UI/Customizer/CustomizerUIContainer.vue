
<template>
	<div id="variant-customizer-ui-container">

        <UIComponent
            v-bind:key="component.id"
            :config="component"
            v-for="component in components"
        ></UIComponent>

        <!-- TODO: turn off if not on ADMIN EDIT mode -->
        <div style="display: inline-grid; width: 100%;">

            <button
                @click="showAddCanvas = true"
                class="ui-utility-button">
                Add new Canvas Item
            </button>

            <button
                @click="showAddUI = true"
                class="ui-utility-button">
                Add new UI
            </button>

            <transition name="modal">
                <AddUIModal v-if="showAddUI"
                    @close  ="showAddUI = false">
                </AddUIModal>
            </transition>

            <transition name="modal">
                <AddCanvasItem v-if="showAddCanvas"
                    @close  ="showAddCanvas = false">
                </AddCanvasItem>
            </transition>

        </div>


	</div>
</template>

<script>
    import UIComponent from '../UIComponent.vue'
    import AddUIModal from './AddUIModal.vue'
    import AddCanvasItem from './AddCanvasItem.vue'

	export default {
    components: { UIComponent, AddUIModal, AddCanvasItem },

		name: 'CustomizerUIContainer',

        data() {

            return {
                components: [],
                showAddUI : false,
                showAddCanvas: false,
            }

        },

		mounted () {

            var allStates = this.$store.getters['ui/getAll']()
            this.components = allStates

		},

        methods: {
            addUIComponent(payload) {

                // console.log(payload)

            }
        }

}

</script>

<style>
</style>
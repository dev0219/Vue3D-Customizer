<template>

    <div class="yarns-container editor-component">

        <h3>Mode</h3>

        <button v-on:click="setModeStatic">Static</button>
        <button v-on:click="setModeSimulated">Simulated</button>

    </div>

</template>

<script>

    import { EVENTS } from '../../../Events'
    import { SWITCH_SIMULATION_MODE } from '../../../helpers/constants'
    import { CONFIG } from '../../../modules/Managers/ConfigManager'

    import ButtonSelector from '../UIItems/ButtonSelector.vue'

    export default {

        name: 'SimulationTrigger',
        components: { ButtonSelector },

        data() {
            return {

            }
        },

        methods: {

            setModeStatic() {
                EVENTS.emit(SWITCH_SIMULATION_MODE, "static")
                console.log("static mode")
            },

            setModeSimulated() {
                EVENTS.emit(SWITCH_SIMULATION_MODE, "simulated")
                console.log("simulated mode")
            }
        }

    }

</script>

<style>

</style>
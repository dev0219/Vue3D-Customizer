<template>
    <div class="yarns-container editor-component">
        <h3>Yarns</h3>
        
    <!-- Add UI button -->
            <button-selector
                v-bind:key="yarn.id"
                v-for="yarn in allYarns"
                :config="yarn">
            </button-selector>

    </div>

</template>

<script>
import { isDefined } from '../../../helpers/helpers'

    import ButtonSelector from '../UIItems/ButtonSelector.vue'
    
    export default {

        name: 'YarnSelector',
        components: { ButtonSelector },

        data() {
            return {

            }
        },

        computed: {

            allYarns() {

                var all = this.$store.getters['yarns/getAll']()
                if (all) {
                    all.forEach(yarn => {
                        // injecting routing
                        yarn.params.route = [
                            {
                                path    : ['yarns', yarn.id],
                                key     : ['value']
                            }
                        ]
                    });
                    return all
                }

            },

        },

        methods: {

        }

    }

</script>

<style>

</style>
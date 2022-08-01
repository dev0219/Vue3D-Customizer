<!-- template for the modal component -->
<template>
    
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
              <h3>Add New UI </h3>
          </div>

      <!-- ID selector -->
          <div class="modal-body">
            Target ID
            <select ref="selectEl"
                    v-model="selectedId"
                    @change="selectedParam = null; selectedSecondary = null">
              <option 
                v-bind:key="id"
                v-for="id in allIds"
                :value="id"
              >
                {{id}}
              </option>
            </select>
          </div>

      <!-- Param Key Selector -->
          <div class="modal-body"
          v-if="getParamsOfSelected"
            >
            Target Param Key
            <select ref="selectEl"
                    v-model="selectedParam"
                    @change="selectedSecondary = null">
              <option 
                v-bind:key="key"
                v-for="(value, key) in getParamsOfSelected"
                :value="key"
              >
                {{key}}
              </option>
            </select>
          </div>

      <!-- Secondary Key Selector -->
          <div class="modal-body"
          v-if="( selectedParam == 'image' ||
                selectedParam == 'fillPatternImage' ) &&
                selectedParam != undefined"
            >
            Secondary Key
            <select ref="selectEl" v-model="selectedSecondary">
              <option 
                v-bind:key="key2"
                v-for="(value, key2) in getInnerParams"
                :value="key2"
              >
                {{key2}}
              </option>
            </select>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="modal-default-button" @click="$emit('close')">
                Close
              </button>

              <button class="modal-default-button" @click="addUiComponent">
                Add
              </button>

            </slot>
          </div>
        </div>
      </div>
    </div>

</template>

<script>
import { isDefined } from '../../../helpers/helpers'

	export default {

		components: { },
		name: 'AddUIModal',

		mounted () {

		},

    data() {
      return {
        selectedId      : '',
        selectedParam   : ''
      }
    },

		computed: {

      allIds() {
        return this.$store.getters['canvas/getAllIds']()
      },

      getParamsOfSelected() {

        var id = this.$data.selectedId
        var state = this.$store.getters['canvas/getStateById'](id) 
        
        if (isDefined(state))
          return state.params
        
      },

      getInnerParams() {

        var id = this.$data.selectedId
        var state = this.$store.getters['canvas/getStateById'](id)    

        if (isDefined(state))
          return state.params[this.$data.selectedParam]

      },

      allUITypes() {
        return [
          'block',
          'text',
          'number',
          'slider',
          'selector',
          'file',
          'image'
        ]

      },

      addUiComponent() {

        var path = ['canvas', this.selectedId]
        var key = [this.selectedParam]

        if (this.selectedSecondary != null ||
            this.selectedSecondary != undefined) {

              key.push(this.selectedSecondary)

            }

        var route = []

        route.push({
          path: path,
          key : key
        })
        
      }

		}

	}

</script>

<style scoped>


</style>

<!-- template for the modal component -->
<template>
    
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
              <h3>Add New Canvas Item </h3>
          </div>

      <!-- type selector -->
          <div class="modal-body">
            Item Type
            <select ref="selectEl"
                    v-model="selectedType">
              <option 
                v-bind:key="key"
                v-for="value, key in allTypes"
                :value="key"
              >
                {{key}}
              </option>
            </select>
          </div>

          <button class="modal-close-button" @click="$emit('close')">
            X
          </button>

          <button class="modal-default-button" @click="addCanvasComponent">
            Add
          </button>
        </div>
      </div>
    </div>

</template>

<script>
import { CONFIG } from '../../../modules/Managers/ConfigManager';

  // @will TODO: revamp this class so it looks nicer, maybe using
  // the components from fontAwesome too as seen in Layer
  
  import { itemSchema } from '../../../schema/item.schema'
  
  var structures = CONFIG.getStructuresConfig()

  export default {

		components: { },
		name: 'AddCanvasModal',

		mounted () {

		},

    data() {
      return {
        type      : '',
        allTypes  : itemSchema,
      }
    },

    methods: {

      addCanvasComponent() {

        var type = this.selectedType;
        // TODO: have a class that handles all the default params for different item types dynamically
        var params = {
          fill: structures[0].id
        }
        var children = []
        var parentId = null

        this.$store.dispatch('canvas/createState' , 
          {type, params, children, parentId}
        )

      }
    }

	}

</script>

<style scoped>


</style>

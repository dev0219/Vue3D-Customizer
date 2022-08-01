<template>

	<v-rect
		:config="translateParameters"
		v-if="config.type == 'rect'"
		@click="setActiveId">
	</v-rect>

	<v-text
		:config="translateParameters"
		v-else-if="config.type == 'text'"
		@click="setActiveId">
	</v-text>

	<v-image
		:config="translateParameters"
		v-else-if="config.type == 'image'"
		@click="setActiveId">
	</v-image>

	<v-circle
		:config="translateParameters"
		v-else-if="config.type == 'circle'"
		@click="setActiveId">
	</v-circle>

	<v-group
		:config="translateParameters"
		v-else-if="config.type == 'group'"
		@click="setActiveId">
	</v-group>

	
</template>

<script>

// This renders the specified item on the Konva Canvas, based the key type
// passed in config.

	import { convertStructureToHex, isDefined } from '../../helpers/helpers'

	export default {

		name: 'CanvasComponent',
		props: ['config'],

		data() {

			return {
				params 	: this.config.params,
			}

		},

		mounted() {
			this.$store.dispatch('utils/reprocess')
		},

		methods: {

			setActiveId() {
				this.$store.commit('canvas/setActiveId', this.config.id)
			},

		},

		computed: {

			translateParameters() {
                let konvaParams = {
					name: this.config.id,
				}
				let params = this.params

                for (const key in params) {

                    switch(key) {

                        case 'fillPatternImage':
                        case 'image':

                            if (isDefined(params[key].processedImage)) {
                                konvaParams[key] = params[key].processedImage
                            } else {
								delete konvaParams[key]
							}
                            break

						case 'fill':
						case 'stroke':
							
							konvaParams[key] = convertStructureToHex(params[key])
							break

						// case 'locked':
						// 	konvaParams[key] = params[key]

                        default:
                            konvaParams[key] = params[key]
                            break

                    }

                }
				
                return konvaParams

            }

		}

	}

</script>

<style>
</style>
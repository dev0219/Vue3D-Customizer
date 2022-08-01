<template>

    <button class="ui-bar-button bmp-export"
            @click="exportBMP">
        Export BMP
    </button>

</template>

<script>

	export default {

		components: { 
		},
		name: 'BMPExportButton',
		methods: {

            exportBMP() {
                
            }

		}

	}

</script>

<style>
    .ui-bar-button.bmp-export {
        position: fixed;
        bottom: 25px;
        right: 25px;
    }
</style>
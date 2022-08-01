
export class StructurePreview {

    constructor() {

        this.previews = {}
        this.colors = [
            [255, 0, 0], // color 1
            [0, 255, 0], // color 2
            [0, 0, 255]  // color 3
        ]

    }

    async updatePreview(allYarnColors, allStructures, allAssets) {

        allStructures.filter(v => v.id != 'none').forEach(structure => {
            
            let img = allAssets[structure.id]
    
            var canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            var context = canvas.getContext('2d')
            context.drawImage(img, 0,0, img.width, img.height)
            var imageData = context.getImageData(0, 0, img.width, img.height)
    
            for (var i=0; i<imageData.data.length; i+=4)
            {
                for (const yc in allYarnColors) {
                    var y = allYarnColors[yc]
                    var c = this.colors[yc]
    
                    if(imageData.data[i]==c[0] &&
                        imageData.data[i+1]==c[1] &&
                        imageData.data[i+2]==c[2]
                    ){
                        // change to your new rgb
                        imageData.data[i]=y[0]
                        imageData.data[i+1]=y[1]
                        imageData.data[i+2]=y[2]
                    }
    
                }
    
            }
            // put the altered data back on the canvas  
            context.putImageData(imageData,0,0);
            this.previews[structure.id] = canvas.toDataURL()

        });

        return new Promise((resolve, reject)=> {resolve()})

    }

}
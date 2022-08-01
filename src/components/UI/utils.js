import { isDefined } from '../../helpers/helpers'

export function getStateValue() {

    let route       = this.config.params.route[0]
    let category 	= route.path[0]
    let id 			= route.path[1]
    let stateGetter = this.$store.getters[`${category}/getStateById`]
    
    var key			= route.key
    var value;

    if (Array.isArray(key)) {
        if (key.length > 1) {
            value = stateGetter(id).params[key[0]][key[1]]        
        } else {
            value = stateGetter(id).params[key[0]]
        }
    } else {
        value = stateGetter(id).params[key]
    }

    return value

}

export function onChange(event) {
    let route = this.config.params.route

    route.forEach(r => {

        var category    = r.path[0]
        var id          = r.path[1]
        var key         = r.key
        var value       = event.target.value

        if (event.target.files) {

            var filePic = event.target.files[0]; //Selected file content--image

            if (!filePic.type.match('image.*')) { //Determine whether the file format meets the requirements
                alert("File is not an image! Please select an image");
                return
            }
            
            let scope = this

            var reader = new FileReader();
            reader.readAsDataURL(filePic);
            reader.onload = function (e) {

                var reprocessCanvas = true

                var image = new Image();
                image.onload = function () {

                    var params = {}

                    if (r.key.length > 1) {

                        // if (key[1] == 'palette') reprocessCanvas =  false
                        
                        params[key[0]] = {}
                        params[key[0]][key[1]] = image
            
                    } else {
            
                        params[key[0]] = image
            
                    }
                                
                    scope.$store.dispatch(category + '/inject', {id, params, reprocessCanvas})

                }

                image.src = e.target.result;
            };


        } else {

            var params = {}

            if (r.key.length > 1) {
                
                params[key[0]] = {}
                params[key[0]][key[1]] = value
                
            } else {
    
                params[key[0]] = value
    
            }
                        
            this.$store.dispatch(category + '/inject', {id, params})

        }

    });
}

export function checkDependency(event) {
    
    var dependency  = this.config.params.dependency
    var route       = this.config.params.route

    if (isDefined(dependency) && isDefined(route)) {

        let category 	= route[0].path[0]
        let id 			= route[0].path[1]
        let stateGetter = this.$store.getters[`${category}/getStateById`]

        for (const key in dependency) {
    
            if (dependency[key] != stateGetter(id).params[key]) return false

        }

        return true

    } else {

        return true

    }

}


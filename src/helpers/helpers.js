import { CONFIG } from "../modules/Managers/ConfigManager";

export function isPathAbsolute(path) {
    var RgExp = new RegExp('^(?:[a-z]+:)?//', 'i');
    return RgExp.test(path)
    return /^(?:\/|[a-z]+:\/\/)/.test(path);
}

export function convertStructureToHex(structure) {
    if (structure === 'none') {
        return '#00000000'
    }
    let structures = CONFIG.getStructuresConfig()
    var targetStructure = structures.filter(obj => obj.id == structure)[0]
    return hexify(targetStructure.value) 

}

export async function checkIfFileExists(path) {

    return new Promise((resolve, reject) => {

        var http = new XMLHttpRequest();

        if (path.length === 0) {
            console.warn("Please enter File URL");
            reject()
        } else {
            http.open('HEAD', path, false);
            http.send();
            if (http.status === 200) {
                resolve(true)
            } else {
                reject(false)
            }
        }
    })

}

export function isLocalhost(){
    return window.location.hostname == "localhost" || window.location.hostname === "127.0.0.1";
}

export function getFileType(filename){
    return filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
}

export function getFileName(filePath) {
    var filename = filePath.replace(/^.*[\\\/]/, '')
    return filename.replace(/\.[^/.]+$/, "")
}

export function isDefined(variable) {
    return !(typeof variable === 'undefined' || variable === null) 
}

export function endsWithNumber( str ){
    return isNaN(str.slice(-1)) ? 'does NOT end with a number' : 'ends with a number';
  }

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

export function rgbaToHex(r, g, b, a) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b) + componentToHex(a);
}

export function hexToRgbA(hex){
    
    var _hex = hex
    if (_hex.charAt(0) != '#') {
        _hex = '#' + _hex
    }

    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(_hex)){
        c= _hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return [(c>>16)&255, (c>>8)&255, c&255];
    }
    throw new Error('Bad Hex');
    
}

export function hexify(str) {
    var hex;
    if (str.charAt(0) !== '#') {
        hex = '#' + str
    } else {
        hex = str
    }

    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        return hex;
    }
    return undefined

}

export function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
  }


export function encodeToBase64 (input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    while (i < input.length) {
        chr1 = input[i++];
        chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index 
        chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                  keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    return output;
}


export function dataURLToBlob(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = parts[1];

        return new Blob([raw], {type: contentType});
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
}

export function isObject(val) {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
}


export function getObjectDifference (obj1, obj2) {

    // Make sure an object to compare is provided
    if (!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') {
        return obj1;
    }

    //
    // Variables
    //

    var diffs = {};
    var key;


    //
    // Methods
    //

    /**
     * Check if two arrays are equal
     * @param  {Array}   arr1 The first array
     * @param  {Array}   arr2 The second array
     * @return {Boolean}      If true, both arrays are equal
     */
    var arraysMatch = function (arr1, arr2) {

        // Check if the arrays are the same length
        if (arr1.length !== arr2.length) return false;

        // Check if all items exist and are in the same order
        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }

        // Otherwise, return true
        return true;

    };

    /**
     * Compare two items and push non-matches to object
     * @param  {*}      item1 The first item
     * @param  {*}      item2 The second item
     * @param  {String} key   The key in our object
     */

    var scope = this

    var compare = function (item1, item2, key) {

        // Get the object type
        var type1 = Object.prototype.toString.call(item1);
        var type2 = Object.prototype.toString.call(item2);

        // If type2 is undefined it has been removed
        if (type2 === '[object Undefined]') {
            diffs[key] = null;
            return;
        }

        // If items are different types
        if (type1 !== type2) {
            diffs[key] = item2;
            return;
        }

        // If an object, compare recursively
        if (type1 === '[object Object]') {
            var objDiff = scope.getStateDifference(item1, item2);
            if (Object.keys(objDiff).length > 0) {
                diffs[key] = objDiff;
            }
            return;
        }

        // If an array, compare
        if (type1 === '[object Array]') {
            if (!arraysMatch(item1, item2)) {
                diffs[key] = item2;
            }
            return;
        }

        // Else if it's a function, convert to a string and compare
        // Otherwise, just compare
        if (type1 === '[object Function]') {
            if (item1.toString() !== item2.toString()) {
                diffs[key] = item2;
            }
        } else {
            if (item1 !== item2 ) {
                diffs[key] = item2;
            }
        }

    };


    //
    // Compare our objects
    //

    // Loop through the first object
    for (key in obj1) {
        if (obj1.hasOwnProperty(key)) {
            compare(obj1[key], obj2[key], key);
        }
    }

    // Loop through the second object and find missing items
    for (key in obj2) {
        if (obj2.hasOwnProperty(key)) {
            if (!obj1[key] && obj1[key] !== obj2[key] ) {
                diffs[key] = obj2[key];
            }
        }
    }

    // Return the object of differences
    return diffs;

};



export function mapColorToPalette(red, green, blue, alpha, palette) {
    var color, diffR, diffG, diffB, diffA, diffDistance, mappedColor;
    var index = 0
    var distance = Infinity;
    for (var i = 0; i < palette.length; i++) {
        color = palette[i];

        diffR = (color.r - red);
        diffG = (color.g - green);
        diffB = (color.b - blue);
        diffA = (color.a - alpha);

        diffDistance = diffR * diffR + diffG * diffG + diffB * diffB + diffA * diffA;
        if (diffDistance < distance) {
            distance = diffDistance;
            mappedColor = palette[i];
            index = i
        };
    }
    
    return [mappedColor, index];
}
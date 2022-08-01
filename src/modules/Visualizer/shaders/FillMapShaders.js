 export const fillMapVert = `

    /* glsl */

    attribute vec2 position;
    varying vec2 texCoords;

    void main() {

        texCoords = (position + 1.0) / 2.0;
        texCoords.y = 1.0 - texCoords.y;
        gl_Position = vec4(position, 0, 1.0);
        
    }

`

export const fillMapFrag = `

    /* glsl */

    precision highp float;
    varying vec2 texCoords;
    uniform sampler2D textureSampler;

    bool isMatching( vec3 c1, vec3 c2 ) {
        return (abs(c1.x - c2.x) < 0.01 && abs(c1.y - c2.y) < 0.01 && abs(c1.z - c2.z) < 0.01);
    }

    void main() {

        vec3 lc2 = vec3(122.0/255.0, 123.0/255.0, 133.0/255.0);
        vec3 lcBirdseye = vec3(179.0/255.0, 204.0/255.0, 199.0/255.0);
        vec4 color = texture2D(textureSampler, texCoords);
        // vec2 p = vec2(floor(gl_FragCoord.x), floor(gl_FragCoord.y));

        vec2 fillUv = gl_FragCoord.xy;
        vec2 value = vec2(mod(fillUv.y, 2.0));

        // TODO : the birdseye strip needs fixing, i adjusted
        // this temporarily for the investor presentation
        // but I think the forced mediump of float on iOS
        // break the precision of modulo

        if (isMatching(vec3(color.r, color.g, color.b), lc2 )) {
            color.rgb = vec3(0.0, 0.0, 0.0);
        } else if (isMatching(vec3(color.r, color.g, color.b), lcBirdseye )) {
            
            // temporary fix, will have to think of something better later on
            color.rgb = vec3(floor(value.x));
        } else {
            color.rgb = vec3(1.0, 1.0, 1.0);
        }

        gl_FragColor = color;
        
    }

`
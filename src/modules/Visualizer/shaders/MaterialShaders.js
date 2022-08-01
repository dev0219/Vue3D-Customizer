
/* ----------------------------------------------------------------------------------------------------------------------
 * calcDiffuse - replaces the ThreeJS MeshStandardMaterial Diffuse
 * This snippet is responsible for defining the bezier-curve drawing structures, fillmap processing, and for defining 
 * functions, and variables necessary for the canvas drawing steps in the `calcDiffuseColor` snippet 
*/
export const calcDiffuse = (color_1, color_2) => `

    /* glsl */

    #define PI_BEZIER 3.14159265358979323846
    #define EPSILON_BEZ 0.000000001
    #define MAX 9999999.
  
    uniform vec3 diffuse;
    uniform sampler2D fillMap;
    varying vec2 vUv;
    varying vec4 v_position;
    varying vec3 v_normal;
    varying float distToCamera;
    varying float faceDirectionFront;

    // keep this a constant
    float txs;
    const vec4 fillMap_color1 = vec4(1.0, 1.0, 1.0, 1.0);
    const vec4 fillMap_color2 = vec4(0.0, 0.0, 0.0, 1.0);
    const vec4 fillMap_color3 = vec4(1.0, 0.0, 0.0, 1.0);

    const vec2 u_resolution = vec2(2048.0, 2048.0);

    // these are the 2 colors as passed from visualizer
    const vec3 color_1 = vec3(${color_1.r}, ${color_1.g}, ${color_1.b});
    const vec3 color_2 = vec3(${color_2.r}, ${color_2.g}, ${color_2.b});

    // Helper functions for parallel solving of bezier curve functions
    float slopeFromT (float t, float A, float B, float C)
    {
        float dtdx = 1.0/(3.0*A*t*t + 2.0*B*t + C); 
        return dtdx;
    }

    float xFromT (float t, float A, float B, float C, float D)
    {
        float x = A*(t*t*t) + B*(t*t) + C*t + D;
        return x;
    }

    float yFromT (float t, float E, float F, float G, float H)
    {
        float y = E*(t*t*t) + F*(t*t) + G*t + H;
        return y;
    }

    float B0 (float t)
    {
        return (1.0-t)*(1.0-t)*(1.0-t);
    }

    float B1 (float t)
    {
        return  3.0*t*(1.0-t)*(1.0-t);
    }

    float B2 (float t)
    {
        return 3.0*t*t* (1.0-t);
    }

    float B3 (float t)
    {
        return t*t*t;
    }

    float  findx (float t, float x0, float x1, float x2, float x3)
    {
        return x0*B0(t) + x1*B1(t) + x2*B2(t) + x3*B3(t);
    }

    float  findy (float t, float y0, float y1, float y2, float y3)
    {
        return y0*B0(t) + y1*B1(t) + y2*B2(t) + y3*B3(t);
    }

    float det(vec2 a, vec2 b) 
    { 
        return a.x*b.y-b.x*a.y;
    }

    // Find roots using Cardano's method. http://en.wikipedia.org/wiki/Cubic_function#Cardano.27s_method
    int findRoots(float a, float b, float c, float d, out float r[3])
    {
        vec3 vS = vec3(-1.0,-1.0,-1.0);
        if (abs(a) > EPSILON_BEZ)
        {
            float z = 1.0/a;
            float d3 = 1.0/3.0;
            float d27 = 1.0/27.0;
            a = b*z;
            b = c*z;
            c = d*z;
            float p = b-a*a*d3;
            float q = a*(2.0*a*a-9.0*b)*d27+c;
            float ppp = p*p*p;
            float D = q*q+4.0*ppp*d27;
            float delta = -a*d3;
            if (D > EPSILON_BEZ)
            {
                z = sqrt(D);
                float u = (-q+z)*0.5;
                float v = (-q-z)*0.5;
                u = sign(u)*pow(abs(u),d3);
                v = sign(v)*pow(abs(v),d3);
                r[0] = u+v+delta;
                return 1;
            }
            else if (D < -EPSILON_BEZ)
            {
                float u = sqrt(-p*d3)*2.0;
                float s = -sqrt(-27.0/ppp)*q*0.5;
                if (abs(s) > 0.) {}
                float v = acos(s)*d3;
                r[0] = u*cos(v)+delta;
                r[1] = u*cos(v+2.0*PI_BEZIER*d3)+delta;
                r[2] = u*cos(v+4.0*PI_BEZIER*d3)+delta;
                return 3;
            }       
            else
            {
                q = sign(q)*pow(abs(q)*0.5,d3);
                r[0] = 2.0*-q+delta;
                r[1] = q+delta;
                return 2;
            }
        }
        else
        {
            if (abs(b) <= EPSILON_BEZ && abs(c) > EPSILON_BEZ)
            {
                r[0] = -d/c;
                return 1;
            }
            else
            {
                float D = c*c-4.0*b*d;
                float z = 1.0/(2.0*b);
                if (D > EPSILON_BEZ)
                {
                    D = sqrt(D);
                    r[0] = (-c-D)*z;
                    r[1] = (-c+D)*z;
                    return 2;
                }
                else if (D > -EPSILON_BEZ)
                {
                    r[0] = -c*z;
                    return 1;
                }
            }
        }
        return 0;
    }
    
    vec2 getPositionOnBezierCurve(float t, vec2 p0, vec2 p1, vec2 p2) 
    {
        float fOneMinusT = 1.0-t;
        vec2 pos = fOneMinusT*fOneMinusT*p0+2.0*t*fOneMinusT*p1+t*t*p2;
        return pos;
    }

    float calculateDistanceToQuadraticBezier(vec2 p, vec2 p0, vec2 p1, vec2 p2) 
    {

        p *= 1000.0;
        vec2 dP0P = p0-p;
        vec2 dP1P0 = p1-p0;
        vec2 sP0P2 = p0+p2-p1*2.0;
        float a = dot(sP0P2,sP0P2);
        float b = dot(dP1P0,sP0P2)*3.0;
        float c = dot(dP1P0,dP1P0)*2.0+dot(dP0P, sP0P2);
        float d = dot(dP0P,dP1P0);
        float r[3];
        int roots = findRoots(a,b,c,d,r);
        float dist = MAX;
        float tmp;

        if (roots > 0 && r[0] >= 0. && r[0] <= 1.) 
            dist = distance(p,getPositionOnBezierCurve(r[0],p0,p1,p2));
        
        if (roots > 1 && r[1] >= 0. && r[1] <= 1.) 
            dist = min(dist, distance(p,getPositionOnBezierCurve(r[1],p0,p1,p2)));
        
        if (roots > 2 && r[2] >= 0. && r[2] <= 1.) 
            dist = min(dist, distance(p,getPositionOnBezierCurve(r[2],p0,p1,p2)));
        
        dist = min(dist, min(distance(p, p0), distance(p, p2)));
        
        return dist;
    }


    vec4 calculateDistanceAndSlopeToQuadraticBezier(vec2 p, vec2 p0, vec2 p1, vec2 p2, float _flip) 
    {

        p *= 1000.0;
        float slope = 0.0;

        vec2 dP0P = p0-p;
        vec2 dP1P0 = p1-p0;
        vec2 sP0P2 = p0+p2-p1*2.0;
        float a = dot(sP0P2,sP0P2);
        float b = dot(dP1P0,sP0P2)*3.0;
        float c = dot(dP1P0,dP1P0)*2.0+dot(dP0P, sP0P2);
        float d = dot(dP0P,dP1P0);
        float r[3];
        int roots = findRoots(a,b,c,d,r);
        float dist = MAX;
        float tmp;
        
        float orientX = 1.0;
        float orientY = 1.0;
        
        slope = c;
        
        if (_flip <= 0.5 && roots > 0 && r[0] >= 0. && r[0] <= 1.) 
        {
            vec2 posOnBezier = getPositionOnBezierCurve(r[0],p0,p1,p2);
            dist = distance(p, posOnBezier);
            slope = ((posOnBezier.y - p.y) / (posOnBezier.x-(p.x)));
            
            if (posOnBezier.y > p.y) 
                orientX = -1.0;
            
            if (posOnBezier.x > p.x)
                orientY = -1.0;
            
        }
        
        if ((_flip > (u_resolution.x/2.0)) && (roots > 0 && r[0] >= 0. && r[0] <= 1.) && !(roots > 1 && r[1] >= 0. && r[1] <= 1.))
        {
            vec2 posOnBezier = getPositionOnBezierCurve(r[0],p0,p1,p2);
            float tempDist = distance(p, posOnBezier);
            dist = tempDist;
            slope = ((posOnBezier.y - p.y) / (posOnBezier.x-(p.x)));
            
            if (posOnBezier.y > p.y)
                orientX = -1.0;
            
            if (posOnBezier.x > p.x)
                orientY = -1.0;
            
        }

        if (_flip > 0.5 && (roots > 1 && r[1] >= 0. && r[1] <= 1.) ) {
            vec2 posOnBezier = getPositionOnBezierCurve(r[1],p0,p1,p2);
            dist = min(dist, distance(p,posOnBezier));

            slope = ((posOnBezier.y - p.y) / (posOnBezier.x-(p.x)));

            if (posOnBezier.y > p.y)
                orientX = -1.0;

            if (posOnBezier.x > p.x)
                orientY = -1.0;

        }

        // uncomment to enable semi-circle endcaps
        // dist = min(dist, min(distance(p, p0), distance(p, p2)));

        return vec4(dist,slope,orientX,orientY);
    }

    vec4 drawQuadBezier(
        vec2 xy,        // uv space
        vec2 _b0,       // first endcap control point
        vec2 _b1,       // midpt control point
        vec2 _b2,       // second endcap control point
        vec2 thickness  // inner (x) and outer (y) thickness values
    ) {
    
            float y = xy.y;
            float x = xy.x;
    
            vec2 b0 = _b0 * u_resolution.xy;
            vec2 b1 = _b1 * u_resolution.xy;
            vec2 b2 = _b2 * u_resolution.xy;
    
            vec2 mid = .5*(b0+b2) + vec2(0.0,0.01);
    
            float d = calculateDistanceToQuadraticBezier( xy, b0, b1, b2);
            float a;
    
            if(d < thickness.x) 
            {
              a = 1.0;
            } 
            else
            {
              // Anti-alias the edge.
              a = 1.0 - smoothstep(d, thickness.x, thickness.x+1.0);
            }
    
            if (d < thickness.y)
                return vec4(mod(d/50.0, 1.0),a,a, 1.0)/2.;
            
            return vec4(0.0);
    
    }

    float circle(vec2 _st, float _radius, vec2 _location){
        vec2 dist = _st-_location;
        return 1.-smoothstep(_radius-(_radius*0.01),
                             _radius+(_radius*0.01),
                             dot(dist,dist)*4.0);
    }
    
    vec4 drawCurve (
        vec2 xy,                // x,y coords of uv space
        vec2 _b0,               // first endcap control point
        vec2 _b1,               // midpt control point
        vec2 _b2,               // second endcap control point
        float _thickness,       // inner (x) and outer (y) thickness values
        float _flip,            // flip bezier root value
        vec2 overlapSection     // y1,y2 locations of overlapping section boundaries
    ) {

        vec4 normalsData = vec4(0.0);
    
        vec2 scaling = vec2(2.45, 2.45);
    
        vec2 b0 = _b0 * u_resolution * scaling.xy;
        vec2 b1 = _b1 * u_resolution * scaling.xy;
        vec2 b2 = _b2 * u_resolution * scaling.xy;
        vec2 mid = .5*(b0+b2) + vec2(0.0,0.01);
    
        vec4 slopeAndDistance = calculateDistanceAndSlopeToQuadraticBezier(xy, b0, b1, b2, _flip);
        float d = slopeAndDistance.x;
        float slope = slopeAndDistance.y;
        float orientX = slopeAndDistance.z;
        float orientY = slopeAndDistance.w;
        float thickness = _thickness;

        float a;

        if (d < thickness)  
        {
          a = 1.0;
        } 
        else
        {
          a = 1.0 - smoothstep(d, thickness, thickness+1.0);
        }

        float angle = atan(abs(slope))/PI_BEZIER;

        vec4 distanceField = vec4(mod(d/thickness, 1.0),a,a, 1.0);

        // normal mapping
        if (orientX > 0.0 && d < thickness)
            normalsData.g = angle * distanceField.r + 0.49;

        if (orientX < 0.0 && d < thickness)
            normalsData.g = 0.49 - angle * distanceField.r; 

        if (d < thickness && slope > 0.0)
        {

            if (orientY > 0.0)
                normalsData.r = ((1.0-angle))* distanceField.r;
            
            if (orientY < 0.0)
                normalsData.r = angle* distanceField.r;
            
         }
    
         if (d < thickness && slope < 0.0) 
         { 
            
            if (orientY < 0.0)
                normalsData.r = angle*distanceField.r;

            if (orientY > 0.0)
                normalsData.r = ((1.0-angle))*distanceField.r;

        }
    
        if (d < thickness)
        {
    
            // height mapping
            normalsData.b = 1.0-(distanceField.r/2.0);
    
            // assign basic 0.2 value to overlap value for all curves 
            normalsData.a += 0.2;

            // subtractive circle used to manually smooth detailing where curves overlap, to have tapered intersection values
            // TODO: to make this less manual, we could automatically derive subtractive area at overlap intersection based on bezier curve thickness
            vec3 subtractiveCircle;
            subtractiveCircle += vec3(circle(xy,0.3,vec2(0.950,0.560)));
            subtractiveCircle += vec3(circle(xy,0.3,vec2(0.05,0.560)));

            // iff in specified overlap section for current curve, increase overlap value 
            if (xy.y > overlapSection.x && xy.y < overlapSection.y && subtractiveCircle.b < 0.1)
                normalsData.a = 0.5;
    
        }

        return normalsData;
    
    }

    // useful plotting functions

    float plot(vec2 st, float pct)
    {
        return smoothstep( pct-0.012, pct, st.y) -
        smoothstep( pct, pct+0.324, st.y);
    }
    
    float plotLine(vec2 st)
    { 
        return smoothstep(0.02, 0.0, abs(st.y - st.x));
    }
    
    float plotLineWithThickness(vec2 st, float y1, float y2)
    {
        return step(y1, st.y) - step(y2, st.y);
    }
    
    // linear transformation functions
    
    mat2 scale(vec2 _scale)
    {
        return mat2(_scale.x,0.0,
                    0.0,_scale.y);
    }
    
    mat2 slant(vec2 _slant)
    {
        return mat2(1.0, _slant.x,
                    _slant.y, 1.0);
    }
    
    mat2 flipAboutY(vec2 _st)
    {
        return mat2(-1.0, 0.0,
                   0.0, 1.0);
    }
    
    vec2 rotate2D (vec2 _st, float _angle)
    {
        _st -= 0.5;
        _st =  mat2(cos(_angle),-sin(_angle),
                    sin(_angle),cos(_angle)) * _st;
        _st += 0.5;
        return _st;
    }

    vec2 transform_st (
        vec2 _st, 
        vec2 scaleFactor, 
        vec2 slantFactor,
        float rotation, 
        vec2 offset
    )
    {
    
        vec2 st3 = scale( vec2(1./scaleFactor.x, 1./scaleFactor.y) ) * _st;
    
        st3 = st3 * slant(slantFactor);
    
        if (rotation != 0.0) st3 = rotate2D(st3, rotation);
    
        st3.x -= offset.x;
        st3.y -= offset.y;
    
        return st3;
    
    }
    
    vec2 rotateTilePattern(vec2 _st)
    {

        _st *= 2.0;

        //  Give each cell an index number
        //  according to its position
        float index = 0.0;
        index += step(1., mod(_st.x,2.0));
        index += step(1., mod(_st.y,2.0))*2.0;

        //      |
        //  2   |   3
        //      |
        //--------------
        //      |
        //  0   |   1
        //      |

        _st = fract(_st);

        if(index == 2.0 || index == 3.0)
        {
            _st = rotate2D(_st,PI_BEZIER);
            _st.x = 1.0 - _st.x;
        }

        return _st;
    }

    vec2 scaleAndRepeat (vec2 _st) 
    {
        _st *= 1024.0;       // repeat factor
        _st = fract(_st);    // wrap around 1.0
        _st = rotateTilePattern(_st);
        _st = scale( vec2(0.500,1.0) ) * _st;

        return _st;
    }

    vec3 drawLine (
        vec2 _st, 
        vec3 color, 
        vec2 offset,
        float rotation, 
        vec2 scaleFactor,
        vec2 slantFactor
    ) 
    {
    
        // transform screenspace / uvspace
        vec2 st3 = transform_st( _st, scaleFactor, slantFactor, rotation, offset);
    
        // draw component to tile
        float pct = plotLine(st3);
    
        if (st3.x > 0.0 && st3.x < 1.0)
            return vec3(0.0)+((1.0-pct)*color+pct*vec3(1.0,1.0,1.0));  

        // default: return black
        return vec3(0.0);
    
    }
    
    vec3 drawLineWithThickness (
        vec2 _st,
        vec3 color,
        vec2 offset,
        float rotation,
        vec2 scaleFactor,
        vec2 slantFactor,
        vec2 thickness
    )
    {
    
        // transform screenspace
        vec2 st3 = transform_st( _st, scaleFactor, slantFactor, rotation, offset);
    
        // draw component to tile
        float y1 = thickness.x;
        float y2 = thickness.y;
    
        float pct = plotLineWithThickness(st3, y1, y2);
    
        if (st3.x > 0.0 && st3.x < 1.0)
            return vec3(0.0)+((1.0-pct)*color+pct*vec3(1.0,1.0,1.0));  

        // default: return black
        return vec3(0.0);
    
    }
`

/* ----------------------------------------------------------------------------------------------------------------------
 * calcDiffuse - replaces the ThreeJS MeshStandardMaterial DiffuseColor
 * This snippet is responsible for applying bezier-curve drawing functions ( defined in earlier snippet,`calcDiffuse`)
 * All draw steps & seeding for current pattern are defined here.
*/
export const calcDiffuseColor = (image, mode, versionGL) => ` 

    /* glsl */

    vec2 texCordNew = fract(vUv * ${image.width}.0);


    // ** Classic Parallax Mapping (DISABLED) **

    // float parallaxScale = 0.01;
    // vec4 normalMap2 = texture2D(normalMap_1, texCordNew);
    // float initialHeight = (normalMap2.r + normalMap2.g + normalMap2.b) / 3.0;

    // vec3 surfPosition =  -vViewPosition;
    // vec3 surfNormal = normalize( vNormal );
    // vec3 viewPosition = normalize( vViewPosition );
    
    // vec2 texDx = dFdx( vUv );
    // vec2 texDy = dFdy( vUv );

    // vec3 vSigmaX = dFdx( surfPosition );
    // vec3 vSigmaY = dFdy( surfPosition );
    // vec3 vR1 = cross( vSigmaY, surfNormal );
    // vec3 vR2 = cross( surfNormal, vSigmaX );
    // float fDet = dot( vSigmaX, vR1 );

    // vec2 vProjVscr = ( 1.0 / fDet ) * vec2( dot( vR1, viewPosition ), dot( vR2, viewPosition ) );
    // vec3 vProjVtex;",
    // vProjVtex.xy = texDx * vProjVscr.x + texDy * vProjVscr.y;
    // vProjVtex.z = dot( surfNormal, viewPosition );

    // // Offset Limiting
    // vec3 V = vProjVtex;
    // vec2 texCoordOffset = (parallaxScale * V.xy * initialHeight);


    // ** Derive ST/UV Space for texel-level processing **

    // vec2 mapUv = vUv - texCoordOffset;    // Enable Parallax Mapping
    vec2 mapUv = vUv;                        // Disable Parallax Mapping
    vec2 stNew = mapUv;

    // temp override
    vec2 mouse_norm = vec2(1.0,1.0);

    txs = 1.0/${image.width}.0; 

    ivec2 T = ivec2(mapUv.x * ${image.width}.0 , mapUv.y * ${image.height}.0);

    float idx = max(floor(sin(mapUv.x*10.0)*1.5),0.0);

    idx *= 0.5;
    idx += 0.1;

    vec2 texCord = fract(mapUv * ${image.width}.0);
    vec2 texPixel = vec2(txs, txs);

    ${versionGL == "webGL1"
        ? `
                // look up current, north, south texels (webGL 1)
                vec4 C = texture2D(fillMap, vUv);
                vec4 N = texture2D(fillMap, vUv + vec2(0, texPixel.y));
                vec4 S = texture2D(fillMap, vUv + vec2(0, -texPixel.y));
            `

        : `
                // Look up current, north, south texels (webGL 2)
                vec4 C = texelFetch(fillMap, T, 0);
                vec4 N = texelFetch(fillMap, T + ivec2(0,1), 0);
                vec4 S = texture2D(fillMap, vUv + vec2(0, -texPixel.y));
            `

    }

    vec3 fillMapColor = vec3(C.x, C.y, C.z);
    vec3 bufferColor = fillMapColor;

    bufferColor = vec3(0.0,0.0,1.0);

    if(C == fillMap_color1) bufferColor = color_1;
    if(C == fillMap_color2) bufferColor = color_2;

    vec2 st = rotate2D(vUv, PI_BEZIER*.5);

    // disable for simulated mesh (unnesc for non-uv mapped objects)
    ${mode == "static" ? `st *= 2048.0;` : ``}
    st = fract(st);


    // ** Prepare Curve Drawing Context **

    // initialize canvas
    vec2 xy = rotate2D(st, 0.5*PI_BEZIER);
    vec4 color = vec4(0.0,0.0,0.0,1.0);

    // initialize curve drawing variables
    vec2 cp1 = vec2(0.060, 0.170);
    vec2 cp2 = vec2(-0.020, 0.360);
    vec2 cp3 = vec2(0.10, 0.360);
    float thickness = 210.0; // 160.0;

    vec2 offset = vec2(0.350,0.380);            // base x, y offset draw coords offset in uv space
    vec2 overlapSection = vec2(0.560,0.980);    // base y1, y2 coords of uv space boundaries for overlap sections 

    vec3 fdx = dFdx(v_position.xyz);
    vec3 fdy = dFdy(v_position.xyz);
	vec3 faceNormal = normalize(cross(fdx,fdy));

    // "normal" keyword already used later on by meshStandardMaterial shader
    vec3 _normal = v_normal;

    // TODO: find where this is being used & messing up the back
    bool frontFacing = true;

    /*
    // use dot product with faceNormal to determine current face direction
    if (dot (_normal, faceNormal) > 0.0) {

        // _normal *= -1.0;

        // for single jersey jacquard
        // overlapSection = vec2(0.0509, 0.509);

        frontFacing = false;

    }
    */

    bool reverseColors = false;
    if (dot (_normal, faceNormal) > 0.0) reverseColors = true;

    // normalsData contains all data to define the curve structures on the canvas:
    //    - normalsData.r : X: -1 to +1 :  Red:     0 to 255
    //    - normalsData.g : Y: -1 to +1 :  Green:   0 to 255
    //    - normalsData.b : Z:  0 to -1 :  Blue:  128 to 255
    //    - normalsData.a : overlap value (higher value => higher priority to display the curve at this texel)
    vec4 normalsData = vec4(0.0);

    // buffer for storage of returned values from drawCurve() function (normalsData returned for new curve)
    vec4 newCurve;

    // these vals are used to determine the top-most curve for diffuse shading, in the case of overlaps
    // TODO: create dynamic array for overlap vals
    bool overlap_1 = false;

    // ** only used for single jersey jacquard backface calculations
    bool overlap_2 = false;
    bool overlap_3 = false;
    bool overlap_4 = false;


    // ** Draw Curves to Canvas Context **

    // vert repeat component
    for (int i = -1; i < 1; i++)
    {

        // horiz repeat component
        for (int j = -1; j < 1; j++)
        {

            offset = vec2(0.0, 0.0);
            offset = offset+vec2(0.20 *float(j), 0.2*float(i));

            vec2 localOverlapSection = overlapSection;

            if (i >= 1) localOverlapSection.xy += vec2(0.250,0.250) * float(i);

            // top left
            newCurve = drawCurve(xy, offset+cp1, offset+cp2+vec2(-0.02, 0.04), offset+cp3, thickness, 0.0, vec2(1.0));
            // newCurve = drawCurve(xy, offset+cp1, offset+cp2, offset+cp3, thickness, vec2(1.0));
            
            if (newCurve.a > normalsData.a) 
            {
                normalsData = newCurve;
                overlap_1 = false;
                // ov_5 = true;

                if (j == 0 && xy.y < 0.5) overlap_3 = true;

                // for single jersey
                // if (i == 0 && !frontFacing) overlap_3 = true;
            }

            // top right
            newCurve = drawCurve(xy, offset+cp3, offset+vec2(cp3.x+0.12+0.02, cp3.y+0.04), offset+vec2(cp3.x+0.04, cp3.y-0.19), thickness, 0.0, vec2(1.0));
            // newCurve = drawCurve(xy, offset+cp3, offset+vec2(cp3.x+0.12, cp3.y), offset+vec2(cp3.x+0.04, cp3.y-0.19), thickness, vec2(1.0));
            
            if (newCurve.a > normalsData.a)
            {
                normalsData = newCurve;
                overlap_1 = false;

                if (i==0) overlap_3 = true;

                // for single jersey
                // if (i == 0 && !frontFacing) overlap_3 = true;
            }

            offset = vec2(0.100, 0.396);
            offset = offset+vec2(0.2 *float(j), 0.2*float(i));

            // bottom right
            newCurve = drawCurve(xy, offset-vec2(0.060, 0.170), offset-vec2(-0.050, 0.40), offset-vec2(0.10, 0.360), thickness, 0.0, localOverlapSection);
            // INVERSE:
            newCurve += drawCurve(xy, offset-vec2(0.060, 0.170), offset-vec2(-0.050, 0.40), offset-vec2(0.1, 0.360), thickness, 0.528, localOverlapSection + vec2(-0.540,0.310));
            // newCurve = drawCurve(xy, offset-vec2(0.060, 0.170), offset-vec2(-0.020, 0.360), offset-vec2(0.10, 0.360), thickness, localOverlapSection);

            if (newCurve.a > normalsData.a)
            {
                if (frontFacing) {
                    normalsData = newCurve;
                    overlap_1 = true;
                }

                // SET OVERLAP 2 TRUE HERE IFF ALSO ELSEWHERE
                if (i == -1) overlap_2 = true;

                // for single jersey
                /* 
                else if (i==0)
                {
                    normalsData = newCurve;
                    overlap_1 = true;

                    for single jersey
                    overlap_4 = true;
                }
                */
            }

            offset = vec2(0.300, 0.396);
            offset = offset+vec2(0.2 *float(j), 0.2*float(i));

            // bottom left
            newCurve = drawCurve(xy, offset-vec2(cp3.x, cp3.y), offset-vec2((cp3.x+0.12+0.02), cp3.y + 0.04), offset-vec2((cp3.x+0.04), (cp3.y-0.19)), thickness, 0.0, localOverlapSection);
            // newCurve = drawCurve(xy, offset-vec2(cp3.x, cp3.y), offset-vec2((cp3.x+0.12), cp3.y), offset-vec2((cp3.x+0.04), (cp3.y-0.19)), thickness, localOverlapSection);
            
            if (newCurve.a > normalsData.a)
            {
                if (frontFacing)
                {
                    normalsData = newCurve;
                    overlap_1 = true;
                }

                if (i==0) overlap_4 = true;

                /*
                else if (i==0)
                {
                    normalsData = newCurve;
                    overlap_1 = true;

                    // for single jersey
                    // overlap_4 = true;
                }
                */
            }

        }

    }

    color += vec4(normalsData.rgb, 1.0);
    
    // apply normal mapping base colors
    if(color.g < 0.0000001) color.g = 0.5;
    if(color.r < 0.0000001) color.r = 0.5;
    if(color.b < 0.0000001) color.b = 1.0;

    float px = 1.0 / u_resolution.y;
    float aplhaVal = 1.0;

    vec4 normalMapColor = color;

    // ** Apply Individual Curve Coloring, Accounting for Overlaps **

    // (1) deal with overlapping sections (front faces)

    if (overlap_1 == true)
    {
        if(S == fillMap_color1) bufferColor = color_1;
        if(S == fillMap_color2) bufferColor = color_2;
    }

    if (overlap_2 == true)
    {
        if(S == fillMap_color1 && C != fillMap_color1) bufferColor = color_2;
        if(S == fillMap_color2 && C != fillMap_color2) bufferColor = color_1;
        // bufferColor.x = 1.0;
        // bufferColor.y = 0.0;
        // bufferColor.z = 0.0;
    }

    if (overlap_3 == true)
    {
        if(S == fillMap_color1 && C != fillMap_color1) bufferColor = color_2;
        if(S == fillMap_color2 && C != fillMap_color2) bufferColor = color_1;
        // bufferColor.x = 0.0;
        // bufferColor.y = 0.0;
        // bufferColor.z = 1.0;

    }

    /*
    if (overlap_4 == true)
    {
        // if(S == fillMap_color1 && C != fillMap_color1) bufferColor = color_1;
        // if(S == fillMap_color2 && C != fillMap_color2) bufferColor = color_2;
        bufferColor.x = 1.0;
        bufferColor.y = 1.0;
        bufferColor.z = 0.0;
    }
    */

    /*
    // deal with grid artifacts
    if (color.r == 0.5 && color.g == 0.5 && color.b == 1.0)
    {
        bufferColor = vec3(0.0,1.0,0.0);
    }
    else
    {
        if (xy.y > 0.95 && S == fillMap_color1) bufferColor = color_1;
        if (xy.y > 0.95 && S == fillMap_color2) bufferColor = color_2;
    }
    */

    // deal with grid artifacts
    if (xy.y > 0.95 && S == fillMap_color1) bufferColor = color_1;
    if (xy.y > 0.95 && S == fillMap_color2) bufferColor = color_2;

    // mode as passed in from visualizer ( static, or simulated geometry )
    ${mode == "static"

        ? `
                // mix colors when beyond distance threshold
                if (distToCamera > 0.975) {
            
                    if(N == fillMap_color1 && C != fillMap_color1)
                        bufferColor = (vec3(color_1) + vec3(color_2)) / 2.0;
            
                    if(N == fillMap_color2 && C != fillMap_color2)
                        bufferColor = (vec3(color_1) + vec3(color_2)) / 2.0;
            
                }

                // TODO ^^ apply same tapering logic to the visibility of the multi-color yarn sections
                normalMapColor = mix(normalMapColor, vec4(0.0), distToCamera/3.0 );
            
                // fill holes when beyond distance threshold
                /*
                if (bufferColor.g == 1.0 && bufferColor.r == 0.0 && bufferColor.b == 0.0 && distToCamera > 0.975) {
            
                    if(C == fillMap_color1) 
                        bufferColor = color_1;
            
                    if(C == fillMap_color2)
                        bufferColor = color_2;
            
                }
                */

                // fill holes always
                if (bufferColor.g >= 0.95 && bufferColor.r <= 0.05 && bufferColor.b <= 0.05) {

                    if(C == fillMap_color1)
                        bufferColor = color_1;

                    if(C == fillMap_color2)
                        bufferColor = color_2;

                }
                `

        : ``
    }

    ${versionGL == "webGL1"
        ? `
                if (bufferColor.r < 0.01 && bufferColor.g < 0.01 && bufferColor.b > 0.99)
                    bufferColor = (vec3(color_1) + vec3(color_2)) / 2.0;
                `

        : ``

    }

    if (reverseColors == true && bufferColor == color_1)
    {
        bufferColor = color_2;
    }
    else if (reverseColors == true && bufferColor == color_2)
    {
        bufferColor = color_1;
    }

    vec4 diffuseColor = vec4(bufferColor, 1.0);

`

export const calcNormalFragmentMaps = () => `

    /* glsl */

    #include <normal_fragment_maps>
    
    vec4 normalMap = normalMapColor;
    mapN = normalMap.xyz * 2.0 - 1.0;
    mapN.xy *= normalScale;
    normal = perturbNormal2Arb( - vViewPosition, normal, mapN, faceDirection ) * faceDirection;

`

export const calcVertStandard = () => `

    /* glsl */

    #define USE_NORMALMAP
    #define STANDARD

    varying vec2 vUv;
    varying vec2 v_texCoord;
    attribute vec2 a_texCoord;

`

export const calcVertMain = () => `

    /* glsl */

    varying float faceDirectionFront;
    varying vec4 v_position;
    varying vec3 v_normal;
    varying float distToCamera;
    
    void main() 
    {
        vUv = uv;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);

        vec3 ndc = gl_Position.xyz / gl_Position.w;  // NDC in [-1, 1] (by perspective divide)

        distToCamera = ndc.z * 0.5 + 0.5;            // depth in [0, 1]

        v_normal = normalMatrix * normal;
        v_position = modelViewMatrix * vec4 (position, 1.0);

`

export const calcFragStandard = () => `

    /* glsl */

    #define USE_NORMALMAP
    #define TANGENTSPACE_NORMALMAP
    #define STANDARD

`

export const calcDitheringParsFrag = () => `

    /* glsl */

    vec3 dithering( vec3 color )
    {
        float grid_position = rand( gl_FragCoord.xy );
        vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
        dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
        return color + dither_shift_RGB;
    }

`
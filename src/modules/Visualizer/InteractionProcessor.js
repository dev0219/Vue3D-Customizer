/*

Sub-module for Visualizer that to generate preview geometry for mesh interaction in 3D context

( Currently disabled, though we will be picking back up development of this in the future )

*/

import { EVENTS } from "../../Events"
import { CUT_STAMP, INIT_INTERACTION, PASTE_STAMP, PROCESS_STAMP, REDO_STAMP, UNDO_STAMP } from "../../helpers/constants"
import * as THREE from "three"


class InteractionProcessor {

    constructor() {

        // Buffers for objects received from visualizer
        this.scene          = null
        this.controls       = null
        this.mesh           = null
        this.camera         = null

        // Mesh Intersection Detection
        this.mouse          = new THREE.Vector2()
        this.raycaster      = new THREE.Raycaster()
        this.mouseHelper    = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 10 ), new THREE.MeshNormalMaterial() )
        this.mouseHelper.visible = false
        this.intersects     = []
        this.intersection   = {
            intersects: false,
            point:      new THREE.Vector3(),
            normal:     new THREE.Vector3()
        };

        // Stamping
        this.isCutting = false;

        // // Decals
        // this.decals = [];
        // this.position = new THREE.Vector3();
        // this.orientation = new THREE.Euler();
        // this.size = new THREE.Vector3( 10, 10, 10 );
        // this.params = {
        //     minScale: 1,
        //     maxScale: 2,
        //     rotate: true,
        // };

        // Events registration
        EVENTS.on( INIT_INTERACTION,          this.initPreviewGeometry.bind(this) )
        EVENTS.on( CUT_STAMP,                 this.cutStamp.bind(this) )
        EVENTS.on( PASTE_STAMP,               this.pasteStamp.bind(this) )

    }

    initPreviewGeometry(scene, controls, mesh, camera) {

        this.scene      = scene;
        this.controls   = controls;
        this.mesh       = mesh;
        this.camera     = camera;

        this.startDate = new Date();

        // this.scene.add(this.mouseHelper);

        const lines = [];

        // define and add geo for stamp preview to scene
        // for (let i=0; i < 4; i++) {

        //     const geometry = new THREE.BufferGeometry();
        //     geometry.setFromPoints( [ new THREE.Vector3(), new THREE.Vector3() ] );
        //     lines[i] = new THREE.Line( geometry, new THREE.LineBasicMaterial() );
        //     this.scene.add( lines[i] );

        // }

        let moved = false;

        this.controls.addEventListener( 'change', () => { moved = true } );

        window.addEventListener( 'pointerdown', () => { moved = false } );

        window.addEventListener( 'pointerup',  ( event ) => {

            if ( moved === false ) {

                checkIntersection( event.clientX, event.clientY );

                var mouseInScene = window.innerWidth - event.clientX > 400;

                if ( this.intersection.intersects && mouseInScene ) {

                    stamp( event.shiftKey );

                }

            }

        } );

        window.addEventListener( 'pointermove', onPointerMove );

        function onPointerMove( event ) {

            if ( event.isPrimary ) {

                checkIntersection( event.clientX, event.clientY );

            }

        }

        window.addEventListener('keydown', function(evt) {

            if ( !evt.ctrlKey ) return;

            if ( evt.key === 'Z' && evt.shiftKey ) {

                EVENTS.emit( REDO_STAMP );

            } else if ( evt.key === 'z' ) {

                EVENTS.emit( UNDO_STAMP );

            }

        });

        // SEE https://github.com/mrdoob/three.js/issues/1486 for V2
        const checkIntersection = ( x, y ) => {

            if ( this.mesh === undefined || this.mesh === null ) return;

            this.mouse.x = ( x / (window.innerWidth - 1200) ) * 2 - 1;
            this.mouse.y = - ( y / window.innerHeight ) * 2 + 1;

            this.raycaster.setFromCamera( this.mouse, this.camera );
            this.raycaster.intersectObject( this.mesh, false, this.intersects );

            // Draw stamp preview geo based on mouse position
            if ( this.intersects.length > 0 ) {

                // store intersection data, to send to material processor
                this.intersectionData = this.intersects[0];

                const p = this.intersects[0].point
                this.mouseHelper.position.copy( p )
                this.intersection.point.copy( p );

                const n = this.intersects[0].face.normal.clone();
                n.multiplyScalar( -0.25 );
                n.add( this.intersects[0].point );

                this.intersection.normal.copy( this.intersects[0].face.normal );
                this.mouseHelper.lookAt( n );

                lines.forEach(line => line.material.color.setHex( this.isCutting ? 0x00ff00 : 0xffffff ))

                // find parallel lines, with offset factor i
                // 𝛿𝑥 = Δ𝑦×𝑖/L

                var i = 1.05;

                var dx = n.x - p.x;
                var dy = n.y - p.y;
                var dz = n.z - p.z;

                var Lxy = Math.sqrt((dx * dx) + (dy * dy));
                var Lxz = Math.sqrt((dz * dz) + (dy * dy));

                var sx = dy * i / Lxy;
                var sy = -dx * i / Lxy;
                var sz = dy * (i * 0.3) / Lxz;

                // midpoints
                var mx = (p.x + n.x) / 2;
                var my = (p.y + n.y) / 2;
                var mz = (p.z + n.z) / 2;

                // todo: tweak positions dynamically based on dims of input image
                const pos0 = lines[0].geometry.attributes.position;
                pos0.setXYZ( 0, mx + sx, my + sy, mz - sz );
                pos0.setXYZ( 1, mx + sx, my + sy, mz + sz );

                const pos1 = lines[1].geometry.attributes.position;
                pos1.setXYZ( 0, mx - sx, my - sy, mz - sz );
                pos1.setXYZ( 1, mx - sx, my - sy, mz + sz );

                const pos2 = lines[2].geometry.attributes.position;
                pos2.setXYZ( 0, mx + sx, my + sy, mz + sz );
                pos2.setXYZ( 1, mx - sx, my - sy, mz + sz );

                const pos3 = lines[3].geometry.attributes.position;
                pos3.setXYZ( 0, mx + sx, my + sy, mz - sz );
                pos3.setXYZ( 1, mx - sx, my - sy, mz - sz );

                // orientation override for X plane
                if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) {

                    if (dz > 0 && p.z > 2) {

                        // front
                        pos0.setXYZ( 0, mx - (i * 0.3), my - i, mz );
                        pos0.setXYZ( 1, mx - (i * 0.3), my + i, mz );
        
                        pos1.setXYZ( 0, mx - (i * 0.3), my - i, mz );
                        pos1.setXYZ( 1, mx + (i * 0.3), my - i, mz );
        
                        pos2.setXYZ( 0, mx + (i * 0.3), my - i, mz );
                        pos2.setXYZ( 1, mx + (i * 0.3), my + i, mz );
        
                        pos3.setXYZ( 0, mx + (i * 0.3), my + i, mz );
                        pos3.setXYZ( 1, mx - (i * 0.3), my + i, mz );


                    } else {

                        // back
                        pos0.setXYZ( 0, mx + i, my - (i * 0.3), mz );
                        pos0.setXYZ( 1, mx + i, my + (i * 0.3), mz );
        
                        pos1.setXYZ( 0, mx + i, my - (i * 0.3), mz );
                        pos1.setXYZ( 1, mx - i, my - (i * 0.3), mz );
        
                        pos2.setXYZ( 0, mx - i, my + (i * 0.3), mz );
                        pos2.setXYZ( 1, mx - i, my - (i * 0.3), mz );
        
                        pos3.setXYZ( 0, mx - i, my + (i * 0.3), mz );
                        pos3.setXYZ( 1, mx + i, my + (i * 0.3), mz );

                    }

                }

                // orientation override for Z plane
                if (Math.abs(dy) < 0.05 && Math.abs(dz) < 0.05) {

                    pos0.setXYZ( 0, mx, my + i, mz + (i * 0.3) );
                    pos0.setXYZ( 1, mx, my + i, mz - (i * 0.3) );
    
                    pos1.setXYZ( 0, mx, my - i, mz - (i * 0.3) );
                    pos1.setXYZ( 1, mx, my + i, mz - (i * 0.3) );
    
                    pos2.setXYZ( 0, mx, my + i, mz + (i * 0.3) );
                    pos2.setXYZ( 1, mx, my - i, mz + (i * 0.3) );
    
                    pos3.setXYZ( 0, mx, my - i, mz - (i * 0.3) );
                    pos3.setXYZ( 1, mx, my - i, mz + (i * 0.3) );

                }

                pos0.needsUpdate = true;
                pos1.needsUpdate = true;
                pos2.needsUpdate = true;
                pos3.needsUpdate = true;

                this.intersection.intersects = true;
                this.intersects.length = 0;

            } else {

                this.intersection.intersects = false;

            }

        }

        const stamp = ( shiftKeyPressed ) => {

            var stampImage = new Image();
            stampImage.src = './test-stamp-4.png';

            stampImage.onload = () => {

                EVENTS.emit( PROCESS_STAMP, this.intersectionData, stampImage, shiftKeyPressed, this.isCutting );

            }

        }

    }

    cutStamp () {

        this.isCutting = true;

    }

    pasteStamp () {

        this.isCutting = false;

    }

}

export { InteractionProcessor }

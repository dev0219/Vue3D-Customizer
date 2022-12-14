import * as THREE from 'three';

const dummy = new THREE.Object3D();


export default class InstancePoint {

    constructor(points, radius) {

        this.points = points;

        const geometry = new THREE.SphereGeometry(radius, 16, 16);
        const material = new THREE.MeshBasicMaterial(0xffffff);

        this.mesh = new THREE.InstancedMesh(geometry, material, this.points.length);

        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame

        this.gravity = -9.81;

    }

    updatePoints(delta) {

        // update points in random order
        const random = this.generateRandomIndexes(this.points.length);

        for (let i = 0; i < this.points.length; i++) {

            const index = random[i];
            const point = this.points[index]; 
            
            point.updatePoint(delta, this.gravity);
            // point.test();

            dummy.position.set(point.position.x, point.position.y, point.position.z);

            dummy.updateMatrix();

            this.mesh.setMatrixAt(index, dummy.matrix);

            const color = new THREE.Color(point.defaultColor);

            this.mesh.setColorAt(index, color);
        }

        this.mesh.instanceMatrix.needsUpdate = true;
        this.mesh.instanceColor.needsUpdate = true;

    }

    constrainPoints(sceneW, sceneH) {

        for (let i = 0; i < this.points.length; i++) {

            const point = this.points[i]; 

            point.constrainPoint(sceneW, sceneH);

            dummy.position.set(point.position.x, point.position.y, 0);

            dummy.updateMatrix();

            this.mesh.setMatrixAt(i++, dummy.matrix);
        }

        this.mesh.instanceMatrix.needsUpdate = true;
    }

    generateRandomIndexes(length) {

        const array = [];

        for (let i = 0 ; i < length ; i++) {
            array.push(i);
        }

        let currentIndex = array.length, temporaryValue, randomIndex;
    
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
    
        return array;
        
    }

    randomArrayShuffle(array) {
    
        let currentIndex = array.length, temporaryValue, randomIndex;
    
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
    
        return array;
    }

}
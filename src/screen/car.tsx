import * as THREE from 'three';

class Car {

    constructor() {
        
    }

    getModel() {
        const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
        const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
        const cube = new THREE.Mesh( geometry, material ); 
        
        return cube
    }

}

export { Car }
import * as THREE from 'three';
import React from 'react';
import ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
import App from './App';


const rootElement = document.getElementById("app");
const root = ReactDOMClient.createRoot(rootElement);
root.render(
    <App />       
);

let state: any = {
    scene: undefined,
    camera: undefined,
    renderer: undefined,
    controls: undefined,
    blocks: undefined
}


const init = async () => {
    state.scene = new THREE.Scene();
    state.scene.background = new THREE.Color( 0x000000 );
    state.scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

    const clock = new THREE.Clock();


    
    state.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 100 );
    state.camera.position.set( 0, 3, 7 );
    state.scene.add(state.camera);


    state.renderer = new THREE.WebGLRenderer();
    state.renderer.setSize( window.innerWidth, window.innerHeight );
    state.renderer.shadowMap.enabled = true

    document.querySelector("#screen").appendChild( state.renderer.domElement );
    
    const dirLight = new THREE.DirectionalLight( 0xffffff );
    dirLight.position.set( -40, 400, -70 );
    dirLight.shadow.camera.top = 150;
    dirLight.shadow.camera.right = 150;
    dirLight.shadow.camera.bottom = -150;
    dirLight.shadow.camera.left = -150;
    dirLight.castShadow = true;


    state.scene.add(dirLight);
    
    const hemiLight = new THREE.HemisphereLight( 0x707070, 0x444444 );
    hemiLight.position.set( 0, 120, 0 );
    state.scene.add(hemiLight);
    
    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ),new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: true} ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    state.scene.add(mesh);



    const helper = new THREE.CameraHelper( dirLight.shadow.camera );
    state.scene.add( helper );
    
    function animate() {
        requestAnimationFrame( animate );

        state.renderer.render( state.scene, state.camera );
    }



    animate();
    
}



init()
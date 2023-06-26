import * as THREE from 'three';
import { Car } from './car'
import { Terrain } from './terrain'
import { Load } from './load'

class World {
    scene: any;
    camera: any;
    renderer: any;
    controls: any;
    blocks: any;
    loadmanager: any

    constructor() {
        this.scene = undefined
        this.camera = undefined
        this.renderer = undefined
        this.controls = undefined
        this.blocks = undefined

        this.init()

        window.addEventListener( 'resize', this.onWindowResize.bind(this) );

    }

    async init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x000000 );
        this.loadmanager = new Load()
        this.createWorld()

       // this.scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );
    
        const clock = new THREE.Clock();
    
        
        this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 100 );
        this.camera.position.set( 0, 3, 0 );
        this.camera.rotation.x = Math.PI + 2.40

        this.scene.add(this.camera);
    
    
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true
    
        document.querySelector("#screen").appendChild( this.renderer.domElement );
        
        const dirLight = new THREE.DirectionalLight( 0xffffff );
        dirLight.position.set( -40, 400, -70 );
        dirLight.shadow.camera.top = 150;
        dirLight.shadow.camera.right = 150;
        dirLight.shadow.camera.bottom = -150;
        dirLight.shadow.camera.left = -150;
        dirLight.castShadow = true;
    
    
        this.scene.add(dirLight);
        
        const hemiLight = new THREE.HemisphereLight( 0x707070, 0x444444 );
        hemiLight.position.set( 0, 120, 0 );
        this.scene.add(hemiLight);
        
        // const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: true} ) );
        // mesh.rotation.x = - Math.PI / 2;
        // mesh.receiveShadow = true;
        // this.scene.add(mesh);
    
    
        const helper = new THREE.CameraHelper( dirLight.shadow.camera );
        this.scene.add( helper );

        const car = new Car({ 
            camera: this.camera,
            loadmanager: this.loadmanager,
            scene: this.scene
        })

        const carModel = await car.getModel()
        const carRaycaster = await car.getRaycaster()
        

        carModel.add(this.camera)

        this.scene.add( carModel );

        this.animate();
    }

    createWorld() {
        for (let index = 0; index < 20; index++) {
            const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
            const material = new THREE.MeshBasicMaterial( {color: 0xffffff} ); 
            const cube = new THREE.Mesh( geometry, material ); 

            const x = Math.random() * (30 - -30) + -30;
            const y = 0
            const z = Math.random() * (30 - -30) + -30;

            cube.position.set(x, y, z)
            this.scene.add(cube)            
        }


        const terrain = new Terrain()
        const getWorld = terrain.getTerrain()

        getWorld.name = 'terrain'
        this.scene.add(getWorld)            

    }

    onWindowResize() {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );

    }

    animate() {
        requestAnimationFrame( this.animate.bind(this) );
        this.renderer.render( this.scene, this.camera );
    }

}

export { World }
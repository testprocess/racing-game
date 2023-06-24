import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Car {
    loadmanager: any
    
    model: any;
    carModel: any
    isMove: boolean;
    radian: number;
    inputRadian: number
    standardRadian: number
    isChangeStandardRadian: boolean
    previousRadian: number[]
    modelVisualTurn: number
    force: number;
    velocity: any;

    camera: any

    constructor({ camera, loadmanager }: any) {
        document.addEventListener("onJoystickMove", this.handleJoystickMove.bind(this))
        document.addEventListener("onJoystickStart", this.handleJoystickStart.bind(this))
        document.addEventListener("onJoystickStop", this.handleJoystickStop.bind(this))

        this.camera = camera
        this.loadmanager = loadmanager

        
        this.model = undefined
        this.isMove = false
        this.radian = 0
        this.inputRadian = 0

        this.standardRadian = 0
        this.isChangeStandardRadian = false

        this.previousRadian = [0]
        this.modelVisualTurn = 0

        this.force = 0
        this.velocity = new THREE.Vector3( 0, 0, 0 )

    }

    handleJoystickMove(e: any) {
        this.moveModel({
            radian: e.detail.radian,
            force: e.detail.force
        })
    }

    handleJoystickStop(e: any) {
        this.isMove = false
        this.isChangeStandardRadian = false
        this.standardRadian = this.radian
    }

    handleJoystickStart(e: any) {
        this.isMove = true
    }


    async getModel() {
        const carBox = new THREE.Object3D()

        // const geometry = new THREE.BoxGeometry( 1, 1, 2 ); 
        // const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
        // const cube = new THREE.Mesh( geometry, material ); 

        const loader = new GLTFLoader(this.loadmanager.manager);


        const gltf = await loader.loadAsync( '/public/models/car.glb')

        gltf.scene.scale.set(0.2, 0.2, 0.2)
 

        console.log(gltf.scene)

        carBox.add(gltf.scene)

        this.model = carBox
        this.carModel = gltf.scene

        this.loop()

        return this.model
    }

    moveModel({ radian, force }: any) {
        this.inputRadian = radian
    }

    updateVelocity() {
        let radianDirection = this.inputRadian + (90 * Math.PI / 180)

        if (Math.abs((radianDirection) * 180 / Math.PI) > 90) {
            radianDirection = (90 * Math.PI / 180) * (radianDirection >  Math.PI ? -1 : 1)
        }

        this.modelVisualTurn = - radianDirection / 10


        if (this.isMove) {
            this.radian += radianDirection / 50

            const vx = -Math.cos(this.radian)
            const vz = -Math.sin(this.radian)
    
            this.velocity.set(vx, 0, vz)
        }
    }

    updatePosition() {
        this.updateVelocity()
        const acceleration = 0.01
        const deacceleration = 0.07
        const maxForce = 5
        const maxVisualTurn = 0.4

        this.previousRadian.unshift(this.radian)

        if (this.previousRadian.length > 5) {
            this.previousRadian.pop()
        }


        // const previousRadianSum = this.previousRadian.reduce((f, l)=> f + l, 0);
        // const previousRadianMean = previousRadianSum / this.previousRadian.length
        // let previousRadianDispersion = 0
        // let previousRadianDispersionNumerator = 0

        // for (let index = 0; index < this.previousRadian.length; index++) {
        //     previousRadianDispersionNumerator += Math.pow(this.previousRadian[index] - previousRadianMean, 2)
        // }

        // previousRadianDispersion = previousRadianDispersionNumerator / this.previousRadian.length

        // if (previousRadianDispersion > 1) {
        //     previousRadianDispersion = 0
        // }




        this.force = this.force > maxForce ? this.force : this.force + acceleration

        if (this.isMove == false && this.force > 0) {
            this.force = this.force - deacceleration
        }

        const dt = 1/10
        const xs = this.model.position.x + this.velocity.x * dt * this.force
        const xz = this.model.position.z + this.velocity.z * dt * this.force

        this.model.position.set(xs, 0, xz)
        this.model.rotation.y = -this.radian + Math.PI / 2

        this.carModel.rotation.y = this.modelVisualTurn + Math.PI

        this.camera.position.set(0, 4, 0 + (4 + (this.force * this.force * this.force) / 50))
        this.camera.rotation.x = -25 * Math.PI / 180

    }

    loop() {
        requestAnimationFrame( this.loop.bind(this) );
        this.updatePosition()

        // if (this.isMove == false) {
        //     this.model.translateZ(0)
        // } else {
        //     this.model.rotation.y = -this.radian + Math.PI / 2
        //     this.updatePosition()
        // }
    }

}

export { Car }
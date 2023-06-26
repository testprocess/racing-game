import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Car {
    loadmanager: any
    
    model: any;
    carModel: any
    isMove: boolean;
    isCollision: boolean;

    radian: number;
    inputRadian: number
    standardRadian: number
    isChangeStandardRadian: boolean
    previousRadian: number[]
    modelVisualTurn: number
    force: number;
    velocity: any;

    camera: any
    scene: any

    raycaster: any

    constructor({ camera, loadmanager, scene }: any) {
        document.addEventListener("onJoystickMove", this.handleJoystickMove.bind(this))
        document.addEventListener("onJoystickStart", this.handleJoystickStart.bind(this))
        document.addEventListener("onJoystickStop", this.handleJoystickStop.bind(this))

        this.camera = camera
        this.loadmanager = loadmanager

        
        this.model = undefined
        this.isMove = false
        this.isCollision = false
        this.radian = 0
        this.inputRadian = 0

        this.standardRadian = 0
        this.isChangeStandardRadian = false

        this.previousRadian = [0]
        this.modelVisualTurn = 0

        this.force = 0
        this.velocity = new THREE.Vector3( 0, 0, 0 )

        this.raycaster = new THREE.Raycaster()
        const rayOrigin = new THREE.Vector3(0, 0, 0)
        const rayDirection = new THREE.Vector3(-2, 0, 0)
        rayDirection.normalize()

        this.raycaster.set(rayOrigin, rayDirection)

        this.scene = scene


        this.loopCollision()

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

        this.previousRadian.unshift(this.radian)

        if (this.previousRadian.length > 5) {
            this.previousRadian.pop()
        }

        this.force = this.force > maxForce ? this.force : this.force + acceleration

        this.carModel.rotation.y = this.modelVisualTurn + Math.PI


        if (this.isMove == false && this.force > 0) {
            this.force = this.force - deacceleration
        }

        if (this.isCollision == true) {
            return 0
        }

        const dt = 1/10
        const xs = this.model.position.x + this.velocity.x * dt * this.force
        const xz = this.model.position.z + this.velocity.z * dt * this.force

        this.model.position.set(xs, 0, xz)
        this.model.rotation.y = -this.radian + Math.PI / 2


        this.camera.position.set(0, 4, 0 + (4 + (this.force * this.force * this.force) / 50))
        this.camera.rotation.x = -25 * Math.PI / 180

        //this.scene.add(new THREE.ArrowHelper(this.raycaster.ray.direction, this.raycaster.ray.origin, 300, 0x00ff00) );

    }

    detectCollision() {
        const rayOrigin = new THREE.Vector3(this.model.position.x, 1, this.model.position.z)
        const rayDirection = new THREE.Vector3(this.velocity.x, 0, this.velocity.z)
        rayDirection.normalize()

        this.raycaster.set(rayOrigin, rayDirection)

        let object = this.scene.getObjectByName( "terrain" );

        const objectsToTest = [object]
        const intersects = this.raycaster.intersectObjects(objectsToTest)
        let collisionCheck = false

        intersects.forEach((element: any) => {
            if (element.distance < 5) {
                collisionCheck = true
                this.isCollision = true
                console.log("CC")
            }
        });

        if (collisionCheck == false) {
            this.isCollision = false
        }
    }

    loopCollision() {
        setInterval(() => {
            this.detectCollision()
        }, 1000/6)
    }

    getRaycaster() {
        return this.raycaster

    }


    loop() {
        requestAnimationFrame( this.loop.bind(this) );
        this.updatePosition()
    }

}

export { Car }
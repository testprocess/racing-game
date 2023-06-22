import * as THREE from 'three';

class Car {
    model: any;
    isMove: boolean;
    radian: number;
    force: number;
    velocity: any;

    camera: any

    constructor({ camera }: any) {
        document.addEventListener("onJoystickMove", this.handleJoystickMove.bind(this))
        document.addEventListener("onJoystickStart", this.handleJoystickStart.bind(this))
        document.addEventListener("onJoystickStop", this.handleJoystickStop.bind(this))

        this.camera = camera

        
        this.model = undefined
        this.isMove = false
        this.radian = 0
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
    }

    handleJoystickStart(e: any) {
        this.isMove = true
    }


    getModel() {
        const geometry = new THREE.BoxGeometry( 1, 1, 2 ); 
        const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
        const cube = new THREE.Mesh( geometry, material ); 
        this.model = cube

        this.loop()

        return this.model
    }

    moveModel({ radian, force }: any) {
        const acceleration = 0.01
        const maxForce = 5

        this.radian = radian
        this.force = this.force > maxForce ? this.force : this.force + acceleration

        const vx = Math.cos(radian)
        const vz = Math.sin(radian)

        this.velocity.set(vx, 0, vz)
        //this.velocity.normalize()
    }

    updatePosition() {
        const deacceleration = 0.07

        if (this.isMove == false && this.force > 0) {
            this.force = this.force - deacceleration
            //return 0
        }

        const dt = 1/10
        const xs = this.model.position.x + this.velocity.x * dt * this.force
        const xz = this.model.position.z + this.velocity.z * dt * this.force

        this.model.position.set(xs, 0, xz)
        this.camera.position.set(xs, 6, xz + 4)
        this.camera.rotation.x = Math.PI + 2.40
    }

    loop() {
        requestAnimationFrame( this.loop.bind(this) );
        this.model.rotation.y = -this.radian + Math.PI / 2
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
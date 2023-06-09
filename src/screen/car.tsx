import * as THREE from 'three';

class Car {
    model: any;
    isMove: boolean;
    radian: number;
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
        this.velocity = new THREE.Vector3( 0, 0, 0 )

    }

    handleJoystickMove(e: any) {
        this.moveModel({
            radian: e.detail.radian
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

    moveModel({ radian }: any) {
        this.radian = radian
        const x = Math.cos(radian)
        const z = Math.sin(radian)

        this.velocity.set(x, 0, z)
        this.velocity.normalize()
    }

    updatePosition() {
        const dt = 1/10
        const xs = this.model.position.x + this.velocity.x * dt
        const xz = this.model.position.z + this.velocity.z * dt

        this.model.position.set(xs, 0, xz)
        this.camera.position.set(xs, 6, xz + 4)
        this.camera.rotation.x = Math.PI + 2.40
    }

    loop() {
        requestAnimationFrame( this.loop.bind(this) );

        if (this.isMove == false) {
            this.model.translateZ(0)
        } else {
            this.model.rotation.y = -this.radian + Math.PI / 2
            // this.model.translateZ(-0.1)
            this.updatePosition()
        }
    }

}

export { Car }
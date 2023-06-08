import * as THREE from 'three';

class Car {
    model: any;
    isMove: boolean;
    radian: number;

    constructor() {
        document.addEventListener("onJoystickMove", this.handleJoystickMove.bind(this))
        document.addEventListener("onJoystickStart", this.handleJoystickStart.bind(this))
        document.addEventListener("onJoystickStop", this.handleJoystickStop.bind(this))

        
        this.model = undefined
        this.isMove = false
        this.radian = 0
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
        const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
        const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
        const cube = new THREE.Mesh( geometry, material ); 
        this.model = cube

        this.loop()

        return this.model
    }

    moveModel({ radian }: any) {
        this.radian = radian
    }

    loop() {
        requestAnimationFrame( this.loop.bind(this) );

        if (this.isMove == false) {
            this.model.translateZ(0)
        } else {
            this.model.rotation.y = -this.radian
            this.model.translateZ(-0.1)
        }
    }

}

export { Car }
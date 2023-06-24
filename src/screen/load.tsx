import * as THREE from 'three';

class Load {
    manager: any;

    constructor() {
        this.manager = new THREE.LoadingManager();

        this.manager.onProgress = function ( url: any, itemsLoaded: any, itemsTotal: any ){
            let progress =  (itemsLoaded / itemsTotal * 100) + '%';
            console.log(progress)
            document.querySelector("#loadProg").innerHTML = progress
        };

        this.manager.onLoad = ( ) => {
            document.querySelector("#screen").classList.remove('d-none')

            setTimeout(() => {
                document.querySelector("#load").classList.add('fadeout')

            }, 2000); 

            setTimeout(() => {

                document.querySelector("#load").classList.add('d-none')

            }, 2500);

        
        };

    }



}

export { Load }
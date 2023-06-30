import * as THREE from 'three';
import { ImprovedNoise } from '../jsm/ImprovedNoise.js';


class Terrain {
    constructor() {


    }

    getTerrain() {
        const worldWidth = 512
        const worldDepth = 210

        const data = this.generateHeight( worldWidth, worldDepth );

        const geometry = new THREE.PlaneGeometry( 450, 750, worldWidth - 1, worldDepth - 1 );
        geometry.rotateX( - Math.PI / 2 );

        const texture = new THREE.CanvasTexture( this.generateTexture( data, worldWidth, worldDepth ) );
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.colorSpace = THREE.SRGBColorSpace;

        const positionAttribute = geometry.getAttribute( 'position' );

        let vertices = geometry.attributes.position.array


        let x = 0, y = 0, z = 0;

        console.log(data)


        for ( let i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {

           //verticess[ j + 1 ] = data[ i ] * 10;


            positionAttribute.setY( i, data[ i ] * 10 );

            // x += ( Math.random() - 0.5 ) * 30;
            y += ( Math.random() - 0.5 ) * 3;
            // z += ( Math.random() - 0.5 ) * 30;

        }



        console.log(vertices)

        let mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture } ) );
        //mesh.scale.set(0.1, 0.1, 0.1)
        mesh.position.set(0, 0, 0)

        return mesh
    }

    generateHeight( width: number, height: number ) {

        const size = width * height, data = new Uint8Array( size ),
            perlin = new ImprovedNoise(), z = Math.random() * 100;

        let quality = 0.01;

        for ( let j = 0; j < 4; j ++ ) {

            for ( let i = 0; i < size; i ++ ) {

                const x = i % width, y = ~ ~ ( i / width );
                data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.1 );

            }

            quality *= 5;

        }

        return data;

    }

    generateTexture( data: Uint8Array, width: number, height: number ) {

        // bake lighting into texture

        let context, image, imageData, shade;

        const vector3 = new THREE.Vector3( 0, 0, 0 );

        const sun = new THREE.Vector3( 1, 1, 1 );
        sun.normalize();

        const canvas = document.createElement( 'canvas' );
        canvas.width = width;
        canvas.height = height;

        context = canvas.getContext( '2d' );
        context.fillStyle = '#000';
        context.fillRect( 0, 0, width, height );

        image = context.getImageData( 0, 0, canvas.width, canvas.height );
        imageData = image.data;

        for ( let i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

            vector3.x = data[ j - 2 ] - data[ j + 2 ];
            vector3.y = 2;
            vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
            vector3.normalize();

            shade = vector3.dot( sun );

            imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
            imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
            imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );

        }

        context.putImageData( image, 0, 0 );

        // Scaled 4x

        const canvasScaled = document.createElement( 'canvas' );
        canvasScaled.width = width * 4;
        canvasScaled.height = height * 4;

        context = canvasScaled.getContext( '2d' );
        context.scale( 4, 4 );
        context.drawImage( canvas, 0, 0 );

        image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
        imageData = image.data;

        for ( let i = 0, l = imageData.length; i < l; i += 4 ) {

            const v = ~ ~ ( Math.random() * 5 );

            imageData[ i ] += v;
            imageData[ i + 1 ] += v;
            imageData[ i + 2 ] += v;

        }

        context.putImageData( image, 0, 0 );

        return canvasScaled;

    }
    
}

export { Terrain }
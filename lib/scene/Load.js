import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { USDLoader } from 'three/examples/jsm/loaders/USDLoader.js';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';

export class Load {

    managementSceneData;

    isDownloading=false;

    constructor(managementSceneData) {
        this.managementSceneData = managementSceneData;
    }

    async fileFBX(filePath){ 

        try{

            let fileLoad = new FBXLoader();

            if (this.isDownloading===true){
                throw new Error("the program is already downloading ")
            }

            this.isDownloading=true;

            console.log(fileLoad);

            const fileModel = await fileLoad.loadAsync(filePath);

            console.log("fileModel= ",fileModel);

            /*fileModel.traverse((child) => {

                if (child.isMesh) {
                    console.log(child.name);
                    console.log('material:', child.material[0].color);
                    console.log('map:', Array.isArray(child.material) ? child.material.map(m=>m.map) : child.material.map);

                    child.material = new THREE.MeshStandardMaterial({
                        color: child.material[0].color || new THREE.Color(0xffffff),
                    });
                }

            });*/

            return fileModel

        }
        catch(e){
            console.log(e)
        }
        finally{
            this.isDownloading=false;
        }
    }

    async fileGLTF(newModelPath) {
    
        let GLTFloader = new GLTFLoader();

        try {

            if (this.isDownloading===true){
                throw new Error("the program is already downloading ")
            }

            this.isDownloading=true;

            const gltf = await GLTFloader.loadAsync(newModelPath);


            // DANGER TENERE D'OCCHIO. POTREBBE CREARE PROBLEMI FUTURI
            //gltf.animations.map((animation) => this.animations.push(animation));

            //this.managementSceneData.animations = this.animations;

            //console.log("animations= ",this.animations)
            
            const model=gltf.scene;

            model.traverse((child) => {

                if(child.isGroup){
                    child.filePath = newModelPath;
                }}

            )
            
            return model;

        } catch (error) {
            console.log(error)
        } finally{
            this.isDownloading=false;
        }
    }

    async fileUSDZ(newModelPath){

        let usdzLoader = new USDLoader();
        
    }

    async fileHdri(newHdriPath){

        let hdriLoader = new HDRLoader();

        try {
            
            if (this.isDownloading===true){
                throw new Error("the program is already downloading ")
            }

            this.isDownloading=true;

            const hdri = await hdriLoader.loadAsync(newHdriPath);

            return hdri;

        } catch (error) {
            console.log(error)
        } finally{
            this.isDownloading=false;
        }

    }

    async texture(newModelPath){

        let textureLoader = new THREE.TextureLoader();

        try{
            if (this.isDownloading===true){
                throw new Error("the program is already downloading ")
            }

            this.isDownloading=true;

            const texture = await textureLoader.loadAsync(newModelPath);

            return texture;
        }
        catch (error) {
            console.log(error)
        } finally{
            this.isDownloading=false;
        }

    }

}
import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
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
            fileModel.texturesList = [];

            fileModel.traverse((child) => {

                if (child.isMesh) {
                    console.log('mesh', child.name);
                    console.log('material:', child.material);
                    console.log('texture:', child.material.map);

                    child.material.map(mesh =>{
                        console.log('mesh name:', mesh.name);
                        let s = mesh.name;
                        const prefix = "MI_";

                        if (s.startsWith(prefix)) {
                            const rest = s.slice(prefix.length);
                            console.log("rest:", rest);
                            fileModel.texturesList.push(rest);
                        }

                        
                    });

                    console.log('material:', child.material);

                }

            });

            console.log("fileModel= ",fileModel);


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
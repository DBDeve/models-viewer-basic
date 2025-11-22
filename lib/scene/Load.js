import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';

import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';

// da verificare quelli qui sotto 
import { VRMLLoader } from 'three/examples/jsm/loaders/VRMLLoader.js';
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';
import { AMFLoader } from 'three/examples/jsm/loaders/AMFLoader.js';
import { GCodeLoader } from 'three/examples/jsm/loaders/GCodeLoader.js';
import { XYZLoader } from 'three/examples/jsm/loaders/XYZLoader.js';



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

    async fileOBJ(newModelPath, texturePath){

        let objLoader = new OBJLoader();
        let mtlLoader = new MTLLoader();

        try {
            
            if (this.isDownloading===true){
                throw new Error("the program is already downloading ")
            }

            this.isDownloading=true;

            const material = await mtlLoader.loadAsync(texturePath);
            console.log(material)
            material.preload();
            objLoader.setMaterials(material);

            const obj = await objLoader.loadAsync(newModelPath);

            return obj;

        } catch (error) {
            console.log(error)
        } finally{
            this.isDownloading=false;
        }

    }

    async fileSTL(newModelPath){

        let stlLoader = new STLLoader();

        try {
            
            if (this.isDownloading===true){
                throw new Error("the program is already downloading ")
            }

            this.isDownloading=true;

            const stlGeometry = await stlLoader.loadAsync(newModelPath);

            stlGeometry.computeVertexNormals();
            const material = new THREE.MeshStandardMaterial({ color: 0x888888 });
            const mesh = new THREE.Mesh(stlGeometry, material);

            return mesh;

        } catch (error) {
            console.log(error)
        } finally{
            this.isDownloading=false;
        }

    }

    async filePLY(newModelPath){

        let plyLoader = new PLYLoader();

        try {
            
            if (this.isDownloading===true){
                throw new Error("the program is already downloading ")
            }

            this.isDownloading=true;

            const plyGeometry = await plyLoader.loadAsync(newModelPath);
            plyGeometry.computeVertexNormals();
            const material = new THREE.MeshStandardMaterial({ color: 0x888888 });
            const ply = new THREE.Mesh(plyGeometry, material);

            return ply;

        } catch (error) {
            console.log(error)
        } finally{
            this.isDownloading=false;
        }

    }

    async fileCollada(newModelPath){

        let CLoader = new ColladaLoader();

        try {
            
            if (this.isDownloading===true){
                throw new Error("the program is already downloading")
            }

            this.isDownloading=true;

            const model = await CLoader.loadAsync(newModelPath);

            return model.scene;

        } catch (error) {
            console.log(error)
        } finally{
            this.isDownloading=false;
        }
    }

    // .wrl and .vrml files
    async fileVRML(newModelPath){

        let vrmlLoader = new VRMLLoader();

        try{

            if (this.isDownloading===true){
                throw new Error("the program is already downloading")
            }

            this.isDownloading=true;

            const model = await vrmlLoader.loadAsync(newModelPath);

            return model;

        }
        catch (error) {
            console.log(error)
        }
        finally{
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
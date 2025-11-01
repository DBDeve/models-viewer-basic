import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GLTFExporter } from 'three/examples/jsm/Addons.js';

export class Load {

    managementSceneData;

    isDownloading=false;

    constructor(managementSceneData) {
        this.managementSceneData = managementSceneData;
    }

    async fileFBX(filePath, interactive){ 

        try{

            let fileLoad = new FBXLoader();

            if (this.isDownloading===true){
                throw new Error("the program is already downloading ")
            }

            this.isDownloading=true;

            console.log(fileLoad);

            const fileModel = await fileLoad.loadAsync(filePath);

            console.log("fileModel= ",fileModel);

            fileModel.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                    color: child.material.color || new THREE.Color(0xffffff),
                    });
                }
            });

            if (interactive){
                let modelInteractive = this.makeModelInteractive(fileModel, interactive);
                return modelInteractive;
            } else { 
                return fileModel;
            }
            
        }
        catch(e){
            console.log(e)
        }
        finally{
            this.isDownloading=false;
        }
    }

    async fileGLTF(newModelPath,interactive) {
    
        let GLTFloader = new GLTFLoader();

        try {

            if (this.isDownloading===true){
                throw new Error("the program is already downloading ")
            }

            this.isDownloading=true;

            const gltf = await GLTFloader.loadAsync(newModelPath);

            if(gltf.animations){
                gltf.animations.map((animation) => this.managementSceneData.models.addAnimation(animation));
            }

            // DANGER TENERE D'OCCHIO. POTREBBE CREARE PROBLEMI FUTURI
            //gltf.animations.map((animation) => this.animations.push(animation));

            //this.managementSceneData.animations = this.animations;

            console.log("animations= ",this.animations)
            
            const model=gltf.scene;

            model.traverse((child) => {

                if(child.isGroup){
                    child.filePath = newModelPath;
                }}

            )

            if (interactive){
                let modelInteractive = this.makeModelInteractive(model, interactive);
                return modelInteractive;
            } else {
                return model;
            }

            //creare una gestione per quando non c'è il file interactive
            

        } catch (error) {
            console.log(error)
        } finally{
            this.isDownloading=false;
        }
    }




    makeModelInteractive(model, interactive) {

        model.traverse((child) => {

            if (child.isMesh) {
                
                this.managementSceneData.originalSethMesh.push({name:child.name, color:child.material.color.clone(), texture:child.material.map});
                
                child.castShadow = true;

                console.log("materials= ",child.material);

                child.material = child.material.clone();

                child.originalTexture = child.material.map;

                console.log("valore interattività in #loadModelGLTF= ",interactive);

                if(interactive){

                    child.isInteractive=true;

                    if (window.innerWidth <= 800) {

                        this.#setOrModifieldMeshInteractiveType(child,interactive.mobileType);

                    } else if (window.innerWidth > 800 && window.innerWidth < 1200) {

                        this.#setOrModifieldMeshInteractiveType(child,interactive.tabletType);

                    } else if (window.innerWidth >= 1200) {

                        this.#setOrModifieldMeshInteractiveType(child,interactive.computerType);

                    }
                                                                    
                }

            }

        });

        return model;

    }


    #setOrModifieldMeshInteractiveType(child,interactiveType){

        if (interactiveType==="type1"){
                            
            child.isClicked = false;

            child.onMouseEvent = true;

            child.autoDeselect = true;

            child.onMouseOut = () => {
                if(child.onMouseEvent===true){
                    child.material.emissive.set(0x000000); 
                    child.material.emissiveIntensity = 0;
                }
            }; 

            child.onMouseOver = () => {
                if(child.onMouseEvent===true){
                    child.material.emissive.set(0xffffff); 
                    child.material.emissiveIntensity = 0.2;
                }
                
            };
    
            child.onClick = () => {
                child.isClicked = !child.isClicked;
            
                if (child.isClicked) {
                    
                    child.material.emissive.set(0xffffff);
                    child.material.emissiveIntensity = 0.2;
                    this.managementSceneData.selectedMesh.push(child.name);
                    console.log("selected mesh= ",this.managementSceneData.selectedMesh);
            
                    child.onMouseEvent=false;

                } else {
                    // Quando viene deselezionato, rimuovi la patina
                    child.material.emissive.set(0x000000);
                    child.material.emissiveIntensity = 0;
                    this.managementSceneData.selectedMesh = this.managementSceneData.selectedMesh.filter((mesh) => mesh !== child.name);
                    console.log("selected mesh= ",this.managementSceneData.selectedMesh);
            
                    child.onMouseEvent=true;

                }
            
                console.log("isClicked=", child.isClicked);
            }
        }


        if (interactiveType==="type2"){

            child.isClicked = false;

            child.onMouseEvent = true;

            child.autoDeselect = false;

            child.onMouseOut = () => {
                if(child.onMouseEvent===true){
                    child.material.emissive.set(0x000000);
                    child.material.emissiveIntensity = 0;
                }
            }; 

            child.onMouseOver = () => {
                if(child.onMouseEvent===true){
                    child.material.emissive.set(0xffffff); 
                    child.material.emissiveIntensity = 0.2;
                }
            };

            child.onClick = () => {

                this.managementSceneData.selectedMesh.pop();

                this.managementSceneData.selectedMesh.push(child.name);

                console.log("select mesh=", this.managementSceneData.selectedMesh);

            };

        }


        if(interactiveType==="type3"){

            child.autoDeselect = false;

            child.onClick = () => {

                child.isClicked=true

                this.managementSceneData.selectedMesh.pop();

                child.material.emissive.set(0xffffff);
                child.material.emissiveIntensity = 0.2;

                this.managementSceneData.selectedMesh.push(child.name);

                setTimeout(() => {
                    if (child.isClicked) { 
                        child.material.emissive.set(0x000000);
                        child.material.emissiveIntensity = 0;
                        child.isClicked=false;
                    }
                }, 1000);

            }

        }

    }

    async fileHdri(newHdriPath){

        let hdriLoader = new RGBELoader();

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
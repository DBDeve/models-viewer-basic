import * as THREE from 'three';

import { Load } from './Load.js';

export class ManagementScene {

    scene;
    load;

    constructor() {
        this.scene = new THREE.Scene();
        this.load = new Load(this);
    }

    async setEnvironment(environmentConfig){
        if(environmentConfig){
            let hdri = await this.load.fileHdri(environmentConfig);
            hdri.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.environment = hdri;
        }
    }

    async addModel(modelConfig){
        
        let model;

        if(!modelConfig.filePath){
            throw new Error("filePath not setting")
        }

        const typeFile = modelConfig.filePath.split('.').pop();

        console.log("typeFile=",typeFile);

        if (typeFile==="gltf" | typeFile==="glb"){
            model = await this.load.fileGLTF(modelConfig.filePath);
        }
        else if(typeFile==="fbx"){
            model = await this.load.fileFBX(modelConfig.filePath);
            model.traverse((child) => {
                if (child.isMesh) {
                    console.log(child);
                    child.material= new THREE.MeshStandardMaterial({
                        color: 0x888888
                    })
                }
            })

            console.log("model",model)
            
        }
        else if(typeFile==='obj'){
            model = await this.load.fileOBJ(modelConfig.filePath, modelConfig.texturePath)
            console.log(model)
            // Luce ambientale
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            this.scene.add(ambientLight);

            // Luce direzionale
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(5, 10, 7.5);
            this.scene.add(directionalLight);
        }
        else if(typeFile==='ply'){
            model = await this.load.filePLY(modelConfig.filePath)
        }
        else if(typeFile==='stl'){
            model = await this.load.fileSTL(modelConfig.filePath)
        }
        else if(typeFile==='dae'){
            model = await this.load.fileCollada(modelConfig.filePath)
            model.traverse((child) => {
                if (child.isMesh) {
                    console.log(child);
                    child.material= new THREE.MeshStandardMaterial({
                        color: 0x888888
                    })
                }
            })
            console.log(model)
        }
        else if(typeFile==='wrl' || typeFile==='wrz'){
            model = await this.load.fileVRML(modelConfig.filePath);
            // Luce ambientale
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            this.scene.add(ambientLight);

            // Luce direzionale
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(5, 10, 7.5);
            this.scene.add(directionalLight);

            console.log(model)
        }

        this.scene.add(model);


        return model
    }

}
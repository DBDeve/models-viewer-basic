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
        if(environmentConfig.hdrFilePath){
            let hdri = await this.load.fileHdri(environmentConfig.hdrFilePath);
            hdri.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.environment = hdri;
        }
    }

    async addModel(modelConfig){
        
        let model;

        if (modelConfig.fileType==="glb/gltf"){ 
            model = await this.load.fileGLTF(modelConfig.filePath);
        }
        else if(modelConfig.fileType==="fbx"){
            model = await this.load.fileFBX(modelConfig.filePath, modelConfig.interactive);
        }

        this.scene.add(model);

        return model
    }

}
import * as THREE from 'three';

import { Colors } from './colors.js';
import { Load } from './Load.js';
import { Search } from './Search.js';
import { Models } from './Models.js';
import { Texture } from './Texture.js';
import { Remove } from './Remove.js';
import { Control } from './Control.js';
import { Move } from './Move.js';

export class ManagementScene {

    scene;

    colors
    texture;
    models;
    materials;

    load;
    export;
    reset;
    search;
    remove;
    control;
    move;

    originalSethMesh=[];
    selectedMesh = [];

    constructor() {
        this.scene = new THREE.Scene();
        this.colors = new Colors(this);
        this.texture = new Texture(this);
        this.search = new Search(this.scene);
        this.remove = new Remove(this);
        this.control = new Control(this);
        this.models = new Models(this);
        this.move = new Move(this);
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
            model = await this.load.fileGLTF(modelConfig.filePath, modelConfig.interactive);
        }
        else if(modelConfig.fileType==="fbx"){
            model = await this.load.fileFBX(modelConfig.filePath, modelConfig.interactive);
        }

        this.scene.add(model);

        return model
    }

}
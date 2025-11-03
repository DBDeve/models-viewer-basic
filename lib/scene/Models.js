import * as THREE from 'three';

export class Models {

    scene;
    load;
    search;

    animationsList=[];

    constructor(managementScene) {
        this.scene = managementScene.scene;
        this.load = managementScene.load;
        this.search = managementScene.search;
    }

    async add(newModelPath,interactive){

        try{

            let model = await this.load.fileGLTF(newModelPath,interactive);
        
            this.scene.add(model);

        } catch(e) {

            console.error("Errore durante l'aggiunta del modello:", e);

        }
        
    }

}
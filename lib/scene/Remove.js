import * as THREE from 'three';

export class Remove {

    scene;
    search;

    constructor(managementScene) {
        this.scene = managementScene.scene;
        this.search = managementScene.search;
    }

    /**
     * this method remove more models with the same or different name in the scene.
     * @param {string[]} nameList - the list of name or partial name of the models to remove
     */
    multiModelsWithPartialNameList(nameList){
        
        for(let i=0; i<nameList.length; i++){

            const Model = this.search.getObjectsBypartialName(nameList[i]);

            console.log("model to remove",Model);

            if(Model){

                for(let y=0; y<Model.length; y++){
                    this.scene.remove(Model[y].parent);
                }
                
            }
        }
        
    }

}
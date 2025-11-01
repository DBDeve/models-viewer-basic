import * as THREE from 'three';

export class Control {

    scene;
    search;

    constructor(managementScene) {
        this.scene = managementScene.scene;
        this.search = managementScene.search;
    }

    /**
     * verify if a model with a name is present in the scene and return true.
     * @param {string} nameList - the list of names of the models to check if is present in the scene
     */
    isPresentElementsWithName(nameList){
        
        for(let i=0; i<nameList.length; i++){
            
            const name = nameList[i];
            let found = false; 

            this.scene.traverse((child) => {
                console.log("child",child);
                if (child.name.includes(name)) {
                    console.log("model with name already present in the scene");
                    found = true;
                } 
            });

            if (found) { // Interrompi il ciclo esterno se un elemento è stato trovato
                return true;
            }

        }
    }
    

}
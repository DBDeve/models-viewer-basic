import * as THREE from 'three';

export class Move {

    scene;
    search;

    constructor(managementScene) {
        this.scene = managementScene.scene;
        this.search = managementScene.search;
    }

    /**
     * this method take a model with a name and move it in the position of another model with a name.
     * @param {string} ModelToMoveName - the name of the model to move.
     * @param {string} ModelPositionName - the name of the model with the position data.
     */
    meshByGroupToAnotherModelPosition(ModelToMoveName, ModelPositionName ){

        let targetModel = this.search.getObjectBypartialName(ModelToMoveName);
        let ModelWithPosition = this.search.getObjectBypartialName(ModelPositionName);
        console.log("targert model=",targetModel);

        if(targetModel && ModelWithPosition){
            
            const PositionToMove = new THREE.Vector3();
            const worldScale = new THREE.Vector3();
            const WorldQuaternion = new THREE.Quaternion();

            ModelWithPosition.getWorldPosition(PositionToMove);
            ModelWithPosition.getWorldQuaternion(WorldQuaternion);
            ModelWithPosition.getWorldScale(worldScale);

            targetModel.position.copy(PositionToMove);
            targetModel.quaternion.copy(WorldQuaternion);
            targetModel.scale.copy(worldScale);

            this.scene.add(targetModel);

            console.log(targetModel.position);

        }


        console.log(this.scene);
    } 

}
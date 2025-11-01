import * as THREE from 'three';

export class materials {

    scene;
    load;
    search;
    managementScene;

    constructor(managementScene) {
        this.scene = managementScene.scene;
        this.load = managementScene.load;
        this.search = managementScene.search;
        this.managementScene = managementScene;
    }

    /**
     * this method take all models with a name in the scene and make it transparent
     * @param {string[]} MeshNamelist - the list of name or parzial name of the models to make transparent.
     */
    specificMeshTransparent(MeshNamelist){
        
        let objects = [];

        for (let i=0;i<MeshNamelist.length; i++){
            
            objects = this.search.getObjectsBypartialName(MeshNamelist[i]);
            console.log("objects list=",objects);

            for(let y=0; y<objects.length; y++){
                let object = objects[y];
                if(object){
                    console.log("oggetto reso trasparente");
                    object.material.transparent = true;
                    object.material.opacity = 0; 
                }
            }

        }

    }


    /**
     * this method make all the mesh in scene lucid
     */
    AllLucid(){
        this.scene.traverse((child)=>{
            if(child.isMesh){
                child.material.roughness = 0;
                child.material.metalness = 1;
            }
        })
    }

    specificMeshLucid(MeshNamelist){
        let objects = [];

        for (let i=0;i<MeshNamelist.length; i++){
            objects = this.search.getObjectsBypartialName(MeshNamelist[i]);
            console.log("objects list=",objects);

            for(let y=0; y<objects.length; y++){
                let object = objects[y];
                if(object){
                    console.log("oggetto reso trasparente");
                    object.material.roughness = 0;
                    object.material.metalness = 1;
                }
            }

        }
    }

    selectedMeshLucid(){
        
        let remainingMeshes=[];

        for (let i = 0; i < this.instance.selectedMesh.length; i++){
            
            const Mesh = this.instance.getObjectBypartialName(this.instance.selectedMesh[i])

            if(Mesh){

                Mesh.material.roughness = 0;
                Mesh.material.metalness = 1;

                if (Mesh.autoDeselect===true){

                    Mesh.material.emissive.set(0x000000);
                    Mesh.material.emissiveIntensity = 0;

                    Mesh.isClicked=!Mesh.isClicked;
                    Mesh.onMouseEvent=!Mesh.onMouseEvent;

                } else {
                    // Mantieni l'elemento nel nuovo array
                    remainingMeshes.push(this.instance.selectedMesh[i]);
                }
            
            }

        }

        this.instance.selectedMesh = remainingMeshes; // Aggiorna l'array selectedMesh con gli elementi rimanenti
    
    }


    /**
     * this method make all the mesh in scene opaque
     */
    AllOpaque(){
        this.scene.traverse((child)=>{
            if(child.isMesh){ 
                child.material.roughness = 1;
                child.material.metalness = 0;
            }
        })
    }


    specificMeshOpaque(MeshNamelist){
        let objects = [];

        for (let i=0;i<MeshNamelist.length; i++){
            objects = this.search.getObjectsBypartialName(MeshNamelist[i]);
            console.log("objects list=",objects);

            for(let y=0; y<objects.length; y++){
                let object = objects[y];
                if(object){
                    console.log("oggetto reso opeco");
                    object.material.roughness = 1;
                    object.material.metalness = 0;
                }
            }

        }
    }

    selectedMeshOpaque(){
        let remainingMeshes=[];

        for (let i = 0; i < this.instance.selectedMesh.length; i++){

            
            const Mesh = this.instance.getObjectBypartialName(this.instance.selectedMesh[i])

            if(Mesh){

                Mesh.material.roughness = 1;
                Mesh.material.metalness = 0;

                if (Mesh.autoDeselect===true){

                    Mesh.material.emissive.set(0x000000);
                    Mesh.material.emissiveIntensity = 0;

                    Mesh.isClicked=!Mesh.isClicked;
                    Mesh.onMouseEvent=!Mesh.onMouseEvent;

                } else {
                    // Mantieni l'elemento nel nuovo array
                    remainingMeshes.push(this.instance.selectedMesh[i]);
                }
            
            }

        }

        this.instance.selectedMesh = remainingMeshes; // Aggiorna l'array selectedMesh con gli elementi rimanenti
    
    }


}
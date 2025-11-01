import * as THREE from 'three';

export class Search {

    scene;

    constructor(managementScene) {
        this.scene = managementScene;
    }

    ///////////////////////////////// search for exact name /////////////////////////////////
    
        getObjectByExactName(name){
    
            let object = null;
    
            this.scene.traverse((child) => {
                if (child.name === name) { 
                    object.push(child);
                }
            });
            
            return object;
    
        }
    
        getObjectsByExactName(name){
    
            let objects = [];
    
            this.scene.traverse((child) => {
                if (child.name === name) { 
                    objects.push(child);
                }
            });
            
            return objects;
    
        }
    
        getGroupByExactName(name){
            let group = null;
    
            this.scene.traverse((child) => {
                if (child.isGroup && child.name === name) { 
                    group = child;
                }
            });
            
            return group;
    
        }
    
        getGroupsByExactName(name){
            let groups = [];
    
            this.scene.traverse((child) => {
                if (child.isGroup && child.name === name) { 
                    groups.push(child);
                }
            });
            
            return groups;
    
        }
    
        getMeshByExactName(name){
            let mesh = null;
    
            this.scene.traverse((child) => {
                if (child.isMesh && child.name === name) { 
                    mesh = child;
                }
            });
            
            return mesh;
    
        }
    
        getMeshesByExactName(name){
            let meshes = [];
    
            this.scene.traverse((child) => {
                if (child.isMesh && child.name === name) { 
                    meshes.push(child);
                }
            });
            
            return meshes;
    
        }
    
    
        ///////////////////////////////// search for partial name /////////////////////////////////
    
        getObjectBypartialName(partialName){
    
            let object = null;
    
            this.scene.traverse((child) => {
                //console.log("scena durante la ricerca", this.scene)
                if (child.name.includes(partialName)) { 
                  //console.log('Oggetto trovato:', child);
                  object = child;
                }
            });
            
            return object;
    
        }
    
        getObjectsBypartialName(partialName){
            let objects = [];
    
            console.log("scena durante la ricerca", this.scene)
            this.scene.traverse((child) => {
                if (child.name.includes(partialName)) { 
                  //console.log('Oggetto trovato:', child);
                  objects.push(child);
                }
            });
            
            return objects;
        }
    
        getGroupBypartialName(partialName){
    
            let group = null;
    
            this.scene.traverse((child) => {
                //console.log("scena durante la ricerca", this.scene)
                if (child.isGroup && child.name.includes(partialName)) { 
                  //console.log('Oggetto trovato:', child);
                  group = child;
                }
            });
            
            return group;
    
        }
    
        getGroupsBypartialName(partialName){
    
            let groups = [];
    
            this.scene.traverse((child) => {
                //console.log("scena durante la ricerca", this.scene)
                if (child.isGroup && child.name.includes(partialName)) { 
                  //console.log('Oggetto trovato:', child);
                  groups.push(child);
                }
            });
            
            return groups;
    
        }
    
        getMeshBypartialName(partialName){
            let mesh = null;
    
            this.scene.traverse((child) => {
                //console.log("scena durante la ricerca", this.scene)
                if (child.isMesh && child.name.includes(partialName)) { 
                  //console.log('Oggetto trovato:', child);
                  mesh = child;
                }
            });
            
            return mesh;
    
        }
    
        getMeshesBypartialName(partialName){
            let meshes = [];
    
            this.scene.traverse((child) => {
                //console.log("scena durante la ricerca", this.scene)
                if (child.isMesh && child.name.includes(partialName)) { 
                  //console.log('Oggetto trovato:', child);
                  meshes.push(child);
                }
            });
            
            return meshes;
    
        }
    
    
        
        ///////////////////////////////// search for world position /////////////////////////////////
    
        getObjectByWorldPosition(worldPosition){
    
            let object = null;
    
            this.scene.traverse((child) => {
                if (child) {
                    let childWorldPosition = new THREE.Vector3();
                    child.getWorldPosition(childWorldPosition);
    
                    if (childWorldPosition.equals(worldPosition)) {
                        object= child;
                    }
                }
            });
    
            return object;
    
        }
    
        getGroupByWorldPosition(worldPosition){
    
            let group=null;
    
            this.scene.traverse((child) =>{
                if (child.isGroup){
                    let childWorldPosition= new THREE.Vector3();
                    child.getWorldPosition(childWorldPosition);
    
                    if(childWorldPosition.equals(worldPosition)){
                        group = child;
                    }
                }
            })
    
            return group;
    
        }
    
        getMeshByWorldPosition(worldPosition){
    
            let mesh=null;
    
            this.scene.traverse((child) =>{
                if (child.isMesh){
                    let childWorldPosition= new THREE.Vector3();
                    child.getWorldPosition(childWorldPosition);
    
                    if(childWorldPosition.equals(worldPosition)){
                        mesh = child;
                    }
                }
            })
    
            return mesh;
    
        }

}
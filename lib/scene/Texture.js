import * as THREE from 'three';
//import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';


export class Texture {
    
    scene;
    load;
    search;
    managementScene;

    constructor(managementScene) {
        this.scene = managementScene.scene;
        this.load = managementScene.load;
        this.search = managementScene.search;
        //questo valore sotto non si aggiorna quando premo. capire perché
        this.managementScene = managementScene;

    }

    async AddOrReplaceToSelectedMeshes(texturePath){

        let selectedMesh = this.managementScene.getSelectedMesh();

        try{

            let remainingMeshes=[];

            const newTexture = await this.load.texture(texturePath);
            
            for (let i = 0; i < selectedMesh.length; i++){
                
                const Mesh = this.search.getObjectBypartialName(selectedMesh[i])

                if(Mesh){

                    //newTexture.colorSpace = THREE.NoColorSpace;

                    //Mesh.material.color = 0xffffff;
                    Mesh.material.map = newTexture;
                    //Mesh.material.transparent= true;

                    if (Mesh.autoDeselect===true){

                        Mesh.material.emissive.set(0x000000);
                        Mesh.material.emissiveIntensity = 0;

                        Mesh.isClicked=!Mesh.isClicked;
                        Mesh.onMouseEvent=!Mesh.onMouseEvent;

                    } else {

                        remainingMeshes.push(selectedMesh[i]);

                    }
                
                }

            };

            this.managementScene.setSelectedMesh(remainingMeshes);

        }
        catch(e) {
            console.error("Errore durante il movimento della camera:", e);
        }
    
    } 


    async changeToSpecificMeshList(texturePath,meshNameList){

        const newTexture = await this.load.texture(texturePath);

        for (let i = 0; i < meshNameList.length; i++){

            const Mesh = this.search.getObjectBypartialName(selectedMesh[i]);

            if(Mesh){

                console.log("Mesh trovato:", Mesh);

                console.log("Mesh trovato:", Mesh);
                console.log("map della mesh:", Mesh.material.map);
                Mesh.material.map = newTexture;
                Mesh.material.map.flipY = false;

                console.log("nuovo map della mesh:", Mesh.material.map);

            }

        }

    }


    async changeToSpecificMaterials(texturePath,materialNameList){

        const newTexture = await this.load.texture(texturePath);

        for (let i = 0; i < materialNameList.length; i++){

            const materials = this.search.getMeshByExactName(materialNameList[i]);
            console.log("materialsssss", materials);

            if(materials.length>0){

                for (let y = 0; y < materials.length; y++){
                    materials[y].map = newTexture;
                }
                
            }
        }

    }


    async ChangeSpecificMeshMap(texturePath,MeshNamelist,mapType,nameType){
    
        let objects = [];

        const newTexture = await this.textureLoader.loadAsync(texturePath);
    
        for (let i=0;i<MeshNamelist.length; i++){

            if(nameType=="partial"){

                objects = this.instance.getObjectsBypartialName(MeshNamelist[i]);

            } else if(nameType=="exact"){

                objects = this.instance.getObjectByExactName(MeshNamelist[i]);

            }
        
            console.log("objects list=",objects);

            for(let y=0; y<objects.length; y++){

                const Mesh = objects[y];

                if(Mesh){

                    if(mapType=="map"){

                        newTexture.colorSpace = THREE.SRGBColorSpace;

                        Mesh.material.map = newTexture;
                        Mesh.material.map.flipY = false;
                        Mesh.material.needsUpdate = true;

                    } 
                    else if(mapType=="emissiveMap"){

                        newTexture.colorSpace = THREE.SRGBColorSpace;

                        Mesh.material.emissiveMap = newTexture;
                        Mesh.material.emissiveMap.flipY = false;
                        Mesh.material.needsUpdate = true;
                    }
                    else if(mapType=="environmentMap"){
                        newTexture.colorSpace = THREE.SRGBColorSpace;

                        Mesh.material.envMap = newTexture;
                        Mesh.material.envMap.flipY = false;
                        Mesh.material.needsUpdate = true;
                    }
                    else if(mapType=="normalMap"){

                        newTexture.colorSpace = THREE.NoColorSpace;

                        Mesh.material.normalMap = newTexture;
                        Mesh.material.normalMap.flipY = false;
                        Mesh.material.needsUpdate = true;

                    }
                    else if(mapType=="roughnessMap"){

                        newTexture.colorSpace = THREE.NoColorSpace;

                        Mesh.material.roughnessMap = newTexture;
                        Mesh.material.roughnessMap.flipY = false;
                        Mesh.material.needsUpdate = true;

                    }
                    else if(mapType=="metalnessMap"){
                        newTexture.colorSpace = THREE.NoColorSpace;

                        Mesh.material.metalnessMap = newTexture;
                        Mesh.material.metalnessMap.flipY = false;
                        Mesh.material.needsUpdate = true;
                    }
                    else if(mapType=="aoMap"){
                        newTexture.colorSpace = THREE.NoColorSpace;

                        Mesh.material.aoMap = newTexture;
                        Mesh.material.aoMap.flipY = false;
                        Mesh.material.needsUpdate = true;
                    }
                    else if(mapType=="displacementMap"){
                        newTexture.colorSpace = THREE.NoColorSpace;

                        Mesh.material.displacementMap = newTexture;
                        Mesh.material.displacementMap.flipY = false;
                        Mesh.material.needsUpdate = true;
                    }
                    else if(mapType=="alphaMap"){
                        newTexture.colorSpace = THREE.NoColorSpace;

                        Mesh.material.alphaMap = newTexture;
                        Mesh.material.alphaMap.flipY = false;
                        Mesh.material.needsUpdate = true;
                    }

                }
            }

        }
        console.log("scene=",this.instance.scene);
    }



}
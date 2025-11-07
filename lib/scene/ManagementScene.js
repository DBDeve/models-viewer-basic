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

        const typeFile = modelConfig.filePath.split('.').pop();

        console.log("typeFile=",typeFile);

        if (typeFile==="gltf" | typeFile==="glb"){
            model = await this.load.fileGLTF(modelConfig.filePath);
        }
        else if(typeFile==="fbx"){
            model = await this.load.fileFBX(modelConfig.filePath);
            model.traverse((child) => {
                if (child.isMesh) {
                    child.material= new THREE.MeshStandardMaterial({
                        color: 0xdddddd
                    })
                }
            })


            /*for (let texture of model.texturesList){
                const diffuseTexture = await this.load.texture(`doom/doom/T_${texture}_D.png`);
                console.log("D",diffuseTexture)
                const normalTexture = await this.load.texture(`doom/doom/T_${texture}_N.png`);
                const specularTexture = await this.load.texture(`doom/doom/T_${texture}_S.png`);
                const emissiveTexture = await this.load.texture(`doom/doom/T_${texture}_E.png`);
                const ambientOcclusionTexture = await this.load.texture(`doom/doom/T_${texture}_AO.png`);
                const roughnessTexture = await this.load.texture(`doom/doom/T_${texture}_R.png`);
                const ornTexture = await this.load.texture(`doom/doom/T_${texture}_ORN.png`);


                model.traverse((child) => {
                    if (child.isMesh){
                        for(let mesh of child.material){
                            console.log('mesh',mesh)

                            if (mesh.name===`MI_${texture}`){
                                console.log("trovata texture",texture)

                                if (diffuseTexture){
                                    mesh.map = diffuseTexture;
                                }

                                if (normalTexture){
                                    mesh.normalMap = normalTexture;
                                }

                                if (specularTexture){
                                    mesh.specularMap = specularTexture;
                                }

                                if (emissiveTexture){
                                    mesh.emissiveMap = emissiveTexture;
                                }

                                if (ambientOcclusionTexture){
                                    mesh.aoMap = ambientOcclusionTexture;
                                }
                                
                                if (roughnessTexture){
                                    mesh.roughnessMap = roughnessTexture;
                                }

                                if (ornTexture){
                                    mesh.ornMap = ornTexture;
                                }
                            }

                        }

                    }
                })

                //console.log("texture=",fileTexture);
            }*/

            console.log("model",model)
            
        }

        this.scene.add(model);

        // luce ambiente per illuminazione uniforme
        const ambient = new THREE.AmbientLight(0xffffff, 1); // colore, intensità
        this.scene.add(ambient);

        // luce direzionale per ombre e definizione
        const dir = new THREE.DirectionalLight(0xffffff, 0.8);
        dir.position.set(5, 10, 7);       // posizione
        dir.castShadow = true;            // attiva ombre (se hai renderer.shadowMap abilitato)
        dir.shadow.mapSize.set(2048, 2048);
        dir.shadow.camera.near = 0.5;
        dir.shadow.camera.far = 50;
        this.scene.add(dir);

        return model
    }

}
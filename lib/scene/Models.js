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

    async addAndRemoveByName(newModelPath,removeName,interactive){
            
        try{
            if (removeName.length>0){
                for (let i=0; i<removeName.length; i++){
                    let Mesh = this.search.getObjectBypartialName(removeName[i]);
                    
                    if (Mesh){
                        this.scene.remove(Mesh.parent);
                    }
                }
            }
            
            let model = await this.load.fileGLTF(newModelPath,interactive);
        
            this.scene.add(model)

        } catch(e) {

            console.error("Errore durante l'aggiunta del modello:", e);

        }
    }

    /** 
     * this method insert a model in one or more specific position of other models in the scene.
     * you can use this method to insert the same model in the position of other different models in the scene. 
     * when you reinsert the model the previous models are removed.
     * @param {string} newModelPath  -the path of the model to insert in the scene
     * @param {string[]} objectNameList - the list of the object names where to insert the model
     * @param {{computerType:string, tabletType:string, mobileType:string}} interactive -in this value you must define the interactivity of the model.
     * @param {string[]} removeExceptionList - the list of the object names to don't remove from the scene when the new model is inserted
     */
    async addOrReplaceModelTo(newModelPath,objectNameList,interactive,removeExceptionList) {

        //console.log("path model=",newModelPath)
        //console.log("objectNameList=",objectNameList)
        
        for(let i=0; i<objectNameList.length; i++){

            //console.log("scena attuale alla funzione=",this.scene);
            //console.log("objectName=",objectNameList[i]);
            //console.log("figli scena all'inizio ", this.scene.children);

            let Mesh = this.search.getObjectBypartialName(objectNameList[i]);
            //console.log("mesh=",Mesh);
            
            if (Mesh){

                const globalPosition1 = new THREE.Vector3();
                Mesh.getWorldPosition(globalPosition1);

                let group = this.search.getMeshesByWorldPosition(globalPosition1); 
                //console.log("gruppi già presente trovato= ", group);

                if (group.length>0){

                    //console.log("uno o più gruppo trovati")

                    for(let z=0; z<group.length; z++){

                        //console.log("gruppo trovato= ", group[z]);

                        //console.log("chid già presente trovato= ", group[z].name);

                        if (removeExceptionList){

                            for(let y=0; y<removeExceptionList.length; y++){

                                if(group[z].name.includes(removeExceptionList[y])){
                                    
                                } else {
                                    this.scene.remove(group[z].parent);
                                }
    
                            }

                        } else {

                            this.scene.remove(group[z].parent);

                        }

                    }

                }

                //console.log("position mesh",Mesh.position)

                //console.log("interattività modello scaricato",interactive);
                let model= await this.load.fileGLTF(newModelPath,interactive)
                
                const globalPosition2 = new THREE.Vector3();
                const globalQuaternion2 = new THREE.Quaternion();
                const globalScale2 = new THREE.Vector3();

                Mesh.getWorldPosition(globalPosition2);
                Mesh.getWorldQuaternion(globalQuaternion2);
                Mesh.getWorldScale(globalScale2);

                model.children[0].position.copy(globalPosition2);
                model.children[0].quaternion.copy(globalQuaternion2);
                model.children[0].scale.copy(globalScale2);

                model.updateMatrixWorld(true);
                //console.log("mesh scale",Mesh.scale);
                //console.log("scene",this.scene);
                //console.log("model data",model);

                this.scene.add(model);
                    
            }
            
        }

    }


    /**
     * this code replace a model in the scene with another model with the position, quaternion and scale update.
     * @param {string} replaceobjectName 
     * @param {string} objectName 
     * @param {{computerType:string, tabletType:string, mobileType:string}} interactive -in this value you must define the interactivity of the model.
     */
    async verifyAndReplaceModelTo(replaceobjectNameList,objectName,interactive=true,byPartialName=true){

        for(let i=0; i<replaceobjectNameList.length; i++){

            let replaceObject;
            let objectPositionData;

            //console.log("array element",i ,replaceobjectNameList[i])

            if (byPartialName===true){
                replaceObject = this.search.getObjectBypartialName(replaceobjectNameList[i]);
                objectPositionData = this.search.getObjectBypartialName(objectName);
            } else {
                replaceObject = this.search.getObjectByName(replaceobjectNameList[i]);
                objectPositionData = this.search.getObjectByName(objectName);
            }
            
            const globalPosition = new THREE.Vector3();
            const globalScale = new THREE.Vector3();
            const globalQuaternion = new THREE.Quaternion();

            //console.log("objectPositionData = ",objectPositionData)

            if (objectPositionData){
                objectPositionData.getWorldPosition(globalPosition);
                objectPositionData.getWorldScale(globalScale);
                objectPositionData.getWorldQuaternion(globalQuaternion);
            }
            
            
            if(replaceObject && objectPositionData){
                let replace = replaceObject.parent
                this.scene.remove(replace);

                let model= await this.load.fileGLTF(replace.filePath,interactive)

                model.children[0].position.copy(globalPosition);
                model.children[0].quaternion.copy(globalQuaternion);
                //console.log(objectPositionData.scale.multiplyScalar(0.1))
                //console.log(globalScale)
                model.children[0].scale.copy(globalScale);
                
                this.scene.add(model)

            }

        }

    }


    /**
     * this method insert a model in the bot of the bounding box created by a one or different object in the scene. 
     * the method can find diferent model with the same name of the list and insert the new model in the position of every.
     * @param {string} objectPath - the path of the model to insert in the scene.
     * @param {string[]} objectNameList - the list of the object names where to insert the model.
     * @param {{computerType:string, tabletType:string, mobileType:string}} interactive -in this value you must define the interactivity of the model.
     */
    async addToMultiBoxPosition(objectPath,objectNameList,interactive){
        for (let i=0; i<objectNameList.length; i++){

            let objects=[];
        
            objects = this.search.getObjectsBypartialName(objectNameList[i]);

            for (let y=0; y<objects.length; y++){
                let r = objects[y];
                const box = new THREE.Box3().setFromObject(r);
            
                const center = new THREE.Vector3();
                box.getCenter(center);

                let position = new THREE.Vector3(center.x, box.min.y, center.z);
                console.log("research position",position);

                let pModel = this.search.getGroupByWorldPosition(position);
                if (pModel){
                    //console.log("modello già presente trovato= ", pModel);
                    this.scene.remove(pModel);
                }

                let model = await this.load.fileGLTF(objectPath,interactive);

                model.scale.y=0;
                model.position.set(center.x, box.min.y, center.z);
                this.scene.add(model)

            }

        }

    }


    /**
     * this method upload a group with many mesh and place every mesh in another group and insert that group in the scene.
     * @param {string} objectPath 
     * @param {[{ nameModel:string, namePosition:string }]} objectTakeAndInsertList -this array object contains the information about what mesh take by upload group and where insert
     * @param {{computerType:string, tabletType:string, mobileType:string}} interactive -in this value you must define the interactivity of the model.
     */
    async addOrReplaceMultiModels(objectPath,objectTakeAndInsertList,interactive){
        await this.load.fileGLTF(objectPath,interactive)
        .then(
            model =>{
                console.log(model);

                let childrenCopy = [...model.children]

                for (let i=0; i < childrenCopy.length; i++){

                    console.log(`Iterazione: ${i}, Elemento:`, childrenCopy[i].name);

                    for(let y=0; y<objectTakeAndInsertList.length; y++){

                        if (childrenCopy[i].name.includes(objectTakeAndInsertList[y].nameModel)){

                            let PostionObject = this.search.getObjectBypartialName(objectTakeAndInsertList[y].namePosition);

                            const globalPosition = new THREE.Vector3();
                            const globalQuaternion = new THREE.Quaternion();
                            const worldScale = new THREE.Vector3();

                            PostionObject.getWorldPosition(globalPosition);
                            PostionObject.getWorldQuaternion(globalQuaternion);
                            PostionObject.getWorldScale(worldScale);
                            
                            let element = this.search.getObjectByWorldPosition(globalPosition);
                            if (element){
                                this.scene.remove(element.parent);
                            }
                            const contentMesh = new THREE.Group();
                            contentMesh.add(childrenCopy[i]);

                            childrenCopy[i].position.copy(globalPosition);
                            childrenCopy[i].quaternion.copy(globalQuaternion);
                            childrenCopy[i].scale.copy(worldScale);
                            
                            this.scene.add(contentMesh);

                        }

                    }
                    
                }

            }
        )
        .catch( error => {console.error('Errore durante l\'inizializzazione della scena:', error)} )
    }



///////////////////////////// MODEL ANIMATION ///////////////////////////////////////////

    addAnimation(animation){
        this.animationsList.push(animation)
    }


    playSpecificAnimation(animationName, stopAtLastFrame=false, reverseAnimation=false) {
    
        console.log("Animazioni disponibili:", this.animationsList);

        if (this.animationsList.length === 0) {
            console.error("Nessuna animazione trovata nel modello");
            return;
        }

        for (let i = 0; i < this.animationsList.length; i++) {
            console.log("animazionsList", this.animationsList);
            console.log("animazione", this.animationsList[0].name);
            console.log("for avviato")
            if (this.animationsList[i].name === animationName) {
                console.log("animazione trovata")

                const action = this.mixer.clipAction(this.animationsList[i]);

                if (stopAtLastFrame) {
                    console.log("stopAtLastFrame attivo")
                    action.loop = THREE.LoopOnce;
                    action.clampWhenFinished = true;
                }

                if (reverseAnimation) {
                    console.log("reverseAnimation attivo")
                    action.timeScale = -1; 
                } else {
                    action.timeScale = 1; 
                }

                if (action.paused===true) {
                    action.paused = false;

                    console.log("Animazione ripresa:", animationName);
                }

                if (action.isRunning()===false) {
                    action.play();
                    console.log("action",action);
                    console.log("Animazione avviata:", animationName);
                    this.animate();
                }

                return;

            }
        }

    }


}
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

import { ManagementScene } from './scene/ManagementScene.js';
import { ManagementRenderer } from './renderer/ManagementRenderer.js';
import { ManagementCamera } from './camera/ManagementCamera.js';

//cambiare nome in compiled 3d

/**
 * this class create a 3D model with the possibility to change the color and the texture of the mesh
 * @class
 * @property {THREE.Scene} scene - the 3D scene
 * @property {THREE.PerspectiveCamera} camera - the 3D camera
 * @property {THREE.WebGLRenderer} renderer - the 3D renderer
 * @property {GLTFLoader} loader - the loader of the 3D model
 * @property {OrbitControls} controls - the controls of the camera
 * 
 * @property {String[]} selectedMesh 
 * @property {THREE.Mesh[]} meshList - the list of the mesh
 */
export class viewer {
    
    config;
    managementScene;
    ManagementRenderer;
    ManagementCamera;
    
    //reset property
    originalBackgroundOpacity;
    originalBackgroundColor;
    originalcameraPosition;
    originalOrbitTarget;
    originalPivot;


    /**
     * create a instance of the model3D class
     * @constructor
     * @param {String} hdrFilePath
     * @param {object} controls
     */
    constructor() {

        //create the scene
        this.managementScene = new ManagementScene();
        this.ManagementCamera = new ManagementCamera();
        this.ManagementRenderer = new ManagementRenderer(this.managementScene.scene, this.ManagementCamera.camera);

        //set render 
        this.ManagementRenderer.renderer.setPixelRatio(window.devicePixelRatio);
        this.ManagementRenderer.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.ManagementRenderer.renderer.toneMappingExposure = 1.5;
        this.originalBackgroundColor = 0xffffff;
        this.originalBackgroundOpacity = 1;
        this.ManagementRenderer.renderer.setClearColor(this.originalBackgroundColor , this.originalBackgroundOpacity);
        this.ManagementRenderer.renderer.setSize(window.innerWidth, window.innerHeight);


        //document.body.appendChild(this.renderer.domElement);
        

        //add event at the model 
        this.onMouseClick = this.onMouseClick.bind(this);
        this.ManagementRenderer.renderer.domElement.addEventListener('click', this.onMouseClick);

        this.onMouseOver = this.onMouseOver.bind(this);
        this.ManagementRenderer.renderer.domElement.addEventListener('mousemove', this.onMouseOver);

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);

        /*const shadowCameraHelper = new THREE.CameraHelper(frontDirectionalLight.shadow.camera);
        this.scene.add(shadowCameraHelper);*/
        
    }

    previousMesh;
    onMouseOver(event) {

        //console.log("selected mesh= ",this.selectedMesh);

        let raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();
        
        // Ottieni l'elemento canvas
        const canvas = this.ManagementRenderer.renderer.domElement;

        // Converti le coordinate del mouse in base alle dimensioni del canvas
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, this.ManagementCamera.camera);

        let intersects = raycaster.intersectObjects(this.managementScene.scene.children, true);
        //console.log("scene children= ",this.scene.children);
        //console.log("intersected objects onmuoserover:", intersects);

        if (intersects.length > 0) {
            const selectedMesh = intersects[0].object;
            //console.log("selectedMesh=",selectedMesh);
    
            if (this.previousMesh !== selectedMesh) {
                if (this.previousMesh && this.previousMesh.onMouseOut) {
                    this.previousMesh.onMouseOut();
                }
                if (selectedMesh.onMouseOver) {
                    selectedMesh.onMouseOver();
                }
                this.previousMesh = selectedMesh;
            }
        } else {
            if (this.previousMesh && this.previousMesh.onMouseOut) {
                this.previousMesh.onMouseOut();
            }
            this.previousMesh = null;
        }
        

    }

    onMouseClick(event) {
        let raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();
        
        // Ottieni l'elemento canvas
        const canvas = this.ManagementRenderer.renderer.domElement;
    
        // Converti le coordinate del mouse in base alle dimensioni del canvas
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        //console.log("mouse coordinates:", mouse.x, mouse.y);
        
        // Aggiorna il raycaster
        raycaster.setFromCamera(mouse, this.ManagementCamera.camera);
        
        // Calcola le intersezioni
        var intersects = raycaster.intersectObjects(this.managementScene.scene.children, true);
        //console.log("intersected objects onclick:", intersects);
        
        if (intersects.length > 0) {
            const selectedObject = intersects[0].object;
            console.log("selected",selectedObject);
            if(selectedObject.onClick){
                selectedObject.onClick();
            }
            
        }

        //console.log("selectedMesh",this.managementScene.selectedMesh);
        //console.log("originalSethMesh",this.managementScene.originalSethMesh);
    }
    
    animate() {
        requestAnimationFrame(this.animate);
        if(this.ManagementCamera.controls){
            this.ManagementCamera.controls.update();
        }
        this.ManagementRenderer.renderer.render(this.managementScene.scene, this.ManagementCamera.camera);
        this.ManagementRenderer.renderer.outputEncoding = THREE.sRGBEncoding;
        //this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        //this.effectComposer.render();
    }

    /**
     * this static function allow the creation of a instance of model3D class
     * @param {string} modelPath 
     * @param {{ 
     *    scene:{
     *        environment:{hdrFilePath:string|undefined},
     *        model?:{fileType:string, filePath:string, interactive?:{computerType:string, tabletType:string, mobileType:string}}
     *    },
     *    renderer:{
     *         canvas?:{
        *         insertIn?:string,
        *         addHtml?:{
        *              idTag: string,
        *              position: string,
        *              customStyle?:{mobile:{value:string}, tablet:{value:string}, computer:{value:string}}
        *         },
     *        }
     *        RenderSize:{
     *             mobile:{width:number, height:number},
     *             tablet:{width:number, height:number},
     *             computer:{width:number, height:number}
     *         }
     *    },
     *    camera:{
     *       basic:{
     *            angle:{x:number,y:number,z:number},
     *            distance:{initial:number, max:number, min:number},
     *            position:{x:number,y:number,z:number}
     *       },
     *       controls?:{
     *           zoom?:boolean,
     *           rotate?:{vertical?:{min:number,max:number}, horizontal?:{min:number,max:number}},
     *           pan?:boolean,
     *           effect?:{
     *              damping?:{factor:number}
     *           },
     *       }
     *    }
     * }} config
     * @returns 
     */
    static async createInstance(config){

        let model = new viewer();

        try {

            model.config=config

            if (config.shadow){

                console.log("impostazione shadow trovata")
                if (config.shadow.enable){
                    console.log("codice cambio valore ombre eseguito")
                    model.ManagementRenderer.renderer.shadowMap.enabled=config.shadow.enable
                }

                if(config.shadow.type==="PCFSoftShadow"){
                    model.ManagementRenderer.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                }
                else if(config.shadow.type==="BasicShadow"){
                    model.ManagementRenderer.renderer.shadowMap.type = THREE.BasicShadowMap;
                }
                else if(config.shadow.type==="PCFShadow"){
                    model.ManagementRenderer.renderer.shadowMap.type = THREE.PCFShadowMap;
                }
                else if(config.shadow.type==="VSMShadow"){
                    model.ManagementRenderer.renderer.shadowMap.type = THREE.VSMShadowMap;
                }

            }



            // il codice funziona sia che il idTags abbia un valore stringa che valore null. se il valore è null il canvas viene posizionato nel body

            // in questa posizione c'è l'inserimento del secondo. il canvas viene inserito dopo.

            model.ManagementRenderer.setCanvas(config.renderer.canvas);

            model.ManagementRenderer.setSize(config.renderer.RenderSize);

            model.ManagementCamera.setControls(config.camera.controls, model.ManagementRenderer.renderer.domElement);

            await model.managementScene.setEnvironment(config.scene.environment);

            if(config.scene.model){
                
                model.ManagementRenderer.animations.isDownloadingFirstModel=true;

                model.ManagementRenderer.animations.loadingFirstModelAnimation();

                /// PROVARE A PRENDERE LE ANIMAZIONI DA QUI.
                let m = await model.managementScene.addModel(config.scene.model);

                if(!m){
                    throw new Error("modello non trovato")
                }

                const box = new THREE.Box3().setFromObject(m);
                const boxCenter = new THREE.Vector3();
                box.getCenter(boxCenter); 


                /*
                console.log(box);
                const boxHelper = new THREE.Box3Helper(box, 0xffff00); 
                this.scene.add(boxHelper);
                */


                boxCenter.multiply(m.scale);
                
                //console.log("model position initial",this.originalModelPosition);

                //trova la distanza più grande tra l'altezza, la larghezza e la profondità del bounding box
                const size = box.getSize(new THREE.Vector3());
                let distance = Math.max(size.x, size.y, size.z);

                model.ManagementCamera.setCamera(config.camera.basic, distance);

                model.ManagementCamera.controls.addEventListener("change", () => {
                    //se il box non contiene il target dei controlli
                    if (!box.containsPoint(model.ManagementCamera.controls.target)) {
                        model.ManagementCamera.controls.target.clamp(box.min, box.max);
                    }
                });

                model.ManagementCamera.controls.target.copy(boxCenter); 
                model.ManagementCamera.camera.lookAt(boxCenter);

                //console.log("original orbitals target",this.controls.target)

                model.originalcameraPosition=model.ManagementCamera.camera.position.clone();
                model.originalOrbitTarget=model.ManagementCamera.controls.target.clone();


                model.ManagementRenderer.animations.isDownloadingFirstModel=false;
            } else {
                model.noModelMessage(config.scene.noModelMessage)
                //model.setDragDrop()
            }


        }
        catch (error) {
            model.ManagementRenderer.animations.errorDownloadingFirstModel=true;
            model.ManagementRenderer.animations.errorDownloadingFirstModelMessage=error.message;
            console.error("Errore durante la creazione dell'istanza:", error);
            throw error; // Rilancia l'errore per gestirlo a livello superiore
        }
        finally{
            model.ManagementRenderer.animations.isDownloadingFirstModel=false;
        }

        return model;
    }



    //////////////////////////////// texture methods ///////////////////////////////////
    /**
     * replace the texture of the selected mesh with the new texture and change the value of the param isClicked and onMouseEvent 
     * and remove the mesh from the selectedMesh array
     * @param {string} texturePath 
     * @category textureMethods
     */
    replaceSelectedMeshesTexture(texturePath){
        const textureLoader = new THREE.TextureLoader();
        const newTexture = textureLoader.load(texturePath);

        for (let i = 0; i < this.selectedMesh.length; i++){
            const Mesh = this.getObjectBypartialName(this.selectedMesh[i]);
            Mesh.material.map= newTexture;
            
            Mesh.isClicked=!Mesh.isClicked;
            Mesh.onMouseEvent=!Mesh.onMouseEvent;
        }

        // Rimuove tutte le mesh dall'array in modo corretto
        while (this.selectedMesh.length > 0) {
            this.selectedMesh.pop();
        }
    }

    /**
     * if the mesh already has a texture, it creates a new texture that combines the new texture and the original texture of the mesh.
     * if the mesh doesn't have a texture, it insert a texture
     * @param {string} texturePath 
     */
    async replaceCombineSelectedMeshesTexture(texturePath){

        const textureLoader = new THREE.TextureLoader();
        const newTexture = await textureLoader.loadAsync(texturePath);

        for (let i = 0; i < this.selectedMesh.length; i++){

            const Mesh = this.getObjectBypartialName(this.selectedMesh[i]);
            
            if(Mesh.originalTexture){
                const combineTexture = this.#createCombinedCanvasTexture(newTexture, Mesh.originalTexture);
                Mesh.material.map= combineTexture;
            } else {
                Mesh.material.map= newTexture;
            }
            
            Mesh.isClicked=!Mesh.isClicked;
            Mesh.onMouseEvent=!Mesh.onMouseEvent;

        }

        // Rimuove tutte le mesh dall'array in modo corretto
        while (this.selectedMesh.length > 0) {
            this.selectedMesh.pop();
        }
        
    }

    changeSetMeshesTexture(setMesh){
        for (let i = 0; i < setMesh.length; i++){
            const textureLoader = new THREE.TextureLoader();
            const newTexture = textureLoader.load(setMesh[i].texturePath);

            const Mesh = this.managementScene.scene.getObjectByName(setMesh[i].name);

            Mesh.material.map = newTexture;
        }
    }

    ////////////////////////////// color-texture method /////////////////////////////////
    changeSpecificMeshTextureColor(meshName,texturePath,Color){

        const Mesh = this.managementScene.scene.getObjectByName(meshName);

        const textureLoader = new THREE.TextureLoader();
        const newTexture = textureLoader.load(texturePath);
        Mesh.material.map = newTexture;

        Mesh.material.color.set(Color);

    }

 
////////////////////////////////////// Animation METHOD ///////////////////////////////////////////////



    ///////////////////////////////////////////* PRIVATE METHOD *///////////////////////////////////////////

    

    #createCombinedCanvasTexture(Texture, maskTexture) {
        console.log("texture1",Texture)
        console.log("texture2",maskTexture)

        const canvas = document.createElement('canvas');
        //canvas.width = Texture.image.width; // Assicurati che le dimensioni siano uguali
        //canvas.height = Texture.image.height;
        const context = canvas.getContext('2d');

        // Disegna la nuova texture sopra la texture originale
        context.drawImage(Texture.image, 0, 0, canvas.width, canvas.height);

        context.globalCompositeOperation = 'destination-atop';

        // Disegna la texture originale sul canvas
        context.save();
        context.scale(1, -1); // Inverti la scala verticale
        context.drawImage(maskTexture.image, 0, -canvas.height, canvas.width, canvas.height);
        context.restore();

        // Creare una nuova texture combinata
        const combinedTexture = new THREE.CanvasTexture(canvas);

        return combinedTexture;
    }

    noModelMessage(message) {
        const canvas = this.ManagementRenderer.canvas.canvas;
        const container = canvas.parentNode;

        container.style.position = 'relative';
        container.style.display='flex'
        canvas.style.display = 'block';

        // Ottieni le dimensioni reali del canvas
        const canvasWidth = canvas.offsetWidth;
        const canvasHeight = canvas.offsetHeight;

        const noModelHtml = document.createElement('div')
        noModelHtml.id="noModel"
        noModelHtml.style.position = 'absolute';
        noModelHtml.style.display='flex';
        noModelHtml.style.flexWrap='wrap';
        noModelHtml.style.justifyContent='center';
        noModelHtml.style.alignContent="center";
        noModelHtml.style.flexDirection="column"
        noModelHtml.style.width= canvasWidth + 'px';
        noModelHtml.style.height=  canvasHeight + 'px';
        noModelHtml.innerHTML=`
            <h2>${message}</h2>
            <button id="chooseBtn">Choose folder</button>
        `

        const inputHtml = document.createElement('input');
        inputHtml.type="file";
        inputHtml.id="fileInput";
        inputHtml.setAttribute("webkitdirectory", "");
        inputHtml.style.position="absolute";
        inputHtml.style.top="0";
        inputHtml.style.left="0";
        inputHtml.style.width= canvasWidth + 'px';
        inputHtml.style.height=  canvasHeight + 'px';
        inputHtml.style.opacity="0";
        inputHtml.style.cursor="pointer"
        inputHtml.style.pointerEvents="none"


        window.addEventListener('resize', () => {
            const canvasWidth = canvas.offsetWidth;
            const canvasHeight = canvas.offsetHeight;

            noModelHtml.style.width = canvasWidth + 'px';
            noModelHtml.style.height = canvasHeight + 'px';

            inputHtml.style.width = canvasWidth + 'px';
            inputHtml.style.height = canvasHeight + 'px'; 
        });

        // Aggiungi al container
        container.appendChild(noModelHtml);
        container.appendChild(inputHtml);

        container.addEventListener("dragover", () => {
            console.log("evento attivato")
            inputHtml.style.cursor="pointer"
            inputHtml.style.pointerEvents="auto"
            inputHtml.style.removeProperty("display");
        });

        // è l'html component che non permette di interagire con il canvas perchè gli è sopra
        container.addEventListener("drop", () => {
            inputHtml.style.display="none"
        });


        const chooseBtn = noModelHtml.querySelector("#chooseBtn");
        chooseBtn.addEventListener("click", () => {
            inputHtml.style.display="none"
            inputHtml.click();
        });
            

        inputHtml.addEventListener("change", async (e) => {
            this.ManagementRenderer.animations.isDownloadingFirstModel=true;
            this.ManagementRenderer.animations.loadingFirstModelAnimation()
            const files = e.target.files;
            if(files.length===0){
                console.log("la cartella non contiene file")
            }
            if (files.length===1){
                this.managementScene.scene.traverse((object) => {
                    if (object.isGroup) {
                        object.clear();  
                    }}
                );
                console.log("c'è solo un file")
                const blobUrl = URL.createObjectURL(files[0]);
                console.log(blobUrl)
                let model= await this.managementScene.load.fileGLTF(blobUrl)
                this.managementScene.scene.add(model);
                this.ManagementRenderer.animations.isDownloadingFirstModel=false;

                const box = new THREE.Box3().setFromObject(model);
                const boxCenter = new THREE.Vector3();
                box.getCenter(boxCenter);
                this.ManagementCamera.controls.target.copy(boxCenter);
                this.ManagementCamera.camera.lookAt(boxCenter);
    
                boxCenter.multiply(model.scale);
                
                const size = box.getSize(new THREE.Vector3());
                let distance = Math.max(size.x, size.y, size.z);

                this.ManagementCamera.setCamera(this.config.camera.basic, distance);

            } else {
                this.managementScene.scene.traverse((object) => {
                    if (object.isGroup) {
                        object.clear();  
                    }}
                );
                console.log(files)
                const fileMap = {};

                for (const file of files) {
                    const blobUrl = URL.createObjectURL(file);
                    fileMap[file.name] = blobUrl;
                }

                console.log("FileMap:", fileMap);

                loadGLTF(fileMap,"scene.gltf",this)
            }
            
        });

        function loadGLTF(fileMap, gltfFilename, self) {

            const manager = new THREE.LoadingManager();

            manager.setURLModifier((url) => {
                console.log("url mananger", url);
                //dall'url ricava il nome del file che contiene il vero url 
                const filename = url.split('/').pop();
                if (fileMap[filename]) {
                    return fileMap[filename];
                }
                console.warn(`File non trovato: ${filename}`);
                return url;
            });

            const loader = new GLTFLoader(manager);
            console.log("fileMap", fileMap);
            //questo codice non funziona. capire perchè
            loader.load(fileMap[gltfFilename], (gltf) => {
                
                //this.managementScene.scene.add(mod);
                console.log("management scene", self)
                self.managementScene.scene.add(gltf.scene);
                self.ManagementRenderer.animations.isDownloadingFirstModel=false;

                const box = new THREE.Box3().setFromObject(gltf.scene);
                const boxCenter = new THREE.Vector3();
                box.getCenter(boxCenter);
                self.ManagementCamera.controls.target.copy(boxCenter);
                self.ManagementCamera.camera.lookAt(boxCenter);
    
                boxCenter.multiply(gltf.scene.scale);
                
                const size = box.getSize(new THREE.Vector3());
                let distance = Math.max(size.x, size.y, size.z);

                self.ManagementCamera.setCamera(self.config.camera.basic, distance);
                console.log("Modello GLTF caricato correttamente.");
            }, undefined, (error) => {
                console.error("Errore nel caricamento del GLTF:", error);
            });
        }
    }

    
};
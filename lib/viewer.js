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

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);

        /*const shadowCameraHelper = new THREE.CameraHelper(frontDirectionalLight.shadow.camera);
        this.scene.add(shadowCameraHelper);*/
        
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
     *        model?:{fileType:string, filePath:string, interactive?:{computerType:string, tabletType:string, mobileType:string}},
     *        noModel?:{"Message":string, "defaultPath":string}
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
                model.noModelMessage(config.camera.basic,config.scene.noModel.Message, config.scene.noModel.defaultPath)
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

 

    noModelMessage(cameraBasic,message, defaultPath) {
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
            <button id="addDM">Add default model</button>
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


        const addDM = noModelHtml.querySelector("#addDM");
        addDM.addEventListener("click", async () => {
            console.log("defaultPath valore al click:", defaultPath);
            noModelHtml.style.display="none"

            const typeFile = defaultPath.split('.').pop();

            let modelFile;
            
            this.ManagementRenderer.animations.isDownloadingFirstModel=true;
            this.ManagementRenderer.animations.loadingFirstModelAnimation();

            this.managementScene.scene.traverse((object) => {
                if (object.isGroup) {
                    object.clear();  
                }}
            ); 

            if(typeFile==='gltf' | typeFile==="glb"){
                modelFile= await this.managementScene.load.fileGLTF(defaultPath)
            }
            else if(typeFile==="fbx"){
                modelFile = await this.managementScene.load.fileFBX(defaultPath);
                modelFile.traverse((child) => {
                    if (child.isMesh) {
                        console.log(child);
                        child.material= new THREE.MeshStandardMaterial({
                            color: 0x888888
                        })
                    }
                })
            }
            else if(typeFile==='obj'){
                modelFile = await this.managementScene.load.fileOBJ(defaultPath, modelConfig.texturePath)
                console.log(modelFile)
                // Luce ambientale
                const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
                this.scene.add(ambientLight);

                // Luce direzionale
                const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
                directionalLight.position.set(5, 10, 7.5);
                this.scene.add(directionalLight);
            }
            else if(typeFile==='ply'){
                modelFile = await this.managementScene.load.filePLY(defaultPath)
            }
            else if(typeFile==='stl'){
                modelFile = await this.managementScene.load.fileSTL(defaultPath)
            }
            else if(typeFile==='dae'){
                modelFile = await this.managementScene.load.fileCollada(defaultPath)
                modelFile.traverse((child) => {
                    if (child.isMesh) {
                        console.log(child);
                        child.material= new THREE.MeshStandardMaterial({
                            color: 0x888888
                        })
                    }
                })
            }

            this.managementScene.scene.add(modelFile);
            this.ManagementRenderer.animations.isDownloadingFirstModel=false;

            const box = new THREE.Box3().setFromObject(modelFile);
            const boxCenter = new THREE.Vector3();
            box.getCenter(boxCenter);
            this.ManagementCamera.controls.target.copy(boxCenter);
            this.ManagementCamera.camera.lookAt(boxCenter);

            boxCenter.multiply(modelFile.scale);
            
            const size = box.getSize(new THREE.Vector3());
            let distance = Math.max(size.x, size.y, size.z);

            this.ManagementCamera.setCamera(cameraBasic, distance); //trovare un modo per passare la configurazione della camera
        });
            

        inputHtml.addEventListener("change", async (e) => {
            try {
                this.managementScene.scene.traverse((object) => {
                    object.clear();  
                });

                this.ManagementRenderer.animations.isDownloadingFirstModel=true;
                this.ManagementRenderer.animations.loadingFirstModelAnimation()
                const files = e.target.files;
                let model;

                if(files.length===0){
                    console.log("la cartella non contiene file")
                    throw new Error("the folder don't container files")
                }
                if (files.length===1){
                    
                    console.log("c'è solo un file")
                    console.log('files',files[0])

                    const fileName = files[0].name;
                    console.log('fileName', fileName)

                    const typeFile=fileName.split('.').pop()
                    console.log('fileType', typeFile)

                    const blobUrl = URL.createObjectURL(files[0]);
                    console.log("blob url",blobUrl)

                    if (typeFile==="gltf" | typeFile==="glb"){
                        model = await this.managementScene.load.fileGLTF(blobUrl);
                    }
                    else if(typeFile==='ply'){
                        model = await this.managementScene.load.filePLY(blobUrl)
                    }
                    else if(typeFile==='stl'){
                        model = await this.managementScene.load.fileSTL(blobUrl)
                    }
                    
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

                    console.log("files",files)
                    const fileMap = {};

                    for (const file of files) {

                        let typeFile=file.name.split('.').pop();

                        if (typeFile==="gltf" | typeFile==="glb"){
                            const blobUrl = URL.createObjectURL(file);
                            model = await this.managementScene.load.fileGLTF(blobUrl);
                        }
                        else if(typeFile==='ply'){
                            const blobUrl = URL.createObjectURL(file);
                            model = await this.managementScene.load.filePLY(blobUrl)
                        }
                        else if(typeFile==='stl'){
                            const blobUrl = URL.createObjectURL(file);
                            model = await this.managementScene.load.fileSTL(blobUrl)
                        }

                    }

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
                }
            } 
            catch (error) {
                this.ManagementRenderer.animations.errorDownloadingFirstModel=true;
                this.ManagementRenderer.animations.errorDownloadingFirstModelMessage=error.message;
                console.error("Errore durante la creazione dell'istanza:", error);
                throw error; // Rilancia l'errore per gestirlo a livello superiore
            }
            finally{
                this.ManagementRenderer.animations.isDownloadingFirstModel=false;
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
import * as THREE from 'three';

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
        

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);

        
    }
    
    animate() {
        requestAnimationFrame(this.animate);
        if(this.ManagementCamera.controls){
            this.ManagementCamera.controls.update();
        }
        this.ManagementRenderer.renderer.render(this.managementScene.scene, this.ManagementCamera.camera);
        this.ManagementRenderer.renderer.outputEncoding = THREE.sRGBEncoding;
        
    }

    /**
     * this static function allow the creation of a instance of model3D class
     * @param {string} modelPath 
     * @param {{ 
     *    scene:{
     *        model:{filePath:string,texturePath?:string}, 
     *        environment?:string,
     *    },
     *    renderer:{
     *         canvas?:{
     *            insertIn?:string,
     *            addHtml?:{
     *                 idTag: string,
     *                 position: string,
     *                 customStyle?:{mobile:{value:string}, tablet:{value:string}, computer:{value:string}}
     *            },
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

        let m;

        let model = new viewer();

        try {

            model.config=config

            model.ManagementRenderer.setCanvas(config.renderer.canvas);

            model.ManagementRenderer.animations.isDownloadingFirstModel=true;

            model.ManagementRenderer.animations.loadingFirstModelAnimation();

            model.ManagementRenderer.setSize(config.renderer.RenderSize);

            model.ManagementCamera.setControls(config.camera.controls, model.ManagementRenderer.renderer.domElement);

            if(config.scene){

                await model.managementScene.setEnvironment(config.scene.environment);

                if(config.scene.model){

                    m = await model.managementScene.addModel(config.scene.model);

                    if(!m){
                        throw new Error("model loading error")
                    }
                
                } else {
                    throw new Error("model not setting");
                }


            } else {
                throw new Error("scene not setting");
            }

            const box = new THREE.Box3().setFromObject(m);
            const boxCenter = new THREE.Vector3();
            box.getCenter(boxCenter); 

            boxCenter.multiply(m.scale);
            
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

            model.originalcameraPosition=model.ManagementCamera.camera.position.clone();
            model.originalOrbitTarget=model.ManagementCamera.controls.target.clone();


            model.ManagementRenderer.animations.isDownloadingFirstModel=false;
           
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

};
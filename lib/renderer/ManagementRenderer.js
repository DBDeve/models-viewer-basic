import * as THREE from 'three';

import { Canvas } from './Canvas.js';
import { RenderAnimations } from './renderAnimations.js';

export class ManagementRenderer {

    camera;
    scene;

    renderer;
    canvas;
    animations;

    constructor(scene,camera){

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.canvas= new Canvas(this.renderer.domElement);
        this.scene=scene;
        this.camera=camera;
        this.animations = new RenderAnimations(this.renderer,this.scene, this.camera);

    }

    deleteCanvas(){
        this.renderer.domElement.remove();
        this.renderer.forceContextLoss();
        this.renderer.dispose();
    }


    setCanvas(canvasConfig){

        if (!canvasConfig){
            return
        }

        if (canvasConfig.insertIn){
            this.canvas.insertIn(canvasConfig.insertIn);
        } else {
            document.body.appendChild(this.renderer.domElement);
        }

        if (canvasConfig.addHtml){

            if (!canvasConfig.addHtml){
                return
            }

            window.addEventListener('resize', () => {
                this.canvas.addHtmlComponent(canvasConfig.addHtml.idTag, canvasConfig.addHtml.position, canvasConfig.addHtml.customStyle);
            });

            window.addEventListener('load', () => {
                this.canvas.addHtmlComponent(canvasConfig.addHtml.idTag, canvasConfig.addHtml.position, canvasConfig.addHtml.customStyle);
            });

        }
        
    }


    setSize(sizeConfig){

        window.addEventListener('resize', () => {
            this.resizeCanvas(sizeConfig);
        });

        window.addEventListener('load', () => {
            this.resizeCanvas(sizeConfig);
        });

    }



    
    resizeCanvas(sizeConfig){

        if(!sizeConfig){

            let width= window.innerWidth 
            let height = window.innerHeight

            this.renderer.setSize(width, height);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();

        } else {

            if(sizeConfig.computer){

                if(window.innerWidth >= 1200){

                    let width= window.innerWidth + sizeConfig.computer.width
                    let height = window.innerHeight + sizeConfig.computer.height

                    this.renderer.setSize(width, height);
                    this.camera.aspect = width / height;
                    this.camera.updateProjectionMatrix();

                }

            } else {

                if(window.innerWidth >= 1200){

                    let width= window.innerWidth 
                    let height = window.innerHeight

                    this.renderer.setSize(width, height);
                    this.camera.aspect = width / height;
                    this.camera.updateProjectionMatrix();

                }
            }

            if(sizeConfig.tablet){

                if (window.innerWidth > 800 && window.innerWidth < 1200){

                    let width= window.innerWidth + sizeConfig.tablet.width
                    let height = window.innerHeight + sizeConfig.tablet.height

                    this.renderer.setSize(width, height);
                    this.camera.aspect = width / height;
                    this.camera.updateProjectionMatrix();

                } 

            } else {

                if (window.innerWidth > 800 && window.innerWidth < 1200){

                    let width= window.innerWidth;
                    let height = window.innerHeight;

                    this.renderer.setSize(width, height);
                    this.camera.aspect = width / height;
                    this.camera.updateProjectionMatrix();

                } 
            }

            if(sizeConfig.mobile){

                if (window.innerWidth < 800){

                    let width= window.innerWidth + sizeConfig.mobile.width
                    let height = window.innerHeight + sizeConfig.mobile.height

                    this.renderer.setSize(width, height);
                    this.camera.aspect = width / height;
                    this.camera.updateProjectionMatrix();

                }

            } else {

                if (window.innerWidth < 800){

                    let width= window.innerWidth;
                    let height = window.innerHeight;

                    this.renderer.setSize(width, height);
                    this.camera.aspect = width / height;
                    this.camera.updateProjectionMatrix();

                }
                
            }
        }

        

    }

}
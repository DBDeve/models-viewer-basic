import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class ManagementCamera {

    camera;
    controls;

    constructor(){

        const focalLength = 50; // Lunghezza focale
        const sensorSize = 36; // Larghezza del sensore
        const fov = (2 * Math.atan((sensorSize / 2) / focalLength)) * (180 / Math.PI);
        this.camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 10000);
        
    }

    setCamera(camera,distance) {

        let cameraAngle;

        if(camera){
        
            if(camera.distance){
                this.controls.minDistance=distance/camera.distance.min;
                this.controls.maxDistance=distance * camera.distance.max;
            } else {
                this.controls.minDistance=distance/2;
                this.controls.maxDistance=distance * 2;
            }
        
            if (camera.angle){
                console.log("camera angle present",camera.angle);
                const radius = 5;
                const angle = camera.angle.x; // usa solo un angolo per XZ

                cameraAngle = new THREE.Vector3(
                    Math.sin(angle) * radius,
                    camera.angle.y, // altezza fissa
                    Math.cos(angle) * radius
                );
            } else {
                cameraAngle = new THREE.Vector3(1,1,1);
            }
            
        } else {

            this.controls.minDistance=distance/2;
            this.controls.maxDistance=distance * 2;

            cameraAngle = new THREE.Vector3(1,1,1);

        }

        cameraAngle.normalize();
    
        if (camera.distance.initial){
            distance *= camera.distance.initial;
        }
        
        this.camera.position.copy(cameraAngle.multiplyScalar(distance));

        if (camera.position){

            const panOffset = new THREE.Vector3();
            panOffset.set(camera.position.x, camera.position.y, camera.position.z);
            this.controls.target.add(panOffset);

        }
    }



    setControls(controlsConfig,canvas){

        if(!controlsConfig){
            return;
        }

        this.controls = new OrbitControls(this.camera, canvas);
        this.controls.screenSpacePanning = true;

        if(controlsConfig.zoom){
            this.controls.enableZoom = true;
        } else {
            this.controls.enableZoom = false;
        }

        if(controlsConfig.rotate){

            this.controls.enableRotate = true;

            if (controlsConfig.rotate.vertical){
                this.controls.minPolarAngle = controlsConfig.rotate.vertical.min * (Math.PI / 180);
                this.controls.maxPolarAngle = controlsConfig.rotate.vertical.max * (Math.PI / 180);
                console.log("controlli verticali presenti");
            } else {
                this.controls.minPolarAngle = 0; 
                this.controls.maxPolarAngle = Math.PI;
                console.log("non sono presenti controlli verticali");
            }

            if (controlsConfig.rotate.horizontal){
                this.controls.minAzimuthAngle = controlsConfig.rotate.horizontal.min * (Math.PI / 180);
                this.controls.maxAzimuthAngle = controlsConfig.rotate.horizontal.max * (Math.PI / 180);
                console.log("controlli orizontali presenti");
            } else {
                this.controls.minAzimuthAngle = -Infinity; 
                this.controls.maxAzimuthAngle = Infinity;
                console.log("non sono presenti controlli orizontali");
            }

            this.controls.update();
            
        } else {
            this.controls.enableRotate = false;
        }


        if(controlsConfig.pan){
            this.controls.enablePan = true; 
        } else {
            this.controls.enablePan = false;
        }

        if(controlsConfig.effect) {

            if(controlsConfig.effect.damping){
                this.controls.enableDamping = true;
                this.controls.dampingFactor = controlsConfig.effect.damping.factor;
            }
           
        }

    }

    
}
export class RenderAnimations {

    renderer;
    camera;
    scene;

    animation;

    isDownloadingFirstModel=null;
    errorDownloadingFirstModel=null;
    errorDownloadingFirstModelMessage="sconosciuto"
    isAnimating=null;

    constructor(renderer, scene, camera) {

        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.animation = false;

    }

    loadingFirstModelAnimation(){

        // Aggiunta di una geometria semplice per l'esempio
        /*const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);
        this.camera.position.set(0, 0, 5);
        this.camera.lookAt(cube.position);*/

        const canvas = this.renderer.domElement;
        const container = canvas.parentNode;

        const htmlComponentModel = document.getElementById("noModel")
        if(htmlComponentModel){
            console.log("html selected",htmlComponentModel )
            htmlComponentModel.remove()
        }

        const htmlComponent = document.createElement('div');
        htmlComponent.style.position="absolute"
        htmlComponent.style.display='flex';
        htmlComponent.style.flexWrap='wrap';
        htmlComponent.style.justifyContent='center';
        htmlComponent.style.alignContent="center";
        htmlComponent.style.flexDirection="column";
        htmlComponent.style.width = canvas.offsetWidth + 'px';
        htmlComponent.style.height = canvas.offsetHeight + 'px';
        htmlComponent.innerHTML = "<h2 id='loading'> loading... </h2>";

        container.appendChild(htmlComponent);

        // Funzione di rendering principale
        const animate = () => {

            if (this.isDownloadingFirstModel===true){
                /*cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;*/
                
                this.renderer.render(this.scene, this.camera);
                requestAnimationFrame(animate);
            } 
            else if(this.errorDownloadingFirstModel===true){

                const htmlComponentLoading = document.getElementById("loading")
                htmlComponentLoading.remove()

                const htmlComponent = document.createElement('div');
                htmlComponent.innerHTML = `<h2> si è verificato un errore: ${this.errorDownloadingFirstModelMessage}</h2>`;

                htmlComponent.style.position = 'absolute';
                htmlComponent.style.top = '50%';
                htmlComponent.style.left = '50%';
                htmlComponent.style.transform = 'translate(-50%, -50%)';

                const canvas = document.getElementsByTagName('canvas')[0]
                const container = canvas.parentNode;
                container.appendChild(htmlComponent);

                this.renderer.render(this.scene, this.camera);
                requestAnimationFrame(animate);

            }
            else {
                //this.scene.remove(cube);
                container.removeChild(htmlComponent)
            }
            
        }

        animate();

    }



    moveCameraAroundMesh(objectName,position){
    
        try{

            if(this.isAnimating===true){
                throw new Error("animazione già in corso");
            }
            
            let object = this.getObjectBypartialName(objectName);

            const boundingBox = new THREE.Box3().setFromObject(object);
            /*const boxHelper = new THREE.Box3Helper(boundingBox, 0xffff00); 
            this.scene.add(boxHelper);*/

            const localCenter = new THREE.Vector3();
            boundingBox.getCenter(localCenter);

            let cameraPosition;

            if (position==="top"){
                cameraPosition = new THREE.Vector3(
                    localCenter.x,
                    localCenter.y+1,
                    localCenter.z,
                );
            } 
            else if (position==="bottom"){
                cameraPosition = new THREE.Vector3(
                    localCenter.x,
                    localCenter.y-1,
                    localCenter.z,
                );
            }
            else if (position==="left"){
                cameraPosition = new THREE.Vector3(
                    localCenter.x-1,
                    localCenter.y,
                    localCenter.z,
                )
            }
            else if (position==="right"){
                cameraPosition = new THREE.Vector3(
                    localCenter.x+1,
                    localCenter.y,
                    localCenter.z,
                )
            }
            else if (position==="front"){
                cameraPosition = new THREE.Vector3(
                    localCenter.x,
                    localCenter.y,
                    localCenter.z+1,
                )
            }
            else if (position==="back"){
                cameraPosition = new THREE.Vector3(
                    localCenter.x,
                    localCenter.y,
                    localCenter.z-1,
                )
            }

            this.isAnimating = true;


            const animateCamera = () => {

                if(this.isAnimating===null || this.isAnimating===true){
                    
                    const speed=0.02; 

                    // Controlla se il target è stato raggiunto
                    if (this.camera.position.distanceTo(cameraPosition) < 0.01) {
                        console.log("Target raggiunto!");
                        this.camera.position.copy(cameraPosition);
                        this.controls.target.copy(localCenter);
                        this.isAnimating = false;
                    }
                    this.camera.position.lerp(cameraPosition, speed); 

                    // Aggiorna il target dei controlli per mantenere il centro
                    this.controls.target.lerp(localCenter,speed); 
                    this.controls.update();

                    // Renderizza la scena e richiama l'animazione
                    this.ManagementRenderer.renderer.render(this.scene, this.camera);
                    requestAnimationFrame(animateCamera);

                } 
                

            }

            animateCamera();

        }catch(e){
            console.error("Errore durante il movimento della camera:", e);
        }

        
    }
}
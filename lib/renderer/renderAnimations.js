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
        htmlComponent.id="loading"
        htmlComponent.style.position="absolute";
        htmlComponent.style.top = '50%';
        htmlComponent.style.left = '50%';
        htmlComponent.style.transform = 'translate(-50%, -50%)';
        htmlComponent.innerHTML = "<h2> loading... </h2>";

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

                const htmlComponentLoading = document.getElementById("loading");
                htmlComponentLoading.remove();

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

}
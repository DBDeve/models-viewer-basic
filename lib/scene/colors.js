import * as THREE from 'three';

export class Colors {

    instance;

    constructor(model3dinstance) {
        this.instance=model3dinstance
        console.log("colors inizializzato!");
    }

    /** change the color of the selected mesh, change the value of the param isClicked
     *  and onMouseEvent and remove the mesh from the selectedMesh array
     * @param {THREE.ColorRepresentation} color - the color of the mesh in hexadecimal format
     * @category colorMethods
    */
    selectedMeshes(color){

        let remainingMeshes=[];

        for (let i = 0; i < this.instance.selectedMesh.length; i++){
            
            const Mesh = this.instance.search.getMeshByExactName(this.instance.selectedMesh[i])

            if(Mesh){

                Mesh.material.color.set(0xffffff);
                Mesh.material.color.set(color);

                if (Mesh.autoDeselect===true){

                    Mesh.material.emissive.set(0x000000);
                    Mesh.material.emissiveIntensity = 0;

                    Mesh.isClicked=!Mesh.isClicked;
                    Mesh.onMouseEvent=!Mesh.onMouseEvent;

                } else {
                    // Mantieni l'elemento nel nuovo array
                    remainingMeshes.push(this.instance.selectedMesh[i]);
                }
            
            }

        }

        this.instance.selectedMesh = remainingMeshes; // Aggiorna l'array selectedMesh con gli elementi rimanenti
    
    }


    /**
     * change the color of the specific mesh. you can use this method for create a button that change always the color same mesh.
     * @param {string} MeshName - the name of the mesh to change the color
     * @param {THREE.ColorRepresentation} color - the color of the mesh in hexadecimal format
     * @category colorMethods
     */
    specificMesh(MeshName,color){
        const Mesh = this.instance.getObjectBypartialName(MeshName);
        if(Mesh){
            Mesh.material.color.set(0xffffff);
            Mesh.material.color.set(color);
            Mesh.material.emissive.set(0x000000);
            Mesh.material.emissiveIntensity = 0;
        }
    }


    /**
     * It takes data from a set defined by you to determine which meshes to change the color of and how to change it.
     * @param {[{color: THREE.ColorRepresentation, name: string}]} setMesh
     * @category colorMethods
     */
    setMeshes(setMesh){
        for(let y=0; y < setMesh.length; y++){

            const Mesh = this.instance.getObjectBypartialName(setMesh[y].name);

            if(Mesh){
                Mesh.material.color.set(0xffffff);
                Mesh.material.color.set(setMesh[y].color);
                Mesh.material.emissive.set(0x000000);
                Mesh.material.emissiveIntensity = 0;
            }
        }
        
    }

    /** change the background color of the cavas 
     * @param {THREE.ColorRepresentation} color - the color of the background in hexadecimal format
     * @param {number} opacity - the opacity of the background (0-1)
     * @category backgroundMethods
    */
    backGround(color, opacity) {
        this.instance.renderer.setClearColor(color, opacity);
    }


    //CAPIRE PERCHE I COLORI NON VENGONO INSERITI GIUSTI. IL RESTO FUNZIONA.
    /**
     * fare in modo che si possano inserirei colori
     * color1, color2, radius
     */
    backGroundRadiantGradient() {

        console.log("metodo modifica sfondo attivato")
        const canvasThree = document.getElementsByTagName('canvas')[0]
        const canvas = document.createElement('canvas');
        canvas.width = canvasThree.width;
        canvas.height = canvasThree.height;
        const context = canvas.getContext('2d');

        // Creazione del gradiente radiale con raggio maggiore
        const gradient = context.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 10,
            canvas.width / 2, canvas.height / 2, canvas.width / 1.7,
        );

        gradient.addColorStop(0, '#595959');  // Grigio chiaro al centro
        gradient.addColorStop(0.5, '#323232');   


        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        const texture = new THREE.CanvasTexture(canvas);

        this.instance.scene.background='#ffffff';
        this.instance.scene.background=texture;

    }

};
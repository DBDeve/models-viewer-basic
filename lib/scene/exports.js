import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { USDZExporter } from 'three/examples/jsm/exporters/USDZExporter.js';
import { NodeIO } from '@gltf-transform/core';

export class exports {

    scene;

    constructor(model3dinstance) {
        this.scene=model3dinstance.scene;
    }

    /**
     * Export the scene to GLTF or GLB format.
     * @param {boolean} binar 
     * @param {boolean} onlyVisible 
     * @param {boolean} seeCode 
     */
    async exportGLTF(binar=false, onlyVisible=false, seeCode=false) {

        let clonedScene = this.scene.clone();

        clonedScene.traverse((child) => {

            if (child.matrix) {
                child.matrixAutoUpdate = false;
                child.matrixWorldNeedsUpdate = true;
                child.updateMatrixWorld(true);

                let matrixArray = child.matrix.toArray();
                if(matrixArray.slice(0, 3).every(value => value === 0)){
                    matrixArray[0]=0.001
                }
                if(matrixArray.slice(4, 7).every(value => value === 0)){
                    matrixArray[5]=0.001
                }
                if(matrixArray.slice(8, 12).every(value => value === 0)){
                    matrixArray[10]=0.001
                }

                child.matrix = new THREE.Matrix4().fromArray(matrixArray);
                console.log("child matrix= ",child.matrix);
            }
        });
        
        const exporter = new GLTFExporter();
        // Esporta la scena in GLTF
        exporter.parse(
            clonedScene,
            async (result) => {
                let blob;

                if (binar === true) {
                
                    // Crea un Blob binario (GLB)
                    const output = JSON.stringify(result, null, 2);
                    blob = new Blob([output], { type: 'application/json' });
    
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'scene.glb';
                    link.click();
    
                    // Revoca l'URL per evitare perdite di memoria
                    URL.revokeObjectURL(link.href);

                } else {
                    // Blob JSON (GLTF)
                    const output = JSON.stringify(result, null, 2);
                    blob = new Blob([output], { type: 'application/json' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'scene.gltf';
                    link.click();
                    URL.revokeObjectURL(link.href);
                }

                if(seeCode===true){
                    // Leggi il blob per accedere ai nodi
                    const arrayBuffer = await blob.arrayBuffer();
                    const glbBlob = new Uint8Array(arrayBuffer);

                    if (binar) {
                        // Usa NodeIO per file binari GLB
                        const io = new NodeIO();
                        const document = await io.readBinary(glbBlob);

                        // Elenca i nodi presenti nel documento
                        const nodes = document.getRoot().listNodes();
                        
                        console.log('Nodi trovati:');
                        nodes.forEach((node,index) => {
                            console.log("indice nodo",index);
                            console.log(`Nome nodo: ${node.getName()}`);
                            console.log(`Tipo nodo: ${node.getType()}`);
                        });

                    } else {
                        // Per file JSON (gltf)
                        const text = new TextDecoder().decode(glbBlob);
                        const json = JSON.parse(text);

                        if (json.nodes) {
                            
                            console.log('Nodi trovati:');
                            json.nodes.forEach((node, index) => {
                            
                                console.log(`Nodo ${index}:`, node);
                                
                            });

                        } else {
                            console.log('Nessun nodo trovato!');
                        }
                        
                    }

                }

            },
            { onlyVisible: onlyVisible, binary: binar } // Usa "true" per GLB binario
        );
    }



    /**
     * Export the scene to USDZ format. since USDZ format don't support che color value of the mesh material all the color
     * are transformed in texture.
     * @category exportMethods
     */
    exportUSDZ(){

        const exporter = new USDZExporter();

        let clonedScene = this.scene.clone();

        clonedScene.traverse((child) => {

            if(child.name==="FLOOR_COPERTONI"){
                child.parent.remove(child);
            }

            if (child.isMesh) {

                child.material = child.material.clone();
                child.material.side = THREE.FrontSide;

                if (child.material.color.getHexString() !== "ffffff"){

                    // Creare il canvas per la texture di colore
                    const colorCanvas = document.createElement('canvas');
                    colorCanvas.width = 256;
                    colorCanvas.height = 256;
                    const colorContext = colorCanvas.getContext('2d');

                    // Generare la texture di colore
                    colorContext.fillStyle = child.material.color.getStyle(); // Colore della mesh
                    colorContext.fillRect(0, 0, colorCanvas.width, colorCanvas.height);

                    // Creare la texture di base dal canvas
                    const colorTexture = new THREE.CanvasTexture(colorCanvas);

                    if(child.material.map){
                        const canvas = document.createElement('canvas');
                        canvas.width = colorTexture.image.width; // Assicurati che le dimensioni siano uguali
                        canvas.height = colorTexture.image.height;
                        const context = canvas.getContext('2d');

                        let masktexture = child.material.map;

                        // Disegna la nuova texture sopra la texture originale
                        context.drawImage(colorTexture.image, 0, 0, canvas.width, canvas.height);

                        context.globalCompositeOperation = 'destination-atop';

                        // Disegna la texture originale sul canvas
                        context.save();
                        context.scale(1, -1); // Inverti la scala verticale
                        context.drawImage(masktexture.image, 0, -canvas.height, canvas.width, canvas.height);
                        context.restore();
                        
                        // Creare una nuova texture combinata
                        const combinedTexture = new THREE.CanvasTexture(canvas);

                        // Applicare la texture combinata al materiale
                        child.material.map = combinedTexture;
                        
                    } else {

                        child.material.map = colorTexture;

                    }
                    
                }

                console.log(" dopo child material= ",child);
                
            }
        });
        
        exporter.parse(
            clonedScene, 
            (result) => {
                const blob = new Blob([result], { type: 'model/vnd.usdz+zip' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'scene.usdz';
                link.click();
            },
        );
    }



}
import * as THREE from 'three';

export class Canvas{

    canvas

    constructor(canvasElement) {
        this.canvas = canvasElement;
    }

    insertIn(elementId){

        const element = document.getElementById(elementId);

        if (element) {
            element.appendChild(this.canvas);
        } else {
            console.error(`Element with id ${elementId} not found.`);
        }

    }


    //dare all'untente la possibilità di personallizzare la distanza "top" dell'html aggiunto. 
    addHtmlComponent(idTag, position, customStyle) {

        const canvas = this.canvas
        const container = canvas.parentNode;

        console.log("idTag= ",idTag);
        console.log("position ",position);

        let htmlContent = document.getElementById(idTag);

        console.log("htmlContent= ",htmlContent);

        htmlContent.style.position = 'absolute';
        htmlContent.style.display = 'flex';
        htmlContent.style.flexWrap = 'wrap';
        htmlContent.style.justifyContent = 'center';
        htmlContent.style.alignContent = "center";
        htmlContent.style.flexDirection = "column";
        htmlContent.style.width = canvas.offsetWidth + 'px';
        htmlContent.style.height = canvas.offsetHeight + 'px';
        htmlContent.style.pointerEvents = 'none';
        
        if (window.innerWidth >= 800){

            if (position==="top"){
                htmlContent.style.justifyContent='flex-start';
            } 
            else if(position==="bottom"){
                htmlContent.style.justifyContent='flex-end';
            }
            else if (position==="left"){
                htmlContent.style.alignContent='flex-start';
            }
            else if (position==="right"){
                htmlContent.style.alignContent='flex-end';
            }

        } else {
            //htmlContent.
        }

        Object.assign(htmlContent.style, customStyle);
       
        // Aggiungi il componente al contenitore del canvas
        container.appendChild(htmlContent);
        
    }


}
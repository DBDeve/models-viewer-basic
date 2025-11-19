# models-viewer-basic V1

## how testing and developer the library
1. git clone https://github.com/DBDeve/models-viewer-basic
2. npm install 
3. npm create vite@latest test
4. select vanilla
5. select javascript
5. npm install three
6. cd test
7. npm install
8. npm run dev
9. add import {viewer} from '../../lib/viewer.js'

## how install and create a project with the package 
1. npm create vite@latest project-name
2. select vanilla
3. select javascript
4. cd project-name
5. npm install models-viewer-basic
6. add this tag to index.html file: 
```
<div id="canvasContainer"></div>
```
7. add this code for default configuration
```
import { viewer } from 'models-viewer-basic'; 

const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/dist' : '';
let model;

window.loadModel =async function () {
    
	let config = {
		"scene": {
			"model": {"filePath": `${basePath}/file_model_name`},
			"environment": {"hdrFilePath": `${basePath}/file_hdri_name`}
		},
		"renderer":{
			"canvas": {
				"insertIn": "canvasContainer",
		    },
			"Size": {
				"modality":"fullScreen",
			},
		},
		"camera":{
			"basic": {
				"angle": { "x": 3.7, "y": 1.5},
				"distance": 1.7,
			},
			"controls": {
				"rotate": { "vertical":{"min":0,"max":360}, "orizontal":{"min":-Infinity,"max":Infinity}},
				"zoom": {"min": 2, "max": 4 },
				"pan":true,
				"effect":{
					"damping":{ "factor": 0.05 }
				}
			},
		},

		
	};
	
	model = await viewer.createInstance(config);

}

window.addEventListener('DOMContentLoaded', loadModel);
```
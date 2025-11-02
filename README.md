# models-viewer-basic V1

## how testing and developer the library
1. git clone https://github.com/DBDeve/three-compilator.git#DEV
2. npm install (forse togliere questo passo)
3. npm create vite@latest test
4. select vanilla
5. select javascript
5. npm install three
6. cd test
7. npm install
8. npm run dev
9. add import {viewer} from '../../lib/viewer.js'

## how install and create a project with the package 
1. npm create vite@latest project
2. cd project
3. npm install
4. npm install git+https://github.com/DBDeve/three-compilator.git#release
5. add this code for default configuration
```
import { viewer } from 'three-compilator';

const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/dist' : '';
let model;

window.loadModel =async function () {
    
	let config = {
		"scene": {
			"model": { "fileType": "glb/gltf", "filePath": `${basePath}/file_model_name` },
			"environment": {"hdrFilePath": `${basePath}/file_hdri_name`}
		},
		"renderer":{
			"canvas": {
				"insertIn": "canvasContainer",
		    },
			"RenderSize": {
				"mobile": { "width": 0 , "height": 0},
				"tablet":{"width": 0 , "height": 0},
				"computer": { "width": 0, "height": 0}
			},
		},
		"camera":{
			"basic": {
				"angle": { "x": 3.7, "y": 1.5},
				"distance": { "initial": 1.7, "min": 2, "max": 4 },
				"position":{"x":0,"y":0,"z":0} 
			},
			"controls": {
				"rotate": { "vertical":{"min":0,"max":360}, "orizontal":{"min":-Infinity,"max":Infinity}},
				"zoom": {},
				"pan":{},
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

## install the package in worldpress
1. generate dist folder with the comand 'npm run build'
2. add the dist folder to root of the site
3. insert the code below with the plugin Code Snippets o direct in the file functions.php.
```
function vite_component_shortcode() {
	return '
		<div>
		  <script type="module" src="https://threeprova.altervista.org/dist/assets/file_name.js"></script>
		</div>
	';
    
}
add_shortcode('vite_three_code', 'vite_component_shortcode');
```
4. insert the short code [vite_three_code] where you want execute it.

## to do
1. trovare un modo per gestire le animazioni dei modelli. 

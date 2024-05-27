import * as THREE from 'three';
import init from './init';

const { sizes, scene, canvas, camera, renderer, controls, fpsBlock } = init();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ 
    color: 'gray', 
    wireframe: true
});

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);



function render() {
    countFramesPerRate();

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}



var time = Date.now();
var iterations = 0;

function countFramesPerRate() {
    const currentTime = Date.now();
    if (currentTime - time >= 1000) {
        fpsBlock.innerText = 'FPS: ' + iterations;
        iterations = 0;
        time = Date.now();
    }
    ++iterations;
}


render();
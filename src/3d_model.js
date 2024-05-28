import * as THREE from 'three';
import TWEEN from 'three/examples/jsm/libs/tween.module.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import init from './script';


const { sizes, scene, canvas, camera, renderer, controls, fpsBlock, light_x, light_y, light_z, orbitcontrols } = init(false);

camera.position.y = 1;
camera.position.z = 1;

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({
//     color: 'gray',
//     wireframe: true
// });

// const mesh = new THREE.Mesh(geometry, material);

const loader = new GLTFLoader();

// loader.load('static/models/gaming_keyboard/scene.gltf', gltf => {
//     console.log('success', gltf.scene.children);
//     gltf.scene.scale.set(0.05, 0.05, 0.05)
//     scene.add(gltf.scene)
// })

loader.load('static/models/head/lieutenantHead.gltf', gltf => {
    // console.log('success', gltf.scene.children);
    gltf.scene.rotateY(Math.PI);
    gltf.scene.position.z = -2;
    gltf.scene.position.y = 0.8;
    gltf.scene.scale.set(0.5, 0.5, 0.5);
    console.log(gltf)
    scene.add(gltf.scene)
})

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 3), 
    new THREE.MeshStandardMaterial(
        { color: 0x222222, metalness: 1, roughness: 0.5 }
    )
);


scene.background = new THREE.Color(0x444444)

floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);
hemiLight.position.set(0, 10, 0);

const dirLight = new THREE.DirectionalLight(0xffffff, 10);
dirLight.position.set(-8, 12, 8);
dirLight.castShadow = true;
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);

scene.add(dirLight);
scene.add(hemiLight);
scene.add(floor);

const clock = new THREE.Clock();

function render() {
    const delta = clock.getDelta();
    const elapsed = clock.elapsedTime;


    controls.update();
    TWEEN.update();
    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

render();


window.addEventListener('toggleorbitcontrols', () => onToggleOrbitControls());
const onToggleOrbitControls = () => {
    controls.enabled = orbitcontrols.checked;

    if (!orbitcontrols.checked) {
        new TWEEN.Tween(camera.position)
            .to({ x: 0, y: 0, z: 8 }, 1000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
    }
}
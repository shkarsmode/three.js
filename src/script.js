import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import TWEEN from 'three/examples/jsm/libs/tween.module.js';
import init from './init';

const { sizes, scene, canvas, camera, renderer, controls, fpsBlock, light_x, light_y, light_z, orbitcontrols } = init(false);

let font;
const group = new THREE.Group();
let textMesh;

const randomColors = [
    'purple', 'red', 'green', 'blue', 'orange'
]


const light = new THREE.DirectionalLight('white', 1);
light.position.set(2, 5, 5).normalize();
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

const loader = new FontLoader();

// loader.loadAsync('static/fonts/RedditMono.json').then(f => console.log(f))

loader.load('static/fonts/RedditMono.json', (fonts) => {
    font = fonts;

    const geometry = new TextGeometry('', {
        font: font,
        size: 0.3,
        depth: 0.003,
        curveSegments: 10,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelOffset: 0,
        bevelSegments: 5
    });

    const material = new THREE.MeshPhongMaterial({ color: 'white' });
    textMesh = new THREE.Mesh(geometry, material);

    // textMesh.position.set(0, 0, 1);
    textMesh.rotation.set(0, Math.PI / 4 + 0.3, 0)

    scene.add(textMesh);
});



const geometries = [
    [new THREE.BoxGeometry(1, 1, 1), 'Box'],
    [new THREE.ConeGeometry(1, 2, 32, 4), 'Cone'],
    [new THREE.TorusGeometry(0.2, 0.5, 10, 20, Math.PI / 2), 'Torus'],
    [new THREE.TorusGeometry(0.5, 0.3, 20, 10, Math.PI * 2), 'Torus'],
    [new THREE.DodecahedronGeometry(1, 0), 'Dodecahedron'],
    [new THREE.SphereGeometry(0.8, 16, 16, 0, Math.PI), 'Sphere'],
    [new THREE.TorusKnotGeometry(0.8, 0.2, 60), 'TorusKnot'],
    [new THREE.OctahedronGeometry(0.5, 0), 'Octahedron'],
    [new THREE.CylinderGeometry(.25, 0.5, 1, 16, 3), 'Cylinder'],
];

let index = 0;
let activeIndex = null;
for (let x = -5; x <= 5; x += 5) {
    for (let y = -5; y <= 5; y += 5) {
        const material = new THREE.MeshBasicMaterial({
            color: 'gray',
            wireframe: true
        });
        const mesh = new THREE.Mesh(geometries[index][0], material);
        
        mesh.position.set(x, y, 0);
        mesh.index = index;
        mesh.name = geometries[index][1]
        mesh.previousPosition = { x, y, z: 0 };
        group.add(mesh);
        ++index;
    }
}


scene.add(group);


const clock = new THREE.Clock();

function render() {
    const delta = clock.getDelta();
    const elapsed = clock.elapsedTime;

    if (typeof activeIndex === 'number') {
        group.children[activeIndex].rotateY(delta);
    }

    if (textMesh) {
        textMesh.rotation.set(0, Math.cos(elapsed) / 3 + 1, 0);
    }

    countFramesPerRate();

    controls.update();
    TWEEN.update();
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

function resetActive() {
    updateText('');
    group.children[activeIndex].material.color.set('gray');

    new TWEEN.Tween(group.children[activeIndex].position)
        .to(group.children[activeIndex].previousPosition, Math.random() * 1000 + 1000)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();

    activeIndex = null;
}

const raycaster = new THREE.Raycaster();

function handleClick(event) {
    const pointer = new THREE.Vector2();
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersections = raycaster.intersectObjects(group.children);

    if (typeof activeIndex === 'number') {
        resetActive();
    }


    if (!intersections.length) return;

    intersections[0].object.material.color.set(
        randomColors[Math.random() * randomColors.length | 0]
    );
    activeIndex = intersections[0].object.index;

    updateText(intersections[0].object.name);
    textMesh.material.color.set(intersections[0].object.material.color);

    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    const updatedPositions = 
        new THREE.Vector3().copy(camera.position).add(direction.multiplyScalar(2));

    const boundingBox = new THREE.Box3().setFromObject(textMesh);

    const sizeVector = new THREE.Vector3();
    boundingBox.getSize(sizeVector);

    const rightEdge = sizeVector.x / 2;


    textMesh.position.set(
        (updatedPositions.x - rightEdge - 0.7) * 2, 
        updatedPositions.y, 
        updatedPositions.z
    ); 

    new TWEEN.Tween(intersections[0].object.position)
        .to(updatedPositions, Math.random() * 1000 + 1000)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();

}

canvas.addEventListener('click', handleClick);


render();

function updateText(newText) {
    newText = newText.replace(/geometry/ig, '');

    const geometry = new TextGeometry(newText, {
        font: font,
        size: 0.3,
        depth: 0.003,
        curveSegments: 10,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelOffset: 0,
        bevelSegments: 5
    });

    textMesh.geometry.dispose();

    textMesh.geometry = geometry;
}

window.addEventListener('lightchanged', () => onChangeLightPosition());
window.addEventListener('toggleorbitcontrols', () => onToggleOrbitControls());

const onChangeLightPosition = () => {
    light.position.set(light_x.value, light_y.value, light_z.value)
};

const onToggleOrbitControls = () => {
    controls.enabled = orbitcontrols.checked;

    if (!orbitcontrols.checked) {
        new TWEEN.Tween(camera.position)
            .to({ x: 0, y: 0, z: 8 }, 1000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
    }
}
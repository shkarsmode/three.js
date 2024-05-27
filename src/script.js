import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './style.css';

const canvas = document.querySelector('.canvas');
const fpsBlock = document.querySelector('.fps');
const range = document.querySelector('input[type="range"]');
range.value = localStorage.getItem('fov') ?? 120;

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

range.addEventListener('input', event => {
    camera.fov = event.target.value;
    camera.updateProjectionMatrix();
    localStorage.setItem('fov', camera.fov);
})

let clock = new THREE.Clock();
const scene = new THREE.Scene();

// const geometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
// const geometry = new THREE.CircleGeometry(1, 10, Math.PI*0.25, Math.PI);
// const geometry = new THREE.PlaneGeometry(1, 1, 10, 10);
// const geometry = new THREE.ConeGeometry(1, 1, 4, 3, true, Math.PI, Math.PI);
// const geometry = new THREE.CylinderGeometry(1, 1, 2, 6, 3)
// const geometry = new THREE.RingGeometry(1, 0.8, 20, 2, 0, Math.PI*2)
// const geometry = new THREE.TorusGeometry(1, 0.9, 20, 10, Math.PI*2)
// const geometry = new THREE.TorusKnotGeometry(1, 0.2, 100, 4, 2, 5)
// const geometry = new THREE.DodecahedronGeometry(1.5, 3)
// const geometry = new THREE.OctahedronGeometry(1, 0)
// const geometry = new THREE.TetrahedronGeometry(1, 0)
// const geometry = new THREE.IcosahedronGeometry(1, 2)
// const geometry = new THREE.SphereGeometry(1, 16, 16, 0, Math.PI / 2);
const geometry = new THREE.BufferGeometry();

const amount = 10;

const points = new Float32Array(amount * 3 * 3);

for (let i = 0; i < amount * 3 * 3; i++) {
    points[i] = (Math.random() - 0.5) * 4;
}

const pointsBuffer = new THREE.BufferAttribute(points, 3);
geometry.setAttribute('position', pointsBuffer);

const material = new THREE.MeshBasicMaterial({ 
    color: 'yellow', 
    wireframe: true
});

const mesh = new THREE.Mesh(geometry, material);

// mesh.position.x = 0.5
// mesh.position.y = 0.5

const camera = new THREE.PerspectiveCamera(
    localStorage.getItem('fov') ?? 120, sizes.width / sizes.height
);

camera.position.z = 3;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

scene.add(camera);
scene.add(mesh);

// const group = new THREE.Group();
// const meshes = [];

// for (let x = -1.2; x <= 1.2; x += 1.2) {
//     for (let y = -1.2; y <= 1.2; y += 1.2) {
//         const mesh = new THREE.Mesh(geometry, material);
//         mesh.position.x = x;
//         mesh.position.y = y;
//         meshes.push(mesh);
//     }
// }

// group.add(...meshes);

// scene.add(group);


let renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const axesHelper = new THREE.AxesHelper(3)
scene.add(axesHelper);




// let lookAtIndex = 0;

function render() {
    countFramesPerRate();

    const elapsedTime = clock.getElapsedTime();

    // camera.position.y = Math.sin(elapsedTime) * 1.5;
    // camera.position.x = Math.cos(elapsedTime) * 1.5;
    // camera.lookAt(meshes[lookAtIndex].position);
    // if (camera.position.y < -1.49999) {
    //     // console.log(camera.position.y)
    //     console.log(lookAtIndex)
    //     lookAtIndex = lookAtIndex > 7 ? 0 : lookAtIndex + 1;
    //     console.log(lookAtIndex)
    // }

    // mesh2.rotateY(0.001 * delta);

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}



document.addEventListener('keydown', event => {
    // console.log(event.code);
    switch (event.code) {
        case 'ArrowLeft': camera.position.x = camera.position.x - 0.05; break;
        case 'ArrowRight': camera.position.x = camera.position.x + 0.05; break;
        case 'ArrowUp': camera.position.z = camera.position.z - 0.05; break;
        case 'ArrowDown': camera.position.z = camera.position.z + 0.05; break;
        case 'Space': camera.position.y = camera.position.y + 0.05; break;
        case 'ShiftLeft': camera.position.y = camera.position.y - 0.05; break;
        case 'KeyE': camera.rotateY(0.03); break;
        case 'KeyQ': camera.rotateY(-0.03); break;
    }
})

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})

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
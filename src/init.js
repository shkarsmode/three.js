import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './style.css';

const init = (isAxesHelper = true) => {
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    };

    const scene = new THREE.Scene();
    const canvas = document.querySelector('.canvas');
    const fpsBlock = document.querySelector('.fps');
    const range = document.querySelector('input[type="range"]');

    range.value = localStorage.getItem('fov') ?? 120;

    const camera = new THREE.PerspectiveCamera(
        localStorage.getItem('fov') ?? 120, sizes.width / sizes.height
    );

    camera.position.z = 3;

    scene.add(camera);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);

    initAxesHelper();
    initViewRangeListener();
    initResizeListener();
    initKeyboardKeydownListener();

    function initAxesHelper() {
        if (!isAxesHelper) return;

        const axesHelper = new THREE.AxesHelper(3)
        scene.add(axesHelper);
    }

    function initViewRangeListener() {
        range.addEventListener('input', event => {
            camera.fov = event.target.value;
            camera.updateProjectionMatrix();
            localStorage.setItem('fov', camera.fov);
        })
    }

    function initResizeListener() {
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    function initKeyboardKeydownListener() {
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
    }


    return { sizes, scene, canvas, camera, renderer, controls, fpsBlock };
}

export default init;


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
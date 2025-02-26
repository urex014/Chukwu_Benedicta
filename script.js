
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap'; 

const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 13;

const scene = new THREE.Scene();
let bee;
let mixer;
const loader = new GLTFLoader();
loader.load('/toon_thumbs_up.glb', function (gltf) {
    bee = gltf.scene;
    scene.add(bee);

    mixer = new THREE.AnimationMixer(bee);
    if (gltf.animations.length > 0) {
        mixer.clipAction(gltf.animations[0]).play();
    }

    bee.scale.set(1, 1, 1);
    bee.position.set(0, -1, -5);
    bee.rotation.set(0, 0, 0);
}, undefined, function (error) {
    console.error('Error loading model:', error);
});

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.zIndex = '-1';
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';

// my model light
const ambientLight = new THREE.AmbientLight(0xffffff, 8.0);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 0.5);
topLight.position.set(500, 500, 500);
scene.add(topLight);

// for my model guy to keep waivng, i loop the animation
const reRender3D = () => {
    requestAnimationFrame(reRender3D);
    renderer.render(scene, camera);
    if (mixer) mixer.update(0.02);
};
reRender3D();

// move when i scroll
const modelMove = () => {
    if (!bee) return;

    //  scroll percentage (0 to 1)
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollProgress = scrollY / maxScroll;

    // rotate model on the y axis 
    const rotationY = scrollProgress * Math.PI * 2; // Rotates 360°
    
    // iterative zoom in as i scroll
    const zoomZ = 13 - scrollProgress * 8; // From 13 → 5 (closer)

    // trnsition(not yet smooth. probably becuase of the html content is less)
    gsap.to(bee.rotation, { duration: 0.5, y: rotationY, ease: 'power1.out' });
    gsap.to(camera.position, { duration: 0.5, z: zoomZ, ease: 'power1.out' });
};

window.addEventListener('scroll', modelMove);

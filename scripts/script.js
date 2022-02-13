'use strict';
//import * as THREE from 'https://cdn.skypack.dev/three@0.135.0';
import * as THREE from './three.module.js';
// import { OrbitControls } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/controls/OrbitControls'
import Particle from './Particle.js';
import { attractionForce, repulsionForce } from './forces.js';

const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({canvas});
const scene = new THREE.Scene();

scene.background = new THREE.Color( 0xffc7d4 );

const cameraSettings = {
    fov: 75,
    aspect: 2,
    near: 0.1,
    far: 150
}

const camera = new THREE.PerspectiveCamera(
    cameraSettings.fov,
    cameraSettings.aspect,
    cameraSettings.near,
    cameraSettings.far
);

camera.position.set(0,0,12);

// const controls = new OrbitControls( camera, renderer.domElement );
// controls.autoRotate = true;
// controls.autoRotateSpeed = 5;

// controls.update();

{
    const lightColor = 0xFFFFFF;
    const keyLight = new THREE.DirectionalLight(lightColor, .75);
    keyLight.position.set(-2, 8, 10);
    keyLight.castShadow = true;
    scene.add(keyLight);
    
    const fillLight = new THREE.DirectionalLight( lightColor, .5);
    fillLight.position.set(10, -5, 8);
    scene.add(fillLight);
    
    const worldLight = new THREE.AmbientLight( 0x404040, .5 );
    scene.add(worldLight);
}


const geometry = new THREE.SphereGeometry(.15, 12, 6);
const blueMaterial = new THREE.MeshPhongMaterial({color: 0xADD8E6});
const purpleMaterial = new THREE.MeshPhongMaterial({color: 0xA865C9});
const particles = [];

let ampX, ampY, angle, repulsionStrength;

// const targetGeo  = new THREE.SphereGeometry(.1);
// const targetMat = new THREE.MeshBasicMaterial({color: 0xFF0000});
// const targetMesh = new THREE.Mesh(targetGeo, targetMat);
// scene.add(targetMesh);

function init() {
    ampX = 1;
    ampY = 1;
    angle  = 0;
    repulsionStrength = .0001;

    for (let i=0; i<650; i++) {
        const particle = new THREE.Mesh(geometry, i % 2 === 0 ? blueMaterial : purpleMaterial);
        particle.castShadow = true;
        particle.receiveShadow = true;

        scene.add(particle);
        
        let dist = 10;
        particle.position.x = THREE.MathUtils.randInt(-dist, dist);
        particle.position.y = THREE.MathUtils.randInt(-dist, dist);
        particle.position.z = THREE.MathUtils.randInt(-dist, dist);
    
        particles.push(new Particle(particle));
    }

}






function draw(time) {
    time *= 0.001;
    
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    particles.forEach(particle => {
        let force;
        let attractionPoint = {
            x: ampX * Math.cos(angle),
            y: ampY * Math.sin(angle)
        }

        if (particles.indexOf(particle) % 2 === 0) {
            force = attractionForce(particle.mesh.position, new THREE.Vector3(attractionPoint.x,attractionPoint.y,0), false);
        } else {
            force = attractionForce(particle.mesh.position, new THREE.Vector3(-attractionPoint.x,-attractionPoint.y,0), false);
        }
        
        const totalRepulsionForce = new THREE.Vector3();
        particles.forEach(otherParticle => {
            if (particle !== otherParticle) {
                totalRepulsionForce.add(repulsionForce(particle.mesh, otherParticle.mesh));
            }
        });

        totalRepulsionForce.normalize;
        totalRepulsionForce.multiplyScalar(repulsionStrength);

        particle.applyForce(force);
        particle.applyForce(totalRepulsionForce);
        
        particle.update();     

        angle+=.00001;
    });

    // controls.update();

    renderer.render(scene,camera);

    requestAnimationFrame(draw);
}



function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
}

window.addEventListener('load' , () => {
    init();
    requestAnimationFrame(draw);
}, false);
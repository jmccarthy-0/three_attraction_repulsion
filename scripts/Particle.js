import * as THREE from './three.module.js';

class Particle {
    constructor(mesh) {
        this.mesh = mesh;
        this.velocity = new THREE.Vector3();
        this.acceleration = new THREE.Vector3();
        this.mass = 1;
    }
    
    /**
     * 
     * @param {THREE.Vector3} force 
     */
    applyForce(force) {
        this.acceleration.add(force);
    }

    updateVelocity() {
        this.velocity.add(this.acceleration);
        this.velocity.clampScalar(-.1,.1);
        this.acceleration.multiplyScalar(0);
    }

    setPosition() {
        this.mesh.position.add(this.velocity);
    }

    setColor() {
        const dist = this.mesh.position.distanceTo(new THREE.Vector3());
        const r = THREE.MathUtils.mapLinear(dist, 0, 15, 0 , 255);

        this.mesh.material = this.mesh.material.clone();
        this.mesh.material.color.r  = r;

    }

    update() {
        this.updateVelocity();
        this.setPosition();
        //this.setColor();
    }
}

export default Particle;
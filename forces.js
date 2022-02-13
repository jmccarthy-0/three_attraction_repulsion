import * as THREE from './three/build/three.module.js';

function attractionForce(particlePosition, point, log = false) {
    // Gravity = unit vector * (G * m1 * m2) / distance ^ 2
    const g = 0.4;

    //let force = new THREE.Vector3().subVectors(point, particlePosition);
    
    let force = point.sub(particlePosition);

    if (log) {
        console.log({particlePosition})
        console.log({point});
        console.log({force});
    }

    //const distance = force.mag();
    //const strength = (g *  particle.mass * m2) / Math.pow(distance, 2); 
    const strength = .01;

    force.normalize();
    force.multiplyScalar(strength);

    return(force);

}


function repulsionForce(currentParticle, otherParticle) {
    const distance = currentParticle.position.distanceTo(otherParticle.position);

    if (distance < 5) { 
        let force = currentParticle.position.clone().sub(otherParticle.position);
        force.normalize();

       return force;
    }

    return new THREE.Vector3(); 
}

export { attractionForce, repulsionForce };
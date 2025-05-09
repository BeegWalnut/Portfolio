import * as THREE from './three.min.js';

let scene, camera, renderer, planet, rings, galaxy;

init();


function init() {

    // Scene & camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    // Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(devicePixelRatio);

    // wait until the Landing component is in the DOM
    getOrWait('hero-canvas', el => el.appendChild(renderer.domElement));

    /* ---------- Planet + rings ---------- */
    // planet
    planet = new THREE.Mesh(
        new THREE.SphereGeometry(2, 48, 48),
        new THREE.MeshStandardMaterial({ color: 0x8878ff, roughness: .5 })
    );
    scene.add(planet);

    //// rings
    //const ringGeo = new THREE.RingGeometry(2.4, 4, 64);
    //const ringMat = new THREE.MeshBasicMaterial({
    //    color: 0xd0c8ff,
    //    side: THREE.DoubleSide,
    //    transparent: true,
    //    opacity: .6
    //});
    //rings = new THREE.Mesh(ringGeo, ringMat);
    //rings.rotation.x = Math.PI / 2.4;
    //scene.add(rings);

    /* ---------- Lighting ---------- */
    scene.add(new THREE.AmbientLight(0xffffff, .5));
    const dir = new THREE.DirectionalLight(0xffffff, .8);
    dir.position.set(5, 2, 5);
    scene.add(dir);

    /* ---------- Galaxy point-cloud ---------- */
    const starGeo = new THREE.BufferGeometry();
    const count = 2000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const r = 1.5 + Math.random() * 6;
        const theta = Math.random() * Math.PI * 2;
        pos[i * 3] = Math.cos(theta) * r;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 2;
        pos[i * 3 + 2] = Math.sin(theta) * r;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const sprite = makeStarSprite(0x88aaff);
    const starMat = new THREE.PointsMaterial({
        size: 0.12, map: sprite,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    galaxy = new THREE.Points(starGeo, starMat);
    scene.add(galaxy);

    window.addEventListener('resize', () => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
    });

    document.addEventListener('scroll', () => {
        const t = Math.min(scrollY / 1000, 1);       // zoom cam while scrolling
        camera.position.z = 8 - 5 * t;
    });

    animate();
    //animateGalaxy();
}


function animate() {
    requestAnimationFrame(animate);
    planet.rotation.y += 0.002;
    //rings.rotation.z += 0.0004; 
    galaxy.rotation.y += 0.00008;  // gentle spin
    renderer.render(scene, camera);
}

function getOrWait(id, cb) {
    const el = document.getElementById(id);
    if (el) { cb(el); return; }
    // Try again on the next frame until Blazor has rendered it
    requestAnimationFrame(() => getOrWait(id, cb));
}

// sprite helper
function makeStarSprite(hexColor) {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, '#fff');
    grad.addColorStop(0.2, '#fff');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = `#${hexColor.toString(16).padStart(6, '0')}`;
    ctx.fillRect(0, 0, size, size);

    return new THREE.CanvasTexture(canvas);
}

//const sphere = new THREE.Mesh(
//    new THREE.SphereGeometry(3, 32, 32),
//    new THREE.MeshBasicMaterial({ color: 0x00d8ff, wireframe: true })
//);
//scene.add(sphere);

//const crystalGeo = new THREE.IcosahedronGeometry(3, 1);
//const crystalMat = new THREE.MeshStandardMaterial({
//    color: 0x0080ff,
//    flatShading: true,
//    metalness: .1,
//    roughness: .8
//});
//const crystal = new THREE.Mesh(crystalGeo, crystalMat);
//scene.add(new THREE.AmbientLight(0xffffff, .8));
//scene.add(crystal);

//// hue-shift
//let hue = 0;
//setInterval(() => {
//    hue = (hue + 1) % 360;
//    crystalMat.color.setHSL(hue / 360, .6, .6);
//}, 60);


//const starGeo = new THREE.BufferGeometry();
//const count = 2000;
//const pos = new Float32Array(count * 3);

//for (let i = 0; i < count; i++) {
//    const radius = 1.5 + Math.random() * 6;
//    const angle = Math.random() * Math.PI * 2;
//    pos[i * 3] = Math.cos(angle) * radius;
//    pos[i * 3 + 1] = (Math.random() - .5) * 2;
//    pos[i * 3 + 2] = Math.sin(angle) * radius;
//}
//starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

//const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: .05 });
//const galaxy = new THREE.Points(starGeo, starMat);
//scene.add(galaxy);

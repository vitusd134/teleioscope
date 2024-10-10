const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const renderer = new THREE.WebGLRenderer({canvas: document.getElementById('glCanvas')});
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.PlaneGeometry(2, 2);
const uniforms = {
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    speed: { value: 1.0 },
    rotation: { value: 1.0 },
    colorCycleSpeed: { value: 1.0 },
    colorIntensity: { value: 1.0 },
    enableTeleidoscope: { value: false },
    zoom: { value: 1.0 },
    teleidoscopeSides: { value: 6 },
    teleidoscopeRotationSpeed: { value: 1.0 },
    shapeType: { value: 1 }
};

const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const gui = new dat.GUI();
// Add fullscreen toggle button
gui.add({
    toggleFullscreen: function() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
}, 'toggleFullscreen').name('Toggle Fullscreen');

gui.add(uniforms.shapeType, 'value', { Circle: 1, Square: 0, Star: 3, Cross: 2}).name('Shape');
gui.add(uniforms.speed, 'value', 0, 5).name('Speed');
gui.add(uniforms.rotation, 'value', 0, 5).name('Rotation');
gui.add(uniforms.colorCycleSpeed, 'value', 0, 10).name('Color Speed');
gui.add(uniforms.colorIntensity, 'value', 0, 2).name('Color Intensity');
gui.add(uniforms.enableTeleidoscope, 'value').name('Teleidoscope');
gui.add(uniforms.zoom, 'value', 0.1, 5).name('Zoom');
gui.add(uniforms.teleidoscopeSides, 'value', 3, 12).step(1).name('# of Sides');
gui.add(uniforms.teleidoscopeRotationSpeed, 'value', -5, 5).name('Spin');

function animate(time) {
    uniforms.iTime.value = time / 1000;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

window.addEventListener('resize', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    uniforms.iResolution.value.set(width, height);
});

// Update canvas size when entering or exiting fullscreen
document.addEventListener('fullscreenchange', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    uniforms.iResolution.value.set(width, height);
});

requestAnimationFrame(animate);

// Fullscreen toggle functionality
const fullscreenToggle = document.getElementById('fullscreen-toggle');

fullscreenToggle.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  } else {
    document.exitFullscreen();
  }
});

document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) {
    fullscreenToggle.textContent = '⤢ Exit Fullscreen';
  } else {
    fullscreenToggle.textContent = '⤢ Toggle Fullscreen';
  }
});
import {
  Camera,
  GLTFLoader,
  Orbit,
  Program,
  Renderer,
  Transform,
  Vec3,
} from "https://unpkg.com/ogl";

const vertex = /* glsl */ `
        attribute vec3 position;
        attribute vec3 normal;

        uniform mat3 normalMatrix;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;

        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

const fragment = /* glsl */ `
        precision highp float;

        uniform vec3 uColor;

        void main() {
            gl_FragColor.rgb = uColor;
            gl_FragColor.a = 0.4;
        }
    `;

let mx = 0;
let my = 0;

window.addEventListener("mousemove", () => {});

export default function (wrapper) {
  const renderer = new Renderer({
    dpr: 2,
    width: window.innerWidth / 2,
  });
  const gl = renderer.gl;
  wrapper.appendChild(gl.canvas);
  gl.clearColor(0, 0, 0, 1);

  const camera = new Camera(gl, { fov: 35 });
  camera.position.set(0, 0, 10);
  camera.lookAt([0, 0, 0]);

  function resize() {
    renderer.setSize(window.innerWidth / 2, window.innerHeight * 0.8);
    camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
  }
  window.addEventListener("resize", resize, false);
  resize();

  const scene = new Transform();
  scene.rotation.x = Math.PI / 2;

  const fixedCamera = false;

  let polar = 1 + Math.random();
  let azimuth = -1 + Math.random() * 2;

  const controls = new Orbit(camera, {
    enableZoom: false,
    element: wrapper,
    minDistance: fixedCamera ? 10 : 8,
    maxDistance: 10,
    minPolarAngle: fixedCamera ? polar : 1,
    maxPolarAngle: fixedCamera ? polar : 2,
    minAzimuthAngle: fixedCamera ? azimuth : -1,
    maxAzimuthAngle: fixedCamera ? azimuth : 1,
  });

  const colors = ["BFB033", "212120", "8F8053", "BAB5A8", "A20504"];

  (async () => {
    const gltf = await GLTFLoader.load(gl, `assets/Konstrukt_01.glb`);
    const s = gltf.scene || gltf.scenes[0];
    s.forEach((root) => {
      root.setParent(scene);
      root.traverse((node) => {
        if (node.program) {
          node.program = new Program(gl, {
            vertex,
            fragment,
            transparent: true,
            uniforms: {
              uColor: {
                value: new Vec3(Math.random(), Math.random(), Math.random()),
              },
            },
          });
        }
      });
    });
  })();

  requestAnimationFrame(update);
  function update() {
    requestAnimationFrame(update);

    controls.update();

    renderer.render({ scene, camera });
  }
}

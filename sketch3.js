import {
  Camera,
  Color,
  GLTFLoader,
  Program,
  Renderer,
  Texture,
  Transform,
} from "./assets/ogl/index.mjs";

const vertex = /* glsl */ `
        attribute vec3 position;
        attribute vec3 normal;
        attribute vec2 uv;

        uniform mat3 normalMatrix;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

const fragment = /* glsl */ `
        precision highp float;

        uniform vec3 uColor;
        uniform sampler2D uGrunge;

        varying vec2 vUv;

        const float grungeIntensity = 0.25;

        void main() {
            vec3 tex = texture2D(uGrunge, vUv).rgb;
            gl_FragColor.rgb = uColor*(1.0+tex*grungeIntensity-grungeIntensity/2.0);
            gl_FragColor.a = 0.4;
        }
    `;

let mx = 0;
let my = 0;

let cx = 0;
let cy = -Math.PI / 2;

const colors = [
  ["BFB033", "212120", "8F8053", "BAB5A8", "A20504"],
  ["1B1B14", "92816D", "DED8BF", "DAAF45", "9F1B04"],
  ["9B8C81", "E5D6C2", "948D8A", "716961", "2B2625"],
  ["221F20", "6A5F55", "D9BF9F", "F6E7D1", "735D42"],
  ["281C23", "948A8B", "D45F55", "816B67", "949785"],
  ["D0291A", "DE6A2B", "F8CF66", "F3E9EA", "10090A"],
  ["232022", "642F26", "A44F39", "AF6C5B", "B9B1A3"],
  ["B33E26", "C29F28", "C9B677", "D5C7C2", "211F1D"],
];

const pickRandom = (arr) => arr[Math.floor(arr.length * Math.random())];
const lerp = (a, b, alpha) => a * alpha + b * (1 - alpha);

export default function (wrapper) {
  const colorScheme = pickRandom(colors);

  wrapper.addEventListener("mousemove", ({ clientX, clientY }) => {
    mx = clientX / window.innerWidth - 0.5;
    my = clientY / window.innerHeight - 0.5;
  });

  const renderer = new Renderer({
    dpr: 2,
    antialias: true,
    width: window.innerWidth / 2,
  });
  const gl = renderer.gl;
  wrapper.appendChild(gl.canvas);
  gl.clearColor(0.06, 0.06, 0.06, 1);

  const camera = new Camera(gl, { fov: 35 });
  camera.position.set(0, 0, 10);
  camera.lookAt([0, 0, 0]);

  const camParent = new Transform();
  camera.setParent(camParent);

  function resize() {
    renderer.setSize(window.innerWidth / 2, window.innerHeight * 0.8);
    camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
  }
  window.addEventListener("resize", resize, false);
  resize();

  const scene = new Transform();
  scene.rotation.x = Math.PI;
  window.s = scene;
  camParent.setParent(scene);

  const fixedCamera = false;

  let polar = 1 + Math.random();
  let azimuth = -1 + Math.random() * 2;

  // const controls = new Orbit(camera, {
  //   enableZoom: false,
  //   element: wrapper,
  //   minDistance: fixedCamera ? 10 : 8,
  //   maxDistance: 10,
  //   minPolarAngle: fixedCamera ? polar : 1,
  //   maxPolarAngle: fixedCamera ? polar : 2,
  //   minAzimuthAngle: fixedCamera ? azimuth : -1,
  //   maxAzimuthAngle: fixedCamera ? azimuth : 1,
  // });

  (async () => {
    const gltf = await GLTFLoader.load(gl, `assets/Konstrukt_01.glb`);
    const s = gltf.scene || gltf.scenes[0];

    // Upload empty texture while source loading
    const texture = new Texture(gl);

    // update image value with source once loaded
    const img = new Image();
    img.src =
      "assets/textures/grunge_0" + Math.floor(1 + Math.random() * 6) + ".jpg";
    img.onload = () => (texture.image = img);

    s.forEach((root) => {
      root.setParent(scene);
      root.traverse((node) => {
        if (node.program) {
          node.program = new Program(gl, {
            vertex,
            fragment,
            transparent: true,
            uniforms: {
              uGrunge: {
                value: texture,
              },
              uColor: {
                value: new Color("#" + pickRandom(colorScheme)),
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

    // controls.update();

    if (true) {
      cx = lerp(cx, -mx * 10, 0.95);
      cy = lerp(cy, -Math.PI / 2 - my, 0.95);
    }

    camera.position.x = cx;
    camParent.rotation.x = cy;
    camera.lookAt([0, 0, 0]);

    renderer.render({ scene, camera });
  }
}

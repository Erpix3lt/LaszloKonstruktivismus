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

        const float grungeIntensity = 0.2;

        void main() {
            vec3 tex = texture2D(uGrunge, vUv).rgb;
            gl_FragColor.rgb = uColor*(1.0+tex*grungeIntensity-grungeIntensity/2.0);
            gl_FragColor.a = 0.7;
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
const random = (v = 1) => (Math.random() - 0.5) * v;

export default function (wrapper) {

  wrapper.addEventListener("mousemove", ({ clientX, clientY }) => {
    mx = clientX / window.innerWidth - 0.5;
    my = clientY / window.innerHeight - 0.5;
  });

  const renderer = new Renderer({
    dpr: 2,
    antialias: true,
    alpha: true,
    width: window.innerWidth / 2,
  });
  const gl = renderer.gl;
  wrapper.appendChild(gl.canvas);
  gl.clearColor(0, 0, 0, 0);

  const camera = new Camera(gl, { fov: 35 });
  camera.position.set(0, 0, 10);
  camera.lookAt([0, 0, 0]);

  const camParent = new Transform();
  camParent.rotation.x = Math.PI / 2;
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

  const konstrukte = [];
  const konstruktParent = new Transform();
  konstruktParent.scale.set(0.4);
  konstruktParent.setParent(scene);
  // Upload empty texture while source loading
  const texture = new Texture(gl);

  function init() {
    if (konstruktParent.children.length) {
      konstruktParent.children.length = 0;
    }

    camera.position.x = random(4);
    camera.position.y = random(4);
    camera.lookAt([0, 0, 0]);

    if (!konstrukte.length) return;

    // update image value with source once loaded
    const img = new Image();
    img.src =
      "assets/textures/grunge_0" + Math.floor(1 + Math.random() * 6) + ".jpg";
    img.onload = () => (texture.image = img);

    const amount = 3 + Math.floor(Math.random() * 5);

    const newKonstrukte = new Array(amount)
      .fill(null)
      .map(() => pickRandom(konstrukte));

		const colorScheme = pickRandom(colors);
    
		newKonstrukte.forEach((node) => {
      node.position.x = random(5);
      node.position.y = random(1);
      node.position.z = random(5);

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
    });

    newKonstrukte.forEach((konst) => konst.setParent(konstruktParent));
  }

  (async () => {
    const gltf = await GLTFLoader.load(gl, `assets/Konstrukte_01.glb`);
    konstrukte.push(...gltf.nodes.map((node) => node.children).flat());
    init();
  })();

  requestAnimationFrame(update);
  function update() {
    requestAnimationFrame(update);

    renderer.render({ scene, camera });
  }

  return init;
}

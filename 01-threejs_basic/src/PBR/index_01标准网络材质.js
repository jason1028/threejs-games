/**********
 * 目标：标准网格材质（MeshStandardMaterial）
 *      默认不会加载其他的材质属性，不要加入灯光（直线光directLight、环境光AmbinetLight）才会显示；
***********/

import * as THREE from 'three';
// 导入动画库
import gsap from 'gsap';
// 导入ui界面控制库
import * as dat from 'dat.gui';

// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 创建一个场景(场景就是要创建一个环境)
const scene = new THREE.Scene();

// 创建一个相机(相机，相当于一个的眼睛)
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth/window.innerHeight,
    0.1,
    10000
);

// 设置相机位置x，y，z(vector3 三维向量)
camera.position.set(0, 0, 10);
// 将相机添加至场景
scene.add(camera);

// 导入纹理加载器
const textureLoader = new THREE.TextureLoader();
// 加载对应的图片
// const zyColorTexture = textureLoader.load('./textures/zy/01.jpg');
const doorColorTexture = textureLoader.load('./textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg');
const doorAoTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg');

// 纹理偏移
// zyColorTexture.offset.x = 0.5;
// zyColorTexture.offset.y = 0.5;
// zyColorTexture.offset.set(0.5, 0.5);

// 设置旋转的原点（默认原点为：0, 0）
// zyColorTexture.center.set(0.5, 0.5);
// 设置纹理旋转45° (旋转目标是以0，0开始)
// zyColorTexture.rotation = Math.PI / 4;
// 设置纹理的重复
// zyColorTexture.repeat.set(1, 3);
// 设置纹理重复的模式
// zyColorTexture.wrapS = THREE.MirroredRepeatWrapping;
// zyColorTexture.wrapS = THREE.RepeatWrapping;


// 纹理显示设置
// doorColorTexture.minFilter = THREE.NearestFilter;   // 按最近的元素颜色设置
// doorColorTexture.magFilter = THREE.NearestFilter;   // 按最近的元素颜色设置

// doorColorTexture.minFilter = THREE.LinearEncoding; // 按线性取平均色
// doorColorTexture.magFilter = THREE.LinearEncoding;

// 创建物体
const cuteGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
// 设置材质
const material = new THREE.MeshStandardMaterial({
    // color: '#ffff00',
    map: doorColorTexture, // 颜色纹理添加
    alphaMap: doorAlphaTexture,
    transparent: true,  // 要想设置透明，这个必须填写
    aoMap: doorAoTexture, // 设置遮挡纹理，但需要第二组UV
    // opacity: 1,
    side: THREE.DoubleSide  // 渲染前后2面，默认是fontSide，也可以设置backSide
});

// 添加物体
const cute = new THREE.Mesh(cuteGeometry, material);
console.log(cuteGeometry);
scene.add(cute);
// 给plane设置第二组UV
cuteGeometry.setAttribute('uv2', new THREE.BufferAttribute(cuteGeometry.attributes.uv.array, 2));

// 添加平面
const planeGeometry = new THREE.PlaneBufferGeometry(1, 1);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(1, 0, 0);

scene.add(plane);
// 给plane设置第二组UV
planeGeometry.setAttribute('uv2', new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2));

// 添加光源(环境光)
const light = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(light);

// 添加光源（直射光，也叫平行光）
const directional = new THREE.DirectionalLight(0xffffff, 0.99);
// 设置光源位置
directional.position.set(10, 10, 10);
scene.add(directional);

// 初始化渲染器
const renderer = new THREE.WebGL1Renderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

// 将webgl渲染的canvas内容添加到body上
document.body.appendChild(renderer.domElement);

// 创建轨道控制器，控制器控制camera(相机)，指定渲染器里面的domElement元素
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器的阻尼（惯性，看起来更加有真实的效果）, 必须在我们动画循环里面调用.update()
controls.enableDamping = true;

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

window.addEventListener('dblclick', () => {
    const fullScreenElement = document.fullscreenElement;
    // 判断是否有全屏元素
    if(!fullScreenElement) {
        // 屏幕双击时全屏 (canvas全屏)
        renderer.domElement.requestFullscreen();
    }else {
        // 退出全屏
        document.exitFullscreen();
    }
});

// 渲染函数
function render(time) {
    // 如果前面设置了阻尼(惯性)效果，每次渲染就必须要调用.update()
    controls.update();
    // 使用渲染器，通过相机将场景渲染进来
    renderer.render(scene, camera);
    // 下一帧执行渲染
    requestAnimationFrame(render);
}

// 开始渲染
render();

// 监听浏览器窗口变化，更新渲染画面
window.addEventListener('resize', () => {
    // 更新摄像头宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    // 更新摄像机的投影矩阵
    camera.updateProjectionMatrix();
    // 更新渲染器高宽
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 设置渲染器的像素比(其实就是分辨率)
    renderer.setPixelRatio(window.devicePixelRatio);
});
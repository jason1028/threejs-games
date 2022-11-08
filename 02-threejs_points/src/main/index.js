/**********
 * 目标： 用pointer打造星河
 * 主要内容：
 *     代码：50 ~ 89
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
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight);

// 设置相机位置x，y，z  (vector3 三维向量)
camera.position.set(0, 0, 10);
// 将相机添加至场景
scene.add(camera);

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.size = 0.5;
const count = 5000;

// 设置换冲区数组
const positions = new Float32Array(count * 3);
// 设置每一个顶点的颜色
const colors = new Float32Array(count * 3);

// 设置顶点
for(let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 30;
};
// 设置位置，每3个数作为一个x,y,z的坐标
particlesGeometry.setAttribute(
    'position', 
    new THREE.BufferAttribute(positions, 3)
);

// const colors = new Float32Array();

// 创建点的材质
const pointMaterial = new THREE.PointsMaterial();
// 设置点材质的大小
pointMaterial.size = 0.1;
// 设置颜色
pointMaterial.color.set(0xffff00);
// 看上去每个点的大小一样（不随距离而衰减，一直不设置默认为true，因为不存在3d真实效果了）
// pointMaterial.sizeAttenuation = false;

// 载入纹理
const texttrueLoader = new THREE.TextureLoader();
const texture = texttrueLoader.load('./textures/particles/5.png');

// 设置纹理
pointMaterial.map = texture;
pointMaterial.alphaMap = texture;   // 设置透明效果（黑色完全透明，白色不透明）
pointMaterial.transparent = true;   // 设置这个透明才能生效
pointMaterial.depthWrite = false;   // 前面是否可以挡住后面
pointMaterial.blending = THREE.AdditiveBlending; // 设置叠加效果，当前后2个点叠加的时候，设置的效果

const points = new THREE.Points(particlesGeometry, pointMaterial);
scene.add(points);

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
    // console.log('画面变化了...');
    // 更新摄像头宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    // 更新摄像机的投影矩阵
    camera.updateProjectionMatrix();
    // 更新渲染器高宽
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 设置渲染器的像素比(其实就是分辨率)
    renderer.setPixelRatio(window.devicePixelRatio);
});
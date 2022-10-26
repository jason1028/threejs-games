/**********
 * 目标：打造酷炫三角形；
 * 主要内容：
 *     代码：32 ~ 47
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

// 设置相机位置x，y，z  (vector3 三维向量)
camera.position.set(0, 0, 10);
// 将相机添加至场景
scene.add(camera);

// 创建物体
for (let i = 0; i < 30; i++) {
    // 每一个三角形由3个顶点，每个顶点需要3个值作为坐标
    const geometry = new THREE.BufferGeometry();
    const positionArray = new Float32Array(9);
    for(var j = 0; j < 9; j++) {
        positionArray[j] = Math.random() * 10 - 5;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    let color = new THREE.Color(Math.random(), Math.random(), Math.random());
    // - 设置材质(基础网格材质) 比如物体的颜色等等
    const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5 });
    // 生成物体
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}


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
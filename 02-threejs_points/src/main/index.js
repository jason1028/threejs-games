/**********
 * 目标： 设置飘动的雪花
 * 主要内容：
 *      
***********/

import * as THREE from 'three';
// 导入动画库
import gsap from 'gsap';
// 导入ui界面控制库
import * as dat from 'dat.gui';

// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Clock } from 'three';

// 创建一个场景(场景就是要创建一个环境)
const scene = new THREE.Scene();

// 创建一个相机(相机，相当于一个的眼睛)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

// 设置相机位置x，y，z  (vector3 三维向量)
camera.position.set(0, 0, 20);
// 将相机添加至场景
scene.add(camera);

// 粒子纹理
const textrueLoader = new THREE.TextureLoader();
const particlesTexture = textrueLoader.load('./textures/particles/1.png');

const params = {
    count: 1000,
    size: 0.2,
    radius: 5,
    branch: 3,
    color: "#ffffff"
};

let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {
    // 生成顶点
    geometry = new THREE.BufferGeometry();
    // 随机生成位置
    const positions = new Float32Array(params.count * 3);
    // 设置顶点颜色
    const colors = new Float32Array(params.count * 3);

    // 循环生成点
    for(let i = 0; i < params.count; i++) {
        // 当前的点应该在哪一条分支
        const branchAngel = (i % params.branch) * ((2 * Math.PI) / params.branch);

        // 当前点距离圆心的距离
        const distance = Math.random() * params.radius;
        const current = i * 3;
        positions[current] = Math.cos(branchAngel) * distance;
        positions[current + 1] = 0;
        positions[current + 2] = Math.sin(branchAngel)* distance;
    }

    // 每3个点位一组坐标
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // 设置材质
    material = new THREE.PointsMaterial({
        color: new THREE.Color(params.color),
        size: params.size,
        // 远距离小，近距离大的效果
        sizeAttenuation: true,
        // 前面是否可以挡住后面
        depthWrite: false,
        // 效果是否叠加
        blending: THREE.AdditiveBlending,
        // 设置纹理
        map: particlesTexture,
        // 设置透明纹理
        alphaMap: particlesTexture,
        // 跟alphaMap同时使用，不然alphaMap不会生效
        transparent: true,
        // 顶点颜色
        // vertexColors: true
    });

    points = new THREE.Points(geometry, material);
    debugger;
    scene.add(points);
}

generateGalaxy();

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

const clock = new THREE.Clock();

// 渲染函数
function render() {
    // 如果前面设置了阻尼(惯性)效果，每次渲染就必须要调用.update()
    controls.update();
    let time = clock.getElapsedTime();
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
/**********
 * 目标：通过CuteTextureLoader加载6面（正方体）环境贴图，添加至场景中和金属物体上，金属物体反射当前环境的内容
 *      2、什么是HDR? HDR文件是将多张图合并至一张，提升图片效果。
 *         比如：苹果手机黑夜拍照，就是将不同光源的地方分成多张图片处理后，再合并为一张图，这就是HDR。
 *      代码：32 ~ 49
***********/

import * as THREE from 'three';
// 导入动画库
import gsap from 'gsap';
// 导入ui界面控制库
import * as dat from 'dat.gui';

// 加载HDR动图
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
// 加载hdr环境图
const rgbeLoader = new RGBELoader();
rgbeLoader.loadAsync('textures/hdr/002.hdr').then((texture) => {
    // 设置纹理映射，如果不设置就是一张平面图，不是6面。也叫做：经纬线映射贴图
    texture.mapping = THREE.EquirectangularReflectionMapping;
    // 给场景添加环境
    scene.background = texture;
    // 给mesh填上映射
    scene.environment = texture;
});

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


// 设置cube纹理加载器(cube是用来设置你当前的环境的，比如天空、地面、旁边的环境)
const cuteTextureLoader = new THREE.CubeTextureLoader();
const envMapTexture = cuteTextureLoader.load([
    'textures/environmentMaps/1/px.jpg',
    'textures/environmentMaps/1/nx.jpg',
    'textures/environmentMaps/1/py.jpg',
    'textures/environmentMaps/1/ny.jpg',
    'textures/environmentMaps/1/pz.jpg',
    'textures/environmentMaps/1/nz.jpg',
]);

// 创建一个球体几何模型（1，20，20）
const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20);
// 设置材质
const material = new THREE.MeshStandardMaterial({
    metalness: 0.7,
    roughness: 0,
    // envMap: envMapTexture   // 添加环境贴图，这里可以自定义
});
// 生成mesh物体
const sphereMesh = new THREE.Mesh(sphereGeometry, material);
// 添加mesh
scene.add(sphereMesh);
// 给场景设置环境贴图，让它在一个真实效果的展示
// scene.background = envMapTexture;
// 这一行代码与49行代码：envMap: envMapTexture是同一个效果 
// scene.environment = envMapTexture;

// 添加光源(环境光)
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

// 添加光源（直射光，也叫平行光）
const directional = new THREE.DirectionalLight(0xffffff, 1);
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
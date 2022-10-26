/**********
 * 目标：Three.js 纹理的属性；
 * 主要内容：
 *     代码：32 ~ 46
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

// 导入纹理加载器
const textureLoader = new THREE.TextureLoader();
// 加载对应的图片
const zyColorTexture = textureLoader.load('./textures/door/01.png');

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


// 创建物体
const cuteGeometry = new THREE.BoxBufferGeometry(2, 2, 2);
// 设置材质
const basicMaterial = new THREE.MeshBasicMaterial({
    // color: '#ffff00',
    map: zyColorTexture, // 颜色纹理添加
});

// 添加物体
const cute = new THREE.Mesh(cuteGeometry, basicMaterial);

console.log(cuteGeometry);
scene.add(cute);

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
/**********
 * 目标： 通过投射光线（Raycater）选中物体设置物体的材质
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

// 创建一个场景(场景就是要创建一个环境)
const scene = new THREE.Scene();

// 创建一个相机(相机，相当于一个的眼睛)
const camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 0.1, 1000);

// 设置相机位置x，y，z  (vector3 三维向量)
camera.position.set(0, 0, 20);
// 将相机添加至场景
scene.add(camera);

const cubeGeometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
    // 设置边框
    wireframe: true
});
const redMaterial = new THREE.MeshBasicMaterial({
    color: '#ff0000'
});

// 创建1000立方体
let cubeArr = [];

for(let i = -5; i < 5; i++) {
    for(let j = -5; j < 5; j++) {
        for(let z = -5; z < 5; z++) {
            const cube = new THREE.Mesh(cubeGeometry, material);
            cube.position.set(i, j , z);
            scene.add(cube);
            cubeArr.push(cube);
        }
    }
}

// 创建投射光线对象
const rayCaster = new THREE.Raycaster();

// 鼠标的位置对象
const mouse = new THREE.Vector2();

// 监听鼠标的位置
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
    // 设置投射
    rayCaster.setFromCamera(mouse, camera);
    // 得到鼠标的有效物体结果集
    const result = rayCaster.intersectObjects(cubeArr);
    // 拿到距离摄像机最近的物体，将其设置为redMeterail材质
    result[0].object.material = redMaterial;
});


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
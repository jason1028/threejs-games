import * as THREE from 'three';

// 导入ui界面控制库
import * as dat from 'dat.gui';

// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 导入PCD loader
// import { ZM_PCDLoader as PCDLoader } from "./ZM_PCDLoader";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader"

var pcdLoader = new PCDLoader();

// 创建一个场景(场景就是要创建一个环境)
const scene = new THREE.Scene();

// 创建一个相机(相机，相当于一个的眼睛)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight);

// 设置相机位置x，y，z  (vector3 三维向量)
camera.position.set(0, 0, 10);
// 将相机添加至场景
scene.add(camera);

// 加载pcd文件
function loadPCD(url) {
    debugger;
    try {
        pcdLoader.load(url, function(points) {
            points.material.color = new THREE.Color(0x00ffff); // 模型颜色
            scene.add(points);

            // 构造盒子
            // var middle = new THREE.Vector3();
            // points.geometry.computeBoundingBox();
            // points.geometry.boundingBox.getCenter(middle);
            // points.applyMatrix4(new THREE.Matrix4().makeTranslation(-middle.x, -middle.y,-middle.z));
        });
    }catch(err) {
        console.error('模型有点问题哦....', err);
    }
}

loadPCD('./pcd/01.pcd');


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
/**********
 * 目标：点光源属性与使用
 *      代码：63 ~ 86

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

// 设置材质
const material = new THREE.MeshStandardMaterial({// side: DoubleSide // emissive: 0xff6600
    metalness: 0.3
});


// 创建一个球体几何模型（1，20，20）
const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20);
// 生成mesh物体
const sphereMesh = new THREE.Mesh(sphereGeometry, material);
// 球体设置阴影
sphereMesh.castShadow = true;
// 添加mesh
scene.add(sphereMesh);

// 添加一个平面
const planeGeometry = new THREE.PlaneBufferGeometry(40, 40);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true; // 接收光源
scene.add(plane);

// 创建一个发光的小球
const smallBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0x00ffff }) // 蓝色
)
smallBall.position.set(2, 2, 2);

// 添加光源(环境光)
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

// 添加光源（点光源）
const pointLight = new THREE.PointLight(0x00ffff, 1);
// 设置光源位置
pointLight.position.set(2, 2, 2);
// 开始渲染阴影
pointLight.castShadow = true;
// 设置阴影贴图当中的20px模糊度
pointLight.shadow.radius = 20;
// 设置底部阴影贴图的分辨率(默认512， 512，看起来比较模糊)
pointLight.shadow.mapSize.set(512, 512);
// 设置距离
pointLight.distance = 0;
// 灯光从边缘衰减效果
pointLight.penumbra = 0;
// 灯光亮度衰减
pointLight.decay = 0;

// 将点光源添加至小球中
smallBall.add(pointLight);
// 将小球添加到场景中
scene.add(smallBall);


// 设置透视相机的属性
// scene.add(spotLight);
const gui = new dat.GUI();
gui.add(pointLight.position, 'x').min(-5).max(5).step(0.1);
// gui.add(pointLight, 'angle').name('angle test.').min(0).max(Math.PI/2).step(0.01);
gui.add(pointLight, 'distance').min(0).max(1).step(0.001);
gui.add(pointLight, 'decay').min(0).max(5).step(0.01);

// gui
//     .add(spotLight.shadow.camera, "near")
//     .min(0)
//     .max(20)
//     .step(0.1)
//     .onChange(() => {
//         // 更新投影矩阵
//         spotLight.shadow.camera.updateProjectionMatrix();
//     })

// 初始化渲染器
const renderer = new THREE.WebGL1Renderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;
// 开启物理正确灯光
renderer.physicallyCorrectLights = true;

// 将webgl渲染的canvas内容添加到body上
document.body.appendChild(renderer.domElement);

// 创建轨道控制器，控制器控制camera(相机)，指定渲染器里面的domElement元素
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器的阻尼（惯性，看起来更加有真实的效果）, 必须在我们动画循环里面调用.update()
controls.enableDamping = true;


// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 设置时钟
const clock = new THREE.Clock();

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
    let elapsedTime = clock.getElapsedTime();
    smallBall.position.x = Math.sin(elapsedTime) * 3;
    smallBall.position.z = Math.cos(elapsedTime) * 3;
    smallBall.position.y = Math.sin(elapsedTime * 5) + 2;

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
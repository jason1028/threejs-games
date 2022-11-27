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

// 导入cannon_es
import * as CANNON  from 'cannon-es';

// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 创建一个场景(场景就是要创建一个环境)
const scene = new THREE.Scene();

// 创建一个相机(相机，相当于一个的眼睛)
const camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 0.1, 1000);

// 设置相机位置x，y，z  (vector3 三维向量)
camera.position.set(0, 0, 40);
// 将相机添加至场景
scene.add(camera);

// 创建球
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
// 材质
const sphereMaterial = new THREE.MeshStandardMaterial();
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
// 投射影子
sphereMesh.castShadow = true;
scene.add(sphereMesh);

// 平面
const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial()
);
floorMesh.position.set(0, -5, 0);
floorMesh.rotation.x = -Math.PI / 2;
// 地面开始接收
floorMesh.receiveShadow = true;
scene.add(floorMesh);

// 开启灯光(环境光)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 开启灯光（平行光）
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
// 开启影子
dirLight.castShadow = true;
scene.add(dirLight);

// 开始创建物理世界
const physicWorld = new CANNON.World();
// 给Y坐标设置9.8的重力
physicWorld.gravity.set(0, -9.8, 0);
// 创建物理小球
const sphereShape = new CANNON.Sphere(1);
// 创建小球材质(默认)
const sphereWorldMaterial = new CANNON.Material("sphere");

// 创建物理世界的小球物体
const sphereBody = new CANNON.Body({
    shape: sphereShape,
    position: new CANNON.Vec3(0, 0, 0),
    // 小球的质量
    mass: 1,
    // 设置小球的材质
    material: sphereWorldMaterial
});
// 将物体添加至世界
physicWorld.addBody(sphereBody);

// 创建击打声音
const hitSound = new Audio('assets/metalHit.mp3');

// 定义碰撞事件
function HitEvent(e) {
    // 获取碰撞的强度
    const impactStrength = e.contact.getImpactVelocityAlongNormal();
    if(impactStrength > 1) {
        hitSound.currentTime = 0;
        hitSound.play();
    }
}

// 监听小球的碰撞事件
sphereBody.addEventListener("collide", HitEvent);

// 创建物理世界地面
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
const floorBodyMaterial = new CANNON.Material("floor");
// 当质量为0时，可以使物体保持不动
floorBody.mass = 0;
floorBody.addShape(floorShape);
// 地面位置
floorBody.position.set(0, -5, 0);
floorBody.material = floorBodyMaterial;
// 旋转地面位置
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
physicWorld.addBody(floorBody);

// 设置2种材质碰撞的参数
const defaultContactMaterial = new CANNON.ContactMaterial(
    sphereWorldMaterial,
    floorBodyMaterial, 
    {
        // 摩擦系数
        friction: 0.1,
        // 弹性
        restitution: 0.7
    }
);

// 将关联材质添加至物理世界
physicWorld.addContactMaterial(defaultContactMaterial);

// 初始化渲染器
const renderer = new THREE.WebGL1Renderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启投射影子
renderer.shadowMap.enabled = true;

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
    let deltaTime = clock.getDelta();
    // 更新物理引擎里面的物体
    physicWorld.step(1/120, deltaTime);

    // 同步重力物体的位置
    sphereMesh.position.copy(sphereBody.position);
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
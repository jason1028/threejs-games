/**********
 * 目标：设置控制器的阻尼（就是拖动，旋转的时候比较生硬、不丝滑，用户体验不好），也叫惯性感。 监控屏幕变化，做到自适应
 * 主要内容：
 *     代码1：58~59 100~10`
 *     代码2：112~123
***********/

import * as THREE from 'three';
// 导入动画库
import gsap from 'gsap';

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

// 添加物体
// - 创建一个几何体，长宽高分别为1
const cuteGeometry = new THREE.BoxGeometry(1, 1, 1);
// - 设置材质(基础网格材质) 比如物体的颜色等等
const cuteMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cuteGeometry, cuteMaterial);

// 修改物体的位置
// cube.position.set(5, 0, 0);
// 设置x为3
// cube.position.x = 3;

// 控制缩放
// cube.scale.set(3, 2, 1);

// 控制旋转(x旋转45°, y旋转90°, z为0°， 以YXZ的顺序旋转)
// cube.rotation.set(Math.PI / 4, Math.PI / 2, 0, 'YXZ');

// 生成的物体添加到场景当中
scene.add(cube);

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

// 设置动画
var animate_01 = gsap.to(cube.position, { 
    x: 5,   // x轴设置5
    duration: 5,    // 5s的时间
    ease: 'power1.inOut',   // 速度次数
    // 完成回调
    onComplete: ()=>{ 
        console.log('动画完成.');    
    }, 
    // 开始回调
    onStart: ()=> {
        console.log('动画开始.');
    }, 
    // 往返运动
    yoyo: true,
    // 延时1秒后运动
    delay: 1,
    // 重复次数
    repeat: -1   // -1为重复循环
});
gsap.to(cube.rotation, { x: 2 * Math.PI, duration: 5 });

// 屏幕双击时暂停与启动
window.addEventListener('dblclick', () => {
    if(animate_01.isActive()) {
        // 暂停
        animate_01.pause();
    } else {
        // 恢复
        animate_01.resume();
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
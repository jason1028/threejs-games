/**********
 * 目标：使用Clock来跟踪时间对象
 * 主要内容：
 * 
    // 设置时钟，默认开始启动
    const clock = new THREE.Clock();

    // 获取时钟运行的总时长
    let allTime = clock.getElapsedTime();
    
    // 获取间隔时间
    // let deltaTime = clock.getDelta();
    // console.log('时钟运行的总时长：', allTime);
    // console.log('两次获取时间的间隔时间：', deltaTime);
***********/

import * as THREE from 'three';

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

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 设置时钟，默认开始启动
const clock = new THREE.Clock();

// 渲染函数
function render(time) {
    // 获取时钟运行的总时长
    let allTime = clock.getElapsedTime();
    // 获取间隔时间
    // let deltaTime = clock.getDelta();
    // console.log('时钟运行的总时长：', allTime);
    // console.log('两次获取时间的间隔时间：', deltaTime);

    // 以每秒60帧频率计算，平均每16.6ms执行一次，但requestAnimationFrame并非按这个时间均匀执行
    // 有时候它的执行间隔小于 16.6ms，有时大于16.6ms，无论大于或者小于都 + 0.01的话，其实这个是不均匀的。
    // 所以按照当前时间/1000，根据时间的大小，同比增长多少，这才是最准确的走法。
    let t = allTime % 5;
    // console.log('当前time:', t);
    cube.position.x = t * 1;

    // 使用渲染器，通过相机将场景渲染进来
    renderer.render(scene, camera);
    // 下一帧执行渲染
    requestAnimationFrame(render);
}

// 开始渲染
render();
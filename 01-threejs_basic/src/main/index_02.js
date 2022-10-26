/**********
 * 本节主要
 * 1、什么是控制器？
 *      控制器：英文名为Control。在Three.js当中，它有很多的控制器：如，DragControls、FirstPersonControls、FlyControls、OrbitControls等等
 *      当你把相机、以及渲染元素renderer.domElement切入后即可帮你控制，但在webgl当中就需要自己去写。
 * 
 * 2、它是如何控制的原理是什么？
 *      Control(控制器)用来控制物体的运动轨迹，轨迹发生改变后需要重新渲染。 那如何重新渲染呢？ 使用requestAnimationFrame这个帧切换函数实时重新渲染，从而完成控制处理；
 *
 * 3、什么是坐标轴辅助器？
 *      THREE.AxesHelper：设置后，物体会出现相应的X, Y, Z轴，用于辅助， 参数为辅助线的长度；
 *      用于简单模拟3个坐标轴的对象.
        红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
        用于看方向，比如：z轴上面是什么？
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
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// 渲染函数
function render() {
    // 使用渲染器，通过相机将场景渲染进来
    renderer.render(scene, camera);
    // 下一帧执行渲染
    requestAnimationFrame(render);
}

// 开始渲染
render();
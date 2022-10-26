/**********
 * 目标：3D物体的移动
 * 主要内容：
 *      1、物体怎么样移动？
            可通过改变cube的position位置来移动处理；
            注意点：
                并不是设置position后就会移动的，而是要不停的渲染，一帧一帧切换。
 *      2、如何做动画？
            通过requestAnimationFrame不断执行render，数据没变时不动。数据变化时更新；
 
 *  
***********/

import * as THREE from 'three';

// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 创建一个场景(场景就是要创建一个环境)
const scene = new THREE.Scene();

// 创建一个相机(相机，相当于一个的眼睛)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight);

// 设置相机位置x，y，z  (vector3 三维向量，从Z轴10的位置)
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

// 渲染函数
function render() {
    // 每次帧切换x轴 + 0.01。
    cube.position.x += 0.01;
    // 当x轴位置大于5时，还原x的值。
    if(cube.position.x > 5) {
        cube.position.x = 0;
    }
    // 使用渲染器，通过相机将场景渲染进来
    renderer.render(scene, camera);
    // 下一帧执行渲染
    requestAnimationFrame(render);
}

// 开始渲染
render();
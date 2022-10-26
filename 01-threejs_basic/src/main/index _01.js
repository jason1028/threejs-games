/**********
 * 本节主要内容
 * 1、了解什么是场景？
 *    所谓场景，个人理解就是3d的一个环境，然后画出的3d内容最后都要放到这个环境中，最后形成一个整体的3D效果；   
 * 
 * 2、什么是相机？
 *    在3D领域中，相机camera相当于人站在一个空间的眼睛，你站的角度不同，视觉呈现也会不同；
 * 
 * 3、如何生成一个几何体？
 *    一个几何体由点线面组成，如果用webgl，你需要传入各个顶点，设置索引缓存、顶点缓存，但threejs提供了方法 BoxGeometry，设置参数 （长、宽、高）即可；   
 * 
 * 4、什么是材质？
 *    当你设置某一个几何体的或者3D元素中的架子是，材质我的理解：应该就是该几何体的颜色、材料（铝、贴）等等一些东西；
 * 
 * 5、通过mesh生成最后的物体
 *      const cube = new THREE.Mesh(cuteGeometry, cuteMaterial);  // 主要是将material和geometry结合生成最终物体
 * 
 * 6、了解什么是渲染器？
 *      渲染器 WebGL1Renderer 类似一个生产工厂，你要将对应的3d元素放入其中，才能给用户呈现最终的效果；
 * 
***********/

import * as THREE from 'three';

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

// 使用渲染器，通过相机将场景渲染进来
renderer.render(scene, camera);
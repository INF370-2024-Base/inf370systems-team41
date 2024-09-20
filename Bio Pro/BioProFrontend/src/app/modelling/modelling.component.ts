import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
  selector: 'app-modelling',
  templateUrl: './modelling.component.html',
  styleUrls: ['./modelling.component.scss']
})
export class ModellingComponent implements OnInit {
  @ViewChild('canvas') private canvasRef!: ElementRef;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private loader = new GLTFLoader();  // Now this should work

  ngOnInit() {
    this.initScene();
    this.loadModel();
  }

  private initScene() {
    
    this.scene = new THREE.Scene();

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;
    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    console.log("test")
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private loadModel() {
    // Replace 'path-to-your-model.gltf' with the actual path to your exported model
    this.loader.load('assets/models/teeth.gltf', (gltf) => {
      this.scene.add(gltf.scene);
      this.animate();
    });
    
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }
}

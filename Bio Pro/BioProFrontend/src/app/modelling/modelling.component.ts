import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modelling',
  templateUrl: './modelling.component.html',
  styleUrls: ['./modelling.component.scss']
})
export class ModellingComponent implements OnInit {
  @ViewChild('canvasing', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private loader = new GLTFLoader();
  private controls!: OrbitControls;
  private gltfFile?: File;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.initScene();
    this.route.queryParams.subscribe(params => {
      const fileUrl = params['fileUrl'];
      if (fileUrl) {
        fetch(fileUrl)
          .then(response => response.blob())
          .then(blob => {
            this.gltfFile = new File([blob], 'model.gltf', { type: 'model/gltf+json' });
            this.loadModel();
          });
      }
    });
  }

  private initScene() {
    this.scene = new THREE.Scene();
  
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;
  
    const canvas = this.canvasRef.nativeElement;
    
    // Set the canvas size to be a fraction of the window size
    const canvasWidth = window.innerWidth * 0.6;  // 80% of the window width
    const canvasHeight = window.innerHeight * 0.7; // 80% of the window height
  
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    this.renderer.setSize(canvasWidth, canvasHeight);
  
    // Set camera aspect ratio and update projection matrix
    this.camera.aspect = canvasWidth / canvasHeight;
    this.camera.updateProjectionMatrix();
  
    // Add basic lighting
    const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    this.scene.add(ambientLight);
  
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // white light
    directionalLight.position.set(1, 1, 1).normalize();
    this.scene.add(directionalLight);
  
    // Initialize OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;
  
    // Handle window resize
    window.addEventListener('resize', () => {
      const newCanvasWidth = window.innerWidth * 0.8;
      const newCanvasHeight = window.innerHeight * 0.8;
  
      this.camera.aspect = newCanvasWidth / newCanvasHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(newCanvasWidth, newCanvasHeight);
    });
  }

  private loadModel() {
    if (this.gltfFile) {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        const arrayBuffer = event.target.result as ArrayBuffer;
        const blob = new Blob([arrayBuffer], { type: 'model/gltf+json' });
        const url = URL.createObjectURL(blob);

        this.loader.load(url, (gltf) => {
          this.scene.add(gltf.scene);
          this.animate();
        }, undefined, (error) => {
          console.error('An error occurred while loading the model:', error);
        });
      };

      reader.readAsArrayBuffer(this.gltfFile);
    } else {
      console.error('No GLTF file provided.');
    }
  }

  private animate() {
    requestAnimationFrame(() => this.animate());

    if (this.controls) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }
}

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

export function modifyAndExportGltf(gltfPath: string, visibleTeethNumbers: number[]): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    
    loader.load(gltfPath, (gltf) => {
      const root = gltf.scene;

      // Modify teeth materials based on the provided list
      applyMaterialsToTeeth(root, visibleTeethNumbers);

      // Export the modified model back to .gltf format
      const exporter = new GLTFExporter();
      exporter.parse(root, (result) => {
        if (result instanceof ArrayBuffer) {
          const blob = new Blob([result], { type: 'application/octet-stream' });
          resolve(blob); // Return the modified .gltf file as a Blob
        } else {
          reject('An error occurred while exporting the GLTF model.');
        }
      }, (error) => {
        console.error('An error occurred during export:', error);
      }, { binary: true }); 
    }, undefined, (error) => {
      reject(`An error occurred while loading the model: ${error}`);
    });
  });
}

function applyMaterialsToTeeth(root: THREE.Object3D, visibleTeethNumbers: number[]) {
  const materials = createUniqueMaterialsForTeeth();

  root.traverse((child) => {
    if (child instanceof THREE.Mesh && child.name.startsWith('Tooth')) {
      const toothNumber = parseInt(child.name.replace('Tooth', ''), 10);

      // Assign different materials for all teeth
      if (toothNumber >= 1 && toothNumber <= 32) {
        child.material = materials[toothNumber];

        // If the tooth is not in the list, make it opaque
        if (!visibleTeethNumbers.includes(toothNumber)) {
          const material = child.material as THREE.MeshStandardMaterial;
          material.opacity = 0.1; // Make it mostly transparent
          material.transparent = true; // Enable transparency
        }
      }
    }
  });
}

function createUniqueMaterialsForTeeth(): { [key: number]: THREE.MeshStandardMaterial } {
  const materials: { [key: number]: THREE.MeshStandardMaterial } = {};

  const baseColor = 0xffffff; // Color for all teeth
  const baseOpacity = 1;    // Default opacity for visible teeth

  // Create a separate material for each tooth (from Tooth1 to Tooth32)
  for (let i = 1; i <= 32; i++) {
    materials[i] = new THREE.MeshStandardMaterial({
      color: baseColor,
      opacity: baseOpacity,
      transparent: true,
    });
  }

  return materials;
}

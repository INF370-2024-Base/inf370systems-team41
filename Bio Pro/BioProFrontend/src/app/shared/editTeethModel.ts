import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import * as THREE from 'three';
import { OrderService } from '../services/order.service';
import { EditMediaFileViewModel } from './SystemOrderViewModel ';
import { DataService } from '../services/login.service';
import { HttpErrorResponse } from '@angular/common/http';


export function editColourAndExportGltf(file: File, mouthArea: string, color: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      const reader = new FileReader();
  
      reader.onload = (event: any) => {
        const contents = event.target.result;
  
        // Load the GLTF model from ArrayBuffer
        loader.parse(contents, '', (gltf) => {
          const root = gltf.scene;
          const visibleTeethNumbers = mouthArea.split(',').map(Number);
          // Modify teeth materials based on the provided list and color
          applyMaterialsToTeeth(root, visibleTeethNumbers, color);
  
          // Export the modified model back to .glb format
          const exporter = new GLTFExporter();
          exporter.parse(
            root, 
            (result) => {
              if (result instanceof ArrayBuffer) {
                const blob = new Blob([result], { type: 'application/octet-stream' });
                resolve(blob); // Return the modified .glb file as a Blob
              } else {
                reject('An error occurred while exporting the GLTF model.');
              }
            },
            (error) => { // This is the correct place for the error handler
              console.error('An error occurred during export:', error);
              reject('An error occurred during export.');
            },
            { binary: true } // Options come last as the fourth argument
          );
        }, 
        (error) => {
          reject(`An error occurred while loading the model: ${error}`);
        });
      };
      reader.readAsArrayBuffer(file); // Read the file as ArrayBuffer
    });
}
function applyMaterialsToTeeth(root: THREE.Object3D, visibleTeethNumbers: number[], color: string) {
    root.traverse((child: any) => {
        if (child.isMesh && child.name.startsWith('Tooth')) {
          // Extract the full tooth number string and log it
          const toothNumber = parseInt(child.name.replace('Tooth', ''), 10);
      
        
      
          // Check if the exact tooth number is in the visibleTeethNumbers list
          if (visibleTeethNumbers.includes(toothNumber)) {
           
      
            // Apply the given color to the material of the specified teeth
            child.material = new THREE.MeshStandardMaterial({ color: new THREE.Color(color) });
          } 
        }
      });
}
const colorSequence = ['#ADD8E6', '#90EE90', '#FFA07A', '#FFFFE0']; // light blue, light green, light orange, light yellow
const finalStepColor = '#FFB6C1'; // light red for final step

// Function to get the next color in the sequence
function getNextColor(pastColor: string, isLastStep: boolean): string {
  if (isLastStep) {
    return finalStepColor; // If it's the final step, return light red
  }
  console.log('Past colour:'+pastColor)
  const currentIndex = colorSequence.indexOf(pastColor.toUpperCase());
  // If the past color isn't found in the sequence, default to the first color (light blue)
  return currentIndex >= 0 && currentIndex < colorSequence.length - 1
    ? colorSequence[currentIndex + 1]
    : colorSequence[0];
}

export function editFromPastColourAndExportGltf(file: File, mouthArea: string, isLastStep: boolean): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    const reader = new FileReader();

    reader.onload = (event: any) => {
      const contents = event.target.result;

      // Load the GLTF model from ArrayBuffer
      loader.parse(contents, '', (gltf) => {
        const root = gltf.scene;
        const visibleTeethNumbers = mouthArea.split(',').map(Number);
        const pastColor = getCurrentToothColor(root, visibleTeethNumbers) || '#ADD8E6';
        // Get the new color based on the past color and whether it's the final step
        const newColor = getNextColor(pastColor, isLastStep);
        console.log('New colour:'+newColor)

        // Modify teeth materials based on the provided list and the new color
        applyMaterialsToTeeth(root, visibleTeethNumbers, newColor);

        // Export the modified model back to .glb format
        const exporter = new GLTFExporter();
        exporter.parse(
          root,
          (result) => {
            if (result instanceof ArrayBuffer) {
              const blob = new Blob([result], { type: 'application/octet-stream' });
              resolve(blob); // Return the modified .glb file as a Blob
            } else {
              reject('An error occurred while exporting the GLTF model.');
            }
          },
          (error) => { // This is the correct place for the error handler
            console.error('An error occurred during export:', error);
            reject('An error occurred during export.');
          },
          { binary: true } // Options come last as the fourth argument
        );
      }, 
      (error) => {
        reject(`An error occurred while loading the model: ${error}`);
      });
    };
    reader.readAsArrayBuffer(file); // Read the file as ArrayBuffer
  });
}
export function editTeethToNewColour(
    orderService: OrderService,
    order: any,
    isLastStep: boolean = false
  ) {
    return new Promise<void>((resolve, reject) => {
      orderService.get3DMediaFile(order.orderId).subscribe(async (result) => {
        try {
          console.log(result);
  
          // Use the utility function to edit the color and export the GLTF file
          const toothModelContent = await editFromPastColourAndExportGltf(
            convertBase64ToFile(result.fileSelf, result.fileName),
            order.mouthArea,
            isLastStep
          );
  
          const mediaFile: EditMediaFileViewModel = {
            MediaFileID: result.mediaFileId,
            FileName: result.fileName,
            FileSelf: await encodeFileContentFromBlob(toothModelContent),
            FileSizeKb: await getFileSizeKb(toothModelContent),
          };
  
          // Update the media file using the order service
          orderService.editMediaFile(mediaFile).subscribe(
            (editResult) => {
              console.log(editResult);
              resolve();
            },
            (error) => {
              console.error(error);
              reject(error);
            }
          );
        } catch (error) {
          console.error(error);
          reject(error);
        }
      });
    });
  }
  async function encodeFileContentFromBlob(blob: Blob): Promise<string> {
    // Convert Blob to ArrayBuffer
    const arrayBuffer = await blob.arrayBuffer();
    
    // Convert ArrayBuffer to Uint8Array
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert Uint8Array to binary string
    let binary = '';
    const len = uint8Array.byteLength;
    
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    
    // Convert binary string to Base64
    return btoa(binary);
  }
  async function getFileSizeKb(blob: Blob):Promise<number> {
    return Math.ceil(blob.size / 1024); // Convert bytes to KB
  }
  function convertBase64ToFile(base64String: string, fileName: string): File {
    // Decode the Base64 string to binary data
    const byteString = atob(base64String);
  
    // Convert the binary string to an array of 8-bit unsigned integers
    const byteArray = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i);
    }
  
    // Check if the file is binary (.glb) or text (.gltf) based on the extension
    const isBinary = fileName.endsWith('.glb');
    const mimeType = isBinary ? 'model/gltf-binary' : 'application/json';
  
    // Create a Blob from the byte array
    const blob = new Blob([byteArray], { type: mimeType });
  
    // Create and return a File from the Blob
    return new File([blob], fileName, { type: mimeType });
  }
  function getCurrentToothColor(root: THREE.Object3D, visibleTeethNumbers: number[]): string | null {
    let currentColor: string | null = null;
  
    root.traverse((child: any) => {
      if (child.isMesh && child.name.startsWith('Tooth')) {
        const toothNumber = parseInt(child.name.replace('Tooth', ''), 10);
  
        // If the tooth is in the visibleTeethNumbers, retrieve its current color
        if (visibleTeethNumbers.includes(toothNumber)) {
          // Check if the material has a color
          if (child.material && child.material.color) {
            // Convert THREE.Color to hex string (#rrggbb format)
            currentColor = `#${child.material.color.getHexString()}`;
            console.log(`Current color of tooth ${toothNumber}:`, currentColor);
          }
        }
      }
    });
  
    return currentColor;
  }
import { fabric } from 'fabric';

class LayeredCanvas extends fabric.Canvas {
  private layerObjects: { [key: number]: fabric.Object[] } = {};

  constructor(element: HTMLCanvasElement | null, options?: fabric.ICanvasOptions) {
    super(element, options);
  }
  addObjectToLayer(object: fabric.Object, layerIndex: number): void {
    // Add the object to the specified layer
    if (!this.layerObjects[layerIndex]) {
      this.layerObjects[layerIndex] = [];
    }
    this.layerObjects[layerIndex].push(object);

    // Sort the objects based on layers and add them to the canvas
    this.updateCanvasObjects();
  }

  removeObjectFromAnyLayer(object: fabric.Object): void {
    // Search for and remove the object from all layers
    Object.keys(this.layerObjects).forEach((key) => {
      const layerIndex = Number(key);
      const objectsInLayer = this.layerObjects[layerIndex];
      const index = objectsInLayer.indexOf(object);
      if (index !== -1) {
        objectsInLayer.splice(index, 1);
      }
    });

    // Sort the objects based on layers and add them to the canvas
    this.remove(object);
    this.updateCanvasObjects();
  }

  private updateCanvasObjects(): void {
    // Sort the objects based on layers and add them to the canvas
    const sortedObjects: fabric.Object[] = [];
    Object.keys(this.layerObjects)
      .sort((a, b) => Number(a) - Number(b))
      .forEach((key) => {
        const layerIndex = Number(key);
        sortedObjects.push(...this.layerObjects[layerIndex]);
      });

    sortedObjects.forEach((obj) => this.remove(obj));
    sortedObjects.forEach((obj) => this.add(obj));
  }
}

export default LayeredCanvas

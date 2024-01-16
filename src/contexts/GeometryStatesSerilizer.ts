import { Console } from 'console';
import { GeometryState } from './GeometryContext';
import { OffsetSpline } from '../interfaces/Spline';

export class GeometryStatesSerializer {
  knownGeometries: Map<string, GeometryState>

  constructor(knownGeometries? : Map<string, GeometryState>) {
    if (!knownGeometries) {
      this.knownGeometries = new Map();
    } else {
      this.knownGeometries = knownGeometries
    }
  }

  reviver(key: string, value: any) : any {
    if (key === "sizesTable") {
      return new Map(value)
    }
    if (key === "handlebarGeometry") {
      const spline = new OffsetSpline(value);
      spline.reconstruct();
      return spline;
    }
    return value
  }

  replacer(key: string, value: any) : any {
    if (key === "sizesTable" && value instanceof Map) {
      return Array.from(value.entries())
    } else if (key === "sizesTable") {
      const arr = Array.from(Object.entries(value))
      console.log("Old sizes table ");
      return arr
    }

    return value
  }

  serialize() : string {
    return JSON.stringify(Array.from(this.knownGeometries.entries()), this.replacer)
  }

  deserialize(serializedData: string) {
    this.knownGeometries = new Map(JSON.parse(serializedData, this.reviver))
  }
}

export default GeometryStatesSerializer;

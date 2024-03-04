import { Console } from 'console';
import { GeometryState } from './GeometryContext';
import { OffsetSpline } from '../interfaces/Spline';

abstract class GeometryStateSerializationHelper {
  reviver(key: string, value: any) : any {
    if (key === "sizesTable") {
      return new Map(value)
    }
    if (key === 'handlebarsTable') {
      return new Map(value);
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

    if (key === "handlebarsTable" && value instanceof Map) {
      return Array.from(value.entries())
    } else if (key === "handlebarsTable") {
      const arr = Array.from(Object.entries(value))
      console.log("Old handlebarsTable sizes table ");
      return arr
    }

    return value
  }
}

export class GeometryStateSerializer extends GeometryStateSerializationHelper {
  geometry: GeometryState | null;

  constructor(geometry? : GeometryState) {
    super();
    if (!geometry) {
      this.geometry = null;
    } else {
      this.geometry = geometry
    }
  }

  serialize() : string {
    return JSON.stringify(this.geometry, this.replacer)
  }

  deserialize(serializedData: string) {
    this.geometry = JSON.parse(serializedData, this.reviver)
  }
}

export interface GeometryPayload {
  make: String,
  model: String,
  year: number,
  data: GeometryState,
}

export class GeompetryPayloadSerializer extends GeometryStateSerializationHelper {
  payload: GeometryPayload | null;

  constructor(payload? : GeometryPayload) {
    super();
    if (!payload) {
      this.payload = null;
    } else {
      this.payload = payload
    }
  }

  serialize() : string {
    return JSON.stringify(this.payload, this.replacer)
  }

  deserialize(serializedData: string) {
    this.payload = JSON.parse(serializedData, this.reviver)
  }
}

export class GeometryStatesSerializer extends GeometryStateSerializationHelper {
  knownGeometries: Map<string, GeometryState>

  constructor(knownGeometries? : Map<string, GeometryState>) {
    super();
    if (!knownGeometries) {
      this.knownGeometries = new Map();
    } else {
      this.knownGeometries = knownGeometries
    }
  }

  serialize() : string {
    return JSON.stringify(Array.from(this.knownGeometries.entries()), this.replacer)
  }

  deserialize(serializedData: string) {
    this.knownGeometries = new Map(JSON.parse(serializedData, this.reviver))
  }
}

export default GeometryStatesSerializer;

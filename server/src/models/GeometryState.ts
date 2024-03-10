import {Schema, model} from 'mongoose'
import {IColor, IColorPoint2d, IFixedCircle, IFixedRectangle, IGeometryFixedCircles, IGeometryFixedRectangles, IGeometryOffsetFixedRectangles, IGeometryPoints, IGeometryPolygons, IGeometrySemiFixedRectangles, IGeometryState, IHandlebarMeasures, IMeasures, IOffsetFixedRectangle, IOffsetSplineSaver, IPoint2d, IPolygon, ISemiFixedRectangle} from '../IGeometryState'

const ColorSchema = new Schema<IColor>({
  color: {
    type : [Number],
    length: 3,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  valpha: {
    type: Number,
    required: true
  },
});

const Point2dSchema = new Schema<IPoint2d>({
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
});

const ColorPoint2dSchema = new Schema<IColorPoint2d>({
  //...Point2dSchema.obj,
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  color: ColorSchema,
});

const FixedRectangleSchema = new Schema<IFixedRectangle>({
  width: {
    type: Number,
    required: true
  }
});

const SemiFixedRectangleSchema = new Schema<ISemiFixedRectangle>({
  //...FixedRectangleSchema.obj,
  width: {
    type: Number,
    required: true
  },
  length: {
    type: Number,
    required: true,
  }
});

const OffsetFixedRectangleSchema = new Schema<IOffsetFixedRectangle>({
  //...FixedRectangleSchema.obj,
  width: {
    type: Number,
    required: true
  },
  leftOffset: {
    type: Number,
    required: true
  },
  rightOffset: {
    type: Number,
    required: true
  },
});

const FixedCircleSchema = new Schema<IFixedCircle>({
  radius: {
    type: Number,
    required: true
  }
});

const PolygonSchema = new Schema<IPolygon>({
  vertices: {
    type: [Point2dSchema],
    required: true
  }
});

const GeometryPointsSchema = new Schema<IGeometryPoints>({
  rearWheelCenter: {type: ColorPoint2dSchema, required: true},
  frontWheelCenter: {type: ColorPoint2dSchema, required: true},
  headTubeTop: {type: ColorPoint2dSchema, required: true},
  headTubeBottom: {type: ColorPoint2dSchema, required: true},
  bottomBracketCenter: {type: ColorPoint2dSchema, required: true},
  seatTubeTop: {type: ColorPoint2dSchema, required: true},
  crankArmEnd: {type: ColorPoint2dSchema, required: true},
  handlebarMount: {type: ColorPoint2dSchema, required: true},
  seatMount: {type: ColorPoint2dSchema, required: true},
});

const GeometryOffsetFixedRectanglesSchema = new Schema<IGeometryOffsetFixedRectangles> ({
  crankArm: {type: OffsetFixedRectangleSchema, required: true},
  seatstay: {type: OffsetFixedRectangleSchema, required: true},
  chainstay: {type: OffsetFixedRectangleSchema, required: true},
  fork: {type: OffsetFixedRectangleSchema, required: true},
  seatTube: {type: OffsetFixedRectangleSchema, required: true},
  headTube: {type: OffsetFixedRectangleSchema, required: true},
  bottomTube: {type: OffsetFixedRectangleSchema, required: true},
  topTube: {type: OffsetFixedRectangleSchema, required: true},
});

const GeometrySemiFixedRectanglesSchema = new Schema<IGeometrySemiFixedRectangles> ({
  seatpost: {type: SemiFixedRectangleSchema, required: true},
  headstack: {type: SemiFixedRectangleSchema, required: true},
});

const GeometryFixedRectanglesSchema  = new Schema<IGeometryFixedRectangles> ({
  stem: {type: FixedRectangleSchema, required: true},
});

const GeometryFixedCirclesSchema  = new Schema<IGeometryFixedCircles> ({
  rearWheel: {type: FixedCircleSchema, required: true},
  frontWheel: {type: FixedCircleSchema, required: true},
  chainring: {type: FixedCircleSchema, required: true},
  seatpostYoke: {type: FixedCircleSchema, required: true},
});

const GeometryPolygonsSchema  = new Schema<IGeometryPolygons> ({
  shifter: {type: PolygonSchema, required: true},
  seat: {type: PolygonSchema, required: true},
});

const MeasuresSchema = new Schema<IMeasures> ({
  stack:  {type: Number, required: true},
  reach: {type: Number, required: true},
  topTube: {type: Number, required: true},
  seatTubeCT: {type: Number, required: true},
  headAngle: {type: Number, required: true},
  seatAngle: {type: Number, required: true},
  headTube: {type: Number, required: true},
  chainstay: {type: Number, required: true},
  bbDrop: {type: Number, required: true},
  crankArm: {type: Number, required: true},
  wheelbase: {type: Number, required: true},
  seatpostSetback: {type: Number, required: true},
  spacersStack: {type: Number, required: true},
  stemLength: {type: Number, required: true},
  stemAngle: {type: Number, required: true},
  seatpostExtension: {type: Number, required: true},
  seatRotation: {type: Number, required: true},
  seatSetback: {type: Number, required: true},
});

const HandlebarMeasuresSchema = new Schema<IHandlebarMeasures> ({
  handlebarDrop: {type: Number, required: true},
  handlebarReach: {type: Number, required: true},
  handlebarRaise: {type: Number, required: true},
  handlebarSetback: {type: Number, required: true},
  handlebarRotation: {type: Number, required: true},
  shiftersMountPoint: {type: Number, required: true},
});

const OffsetSplineSaverSchema = new Schema<IOffsetSplineSaver> ({
  intermediatePoints:  {
    type: [Point2dSchema],
    required: true
  },
  controlPoints:  {
    type: [Point2dSchema],
    required: true
  },
  thickness: {type: Number, required: true},
});

const GeometryStateSchema = new Schema<IGeometryState>({
  wheelbase: {
    type: Number,
    required: true,
  },
  selectedFile: {
    type: String,
    required: false,
  },
  bikesList: {
    type: [String],
    required: true
  },
  shifterMountOffset: {
    type: Number,
    required: true
  },
  seatRailAngle: {
    type: Number,
    required: true
  },
  geometryPoints: {
    type: GeometryPointsSchema,
    required: true
  },
  offsetFixedRectangles: {type: GeometryOffsetFixedRectanglesSchema, required: true},
  semiFixedRectangles: {type: GeometrySemiFixedRectanglesSchema, required: true},
  fixedRectangles: {type: GeometryFixedRectanglesSchema, required: true},
  fixedCircles: {type: GeometryFixedCirclesSchema, required: true},
  polygons: {type: GeometryPolygonsSchema, required: true},
  sizesTable: {type: Map, of: MeasuresSchema, required: true},
  handlebarsTable: {type: Map, of: HandlebarMeasuresSchema, required: true},
  handlebarGeometry: {type: OffsetSplineSaverSchema, required: true},
});

export default model<IGeometryState>('GeometryState', GeometryStateSchema);
import {Schema, model} from 'mongoose'
import {IBikeData, IColor, IColorPoint2d, IFixedCircle, IFixedRectangle, IGeometryFixedCircles, IGeometryFixedRectangles, IGeometryOffsetFixedRectangles, IGeometryPoints, IGeometryPolygons, IGeometrySemiFixedRectangles, IGeometryState, IHandlebarMeasures, IMeasures, IOffsetFixedRectangle, IOffsetSplineSaver, IPoint2d, IPolygon, ISemiFixedRectangle} from '../IGeometryState'

const ColorSchema = new Schema<IColor>({
  color: {
    type : [Number],
    length: 3,
    required: false
  },
  model: {
    type: String,
    required: false
  },
  valpha: {
    type: Number,
    required: false
  },
});

const Point2dSchema = new Schema<IPoint2d>({
  x: {
    type: Number,
    required: false
  },
  y: {
    type: Number,
    required: false
  },
});

const ColorPoint2dSchema = new Schema<IColorPoint2d>({
  //...Point2dSchema.obj,
  x: {
    type: Number,
    required: false
  },
  y: {
    type: Number,
    required: false
  },
  color: ColorSchema,
});

const FixedRectangleSchema = new Schema<IFixedRectangle>({
  width: {
    type: Number,
    required: false
  }
});

const SemiFixedRectangleSchema = new Schema<ISemiFixedRectangle>({
  //...FixedRectangleSchema.obj,
  width: {
    type: Number,
    required: false
  },
  length: {
    type: Number,
    required: false,
  }
});

const OffsetFixedRectangleSchema = new Schema<IOffsetFixedRectangle>({
  //...FixedRectangleSchema.obj,
  width: {
    type: Number,
    required: false
  },
  leftOffset: {
    type: Number,
    required: false
  },
  rightOffset: {
    type: Number,
    required: false
  },
});

const FixedCircleSchema = new Schema<IFixedCircle>({
  radius: {
    type: Number,
    required: false
  }
});

const PolygonSchema = new Schema<IPolygon>({
  vertices: {
    type: [Point2dSchema],
    required: false
  }
});

const GeometryPointsSchema = new Schema<IGeometryPoints>({
  rearWheelCenter: {type: ColorPoint2dSchema, required: false},
  frontWheelCenter: {type: ColorPoint2dSchema, required: false},
  headTubeTop: {type: ColorPoint2dSchema, required: false},
  headTubeBottom: {type: ColorPoint2dSchema, required: false},
  bottomBracketCenter: {type: ColorPoint2dSchema, required: false},
  seatTubeTop: {type: ColorPoint2dSchema, required: false},
  crankArmEnd: {type: ColorPoint2dSchema, required: false},
  handlebarMount: {type: ColorPoint2dSchema, required: false},
  seatMount: {type: ColorPoint2dSchema, required: false},
});

const GeometryOffsetFixedRectanglesSchema = new Schema<IGeometryOffsetFixedRectangles> ({
  crankArm: {type: OffsetFixedRectangleSchema, required: false},
  seatstay: {type: OffsetFixedRectangleSchema, required: false},
  chainstay: {type: OffsetFixedRectangleSchema, required: false},
  fork: {type: OffsetFixedRectangleSchema, required: false},
  seatTube: {type: OffsetFixedRectangleSchema, required: false},
  headTube: {type: OffsetFixedRectangleSchema, required: false},
  bottomTube: {type: OffsetFixedRectangleSchema, required: false},
  topTube: {type: OffsetFixedRectangleSchema, required: false},
});

const GeometrySemiFixedRectanglesSchema = new Schema<IGeometrySemiFixedRectangles> ({
  seatpost: {type: SemiFixedRectangleSchema, required: false},
  headstack: {type: SemiFixedRectangleSchema, required: false},
});

const GeometryFixedRectanglesSchema  = new Schema<IGeometryFixedRectangles> ({
  stem: {type: FixedRectangleSchema, required: false},
});

const GeometryFixedCirclesSchema  = new Schema<IGeometryFixedCircles> ({
  rearWheel: {type: FixedCircleSchema, required: false},
  frontWheel: {type: FixedCircleSchema, required: false},
  chainring: {type: FixedCircleSchema, required: false},
  seatpostYoke: {type: FixedCircleSchema, required: false},
});

const GeometryPolygonsSchema  = new Schema<IGeometryPolygons> ({
  shifter: {type: PolygonSchema, required: false},
  seat: {type: PolygonSchema, required: false},
});

const MeasuresSchema = new Schema<IMeasures> ({
  stack:  {type: Number, required: false},
  reach: {type: Number, required: false},
  topTube: {type: Number, required: false},
  seatTubeCT: {type: Number, required: false},
  headAngle: {type: Number, required: false},
  seatAngle: {type: Number, required: false},
  headTube: {type: Number, required: false},
  chainstay: {type: Number, required: false},
  bbDrop: {type: Number, required: false},
  crankArm: {type: Number, required: false},
  wheelbase: {type: Number, required: false},
  seatpostSetback: {type: Number, required: false},
  spacersStack: {type: Number, required: false},
  stemLength: {type: Number, required: false},
  stemAngle: {type: Number, required: false},
  seatpostExtension: {type: Number, required: false},
  seatRotation: {type: Number, required: false},
  seatSetback: {type: Number, required: false},
});

const HandlebarMeasuresSchema = new Schema<IHandlebarMeasures> ({
  handlebarDrop: {type: Number, required: false},
  handlebarReach: {type: Number, required: false},
  handlebarRaise: {type: Number, required: false},
  handlebarSetback: {type: Number, required: false},
  handlebarRotation: {type: Number, required: false},
  shiftersMountPoint: {type: Number, required: false},
});

const OffsetSplineSaverSchema = new Schema<IOffsetSplineSaver> ({
  intermediatePoints:  {
    type: [Point2dSchema],
    required: false
  },
  controlPoints:  {
    type: [Point2dSchema],
    required: false
  },
  thickness: {type: Number, required: false},
});

const GeometryStateSchema = new Schema<IGeometryState>({
  wheelbase: {
    type: Number,
    required: false,
  },
  selectedFile: {
    type: String,
    required: false,
  },
  selectedFileHash: {
    type: String,
    required: false,
  },
  bikesList: {
    type: [String],
    required: false
  },
  shifterMountOffset: {
    type: Number,
    required: false
  },
  seatRailAngle: {
    type: Number,
    required: false
  },
  geometryPoints: {
    type: GeometryPointsSchema,
    required: false
  },
  offsetFixedRectangles: {type: GeometryOffsetFixedRectanglesSchema, required: false},
  semiFixedRectangles: {type: GeometrySemiFixedRectanglesSchema, required: false},
  fixedRectangles: {type: GeometryFixedRectanglesSchema, required: false},
  fixedCircles: {type: GeometryFixedCirclesSchema, required: false},
  polygons: {type: GeometryPolygonsSchema, required: false},
  sizesTable: {type: Map, of: MeasuresSchema, required: false},
  handlebarsTable: {type: Map, of: HandlebarMeasuresSchema, required: false},
  handlebarGeometry: {type: OffsetSplineSaverSchema, required: false},
});


const BikeDataSchema = new Schema<IBikeData>({
  make: {
    type: String,
    required: false,
  },
  model: {
    type: String,
    required: false,
  },
  year: {
    type: Number,
    required: false,
  },
  user: {
    type: String,
    required: false,
  },
  isPublic: {
    type: Boolean,
    required: false,
  },
  data: {type: GeometryStateSchema, required: false},
});

export default model<IBikeData>('BikeData', BikeDataSchema);
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ColorSchema = new mongoose_1.Schema({
    color: {
        type: [Number],
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
const Point2dSchema = new mongoose_1.Schema({
    x: {
        type: Number,
        required: false
    },
    y: {
        type: Number,
        required: false
    },
});
const ColorPoint2dSchema = new mongoose_1.Schema({
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
const FixedRectangleSchema = new mongoose_1.Schema({
    width: {
        type: Number,
        required: false
    }
});
const SemiFixedRectangleSchema = new mongoose_1.Schema({
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
const OffsetFixedRectangleSchema = new mongoose_1.Schema({
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
const FixedCircleSchema = new mongoose_1.Schema({
    radius: {
        type: Number,
        required: false
    }
});
const PolygonSchema = new mongoose_1.Schema({
    vertices: {
        type: [Point2dSchema],
        required: false
    }
});
const GeometryPointsSchema = new mongoose_1.Schema({
    rearWheelCenter: { type: ColorPoint2dSchema, required: false },
    frontWheelCenter: { type: ColorPoint2dSchema, required: false },
    headTubeTop: { type: ColorPoint2dSchema, required: false },
    headTubeBottom: { type: ColorPoint2dSchema, required: false },
    bottomBracketCenter: { type: ColorPoint2dSchema, required: false },
    seatTubeTop: { type: ColorPoint2dSchema, required: false },
    crankArmEnd: { type: ColorPoint2dSchema, required: false },
    handlebarMount: { type: ColorPoint2dSchema, required: false },
    seatMount: { type: ColorPoint2dSchema, required: false },
});
const GeometryOffsetFixedRectanglesSchema = new mongoose_1.Schema({
    crankArm: { type: OffsetFixedRectangleSchema, required: false },
    seatstay: { type: OffsetFixedRectangleSchema, required: false },
    chainstay: { type: OffsetFixedRectangleSchema, required: false },
    fork: { type: OffsetFixedRectangleSchema, required: false },
    seatTube: { type: OffsetFixedRectangleSchema, required: false },
    headTube: { type: OffsetFixedRectangleSchema, required: false },
    bottomTube: { type: OffsetFixedRectangleSchema, required: false },
    topTube: { type: OffsetFixedRectangleSchema, required: false },
});
const GeometrySemiFixedRectanglesSchema = new mongoose_1.Schema({
    seatpost: { type: SemiFixedRectangleSchema, required: false },
    headstack: { type: SemiFixedRectangleSchema, required: false },
});
const GeometryFixedRectanglesSchema = new mongoose_1.Schema({
    stem: { type: FixedRectangleSchema, required: false },
});
const GeometryFixedCirclesSchema = new mongoose_1.Schema({
    rearWheel: { type: FixedCircleSchema, required: false },
    frontWheel: { type: FixedCircleSchema, required: false },
    chainring: { type: FixedCircleSchema, required: false },
    seatpostYoke: { type: FixedCircleSchema, required: false },
});
const GeometryPolygonsSchema = new mongoose_1.Schema({
    shifter: { type: PolygonSchema, required: false },
    seat: { type: PolygonSchema, required: false },
});
const MeasuresSchema = new mongoose_1.Schema({
    stack: { type: Number, required: false },
    reach: { type: Number, required: false },
    topTube: { type: Number, required: false },
    seatTubeCT: { type: Number, required: false },
    headAngle: { type: Number, required: false },
    seatAngle: { type: Number, required: false },
    headTube: { type: Number, required: false },
    chainstay: { type: Number, required: false },
    bbDrop: { type: Number, required: false },
    crankArm: { type: Number, required: false },
    wheelbase: { type: Number, required: false },
    seatpostSetback: { type: Number, required: false },
    spacersStack: { type: Number, required: false },
    stemLength: { type: Number, required: false },
    stemAngle: { type: Number, required: false },
    seatpostExtension: { type: Number, required: false },
    seatRotation: { type: Number, required: false },
    seatSetback: { type: Number, required: false },
});
const HandlebarMeasuresSchema = new mongoose_1.Schema({
    handlebarDrop: { type: Number, required: false },
    handlebarReach: { type: Number, required: false },
    handlebarRaise: { type: Number, required: false },
    handlebarSetback: { type: Number, required: false },
    handlebarRotation: { type: Number, required: false },
    shiftersMountPoint: { type: Number, required: false },
});
const OffsetSplineSaverSchema = new mongoose_1.Schema({
    intermediatePoints: {
        type: [Point2dSchema],
        required: false
    },
    controlPoints: {
        type: [Point2dSchema],
        required: false
    },
    thickness: { type: Number, required: false },
});
const GeometryStateSchema = new mongoose_1.Schema({
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
    offsetFixedRectangles: { type: GeometryOffsetFixedRectanglesSchema, required: false },
    semiFixedRectangles: { type: GeometrySemiFixedRectanglesSchema, required: false },
    fixedRectangles: { type: GeometryFixedRectanglesSchema, required: false },
    fixedCircles: { type: GeometryFixedCirclesSchema, required: false },
    polygons: { type: GeometryPolygonsSchema, required: false },
    sizesTable: { type: Map, of: MeasuresSchema, required: false },
    handlebarsTable: { type: Map, of: HandlebarMeasuresSchema, required: false },
    handlebarGeometry: { type: OffsetSplineSaverSchema, required: false },
});
const BikeDataSchema = new mongoose_1.Schema({
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
    data: { type: GeometryStateSchema, required: false },
});
exports.default = (0, mongoose_1.model)('BikeData', BikeDataSchema);

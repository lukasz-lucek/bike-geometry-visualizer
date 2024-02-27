import { fabric } from 'fabric';
import { Point } from 'fabric/fabric-impl';
import { BoundingBox } from '../interfaces/BoundingBox';
import { Point2d } from '../interfaces/Point2d';

const findAngleRad = ({ x: x1, y: y1 }: Point2d, { x: x2, y: y2 }: Point2d): number => {
  return Math.atan2(y2 - y1, x2 - x1);
}

const findAngle = ({ x: x1, y: y1 }: Point2d, { x: x2, y: y2 }: Point2d): number => {
  return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
}

const findRectangle = ({ x: x1, y: y1 }: Point2d, { x: x2, y: y2 }: Point2d, width: number): fabric.Rect => {
  const center = {
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2
  }
  const length = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  const angle = findAngle({ x: x1, y: y1 }, { x: x2, y: y2 });

  const rectangle = new fabric.Rect({
    left: center.x - length / 2,
    top: center.y - width / 2,
    width: length,
    height: width,
  });
  rectangle.rotate(angle);
  return rectangle;
}

interface ACoords {
  bl: Point2d;
  br: Point2d;
  tl: Point2d;
  tr: Point2d;
}

const findBBFromACoords = ({ bl, br, tl, tr }: ACoords): BoundingBox => {
  const xes = [bl.x, br.x, tl.x, tr.x];
  const ys = [bl.y, br.y, tl.y, tr.y];
  const minX = Math.min.apply(null, xes);
  const maxX = Math.max.apply(null, xes);
  const minY = Math.min.apply(null, ys);
  const maxY = Math.max.apply(null, ys);
  return {
    left: minX,
    top: minY,
    width: maxX - minX,
    height: maxY - minY
  }
}

const findBBFromRectangle = (rect: fabric.Rect): BoundingBox | null => {
  if (!rect.aCoords) {
    return null;
  }
  return findBBFromACoords(rect.aCoords);
}

const findACoords = ({ x: x1, y: y1 }: Point2d, { x: x2, y: y2 }: Point2d, width: number): ACoords => {
  const length = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  const dw = width / 2;
  const dy = ((x2 - x1) * dw) / length;
  const dx = ((y2 - y1) * dw) / length;
  return {
    tl: { x: x1 - dx, y: y1 - dy },
    bl: { x: x1 + dx, y: y1 + dy },
    tr: { x: x2 - dx, y: y2 - dy },
    br: { x: x2 + dx, y: y2 + dy }
  }
}

const findACoordsFromImage = (image: fabric.Image): ACoords => {
  const angle = (image.angle ? image.angle : 0) * Math.PI / 180;
  const sina = Math.sin(angle);
  const cosa = Math.cos(angle);
  const width = image.width ? image.width : 0;
  const height = image.height ? image.height : 0;
  const dx1 = cosa * width;
  const dy1 = sina * width;
  const dx2 = sina * height;
  const dy2 = cosa * height;
  const left = image.left ? image.left : 0;
  const top = image.top ? image.top : 0;

  return {
    tl: { x: left, y: top },
    bl: { x: left - dx2, y: top + dy2 },
    tr: { x: left + dx1, y: top + dy1 },
    br: { x: left + dx1 - dx2, y: top + dy1 + dy2 }
  }
}

const findBB = ({ x: x1, y: y1 }: Point2d, { x: x2, y: y2 }: Point2d, width: number): BoundingBox => {
  return findBBFromACoords(findACoords({ x: x1, y: y1 }, { x: x2, y: y2 }, width));
}

const findBBWithMargins = ({ x: x1, y: y1 }: Point2d, { x: x2, y: y2 }: Point2d, w: number, margin: number): BoundingBox => {
  const { left, top, width, height } = findBB({ x: x1, y: y1 }, { x: x2, y: y2 }, w);
  const leftProt = left - margin / 2;
  const topProt = top - margin / 2;
  const xCorrection = leftProt < 0 ? leftProt : 0;
  const yCorrection = topProt < 0 ? topProt : 0;
  return {
    left: left - margin / 2 - xCorrection,
    top: top - margin / 2 - yCorrection,
    width: width + margin + xCorrection,
    height: height + margin + yCorrection,
  }
}

const findCircleBB = (x: number, y: number, radius: number): BoundingBox => {
  return {
    left: x - radius,
    top: y - radius,
    width: 2 * radius,
    height: 2 * radius
  }
}

const findBBFromImage = (image: fabric.Image): BoundingBox => {
  return findBBFromACoords(findACoordsFromImage(image));
}

const findPxPerMm = (point1: Point2d | null, point2: Point2d | null, distance: number | null): number | null => {

  if (point1 && point2 && distance && distance != 0) {
    const distancePx = Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
    return distancePx / distance;
  }
  return null;
}

const findIntermediatePoint = (point1: Point2d, point2: Point2d, offset: number): Point2d | null => {
  if (point1 && point2) {
    const distance = Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
    if (distance == 0) {
      return {
        x: point1.x,
        y: point1.y,
      }
    }
    const ratio = offset / distance;
    return {
      x: point1.x - (point1.x - point2.x) * ratio,
      y: point1.y - (point1.y - point2.y) * ratio,
    }
  }
  return null;
}

const findDistance = (point1: Point2d, point2: Point2d): number => {
  return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}

const findDistanceFromLine = ({ x: x1, y: y1 }: Point2d, { x: x2, y: y2 }: Point2d, { x: x0, y: y0 }: Point2d): number => {
  const abs = Math.abs((x2 - x1) * (y1 - y0) - (x1 - x0) * (y2 - y1));
  const magnitude = findDistance({ x: x1, y: y1 }, { x: x2, y: y2 });

  return abs / magnitude;
}

const findProjectionPointToLine = ({ x: x1, y: y1 }: Point2d, { x: x2, y: y2 }: Point2d, { x: x0, y: y0 }: Point2d): Point2d => {
  const magnitude = findDistance({ x: x1, y: y1 }, { x: x2, y: y2 });
  const dotProduct = (x2 - x1) * (x0 - x1) + (y2 - y1) * (y0 - y1);
  return {
    x: dotProduct / magnitude * ((x2 - x1) / magnitude) + x1,
    y: dotProduct / magnitude * ((y2 - y1) / magnitude) + y1
  }
}

const findPointFromPointAngleLength = ({ x: x1, y: y1 }: Point2d, angle: number, length: number): Point2d => {
  const andgleRad = angle * Math.PI / 180;
  return {
    x: x1 + Math.cos(andgleRad) * length,
    y: y1 + Math.sin(andgleRad) * length,
  }
}

export {
  findRectangle,
  findBBFromRectangle,
  findBB,
  findAngle,
  findAngleRad,
  findBBFromACoords,
  findBBFromImage,
  findCircleBB,
  findBBWithMargins,
  findPxPerMm,
  findIntermediatePoint,
  findDistance,
  findDistanceFromLine,
  findProjectionPointToLine,
  findPointFromPointAngleLength
};
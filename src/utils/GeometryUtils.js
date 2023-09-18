import { fabric } from 'fabric';

const findAngleRad = ({x: x1, y: y1}, {x: x2, y: y2}) => {
    return Math.atan2(y2-y1, x2-x1);
}

const findAngle = ({x: x1, y: y1}, {x: x2, y: y2}) => {
    return Math.atan2(y2-y1, x2-x1) * 180 / Math.PI;
}

const findRectangle = ({x: x1, y: y1}, {x: x2, y: y2}, width) => {
    const center = {
        x: (x1 + x2) / 2, 
        y: (y1 + y2) / 2
    }
    const length = Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2));
    const angle = findAngle({x: x1, y: y1}, {x: x2, y: y2});

    const rectangle = new fabric.Rect({
        left: center.x - length/2,
        top: center.y - width/2,
        width: length,
        height: width,
    });
    rectangle.rotate(angle);
    return rectangle;
}

const findBBFromACoords = (aCoords) => {
    const keys   = Object.keys(aCoords);
    const xes = keys.map(function(k) { return aCoords[k].x} );
    const ys = keys.map(function(k) { return aCoords[k].y} );
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

const findBBFromRectangle = (rect) => {
    if (!rect.aCoords) {
        return null;
    }
    return findBBFromACoords(rect.aCoords);
}

const findACoords = ({x1, y1}, {x2, y2}, width) => {
    const length = Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2));
    const dw = width / 2;
    const dy = ((x2-x1) * dw) / length;
    const dx = ((y2-y1) * dw) / length;
    return {
        tl: {x: x1-dx, y: y1-dy},
        bl: {x: x1+dx, y: y1+dy},
        tr: {x: x2-dx, y: y2-dy},
        br: {x: x2+dx, y: y2+dy}
    }
}

const findACoordsFromImage = (image) => {
    const angle = image.angle * Math.PI / 180;
    const sina = Math.sin(angle);
    const cosa = Math.cos(angle);
    const dx1 = cosa * image.width;
    const dy1 = sina * image.width;
    const dx2 = sina * image.height;
    const dy2 = cosa * image.height;

    return {
        tl: {x: image.left, y: image.top},
        bl: {x: image.left - dx2, y: image.top + dy2},
        tr: {x: image.left + dx1, y: image.top + dy1},
        br: {x: image.left + dx1 - dx2, y: image.top + dy1 + dy2}
    }
}

const findBB = ({x1, y1}, {x2, y2}, width) => {
    return findBBFromACoords(findACoords({x1: x1, y1: y1}, {x2: x2, y2: y2}, width));
}

const findBBWithMargins = ({x1, y1}, {x2, y2}, w, margin) => {
    const {left, top, width, height} = findBB({x1: x1, y1: y1}, {x2: x2, y2: y2}, w);
    const leftProt = left - margin/2;
    const topProt = top - margin/2;
    const xCorrection = leftProt < 0 ? leftProt : 0;
    const yCorrection = topProt < 0 ? topProt : 0;
    return {
        left: left - margin/2 - xCorrection,
        top: top - margin/2 - yCorrection,
        width: width + margin + xCorrection,
        height: height + margin + yCorrection,
    }
}

const findCircleBB = (x, y, radius) => {
    return {
        left: x - radius,
        top: y - radius,
        width: 2*radius,
        height: 2*radius
    } 
}

const findBBFromImage = (image) => {
    return findBBFromACoords(findACoordsFromImage(image));
}

const findPxPerMm = (point1, point2, distance) => {

  if (point1 && point2) {
    const distancePx = Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
    return distancePx / distance;
  }
  return null;
}

const findIntermediatePoint = (point1, point2, offset) => {
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

const  findDistance = (point1, point2) => {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}

const findDistanceFromLine = ({x: x1, y: y1}, {x: x2, y: y2}, {x: x0, y: y0}) => {
    const abs = Math.abs((x2 - x1)*(y1 - y0) - (x1 - x0)*(y2 - y1));
    const magnitude = findDistance({x: x1, y: y1}, {x: x2, y: y2});
    
    return abs/magnitude;
}

const findProjectionPointToLine = ({x: x1, y: y1}, {x: x2, y: y2}, {x: x0, y: y0}) => {
    const magnitude = findDistance({x: x1, y: y1}, {x: x2, y: y2});
    const dotProduct = (x2-x1)*(x0-x1) + (y2-y1)*(y0-y1);
    return {
        x: dotProduct/magnitude * ((x2 - x1)/magnitude) + x1,
        y: dotProduct/magnitude * ((y2 - y1)/magnitude) + y1
    }
}

const findPointFromPointAngleLength = ({x: x1, y: y1}, angle, length) => {
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
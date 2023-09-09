import { fabric } from 'fabric';

const findAngle = ({x1, y1}, {x2, y2}) => {
    return Math.atan2(y2-y1, x2-x1) * 180 / Math.PI;
}

const findRectangle = ({x1, y1}, {x2, y2}, width) => {
    const center = {
        x: (x1 + x2) / 2, 
        y: (y1 + y2) / 2
    }
    const length = Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2));
    const angle = findAngle({x1: x1, y1: y1}, {x2: x2, y2: y2});

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
    console.log("image width: ", image.width, " image height: ", image.height, image);
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

const findBBWithMargins = ({x1, y1}, {x2, y2}, w) => {
    const {left, top, width, height} = findBB({x1: x1, y1: y1}, {x2: x2, y2: y2}, w);
    const leftProt = left - w/2;
    const topProt = top - w/2;
    const xCorrection = leftProt < 0 ? leftProt : 0;
    const yCorrection = topProt < 0 ? topProt : 0;
    return {
        left: left - w/2 - xCorrection,
        top: top - w/2 - yCorrection,
        width: width + w + xCorrection,
        height: height + w + yCorrection,
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
    console.log("Accords from image: ", findACoordsFromImage(image));
    return findBBFromACoords(findACoordsFromImage(image));
}

const findPxPerMm = (point1, point2, distance) => {

  if (point1 && point2) {
    const distancePx = Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
    return distancePx / distance;
  }
  return null;
}

export {
    findRectangle,
    findBBFromRectangle,
    findBB,
    findAngle,
    findBBFromACoords,
    findBBFromImage,
    findCircleBB,
    findBBWithMargins,
    findPxPerMm
};
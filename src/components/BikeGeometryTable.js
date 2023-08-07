// src/components/BikeGeometryTable.js
import React from 'react';

const BikeGeometryTable = ({ points, wheelbase }) => {
  // Calculate bike geometry specs based on the provided points and wheelbase
  const finalWheelbase=wheelbase ? Number(wheelbase) : 0;

  let stack=0;
  let reach=0;
  let topTube=0;
  let seatTubeCT=0;
  let headAngle=0;
  let seatAngle=0;
  let headTube=0;
  let chainstay=0;
  let bbDrop=0;

  const rearWheelCenter = points["rearWheelCenter"];
  const frontWheelCenter = points["frontWheelCenter"];

  if (rearWheelCenter && frontWheelCenter) {
    const wheelbasePx = Math.sqrt(Math.pow(rearWheelCenter.x - frontWheelCenter.x, 2) + Math.pow(rearWheelCenter.y - frontWheelCenter.y, 2));
    const pxPerMm = wheelbasePx / wheelbase;

    const bottomBracketCenter = points["bottomBracketCenter"];
    const headTubeTop = points["headTubeTop"];
    const seatTubeTop = points["seatTubeTop"];
    const headTubeBottom = points["headTubeBottom"];

    if (bottomBracketCenter && headTubeTop) {
        stack = Math.abs(headTubeTop.y - bottomBracketCenter.y) / pxPerMm;
        reach = Math.abs(headTubeTop.x - bottomBracketCenter.x) / pxPerMm;
    }

    if (seatTubeTop && bottomBracketCenter) {
        seatTubeCT = Math.sqrt(Math.pow(bottomBracketCenter.x - seatTubeTop.x, 2) + Math.pow(bottomBracketCenter.y - seatTubeTop.y, 2)) / pxPerMm;
        const seatAngleRad = Math.atan2(Math.abs(seatTubeTop.y-bottomBracketCenter.y), Math.abs(seatTubeTop.x - bottomBracketCenter.x));
        seatAngle = (seatAngleRad * 180) / Math.PI;
        
        if (headTubeTop) {
            const seatAngleRadTo90 = (Math.PI / 2.0) - seatAngleRad;
            console.log("radians: ", seatAngleRadTo90);
            topTube = reach + Math.tan(seatAngleRadTo90) * stack;
        }
    }
    
    if (headTubeBottom && headTubeTop) {
        headTube = Math.sqrt(Math.pow(headTubeBottom.x - headTubeTop.x, 2) + Math.pow(headTubeBottom.y - headTubeTop.y, 2)) / pxPerMm;
        headAngle = (Math.atan2(Math.abs(headTubeTop.y-headTubeBottom.y), Math.abs(headTubeTop.x - headTubeBottom.x)) * 180) / Math.PI;
    }

    if (bottomBracketCenter && rearWheelCenter) {
        chainstay = Math.sqrt(Math.pow(bottomBracketCenter.x - rearWheelCenter.x, 2) + Math.pow(bottomBracketCenter.y - rearWheelCenter.y, 2)) / pxPerMm;
        bbDrop = Math.abs(bottomBracketCenter.y - rearWheelCenter.y) / pxPerMm;
    }
  }

  
//   const reach = points['reach'] ? points['reach'][0] - points['headTube'][0] : '';
//   const stack = points['stack'] ? points['stack'][1] - points['headTube'][1] : '';
//   const topTube = Math.sqrt(reach * reach + stack * stack);
//   const seatTubeCT = points['seatTube'] ? points['seatTube'][1] : '';
//   const headAngle = points['headTube'] ? Math.atan(stack / reach) * (180 / Math.PI) : '';
//   const seatAngle = points['seatTube'] ? Math.atan((points['seatTube'][2] - points['bottomBracket'][2]) / stack) * (180 / Math.PI) : '';
//   const headTube = points['headTube'] ? Math.sqrt(Math.pow(points['headTube'][0], 2) + Math.pow(points['headTube'][1], 2)) : '';
//   const chainstay = points['chainstay'] ? points['chainstay'][0] : '';
//   const calculatedWheelbase = Math.sqrt(Math.pow(chainstay, 2) + Math.pow(points['bottomBracket'][2], 2));
//   const finalWheelbase = wheelbase || calculatedWheelbase;

  return (
    <div className="bike-geometry-table">
      <h3>Bike Geometry Specifications</h3>
      <table>
        <thead>
          <tr>
            <th>Spec</th>
            <th>Value(mm)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Reach</td>
            <td>{reach.toFixed(0)}</td>
          </tr>
          <tr>
            <td>Stack</td>
            <td>{stack.toFixed(0)}</td>
          </tr>
          <tr>
            <td>Top Tube (effective)</td>
            <td>{topTube.toFixed(0)}</td>
          </tr>
          <tr>
            <td>Seat Tube C-T</td>
            <td>{seatTubeCT.toFixed(0)}</td>
          </tr>
          <tr>
            <td>Head Angle</td>
            <td>{headAngle.toFixed(0)}</td>
          </tr>
          <tr>
            <td>Seat Angle</td>
            <td>{seatAngle.toFixed(0)}</td>
          </tr>
          <tr>
            <td>Head Tube</td>
            <td>{headTube.toFixed(0)}</td>
          </tr>
          <tr>
            <td>Chainstay</td>
            <td>{chainstay.toFixed(0)}</td>
          </tr>
          <tr>
            <td>Wheelbase</td>
            <td>{finalWheelbase.toFixed(0)}</td>
          </tr>
          <tr>
            <td>BB Drop</td>
            <td>{bbDrop.toFixed(0)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BikeGeometryTable;

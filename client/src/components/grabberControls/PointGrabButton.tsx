import Color from 'color';
import React, { useState, useRef, ReactNode } from 'react';
import { useCanvasContext } from '../../contexts/CanvasContext';
import { GeometryPoints, useGeometryContext } from '../../contexts/GeometryContext';
import { ColorPoint2d } from '../../interfaces/Point2d';
import PointPickerControls, { PointPickerControlsRef } from '../drawing/PointPickerControls';
import PointMoveControls from './PointMoveControls';

interface PointGrabButtonProps {
  className: string;
  pointKey: keyof GeometryPoints;
  selectedPoint: string | null;
  setSelectedPoint: (val: string | null) => void;
  children: ReactNode;
}

const PointGrabButton = (props: PointGrabButtonProps) => {
  const {
    state: [geometryState, updateGeometryState],
  } = useGeometryContext();

  const {
    state: [canvasState,],
  } = useCanvasContext();

  const pointPickerControlsRef = useRef<PointPickerControlsRef>(null);

  const handleAddPoint = (style: string, backupStyle: string) => {
    if (!pointPickerControlsRef.current) {
      return;
    }
    let button = document.querySelector(style + ':hover');
    if (button == null) {
      button = document.querySelector(backupStyle);
    }
    if (!button) {
      return;
    }
    const computedStyle = getComputedStyle(button);
    const color = Color(computedStyle.getPropertyValue("background-color"));
    const promise = pointPickerControlsRef.current.enablePointPicker(color);
    promise.then((point) => {
      const stateChange = {
        geometryPoints: { ...geometryState.geometryPoints, [props.pointKey]: { x: point.x, y: point.y, color: color } }
      };
      updateGeometryState(stateChange);
      props.setSelectedPoint(null);
    });
    props.setSelectedPoint(props.pointKey);

  };

  //TODO fix casting after geometry points are split
  return (
    <div>
      {(props.selectedPoint != props.pointKey || !geometryState.geometryPoints[props.pointKey]) &&
      <button
        className={props.selectedPoint === props.pointKey ? 'selected-' + props.className : props.className}
        onClick={() => handleAddPoint('.' + props.className, '.selected-' + props.className)}
      >
        {props.children}
        (
        {geometryState.geometryPoints[props.pointKey] ? (geometryState.geometryPoints[props.pointKey]!).x.toFixed(0) : '____'},
        {geometryState.geometryPoints[props.pointKey] ? (geometryState.geometryPoints[props.pointKey]!).y.toFixed(0) : '____'}
        )
      </button>
      }
      {canvasState.canvas && <PointPickerControls ref={pointPickerControlsRef} />}
      {(props.selectedPoint === props.pointKey && geometryState.geometryPoints[props.pointKey]) &&
      <div>
        {props.children}
        <PointMoveControls pointKey={props.pointKey}/>
      </div>
      }
    </div>
  );
};

export default PointGrabButton;
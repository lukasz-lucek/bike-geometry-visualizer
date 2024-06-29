// src/components/ImageUploadOption.js
import React, { DragEvent, FormEvent, useState } from 'react';
import { useGeometryContext } from '../../contexts/GeometryContext';
import BackgroundImage from "../drawing/BackgroundImage"
import { sha256 } from '../../utils/Sha256Utils';

const ImageUploadOption = () => {


  const [dragOver, setDragOver] = useState(false);

  const {
    state: [geometryState, updateGeometryState],
  } = useGeometryContext();

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageSelection(file);
    }
  };

  const handleImageSelection = (file: Blob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        var result = reader.result;
        const dec = new TextDecoder("utf-8");
        if (reader.result instanceof ArrayBuffer) {
          result = dec.decode(reader.result);
        }
        sha256(result as string).then((resultHash) => {
          updateGeometryState({ selectedFile: result as string, selectedFileHash: resultHash});
        });
        // var enc = new TextEncoder();
        // let hashPromise : Promise<ArrayBuffer> | null = null;
        // if (reader.result instanceof ArrayBuffer) {
        //   hashPromise = window.crypto.subtle.digest('SHA-256', reader.result);
        // } else {
        //   hashPromise = window.crypto.subtle.digest('SHA-256', enc.encode(reader.result).buffer);
        // }
        // hashPromise.then((hash) => {
        //   const dec = new TextDecoder("utf-8");
        //   const hashString = btoa(dec.decode(hash));
        //   if (reader.result instanceof ArrayBuffer) {
        //     const result = dec.decode(reader.result);
        //     updateGeometryState({ selectedFile: result, selectedFileHash: hashString});
        //   } else {
        //     updateGeometryState({ selectedFile: reader.result, selectedFileHash: hashString});
        //   }
          
        // })
      
      
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: FormEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files) {
      return;
    }
    const file = e.currentTarget.files[0];
    if (file) {
      handleImageSelection(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
      {dragOver ?
        <div className="drop-indicator">Drop it - I'm ready</div> :
        <div className="drop-indicator">You can drop images here</div>}
      <input type="file" onChange={handleFileInputChange} />
      {geometryState.selectedFile && <BackgroundImage opacity={1.0} desiredPxPerMM={null} focusPoint={null}/>}
    </div>
  );
};

export default ImageUploadOption;

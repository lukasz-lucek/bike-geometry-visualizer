import React, {MouseEvent, useEffect, useState} from "react";
import "./BikeInfo.css"
import { GeometryState, useGeometryContext } from "../../contexts/GeometryContext";
import { useAuthContext } from "../../contexts/AuthContext";
import { IBikeData } from "../../IGeometryState";
import { GeompetryPayloadSerializer } from "../../contexts/GeometryStatesSerilizer";
import axios from "axios";
import { getAxiosInstance } from "../../utils/AxiosUtils";
import { cloneBikeInStorage, loadBikeFromStorage, saveBikeToStorage } from "../../utils/StorageUtils";

const BikeInfo = () => {
  const [displayedName, setDisplayedName] = useState<string>("No bike loaded - use 'Find' or 'Create New'");
  const [saveEnabled, setSaveEnabled] = useState<boolean>(false);
  const auth = useAuthContext();
  const {
    state: [geometryState, updateGeometryContextState],
    metadata: [geometryMetadata, setMetadata],
  } = useGeometryContext();

  useEffect(() => {
    if (geometryMetadata.make != '') {
      setDisplayedName(geometryMetadata.make + ' ' + geometryMetadata.model + ' ' + geometryMetadata.year)
    }
    setSaveEnabled(auth.authState.user == geometryMetadata.user);
  }, [geometryMetadata])

  const save = async (e: MouseEvent) => {
    console.log(`sending upstream bike: ${geometryMetadata.make}, ${geometryMetadata.model}, ${geometryMetadata.year}`);
    const geometryData : IBikeData = geometryMetadata;
    geometryData.data = geometryState;

    saveBikeToStorage(geometryData).then( resp => {
      console.log(resp);
    }).catch(function (error) {
      console.log(error);
    });
    //console.log(`about to sent data: ${prepPayload}`);
  }

  const createMyCopy = (id: string | null) => {
    if (!id) {
      console.log('unable to clone bike withut ID');
      return;
    }
    cloneBikeInStorage(id).then(newId => {
      loadBikeFromStorage(newId).then(data => {
        updateGeometryContextState(data.data as GeometryState);
        data.data = null;
        setMetadata(data);
      }).catch(err => {
        console.log(err);
      })
    }).catch(err => {
      console.log(err);
    });
  }

  return (
    <div className="container">
      <img src="/bike.png" className="bike"></img>
      <span><b>{displayedName}</b></span>
      <button onClick={e => {save(e)}} disabled={!saveEnabled}>Save Changes</button>
      {!saveEnabled && geometryMetadata._id && <button onClick={e => {createMyCopy(geometryMetadata._id!)}}>Create your copy</button>}
    </div>
  );
};

export default BikeInfo;
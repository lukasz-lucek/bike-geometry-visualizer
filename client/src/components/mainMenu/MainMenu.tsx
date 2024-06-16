import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import "./MainMenu.css"
import BikeFinder from "../storage/BikeFinder";
import ImageUploadOption from "../basicOptions/ImageUploadOption";
import GeometrySaver from "../storage/GeometrySaver";
import { useGeometryContext } from "../../contexts/GeometryContext";
import GrabGeometryMenu from "./GrabGeometryMenu";
import FrameGeometryInput from "../basicOptions/FrameGeometryInput";
import BikeFinderTab from "../toolTabs/BikeFinderTab/BikeFinderTab";

const MainMenu = () => {

  const {
    state: [state],
    metadata: [metadata]
  } = useGeometryContext();

  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    //setDataLoaded(state.selectedFile != null && metadata.make != null && metadata.model != null && metadata.year != null);
    setDataLoaded(metadata._id != null);
  }, [state, metadata])

  return (
  <Tabs>
    <TabList>
      <Tab>Find & Load</Tab>
      <Tab>Create New</Tab>
      <Tab>Edit Bike</Tab>
      <Tab>Edit Sizes</Tab>
      <Tab>Compare</Tab>
    </TabList>

    <TabPanel>
      <BikeFinderTab />
    </TabPanel>
    <TabPanel>
      <ImageUploadOption/>
      <GeometrySaver/>
    </TabPanel>
    <TabPanel>
      {dataLoaded &&
        <GrabGeometryMenu/>}
      {!dataLoaded &&
        <p>no bike loaded - load one or create new to edit geometry</p>}
    </TabPanel>
    <TabPanel>
      <FrameGeometryInput/>
    </TabPanel>
    <TabPanel>
      <FrameGeometryInput/>
    </TabPanel>
  </Tabs>
  );
};

export default MainMenu;
import React from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import HandlebarGeometryGrabber from "../basicOptions/HandlebarGeometryGrabber";
import SeatGeometryGrabber from "../basicOptions/SeatGeometryGrabber";
import ImageGeometryGrabber from "../basicOptions/ImageGeometryGrabber";
import PartsGrabber from "../basicOptions/PartsGrabber";

const GrabGeometryMenu = () => {
  return (
  <Tabs>
    <TabList>
      <Tab>Key Points</Tab>
      <Tab>Bike Parts</Tab>
      <Tab>Handlenars</Tab>
      <Tab>Seat</Tab>
    </TabList>

    <TabPanel>
      <ImageGeometryGrabber />
    </TabPanel>
    <TabPanel>
      <PartsGrabber />
    </TabPanel>
    <TabPanel>
      <HandlebarGeometryGrabber/>
    </TabPanel>
    <TabPanel>
      <SeatGeometryGrabber/>
    </TabPanel>
  </Tabs>
  );
};

export default GrabGeometryMenu;
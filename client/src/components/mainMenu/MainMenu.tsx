import React from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import "./MainMenu.css"
import BikeFinder from "../storage/BikeFinder";

const MainMenu = () => {

  return (
  <Tabs>
    <TabList>
      <Tab>Find</Tab>
      <Tab>Create new</Tab>
    </TabList>

    <TabPanel>
      <BikeFinder />
    </TabPanel>
    <TabPanel>
      <h2>Any content 2</h2>
    </TabPanel>
  </Tabs>
  );
};

export default MainMenu;
import { createStackNavigator, createAppContainer } from "react-navigation";
import React from "react";
import ScanSurroundings from "./components/ScanSurroundings";

// Navigation is necessary if want to add more screens
// (is needed in an unpublished version of this project)
const AppNavigator = createStackNavigator({
    ScanSurroundings: { screen: ScanSurroundings }
});

export default createAppContainer(AppNavigator);

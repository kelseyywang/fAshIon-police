import { createStackNavigator, createAppContainer } from "react-navigation";
import React from "react";
import PredictFromCamera from "./components/PredictFromCamera";

// Navigation is necessary if want to add more screens
// (is needed in an unpublished version of this project)
const AppNavigator = createStackNavigator({
    PredictFromCamera: { screen: PredictFromCamera }
});

export default createAppContainer(AppNavigator);

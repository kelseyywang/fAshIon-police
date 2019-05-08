import React from "react";
import { Text, View, ImageStore, Vibration } from "react-native";
import {
    Camera,
    Permissions,
    FileSystem,
    Constants,
    ImageManipulator
} from "expo";
import { Button } from "./common";
import { PREDICTION_KEY, PREDICTION_URL, IMGUR_API_ID } from "../config-keys";

const DEFAULT_TAG_TEXT = "Hey, I'm your custom fashion police!";

export default class PredictFromCamera extends React.Component {
    static navigationOptions = {
        header: null
    };
    state = {
        tagText: DEFAULT_TAG_TEXT,
        flash: "off",
        zoom: 0,
        autoFocus: "on",
        depth: 0,
        ratio: "16:9",
        ratios: [],
        photoId: 1,
        photoIdTag: 1,
        whiteBalance: "auto",
        hasCameraPermission: null,
        type: Camera.Constants.Type.back
    };

    async componentWillMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === "granted" });
    }

    componentWillUnmount() {
        clearInterval(this.resetPredictionInterval);
    }

    async componentDidMount() {
        var file_info = await FileSystem.getInfoAsync(
            FileSystem.documentDirectory + "photos"
        );
        if (!file_info.exists) {
            FileSystem.makeDirectoryAsync(
                FileSystem.documentDirectory + "photos"
            ).catch(e => {
                console.log(e, "Directory exists");
            });
        }
    }

    // Takes picture, then calls sendToImgur
    async takePicture() {
        var photoLoc = `${FileSystem.documentDirectory}photos/Photo_${
            this.state.photoId
        }_Base64`;
        if (this.camera) {
            let photo = await this.camera.takePictureAsync({ base64: true });
            FileSystem.moveAsync({
                from: photo.uri,
                to: photoLoc
            }).then(() => {
                this.setState({
                    photoId: this.state.photoId + 1
                });
                this.sendToImgur(photoLoc);
            });
        }
    }

    // Downsizes photo and uses Imgur API to
    // get a web url of photo, sends to Prediction API
    // (calls sendToMicrosoftPrediction)
    async sendToImgur(photoLoc) {
        try {
            // Use Image Manipulator to downsize image
            let manipulatedObj = await ImageManipulator.manipulateAsync(
                photoLoc,
                [{ resize: { width: 200 } }],
                { base64: true }
            );
            var xmlHttp = new XMLHttpRequest();
            const data = new FormData();
            xmlHttp.onreadystatechange = e => {
                if (xmlHttp.readyState == 4) {
                    if (xmlHttp.status === 200) {
                        // Send Imgur link to photo to be sent to Prediction API
                        let imgur_json = JSON.parse(xmlHttp.responseText);
                        this.sendToMicrosoftPrediction(imgur_json.data.link);
                    } else {
                        // Debug errors
                        console.log(xmlHttp.responseJson);
                    }
                }
            };
            xmlHttp.open("POST", "https://api.imgur.com/3/upload", true);
            xmlHttp.setRequestHeader(
                "Authorization",
                "Client-ID " + IMGUR_API_ID
            );
            data.append("type", "base64");
            data.append("image", manipulatedObj.base64);
            xmlHttp.send(data);
        } catch (error) {
            console.error(error);
        }
    }

    // Uses Prediction API to process photo at a web url
    // and calls setNewPrediction
    async sendToMicrosoftPrediction(img_url) {
        let response = await fetch(PREDICTION_URL, {
            method: "POST",
            headers: {
                "Prediction-Key": PREDICTION_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Url: img_url
            })
        });
        let bodyText = JSON.parse(response["_bodyText"]);
        let predictions = bodyText["predictions"];
        this.setNewPrediction(predictions);
    }

    // Sets tagText to most probable tag
    setNewPrediction(predictions) {
        let maxProb = 0;
        let bestTag = "None";
        for (let predMap of predictions) {
            if (predMap.probability > maxProb) {
                maxProb = predMap.probability;
                bestTag = predMap.tagName;
            }
        }
        Vibration.vibrate();
        // To give our app more personality, we created arrays of funny responses and chose
        // a random response depending on what the tag was. Removed from this version
        // to accommodate any named tags
        this.setState({
            tagText: `AI says: ${bestTag}\nProbability: ${maxProb.toString()}`
        });
        this.resetPredictionInterval = setInterval(
            this.resetPredictionText.bind(this),
            20000
        );
    }

    resetPredictionText() {
        this.setState({
            tagText: DEFAULT_TAG_TEXT
        });
    }

    render() {
        const { hasCameraPermission } = this.state;
        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <Camera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={{ flex: 1 }}
                    type={this.state.type}
                    flashMode={this.state.flash}
                    autoFocus={this.state.autoFocus}
                    zoom={this.state.zoom}
                    whiteBalance={this.state.whiteBalance}
                    ratio={this.state.ratio}
                    focusDepth={this.state.depth}
                >
                    <View style={styles.cameraView}>
                        <View style={styles.tagTextView}>
                            <Text style={styles.textStyle}>
                                {this.state.tagText}
                            </Text>
                        </View>
                        <View style={styles.buttonContainerView}>
                            <Button
                                title="Cute or not?"
                                onPress={() => {
                                    clearInterval(this.resetPredictionInterval);
                                    this.takePicture();
                                    this.setState({
                                        tagText: "Thinking..."
                                    });
                                }}
                            />
                        </View>
                    </View>
                </Camera>
            );
        }
    }
}

const styles = {
    cameraView: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "stretch",
        backgroundColor: "transparent"
    },
    tagTextView: {
        backgroundColor: "white",
        height: 90,
        margin: 20,
        marginTop: 30,
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    buttonContainerView: {
        backgroundColor: "transparent",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        alignSelf: "stretch",
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10
    },
    textStyle: {
        color: "black",
        fontSize: 19,
        textAlign: "center"
    }
};

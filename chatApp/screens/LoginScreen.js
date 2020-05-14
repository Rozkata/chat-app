import * as React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Dimensions } from "react-native";
import firebase from "firebase";

export default function LoginScreen (props) {
    const [name, setName] = React.useState("");
    const [telephoneNumber, setTelephoneNumber] = React.useState("");

    // move to Chat screen and pass in the name of the user
    // also set user name in firebase db
    async function handleContinue() {
        if (name.length < 3) {
            Alert.alert('Error', 'Wrong name');
        } else if (telephoneNumber.length < 10) {
            Alert.alert('Error', 'Invalid phone number entered');
        } else {
            var rootRef = firebase.database().ref('users/' + telephoneNumber);
            rootRef.once("value")
            .then(function(snapshot) {
            var key = snapshot.exists();
            if (!key) {
                firebase.database().ref('users/' + telephoneNumber).set({name: name});
            }
            });
            props.navigation.navigate("Home", {name: name, userPhoneNumber: telephoneNumber});
        }
    }

    React.useEffect(() => {
        var firebaseConfig = {
            apiKey: "AIzaSyAh3x6KWsJjo57daK3qwz1ebMzSxpVdORI",
            authDomain: "chat-application-b7520.firebaseapp.com",
            databaseURL: "https://chat-application-b7520.firebaseio.com",
            projectId: "chat-application-b7520",
            storageBucket: "chat-application-b7520.appspot.com",
            messagingSenderId: "724772630504",
            appId: "1:724772630504:web:b557f07c2f2de268463e5d"
          };
          // check if firebase is already loaded
          if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
    });
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 30 : 0

    return (
        <View style={styles.container}>
            <View style={styles.circle} />
            <View style={{marginTop: 64}}>
                <Image source={require("../assets/mentormate.png")} />
            </View>
            <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}>
            <View style={{marginHorizontal: 32}}>
                <Text style={styles.username}>Username</Text>
                <TextInput style={styles.input} 
                placeholder="Enter username" 
                onChangeText={name => setName(name)}
                value={name}
                />
                <Text style={styles.username}>Phone number</Text>
                <TextInput style={styles.input}
                placeholder="Enter telephone number"
                onChangeText={number => setTelephoneNumber(number)}
                value={telephoneNumber} 
                />
            </View>
            </KeyboardAvoidingView>
            <View style={{alignItems: "flex-end", marginTop: 50, marginHorizontal: 32}}>
                    <TouchableOpacity  onPress={handleContinue}>
                        <Text style={styles.continueButton}>Continue</Text>
                    </TouchableOpacity>
                </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F5F7",
    }, 
    circle: {
        width: 500,
        height: 500,
        borderRadius: 500 / 2,
        backgroundColor: "#FFF",
        position: "absolute",
        left: -120,
        top: -20
    },
    username: {
        fontWeight: "bold",
        fontSize: 20,
        color: "#514E5A",
        marginTop: 5,
    },
    input: {
        marginTop: 20,
        height: 50,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#BAB7C3",
        borderRadius: 30,
        paddingHorizontal: 16,
        color: "#514E5A",
        fontWeight: "bold",
    },
    continueButton: {
        fontWeight: "bold",
        fontSize: 20,
        color: "#00ace6",
    }
});
import * as React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import firebase from 'firebase';

export default function AddFriendScreen(props) {
    const [phoneNumber, setPhoneNumber] = React.useState("");
    const userPhoneNumber = props.navigation.state.params.currentPhoneNumber;

    function handleAddFriend() {
        if (phoneNumber.length >= 10) {
            firebase.database().ref('users').child(userPhoneNumber+'/friend').push().update({friend: phoneNumber});
            Alert.alert('Success', 'Added a new friend succesfully. Please logout to be able to see the new changes !');
        } else {
            Alert.alert('Error', 'Please enter a valid telephone number !');
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.details}>Provide your friend's details</Text>
            <View style={{marginHorizontal: 32}}>
                <Text style={styles.username}>Phone number</Text>
                <TextInput style={styles.input}
                placeholder="Enter telephone number"
                placeholderTextColor="#514E5A"
                onChangeText={number => setPhoneNumber(number)}
                value={phoneNumber} 
                />
            </View>
            <TouchableOpacity style={styles.addFriend} onPress={() => handleAddFriend()}>
                <Text style={{color: "#514E5A"}}>Add Friend</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ccffff"
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
        borderColor: "black",
        borderRadius: 30,
        paddingHorizontal: 16,
        fontWeight: "bold",
    },
    details: {
        alignSelf: 'center',
        fontWeight: "bold",
        color: "#514E5A",
        fontSize: 20,
        marginTop: 30,
        marginBottom: 30
    },
    addFriend: {
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 30,
        borderColor: "black",
        borderWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: 16,
    }
});
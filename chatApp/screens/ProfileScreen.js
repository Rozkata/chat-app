import * as React from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import User from '../constants/User';
import firebase from 'firebase';

export default function ProfileScreen(props) {
    User.name = props.navigation.state.params.userName;

    async function _logOut() {
        props.navigation.navigate('Login');
    }

    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.username}>
                Username
            </Text>
            <Text style={{fontSize: 20}}>
                {User.name}
            </Text>

            <TouchableOpacity onPress={() => _logOut()}>
                <Text style={styles.logout}>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ccffff'
    },
    logout: {
        marginTop: 20,
        fontWeight: "bold",
        fontSize: 20,
        color: "#d2143a",
    }, 
    username: {
        fontWeight: "bold",
        fontSize: 20,
        color: "#00ace6",
    }
});
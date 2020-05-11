import * as React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, FlatList, Dimensions, Platform, KeyboardAvoidingView } from "react-native";
import firebase from "firebase";

export default function ChatScreen(props) {
    const [textMessage, setTextMessage] = React.useState("");
    const [messages, setMessages] = React.useState([]);

    const userName = props.navigation.state.params.name;
    const fromUser = props.navigation.state.params.userName;
    async function handleSend() {
        await firebase.database().ref("messages/").push({
            text: textMessage,
            fromUser: fromUser,
            toUser: userName,
            timeStamp: firebase.database.ServerValue.TIMESTAMP
        });
        setTextMessage("");

        return () => firebase.database().ref("messages/").off();
    }

    React.useEffect(() => {
        const dbRef = firebase.database().ref('messages/');
        dbRef.on('child_added', function (val) {
            const message = val.val();
            let messageArray = messages;
            messageArray.push(message);
            messageArray = messageArray.filter((item) => {
                if ((item.fromUser === fromUser && item.toUser === userName) || (item.fromUser === userName && item.toUser === fromUser)) {
                    return {
                        text: item.textMessage,
                        fromUser: item.fromUser,
                        toUser: item.toUser,
                        timeStamp: item.timeStamp
                    }
                }
            })
            setMessages([...messageArray]);
            });
            return () => dbRef.off();
    }, []);

    const renderMessages = ({item}) => {
        return (
            <View style={{
                flexDirection: 'row',
                width: '60%',
                alignSelf: item.fromUser === fromUser ? 'flex-end' : 'flex-start',
                backgroundColor: item.fromUser === fromUser ? '#00ccff' : '#9c9cbd',
                borderRadius: 10,
                marginBottom: 10 
            }}>
                <Text style={{color: '#fff', padding: 7, fontSize: 16}}>
                    {item.text}
                </Text>
                <Text style={{color: '#eee', padding:3, fontSize: 12}}>
                    {convertTime(item.timeStamp)}
                </Text>

            </View>
        );
    }

    const convertTime = (time) => {
        let d = new Date(time);
        let c = new Date();
        let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
        result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();

        // if day when u are looking at the chat isnt the same as when u were chatting
        // display the date + the time of the sent messages
        // should check if this works correctly
        if (c.getDay() !== d.getDay()) {
            result = d.getDay() + ' ' + d.getMonth() + ' ' + result;
        }
        return result;
    }

    let {height, width} = Dimensions.get('window');
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

        return(
            <SafeAreaView>
                <Text style={styles.username}>{userName}</Text>
                <FlatList 
                style={{padding: 10, height: height * 0.85}}
                data={messages}
                renderItem={renderMessages}
                keyExtractor={(item, index) => index.toString()}
                />
                <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    <TextInput 
                    style={styles.input}
                    placeholder="Type message..."
                    onChangeText={name => setTextMessage(name)}
                    value={textMessage}
                    />
                    <TouchableOpacity onPress={() => handleSend()} style={{paddingBottom:10, marginLeft:5}}>
                        <Text style={styles.btnText}>Send</Text>
                    </TouchableOpacity>
                </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'center',
    },
    username: {
        marginTop: 0, 
        alignSelf: 'center', 
        fontSize: 20, 
        fontWeight: 'bold'
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        width: '90%',
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: "white"
    },
    btnText: {
        color: 'darkblue',
        fontSize: 15
    },
    send: {
        position: "absolute",
        bottom:20,
        left: 150,
    }
});
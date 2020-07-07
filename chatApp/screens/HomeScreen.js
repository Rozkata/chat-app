import * as React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { SearchBar } from 'react-native-elements';
import _ from 'lodash';
import firebase from "firebase";
import User from "../constants/User";

export default function HomeScreen(props) {
    const [users, setUsers] = React.useState([]);
    const [query, setQuery] = React.useState("");
    const [fullData, setFullData] = React.useState([]);
    let hasImage = false;
    
    const currentTelephoneNumber = props.navigation.state.params.userPhoneNumber;

    let friends = [];

    React.useEffect(() => {
        const dbRef = firebase.database().ref('users');
        dbRef.on('child_added', (val) => {
            const person = val.val();
            dbRef.orderByChild('name').equalTo(person.name).on("value", function(snapshot) {
                snapshot.forEach((function(child) {
                    person['fatherKey'] = child.key;
                 })); 
              });
            
            firebase.database().ref('users/' + currentTelephoneNumber + '/' +'friend/')
            .on('child_added', (value) => {
                friends.push(value.val().friend);
            });
            if (person.image && person.name === props.navigation.state.params.name) {
                User.imageUrl = person.image;
                hasImage = true;
            } 
            if (!hasImage) {
                User.imageUrl = null;
            }

            if (friends.includes(person.fatherKey)) {
                setUsers((prevState) =>  {
                        return [...prevState, person];
                });
                setFullData((prevState) => {
                    return [...prevState, person];
                });
            }
        })
    }, []);
    

    function renderRow(item) {
        return(
            <TouchableOpacity key={item.name} style={styles.users}>
                <Image 
                source={item.image? {uri: item.image} : require('../assets/user.png')}
                style={{width:32, height: 32, resizeMode: 'cover', borderRadius: 32, marginRight: 5}}
                />
                <Text style={{fontSize: 20}} onPress={() => goToChat(item.name)}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    function goToChat(name) {
        let receiverPhone;
        firebase.database().ref('users/').orderByChild('name').equalTo(name).on("value", snapshot => {
            snapshot.forEach((function(child) { 
                receiverPhone = child.key;
            })); 
        })
        props.navigation.navigate("Chat", {senderPhoneNumber: currentTelephoneNumber, toUser: name, receiverPhoneNumber: receiverPhone});
    }

    function handleGoToProfile() {
        props.navigation.navigate("Profile", {userName: props.navigation.state.params.name, phoneNumber: currentTelephoneNumber});
    }
    
    function handleAddFriend() {
        props.navigation.navigate("AddFriend", {currentPhoneNumber: currentTelephoneNumber});
    }
    
    function contains(name, query) {
        if (name.name.includes(query)) {
            return true;
        }

        return false;
    }

    function handleSearch(text) {
        const formatQuery = text;
        const data = _.filter(fullData, user => {
            return contains(user, formatQuery);
        });
        setQuery(formatQuery);
        setUsers(data);
    }

        const profileUsers = users.map((user) => {
            return renderRow(user);
        });
        return(
            <View style={styles.container}>                        
             <SearchBar placeholder="Search here..." lightTheme round onChangeText={handleSearch} value={query} containerStyle={styles.searchcontainer}/>
            <TouchableOpacity onPress={() => handleGoToProfile()}style={styles.profileButton}>
            <Image style={styles.profileImage} source={require("../assets/profile.png")} />
            <Text style={styles.goToProfileText}> Go to your profile </Text>
            </TouchableOpacity>
            <SafeAreaView style={{flex: 1}}>
                {profileUsers}
            </SafeAreaView>
            <TouchableOpacity onPress={() => handleAddFriend()}>
            <Image  style={styles.addFriend} source={require("../assets/addFriend.jpg")} />
            </TouchableOpacity>
            </View>
        );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column', 
        height: '100%', 
        backgroundColor: "#ccffff",
    },
    users: {
        padding: 10, 
        borderColor: "#00ccff", 
        borderWidth: 1, 
        borderRadius: 10, 
        marginBottom: 10,
        flexDirection: 'row',
    },
    searchcontainer: {
        backgroundColor: '#ccffff',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        paddingTop: 20
    },
    profileButton: {
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingBottom: 5
    },
    profileImage: {
        height: 50, 
        width: 50, 
        right: 0, 
        top: 0
    },
    goToProfileText: {
        fontSize: 20, 
        fontWeight: 'bold', 
        color: "#00ace6"
    },
    addFriend: {
        width: 50, 
        height: 50, 
        alignSelf: 'flex-end', 
        borderRadius: 32
    }
});
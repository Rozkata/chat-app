import * as React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { SearchBar } from 'react-native-elements';
import _ from 'lodash';
import firebase from "firebase";
import User from "../constants/User";

export default function HomeScreen(props) {
    const [users, setUsers] = React.useState([]);
    const [query, setQuery] = React.useState([]);
    const [fullData, setFullData] = React.useState([]); 

    React.useEffect(() => {
        const dbRef = firebase.database().ref('users');
        dbRef.on('child_added', (val) => {
            const person = val.val();
            User.imageUrl = person.image && person.name === props.navigation.state.params.name ? person.image : null;
            setUsers((prevState) =>  {
                    return [...prevState, person];
            });
            setFullData((prevState) => {
                return [...prevState, person];
            });
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
        props.navigation.navigate("Chat", {name: name, userName: props.navigation.state.params.name});
    }

    function handleGoToProfile() {
        props.navigation.navigate("Profile", {userName: props.navigation.state.params.name});
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
            <View style={{flexDirection: 'column', height: '100%', backgroundColor: "#ccffff"}}>                        
             <SearchBar placeholder="Search here..." lightTheme round onChangeText={handleSearch} value={query} containerStyle={styles.searchcontainer}/>
            <TouchableOpacity onPress={() => handleGoToProfile()}style={{flexDirection: 'row', alignItems: 'center', paddingBottom: 5}}>
            <Image style={{height: 50, width: 50, right: 0, top: 0}} source={require("../assets/profile.png")} />
            <Text style={{fontSize: 20, fontWeight: 'bold', color: "#00ace6"}}> Go to your profile </Text>
            </TouchableOpacity>
            <SafeAreaView style={{flex: 1}}>
                {profileUsers}
            </SafeAreaView>
            </View>
        );
}

const styles = StyleSheet.create({
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
    }
});
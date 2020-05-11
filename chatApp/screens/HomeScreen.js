import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { SearchBar } from 'react-native-elements';
import _ from 'lodash';
import firebase from "firebase";

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
    }
    static navigationOptions = {
        title: 'Chat'
    }

    state = {
        users: [],
        query: '',
        fullData: []
    }

    componentDidMount() {
        const dbRef = firebase.database().ref('users');
        dbRef.on('child_added', (val) => {
            const person = val.val();
            this.setState((prevState) => {
                return {
                    users: [...prevState.users, person],
                    fullData: [...prevState.users, person]
                }
            })
        })
    }

    renderRow = (item) => {
        return(
            <TouchableOpacity key={item.name} style={styles.users}>
                <Text style={{fontSize: 20}} onPress={() => this.goToChat(item.name)}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    goToChat(name) {
        this.props.navigation.navigate("Chat", {name: name, userName: this.props.navigation.state.params.name});
    }

    handleGoToProfile() {
        this.props.navigation.navigate("Profile", {userName: this.props.navigation.state.params.name});
    }
    
    contains = (name, query) => {
        if (name.name.includes(query)) {
            return true;
        }

        return false;
    }

    handleSearch = (text) => {
        const formatQuery = text;
        const data = _.filter(this.state.fullData, user => {
            return this.contains(user, formatQuery);
        });
        this.setState({ query: formatQuery, users: data });
    }

    render() {
        const users = this.state.users.map((user) => {
            return this.renderRow(user);
        });
        return(
            <View style={{flexDirection: 'column', height: '100%', backgroundColor: "#ccffff"}}>                        
             <SearchBar placeholder="Search here..." lightTheme round onChangeText={this.handleSearch} value={this.state.query} containerStyle={styles.searchcontainer}/>
            <TouchableOpacity onPress={() => this.handleGoToProfile()}style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image style={{height: 50, width: 50, right: 0, top: 0}} source={require("../assets/profile.png")} />
            <Text style={{fontSize: 20, fontWeight: 'bold', color: "#00ace6"}}> Go to your profile </Text>
            </TouchableOpacity>
            <SafeAreaView style={{flex: 1}}>
                {users}
            </SafeAreaView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    users: {
        padding: 10, 
        borderColor: "#00ccff", 
        borderWidth: 1, 
        borderRadius: 10, 
        marginBottom: 10
    },
    searchcontainer: {
        backgroundColor: '#ccffff',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        paddingTop: 20
    }
});
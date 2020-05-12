import * as React from 'react';
import { SafeAreaView, View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import User from '../constants/User';
import firebase from 'firebase';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

export default function ProfileScreen(props) {
    const [imageSource, setImageSource] = React.useState(User.imageUrl ? {uri: User.imageUrl} : require('../assets/user.png'));
    const [upload, setUpload] = React.useState(false);
    User.name = props.navigation.state.params.userName;



    React.useEffect(() => {
        getPermissionAsync();
    });


    async function getPermissionAsync() {
        if (Constants.platform.ios) {
          const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
      };


    async function _logOut() {
        props.navigation.navigate('Login');
    }

    function updateUserImage(imageUrl) {
        User.image = imageUrl;
        firebase.database().ref('users').child(User.name).set({name: User.name, image: imageUrl});
        Alert.alert('Success', 'Image changed succesfully.');
        setImageSource({uri: imageUrl}); 
        setUpload(false);
    }

    async function handleChangeImage() {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.All,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });
            if (!result.cancelled) {
                setUpload(true);
                setImageSource({uri: result.uri});
                uploadFile();
            }
            console.log(result);
          } catch (E) {
            console.log(E);
          }
    }

    async function uploadFile() {
        let file = await uriToBlob(imageSource.uri);
        firebase.storage().ref(`profile_pictures/${name}.png`)
        .put(file)
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => updateUserImage(url))
        .catch(error => {
            setUpload(false);
            setImageSource(require('../assets/user.png'));
            Alert.alert('Error', 'Error when uploading image');
        })
}
    
    function uriToBlob(uri) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                resolve(xhr.response);
            };

            xhr.onerror = function() {
                reject(new Error('Error uploading image'))
            };

            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        })
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={{alignItems: 'center'}}>
                <TouchableOpacity onPress={handleChangeImage}>
                    {
                        upload ? <ActivityIndicator size="large" /> :
                        <Image 
                        style={{borderRadius: 100, width: 100, height: 100, resizeMode: 'cover'}}
                        source={imageSource}
                        />
                    }
                </TouchableOpacity>
            </View>
            <Text style={styles.username}>
                Username
            </Text>
            <Text style={{fontSize: 20}}>
                {User.name}
            </Text>

            <TouchableOpacity style={styles.logoutWrapper} onPress={() => _logOut()}>
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
        fontWeight: "bold",
        fontSize: 20,
        color: "black",
    }, 
    username: {
        fontWeight: "bold",
        fontSize: 20,
        color: "#00ace6",
    },
    logoutWrapper: {
        marginTop: '50%',
        borderWidth: 1,
        borderRadius: 12,
        width: '50%',
        alignItems: 'center',
        backgroundColor: '#00cccc'
    }
});
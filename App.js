
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Text, Image, Button } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [googleAccessToken, setGoogleAccessToken] = React.useState();
  const [googleUserInfo, setGoogleUserInfo] = React.useState();

  const [facebookAccessToken, setFacebookAccessToken] = React.useState();
  const [facebookUserInfo, setFacebookUserInfo] = React.useState();

  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    expoClientId: "392564443315-oii27uebkkd253l07mncca6fatb2qhds.apps.googleusercontent.com",
  });

  const [facebookRequest, facebookResponse, facebookPromptAsync] = Facebook.useAuthRequest({
    expoClientId: "1170426170555668",
  });
  console.log(facebookAccessToken)

  React.useEffect(() => {
    if (facebookResponse?.type === "success") {
      setFacebookAccessToken(facebookResponse.authentication.accessToken);
    }
  }, [facebookResponse]);

  React.useEffect(() => {
    if (googleResponse?.type === "success") {
      setGoogleAccessToken(googleResponse.authentication.accessToken);
    }
  }, [googleResponse]);

  async function getGoogleUserData() {
    let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${googleAccessToken}` }
    });

    userInfoResponse.json().then(data => {
      setGoogleUserInfo(data);
    });
  }

  async function getFacebookUserData() {
    let userInfoResponse = await fetch(`https://graph.facebook.com/v15.0/me?access_token=${facebookAccessToken}
    &fields=${encodeURIComponent('id,name,picture,email')}`);

    userInfoResponse.json().then(data => {
      setFacebookUserInfo(data);
    });
  }

  function showGoogleUserInfo() {
    if (googleUserInfo) {
      return (
        <View style={styles.userInfo}>
          <Image source={{ uri: googleUserInfo.picture }} style={styles.profilePic} />
          <Text>Welcome {googleUserInfo.name}</Text>
          <Text>{googleUserInfo.email}</Text>
        </View>
      );
    }
  }


  function showFacebookUserInfo() {
    if (facebookUserInfo) {
      return (
        <View style={styles.userInfo}>
          <Image source={{ uri: facebookUserInfo.picture.data.url }} style={styles.profilePic} />
          <Text>Welcome {facebookUserInfo.name}</Text>
          <Text>{facebookUserInfo.email}</Text>
        </View>
      );
    }
  }

  React.useEffect(() => {
    if (googleAccessToken)
      getGoogleUserData()
  }, [googleAccessToken])

  React.useEffect(() => {
    if (facebookAccessToken)
      getFacebookUserData()
  }, [facebookAccessToken])


  return (
    <View style={styles.container}>
      {showGoogleUserInfo()}
      <Button
        title={googleAccessToken ? "Get Google User Data" : "Login with Google"}
        onPress={googleAccessToken ? getGoogleUserData : () => {
          try {
            googlePromptAsync({ useProxy: true, showInRecents: true })
          } catch (error) {
            console.log(error)
          }

        }}
      />
      {showFacebookUserInfo()}
      <Button
        title={facebookAccessToken ? "Get Facebook User Data" : "Login with Facebook"}
        onPress={facebookAccessToken ? getFacebookUserData : () => {
          try {
            facebookPromptAsync({ useProxy: true, showInRecents: true })
          } catch (error) {
            console.log(error)
          }

        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePic: {
    width: 50,
    height: 50
  }
});

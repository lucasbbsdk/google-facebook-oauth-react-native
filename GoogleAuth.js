import React from 'react'
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export const GoogleAuth = () => {
  const [googleAccessToken, setGoogleAccessToken] = React.useState();
  const [googleUserInfo, setGoogleUserInfo] = React.useState();
  const [googleMessage, setGoogleMessage] = React.useState();


  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    expoClientId: "392564443315-oii27uebkkd253l07mncca6fatb2qhds.apps.googleusercontent.com",
  });

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


  return (
    <div>GoogleAuth</div>
  )
}

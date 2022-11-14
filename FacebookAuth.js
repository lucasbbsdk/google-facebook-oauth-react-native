import React from 'react'

export const FacebookAuth = () => {

  const [facebookAccessToken, setFacebookAccessToken] = React.useState();
  const [facebookUserInfo, setFacebookUserInfo] = React.useState();
  const [facebookMessage, setFacebookMessage] = React.useState();


  const [facebookRequest, facebookResponse, facebookPromptAsync] = Facebook.useAuthRequest({
    expoClientId: "1170426170555668",
  });

  React.useEffect(() => {
    setFacebookMessage(JSON.stringify(facebookResponse));
    if (facebookResponse?.type === "success") {
      setFacebookAccessToken(facebookResponse.authentication.accessToken);
    }
  }, [facebookResponse]);


  async function getFacebookUserData() {
    let userInfoResponse = await fetch(`https://graph.facebook.com/v15.0/me?access_token=${facebookAccessToken}
    &fields=${encodeURIComponent('id,name,picture,email')}`);

    userInfoResponse.json().then(data => {
      setFacebookUserInfo(data);
    });
  }
  return (
    <div>FacebookAuth</div>
  )
}

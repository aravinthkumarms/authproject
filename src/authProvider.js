import { MsalAuthProvider, LoginType } from 'react-aad-msal';


const config = {

    auth: {
        authority: 'https://login.microsoftonline.com/ece44b2c-fdf6-4530-8f32-0cc5e723de98',
        clientId: "4e9d4fef-fe72-4125-90d9-eb3f84e712f9",
        postLogoutRedirectUri: window.location.origin,
        redirectUri: window.location.origin,
        validateAuthority: true,
        navigateToLoginRequestUrl: true
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true
    }
}

// Authentication Parameters
export const authenticationParameters = {
    scopes: [
        'user.read'
    ]
}
export const authenticationParametersGraph = {
    scopes: [
        'openid'
    ]
}
// Options
export const options = {
    loginType: LoginType.Redirect,
    tokenRefreshUri: window.location.origin
}

export const authProvider = new MsalAuthProvider(config, authenticationParameters, options)
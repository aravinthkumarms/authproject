import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import { loginRequest, protectedResources } from "../authConfig";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { Button } from '@mui/material';
import { msalInstance } from "../index";
import axios from 'axios';
const style = {
    color: "white",
    textDecoration: "none",
    fontSize: "1.3rem",
    textTransform: "uppercase",
    letterSpacing: "1px"
}

const LoginStyle = {
    color: "white",
    textDecoration: "none",
    fontSize: "1.3rem",
    letterSpacing: "1px",
    textTransform: "uppercase",
}

export default function NavBar() {
    const { instance } = useMsal();
    const getToken = async () => {
        const account = msalInstance.getActiveAccount();

        if (!account) {
            throw Error("No active account! Verify a user has been signed in and setActiveAccount has been called.");
        }

        const response = await msalInstance.acquireTokenSilent({
            account: account,
            ...protectedResources.apiTodoList.scopes
        });

        return response.accessToken;
    }
    const account = msalInstance.getActiveAccount();
    const [userName, setUserName] = React.useState('');

    React.useEffect(() => {
        if (account) {
            setUserName(account.username);
            console.log(account.username);
        }
    }, [])


    // const accountName = instance.currentAccount.name;
    const handleLogin = () => {
        instance.loginPopup(loginRequest)
            .catch((error) => console.log(error))
    }
    const getData = async () => {
        const accessToken = await getToken();
        const response = await axios.getActiveAccount(protectedResources.apiTodoList.upload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        const data = await response.json();
        console.log(data);
    }
    return (
        <>
            <CssBaseline />
            <AppBar >
                <Toolbar sx={{ background: "#02a0c7", justifyContent: "space-between" }}>
                    <Typography variant="h6" noWrap>
                        <a href="/" style={style}>Authorized App</a>
                    </Typography>
                    <AuthenticatedTemplate>
                        <Typography variant="h6" noWrap>
                            <a href="upload" style={LoginStyle}>Upload</a>
                        </Typography>
                        <Typography variant="h6" noWrap>
                            <a href="dashboard" onClick={{ getData }} style={LoginStyle}>Uploaded Details</a>
                        </Typography>
                        <Typography variant="h6" noWrap>
                            <Button variant="outline-light" onClick={() => instance.logoutPopup({ postLogoutRedirectUri: "/", mainWindowRedirectUri: "/" })}>Logout</Button>
                        </Typography>
                        <Typography variant="h6" noWrap>
                            <p>{userName}</p>
                        </Typography>
                    </AuthenticatedTemplate>
                    <UnauthenticatedTemplate>
                        <Typography variant="h6" noWrap>
                            <Button variant="outline-light" onClick={handleLogin}>Login</Button>
                        </Typography>
                    </UnauthenticatedTemplate>
                </Toolbar>
            </AppBar>
            <Toolbar />
        </>
    );
}

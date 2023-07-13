

import NavBar from "./NavBar";


export const PageLayout = (props) => {
    const LoginStyle = {
    textDecoration: "none",
    fontSize: "1.3rem",
    fontWeight: "bold",
    letterSpacing: "1px",
    textTransform: "uppercase",
}
    /**
     * Most applications will need to conditionally render certain components based on whether a user is signed in or not. 
     * msal-react provides 2 easy ways to do this. AuthenticatedTemplate and UnauthenticatedTemplate components will 
     * only render their children if a user is authenticated or unauthenticated, respectively.
     */

    return (
        <>
            <NavBar />
            <br />
            <p style={LoginStyle}><center>Authorized App</center></p>
            <br />
            {props.children}
            <br />

        </>
    );
};
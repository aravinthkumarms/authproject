import { BrowserRouter as Router, Switch } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";

import { RouteGuard } from './components/RouteGuard';
import { PageLayout } from "./components/PageLayout";
import UploadScreen from "./components/UploadScreen";

import { appRoles } from "./authConfig";
import { UploadedDetails } from "./components/UploadedDetails";



const Pages = () => {
  return (
    <Switch>
      <RouteGuard
        exact
        path='/upload'
        roles={[appRoles.TaskUser, appRoles.TaskAdmin]}
        Component={UploadScreen}
      />
      <RouteGuard
        exact
        path='/dashboard'
        roles={[appRoles.TaskAdmin]}
        Component={UploadedDetails}
      />
    </Switch>
  )
}

/**
 * msal-react is built on the React context API and all parts of your app that require authentication must be 
 * wrapped in the MsalProvider component. You will first need to initialize an instance of PublicClientApplication 
 * then pass this to MsalProvider as a prop. All components underneath MsalProvider will have access to the 
 * PublicClientApplication instance via context as well as all hooks and components provided by msal-react. For more, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
const App = ({ instance }) => {
  return (
    <Router>
      <MsalProvider instance={instance}>
        <PageLayout>
          <Pages instance={instance} />
        </PageLayout>
      </MsalProvider>
    </Router>
  );
}

export default App;
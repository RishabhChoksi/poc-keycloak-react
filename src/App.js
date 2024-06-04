import React, { useState } from "react";
import "./App.css";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

import Keycloak from "keycloak-js";

let initOptions = {
  url: "http://localhost:8080/",
  realm: "Legodesk-Platform",
  clientId: "poc-demo-backend",
  onLoad: "login-required", // check-sso | login-required
  KeycloakResponseType: "code",

  // silentCheckSsoRedirectUri: (window.location.origin + "/silent-check-sso.html")
};

let kc = new Keycloak(initOptions);

kc.init({
  onLoad: initOptions.onLoad,
  KeycloakResponseType: "code",
  silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
  checkLoginIframe: false,
  pkceMethod: "S256",
}).then(
  (auth) => {
    if (!auth) {
      window.location.reload();
    } else {
      console.info("Authenticated");
      console.log("auth", auth);
      console.log("Keycloak", kc);
      kc.onTokenExpired = () => {
        console.log("token expired");
      };
    }
  },
  () => {
    console.error("Authenticated Failed");
  }
);

function App() {
  const [infoMessage, setInfoMessage] = useState("");

  return (
    <div className="App">
      {/* <Auth /> */}
      <div>
        <h1>My Awesome React App</h1>
        <h1>Secured with Keycloak</h1>
      </div>
      <div>
        <div>
          <Button
            onClick={() => {
              setInfoMessage(
                kc.authenticated
                  ? "Authenticated: TRUE"
                  : "Authenticated: FALSE"
              );
            }}
            label="Is Authenticated"
          />
          <Button
            onClick={() => {
              kc.login();
            }}
            label="Login"
            severity="success"
          />
          <Button
            onClick={() => {
              setInfoMessage(kc.token);
            }}
            label="Show Access Token"
            severity="info"
          />
          <Button
            onClick={() => {
              setInfoMessage(JSON.stringify(kc.tokenParsed, null, ""));
            }}
            label="Show Parsed Access token"
            severity="info"
          />
          <Button
            onClick={() => {
              setInfoMessage(kc.isTokenExpired(5).toString());
            }}
            label="Check Token expired"
            severity="warning"
          />
          <Button
            onClick={() => {
              kc.updateToken(10).then(
                (refreshed) => {
                  setInfoMessage("Token Refreshed: " + refreshed.toString());
                },
                (e) => {
                  setInfoMessage("Refresh Error");
                }
              );
            }}
            label="Update Token (if about to expire)"
          />{" "}
          {/** 10 seconds */}
          <Button
            onClick={() => {
              kc.logout({ redirectUri: "http://localhost:3000/" });
            }}
            label="Logout"
          />
        </div>
      </div>

      <div>
        <h3>Info Pane</h3>
        <div className="card">
          <Card>
            <p style={{ wordBreak: "break-all" }} id="infoPanel">
              {infoMessage}
            </p>
          </Card>{" "}
        </div>
      </div>
    </div>
  );
}

export default App;

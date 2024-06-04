import React, { useState } from "react";
import { Button } from "primereact/button";

const RoleCheck = ({ label, url, token }) => {
  const [response, setReponse] = useState("");

  const hitUrl = async () => {
    const res = await fetch(`http://localhost:8081${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
    });
    const body = await res.text();
    const status = res.status;
    setReponse(() => status + "\n" + body);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Button onClick={hitUrl} label={label} severity="info" />
      <span>{response}</span>
    </div>
  );
};

export default RoleCheck;

import { useMsal } from '@azure/msal-react'
import React, { useEffect, useState } from 'react'
import { loginRequest } from '../utils/authConfig'
import { callMsGraph } from '../utils/requests'

const navbarStyle={
    background: "transparent",
    position: "fixed",
    top: "0px",
    left: "0px",
    right: "0px",
    zIndex: "1",
    height: "40px",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center"
}

const buttonStyle={
    height: "40px",
    width: "100px",
}

const nameStyle = {
    fontSize: "19px",
    marginRight: "20px",
    fontWeight: "700",
}
const NavBar = () => {
    const {instance, accounts} = useMsal();
    const [data, setData] = useState(null);

    useEffect(() => {
        if(accounts[0]) {
            instance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0]
            }).then(resp => {
                callMsGraph(resp.accessToken).then(response => {
                    console.log(response)
                    setData(response)
                })
            })
        }
    }, [accounts])
    return (
        <div style={navbarStyle}>
            <span style={nameStyle}>{data?.displayName}</span>
            <button style={buttonStyle} onClick={() => instance.logout({
                postLogoutRedirectUri: "http://localhost:3000/"
            })}>Sign out</button>
        </div>
    )
}
export default NavBar;
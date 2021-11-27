import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { Badge, Button, Row, Spinner } from 'react-bootstrap';
import { useAppContext } from "../app-context";
import { shortenAddress } from "../util/string-util";
import { web3Connector } from "../util/web3-connector";
import { status } from "../consts";

function Connect() {
    const {activate, active, account, library, deactivate } = useWeb3React();
    const { user, setUser, setGlobalError } = useAppContext();

    const determineInitialState = () => {
        if (!window.ethereum) {
            user.state = status.NoConnection;
        } else {
            user.state = status.Ready;
        }

        setUser(user);
        return useState(user.state);
    };
    
    let [connection, setConnection] = determineInitialState();

    if (connection === status.Ready && 
        localStorage.getItem('ConnectionState') === status.Connected) {
        activate(web3Connector);
    }

    const setConnectionProxy = (value) => {
        localStorage.setItem('ConnectionState', value);
        setConnection(value);
    }

    useEffect(() => {
        if (!window.ethereum) {
            return setConnectionProxy(status.NoConnection);
        } else if (active) {
            return setConnectionProxy(status.Connected);
        } else {
            return setConnectionProxy(status.Ready);
        }
    }, [active]);

    const onConnectClick = async () => {
        if (!window.ethereum) {
            setConnectionProxy(status.NoConnection);
        } else {
            setConnectionProxy(status.Connecting);
            await activate(web3Connector, (error) => {
                if (error instanceof UnsupportedChainIdError) {
                    const globalError = {
                        context: 'Metamask connection',
                        error: 'You are trying to connect to unsupported network. Please, use Rinkeby network to connect!',
                        isActive: true
                    };
                    setGlobalError(globalError);
                }
                setConnectionProxy(status.Ready);
            });
        }
    };

    const rowStyle = {
        background: '#CDCDCD'
    };

    if (connection == status.Ready) {
        return (
            <Button onClick={() => onConnectClick()}>Connect Metamask</Button>
        );
    } else if (connection == status.NoConnection) {
        return (
            <span>Setup Metamask to connect</span>
        );
    } else if (connection == status.Connecting) {
        return <Spinner animation="grow" />;
    } else {
        return (
            <div className="d-flex justify-content-end" style={rowStyle}>
                <div className="justify-content-end">
                    <div>Account</div>
                    <div className="text-end">Balance</div>
                </div>
                <div className="mx-2"><Badge bg="success">{shortenAddress(account)}</Badge></div>
                <div><a href="#" className="link-primary" onClick={() => deactivate()}>Disconnect</a></div>
            </div>
        );
    }
    
};

export default Connect;
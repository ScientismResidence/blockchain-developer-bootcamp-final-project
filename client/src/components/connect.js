import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import React, { useEffect } from "react";
import { Badge, Button, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { formatEther } from "@ethersproject/units";
import { useAppContext } from "../app-context";
import { shortenAddress } from "../util/string-util";
import { web3Connector } from "../util/web3-connector";
import { status } from "../consts";

function Connect() {
    const {activate, active, account, library, deactivate } = useWeb3React();
    const { user, setUser, setGlobalError } = useAppContext();
    const navigate = useNavigate();

    if (user.state === status.NoConnection && 
        localStorage.getItem('ConnectionState') === status.Connected) {
        activate(web3Connector);
    }

    const setConnectionProxy = (value) => {
        localStorage.setItem('ConnectionState', value);
        user.state = value;
        setUser(user);
    }

    useEffect(async () => {
        if (!window.ethereum) {
            return setConnectionProxy(status.NoConnection);
        } else if (active) {
            const balance = await library.getBalance(account);
            user.balance = parseFloat(formatEther(balance)).toPrecision(4);
            return setConnectionProxy(status.Connected);
        } else {
            return setConnectionProxy(status.Ready);
        }
    }, [active, account]);

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

    const onLogout = () => {
        deactivate();
        navigate('/');
    }

    if (user.state == status.Ready) {
        return (
            <Button onClick={() => onConnectClick()}>Connect Metamask</Button>
        );
    } else if (user.state == status.NoConnection) {
        return (
            <span>Setup Metamask to connect</span>
        );
    } else if (user.state == status.Connecting) {
        return <Spinner animation="grow" />;
    } else {
        return (
            <div className="d-flex justify-content-end">
                <div className="justify-content-end">
                    <div>Account</div>
                    <div className="text-end">Balance</div>
                </div>
                <div className="mx-2">
                    <div><Badge bg="success">{shortenAddress(account)}</Badge></div>
                    <div><Badge bg="success">{user.balance}</Badge></div>
                </div>
                <div><a href="#" className="link-primary" onClick={onLogout}>Disconnect</a></div>
            </div>
        );
    }
    
};

export default Connect;
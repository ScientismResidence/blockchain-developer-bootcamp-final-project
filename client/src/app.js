import 'bootstrap/dist/css/bootstrap.min.css';

import React from "react";
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';

import { Container } from 'react-bootstrap';

import Header from './components/header';
import { AppContextProvider } from './app-context';
import GlobalError from './components/global-error';

function App() {
    if (window.ethereum) {
        window.ethereum.on('networkChanged', () => window.location.reload());
    }

    function getLibrary(provider) {
        return new ethers.providers.Web3Provider(provider);
    }

    return (
    <AppContextProvider>
        <Web3ReactProvider getLibrary={getLibrary}>    
            <Container>
                <Header/>
                <hr/>
                <GlobalError/>
            </Container>
        </Web3ReactProvider>
    </AppContextProvider>
    )
}

export default App
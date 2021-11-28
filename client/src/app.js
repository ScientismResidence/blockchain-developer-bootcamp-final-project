import 'bootstrap/dist/css/bootstrap.min.css';

import React from "react";
import { Web3ReactProvider } from '@web3-react/core';
import { Route, Routes } from 'react-router-dom';
import { ethers } from 'ethers';

import { Container } from 'react-bootstrap';

import Header from './components/header';
import { AppContextProvider } from './app-context';
import GlobalError from './components/global-error';
import HomePage from './pages/home';
import CreateGroup from './components/create-group';
import GroupContent from './components/group-content';
import CreateDraft from './components/create-draft';

function App() {
    console.log('Contract address is', process.env.CENSORSHIELD_CONTRACT_ADDRESS);

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
                <Routes>
                    <Route path="/" element={<HomePage/>}>
                        <Route path="create-group" element={<CreateGroup/>} />
                        <Route path="create-draft/:groupId" element={<CreateDraft/>}/>
                        <Route path="group-content/:groupId" element={<GroupContent/>} />
                    </Route>
                    <Route path="*" element={<HomePage/>}/>
                </Routes>
            </Container>
        </Web3ReactProvider>
    </AppContextProvider>
    )
}

export default App;
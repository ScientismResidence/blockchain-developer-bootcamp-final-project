import 'bootstrap/dist/css/bootstrap.min.css';

import React from "react";
import { Web3ReactProvider } from '@web3-react/core';

import { Button, Container, Col, Row } from 'react-bootstrap';

function App() {
    function getLibrary(provider) {
        return new ethers.providers.Web3Provider(provider);
    }

    return (
    <Web3ReactProvider getLibrary={getLibrary}>    
        <Container>
            <Row>
                <Col>
                    1 of 2
                </Col>
                <Col>
                    <Button className="float-end">Connect Metamask</Button>
                </Col>
            </Row>
            
        </Container>
    </Web3ReactProvider>
    )
}

export default App
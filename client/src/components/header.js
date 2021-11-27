import React from "react";
import { Button, Row, Navbar, NavbarBrand } from 'react-bootstrap';
import Connect from "./connect";

function Header() {
    function getLibrary(provider) {
        return new ethers.providers.Web3Provider(provider);
    }

    return (
            <Row>
                <Navbar className="justify-content-between">
                    <NavbarBrand href="#home">Censorshield</NavbarBrand>
                    <Connect/>
                </Navbar>
            </Row>
    )
}

export default Header;
import React from "react";
import { Button, Row, Navbar, NavbarBrand } from 'react-bootstrap';
import Connect from "./connect";

function Header() {
    const navbarStyle = {
        minHeight: '64px'
    }

    return (
        <Row className="mt-3">
            <Navbar className="justify-content-between" style={navbarStyle}>
                <NavbarBrand href="#home">Censorshield</NavbarBrand>
                <Connect/>
            </Navbar>
        </Row>
    )
}

export default Header;
import React from "react";
import { Link } from 'react-router-dom';
import { Button, Row, Navbar, NavbarBrand } from 'react-bootstrap';
import Connect from "./connect";

function Header() {
    const navbarStyle = {
        minHeight: '64px'
    }

    return (
        <Row className="mt-3">
            <Navbar className="justify-content-between" style={navbarStyle}>
                <NavbarBrand as={Link} to="/">Censorshield</NavbarBrand>
                <Connect/>
            </Navbar>
        </Row>
    )
}

export default Header;
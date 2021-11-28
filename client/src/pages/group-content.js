import React from "react";
import { Col, Row } from "react-bootstrap";
import { useAppContext } from "../app-context";
import Groups from "../components/groups";
import { status } from "../consts";

function ContentPage() {
    const { user } = useAppContext();

    if (user.state !== status.Connected) {
        return (
            <Row className="text-center">
                <span>Connect your Rinkeby account to continue...</span>
            </Row>
        );
    }

    return (
        <Row>
            <Col><Groups/></Col>
            <Col xs={9}>
                Content
            </Col>
        </Row>
    );
};

export default ContentPage;
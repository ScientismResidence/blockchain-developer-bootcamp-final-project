import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useAppContext } from "../app-context";
import CreateGroup from "../components/create-group";
import Groups from "../components/groups";
import { status } from "../consts";

function CreateGroupPage() {
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
                <CreateGroup/>
            </Col>
        </Row>
    );
};

export default CreateGroupPage;
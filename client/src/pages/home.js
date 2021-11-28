import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useAppContext } from "../app-context";
import Groups from "../components/groups";
import { status } from "../consts";

function HomePage() {
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
            <Col xs={9}>asdjfaksdj adskj faksdj faksjd fjasd fasdlkjf alsdkjf akjfasld jflaskdj khagd kfhasdk dhfgas
                djfaksdj adskj faksdj faksjd fjasd fasdlkjf alsdkjf akjfasld jflaskdj khagd kfhasdk dhfg
            </Col>
        </Row>
    );
};

export default HomePage;
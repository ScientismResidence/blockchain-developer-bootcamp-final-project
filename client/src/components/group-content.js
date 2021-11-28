import React, { useEffect, useState } from "react";
import { Accordion, Badge, ListGroup, Spinner } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../app-context";
import moment from "moment";
import { useCensorshieldContract } from "../hooks/useCensorShieldContract";
import { text } from "./create-draft";

const GroupContent = () => {
    const params = useParams();
    const { currentGroup } = useAppContext();
    const contract = useCensorshieldContract();
    const [content, setContent] = useState([]);


    const ContentList = () => {
        return (
            <Accordion defaultActiveKey={content[0].id} className="mt-4">
                {
                    content.map((value) => {
                        const status = value.isAccepted ? 'Published' : 'Draft';
                        return (
                            <Accordion.Item eventKey={value.id} key={value.id}>
                                <Accordion.Header>
                                    <div className="d-flex">
                                        <div>{value.name}</div>
                                        <div className="mx-3"><Badge bg="danger">{status}</Badge></div>
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div>
                                        <small>Hash: {value.hash}</small>
                                    </div>
                                    <div className="d-flex">
                                        <div><small>Created: {moment(new Date(value.creationDate)).format('YYYY-MM-DD')}</small></div>
                                        <div className="mx-2"><small>Creator: {value.author}</small></div>
                                    </div>
                                    <div className="mt-4">{text}</div>
                                </Accordion.Body>
                            </Accordion.Item>
                        );
                    })
                }
            </Accordion>
        );
    };

    useEffect(async () => {
        if (!currentGroup) {
            return;
        }
        
        try {
            const contentIds = await Promise.all(Array.from(Array(currentGroup.size).reverse()).map((_, i) => contract.getGroupContentId(currentGroup.id, i)));
            let content = await Promise.all(contentIds.map(async (id) => { 
                const result = await contract.itemsMap(id.toNumber());
                return {
                    id: result[0].toNumber(),
                    hash: result[1],
                    name: result[2],
                    creationDate: result[3].toNumber(),
                    groupId: result[4].toNumber(),
                    author: result[5],
                    isAccepted: result[6]
                };
            }));
            setContent(content);
        } catch (error) {
            console.log("Error happened during group content fetching", error);
        }
    }, [currentGroup]);
    
    if (!currentGroup) {
        return (
            <Spinner animation="grow" />
        );
    }

    return (
        <>
            <h4>Drafts</h4>
            <ListGroup as="ol">
                <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                >
                    <div className="ms-2 me-auto">
                    <div className="fw-bold">{currentGroup.name}</div>
                        <div className="d-flex">
                            <div className="mx-1"><small>Created: {moment(new Date(currentGroup.creationDate)).format('YYYY-MM-DD')}</small></div>
                            <div className="mx-1"><small>Members: {currentGroup.memberCounter}</small></div>
                            <div className="mx-1"><small>Creator: {currentGroup.creator}</small></div>
                        </div>
                    </div>
                    <Badge variant="primary" pill>
                        {currentGroup.size}
                    </Badge>
                </ListGroup.Item>
            </ListGroup>
            {content.length == 0 && <div className="mt-3">It looks like this group is still empty. Do you want to add something?</div>}
            {content.length > 0 && <ContentList/>}
            <div className="mt-3">
                <Link to={`/create-draft/${params.groupId}`}>Create draft</Link>
            </div>
        </>
    );
}

export default GroupContent;
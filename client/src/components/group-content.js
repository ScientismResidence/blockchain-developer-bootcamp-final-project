import React, { useEffect, useState } from "react";
import { Accordion, Badge, ListGroup, Spinner } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../app-context";
import moment from "moment";
import { useCensorshieldContract } from "../hooks/useCensorShieldContract";
import { text } from "./create-draft";

const GroupContent = () => {
    const params = useParams();
    const contract = useCensorshieldContract();
    const [state, setState] = useState({});
    //const [group, setGroup] = useState({});

    const ContentList = () => {
        return (
            <Accordion defaultActiveKey={state.content[0].id} className="mt-4">
                {
                    state.content.map((value) => {
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
                                        <div><small>Created: {moment(new Date(value.creationDate * 1000)).format('YYYY-MM-DD')}</small></div>
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
        try {
            let group = await contract.getGroup(params.groupId);
            group = {
                id: params.groupId,
                size: group[0].toNumber(),
                name: group[1],
                creator: group[2],
                creationDate: group[3].toNumber(),
                minimalVotes: group[4],
                minimalPercentsToAccept: group[5],
                memberCounter: group[6].toNumber()
            };
            
            const contentIds = await Promise.all(Array.from(Array(group.size).reverse()).map((_, i) => contract.getGroupContentId(group.id, i)));
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
            setState({
                group: group,
                content: content
            });
        } catch (error) {
            console.log("Error happened during group content fetching", error);
        }
    }, [params.groupId]);
    
    if (!state.group) {
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
                    <div className="fw-bold">{state.group.name}</div>
                        <div className="d-flex">
                            <div className="mx-1"><small>Created: {moment(new Date(state.group.creationDate * 1000)).format('YYYY-MM-DD')}</small></div>
                            <div className="mx-1"><small>Members: {state.group.memberCounter}</small></div>
                            <div className="mx-1"><small>Creator: {state.group.creator}</small></div>
                        </div>
                    </div>
                    <Badge variant="primary" pill>
                        {state.group.size}
                    </Badge>
                </ListGroup.Item>
            </ListGroup>
            {state.content.length == 0 && <div className="mt-3">It looks like this group is still empty. Do you want to add something?</div>}
            {state.content.length > 0 && <ContentList/>}
            <div className="mt-3">
                <Link to={`/create-draft/${params.groupId}`}>Create draft</Link>
            </div>
        </>
    );
}

export default GroupContent;
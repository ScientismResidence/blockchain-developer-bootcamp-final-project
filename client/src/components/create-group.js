import { useWeb3React } from "@web3-react/core";
import React, { useState } from "react";
import { Form, Button, InputGroup, Spinner } from "react-bootstrap";
import { useCensorshieldContract } from "../hooks/useCensorShieldContract";
import { parseUnits } from '@ethersproject/units';
import { useAppContext } from "../app-context";
import { events } from "../consts";
import { useNavigate } from "react-router-dom";

function CreateGroup() {
    const [isValidated, setIsValidated] = useState(false);
    const [name, setName] = useState('');
    const [minimalVotes, setMinimalVotes] = useState(1);
    const [minimalPercentsToAccept, setMinimalPercentsToAccept] = useState(50);
    const [loading, setLoading] = useState(false);
    const contract = useCensorshieldContract();
    const { account } = useWeb3React();
    const { setEvent, setGlobalError } = useAppContext();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        
        event.preventDefault();
        event.stopPropagation();

        setIsValidated(true);

        if (form.checkValidity() === true) {
            setLoading(true);
            try {
                console.log("Transaction is starting");
                const transaction = await contract.addGroup(name, minimalVotes, minimalPercentsToAccept, {
                    from: account,
                    value: parseUnits("0.1", "ether")
                })
                await transaction.wait(1);
                
                setEvent(events.OnGroupAdded);

                // Get the group id
                let groupsCount = await contract.memberGroupsCounterMap(account);
                let groupId = await contract.memberGroupsMap(account, groupsCount.toNumber() - 1);
                navigate(`/group-content/${groupId.toNumber()}`);
            } catch (error) {
                setGlobalError({
                    context: "Transaction Failed",
                    error: error.message,
                    isActive: true
                });
            }
        }

        setLoading(false);
    };
    
    return (
        <>
            <h4>Create Group</h4>
            <Form noValidate validated={isValidated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Group name</Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control 
                            onChange={(event) => setName(event.target.value)} 
                            type="text" maxLength="32" placeholder="name" 
                            pattern="^([a-z0-9]{1,}|[\s]{1}[a-z0-9]{1,})*" required/>
                        <Form.Control.Feedback type="invalid">
                            Please, match the value with required format.
                        </Form.Control.Feedback>
                    </InputGroup>
                    <Form.Text className="text-muted">
                        Name of your group. Maximum 32 latin characters in lower case. Maximum one space in a row.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="minimalVotes">
                    <Form.Label>Minimal votes</Form.Label>
                    <Form.Control 
                        onChange={(event) => setMinimalVotes(event.target.value)}
                        type="number" min="1" defaultValue="1" required/>
                    <Form.Text className="text-muted">
                        Minimal votes required to move draft to accept content. See description below for details.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="minimalPercentsToAccept">
                    <Form.Label>Minimal percents of members</Form.Label>
                    <Form.Control 
                        onChange={(event) => setMinimalPercentsToAccept(event.target.value)}
                        type="number" min="0" max="100" defaultValue="50" required />
                    <Form.Text className="text-muted">
                        Minimal percents of members to move draft to accept content. See description below for details
                    </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="description1">
                    <Form.Text className="text-muted">
                        Example: group has 100 members. Minimal votes is set to 1000. No matter what minimal percents of members is set, accepting will require all (100) of the members.
                    </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="description1">
                    <Form.Text className="text-muted">
                        Example: group has 100 members. Minimal votes is set to 10. Minimal percents of members is set to 50%, accepting will require 50 members before it lefts the draft.
                    </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="description2">
                    <Form.Text className="text-muted">
                        Transaction will require 0.1 ether to perform
                    </Form.Text>
                </Form.Group>

                {loading && <Spinner animation="grow" />}
                {!loading && <Button variant="primary" type="submit">Create</Button>}
            </Form>
        </>
    );
};

export default CreateGroup;
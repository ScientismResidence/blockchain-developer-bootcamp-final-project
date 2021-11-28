import { useWeb3React } from "@web3-react/core";
import React, { useState } from "react"
import { Form, Button, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import { parseUnits } from '@ethersproject/units';
import { useCensorshieldContract } from "../hooks/useCensorShieldContract";
import { useAppContext } from "../app-context";

export const text = "Off-chain content! Work in progress... Existence of content is presented by Proof Of Existence with content hash stored in contract";

const CreateDraft = () => {
    const params = useParams();
    const contract = useCensorshieldContract();
    const { account } = useWeb3React();
    const { setGlobalError } = useAppContext();
    const navigate = useNavigate();

    const [isValidated, setIsValidated] = useState(false);
    const [name, setName] = useState('');
    const [content, setContent] = useState(text);
    const [hash, setHash] = useState("0xf84d2795c6c8adb43c98ec8cd0919cb5288c82d2a7f13afed7ab18242b6898dc");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        setIsValidated(true);

        if (form.checkValidity() === true) {
            setLoading(true);
            try {
                const transaction = await contract.addItem(params.groupId, name, hash, {
                    from: account,
                    value: parseUnits("0.1", "ether")
                });
                await transaction.wait(1);
                setLoading(false);
                navigate(`/group-content/${params.groupId}`);
            } catch (error) {
                setLoading(false);
                setGlobalError({
                    context: "Transaction Failed",
                    error: error.message,
                    isActive: true
                });
            }
        }
    };

    return (
        <>
            <h4>Add Draft</h4>
            <Form noValidate validated={isValidated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Content name</Form.Label>
                    <Form.Control 
                            onChange={(event) => setName(event.target.value)} 
                            type="text" maxLength="128" placeholder="Content name" 
                            required/>
                    <Form.Text className="text-muted">
                        Name of your content.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="content">
                    <Form.Label>Content</Form.Label>
                    <Form.Control as="textarea" rows={3} disabled value={content}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="hash">
                    <Form.Label>Content hash</Form.Label>
                    <Form.Control type="text" disabled value={hash}/>
                </Form.Group>
                {loading && <Spinner animation="grow" />}
                {!loading && <Button variant="primary" type="submit">Add</Button>}                
            </Form>
        </>
    );
};

export default CreateDraft;
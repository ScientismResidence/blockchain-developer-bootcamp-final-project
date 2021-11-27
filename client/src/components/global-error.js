import React, { useEffect, useState } from "react";
import { Modal, Button } from 'react-bootstrap';
import { useAppContext } from "../app-context";

function GlobalError() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { globalError, setGlobalError } = useAppContext();

    useEffect(() => {
        if (globalError.isActive) {
            handleShow();
        }
    }, [globalError]);

    return (
        <Modal
            show={show}
            onHide={handleClose}
        >
            <Modal.Header>
                <Modal.Title>{globalError.context}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {globalError.error}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    Ok
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default GlobalError;
import React from "react";
import { Link } from "react-router-dom";

function Groups() {
    return (
        <>
            <div>
                <p>You don't have any group. Get invite from others or create your own group!</p>
            </div>
            <div>
                <Link to={{ pathname: '/create-group'}}>Create group</Link>
            </div>
        </>
    );
};

export default Groups;
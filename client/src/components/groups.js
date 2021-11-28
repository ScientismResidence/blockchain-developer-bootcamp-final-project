import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../app-context";
import { useCensorshieldContract } from "../hooks/useCensorShieldContract";

const Groups = () => {
    const { account } = useWeb3React();
    const { setCurrentGroup } = useAppContext();
    const contract = useCensorshieldContract();
    const [groups, setGroups] = useState([]);
    const params = useParams();

    const ConnectionInfo = () => {
        return (
            <div>
                <p>You don't have any group. Get invite from others or create your own group!</p>
            </div>
        );
    }

    const GroupsList = () => {
        return (
            <ListGroup as="ul">
                {groups.map((value) => {
                    let isActive = value.id == params.groupId;
                    return (
                        <ListGroup.Item as="li" key={value.id} variant="info" active={isActive}>
                            <Link
                                onClick={() => setCurrentGroup(value)}
                                className="link-dark"
                                to={`/group-content/${value.id}`}>
                                    {value.name}
                            </Link>
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>
        );
    }

    const sleep = t => new Promise(s => setTimeout(s, t));

    useEffect(async () => {
        try {
            let groupsCount = await contract.memberGroupsCounterMap(account);
            let memberGroups = [];
            if (groupsCount.toNumber() > 0) {
                //await sleep(1000);
                const groupIds = await Promise.all(Array.from(Array(groupsCount.toNumber())).map((_, i) => contract.memberGroupsMap(account, i)));
                memberGroups = await Promise.all(groupIds.map(async (id) => { 
                    const result = await contract.getGroup(id.toNumber());
                    return {
                        id: id.toNumber(),
                        size: result[0].toNumber(),
                        name: result[1],
                        creator: result[2],
                        creationDate: result[3].toNumber(),
                        minimalVotes: result[4],
                        minimalPercentsToAccept: result[5],
                        memberCounter: result[6].toNumber()
                    };
                }));
            }
            setGroups(memberGroups);

            if (params.groupId && memberGroups.length > 0) {
                let result = memberGroups.find(value => {
                    return value.id == params.groupId;
                });
                setCurrentGroup(result);
            }
        } catch (error) {
            console.log("Error happened during groups fetching", error);
        }
    }, [account]);

    return (
        <>
            <div>
                <h4>Groups</h4>
            </div>
            {groups.length == 0 && <ConnectionInfo/>}
            {groups.length > 0 && <GroupsList/>}
            <div className="mt-3">
                <Link to={{ pathname: '/create-group'}}>Create group</Link>
            </div>
        </>
    );
};

export default Groups;
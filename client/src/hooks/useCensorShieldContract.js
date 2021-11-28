import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";

import Abi from "../contracts/Censorshield.json";

export function useCensorshieldContract() {
    const { library, account } = useWeb3React();
    const signerOrProvider = account ? library.getSigner(account).connectUnchecked() : library;
    const contractAddress = process.env.CENSORSHIELD_CONTRACT_ADDRESS;

    return useMemo(() => {
        return new Contract(contractAddress, Abi.abi, signerOrProvider);
    }, [signerOrProvider]);
}
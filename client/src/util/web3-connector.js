import { InjectedConnector } from '@web3-react/injected-connector';

export const web3Connector = new InjectedConnector({ 
    supportedChainIds: [
        // Rinkeby
        4, 
        // Ganache
        1337
    ] 
});
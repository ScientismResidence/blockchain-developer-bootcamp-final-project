# blockchain-developer-bootcamp-final-project

I've changed the initial idea slitly to make the project more abstract. Please see the README-v1.0.md to see the difference.

# Abstract

Decentralized protocol for publishing of content with Proof of Existence concept.
Platform allows you to create a group that will determine the scope of the content. This group by default will contain draft content that required to be voted by group members to be published. Voting rules are determined by the group creator, how many members should vote for a content is stored in immutable group settings. Group members are able to invite others to become new group members. Only group members are able to add new content for that group.

# Motivation

You cannot rely on centralized content storages by having next obstacles:
* Centralized administrator can block/restrict access/availability of the content.
* Content platform has own rules to publish content and you unable control what the content in prefered area should be

# Scpecification

## Actions

### 1. *Add new group*

You need specify unique name for a group. After adding you will be sole member such a group and you will be able to invite others. Group has rules for voting process, exactly how many members required to public draft content.
1. Minimal votes settings. Allows set exact number of members required for publish content. But maximal votes count is restricted by current group members.
2. Minimal percents of members required to publish content. To define the threshold contract will consider maximal applyable value.
In current flow the first member of group is able to misuse the content publishing, awhile there are no other members.

### 2. "Add new draft"

Member of the group is able to add new draft. For each draft the name, content (any digital asset) and hash of content should be presented. Content itself is off-chain information, contract stores only hash of the content implementing Proof of Existence concept.

### 3. *Voting*

Member of the group is able to vote for a draft content. When group threshold is reached the content changes its status to published.
(not implementet currently)

### 4. *Invitation*

Member of the group is able to invite others to become a new group members.
(not implementet currently)

## Setup

### Contracts

- `npm i`
- Run Ganache on port `7545`
- `truffle migrate --network development`
- `truffle test`
- `.env` variables to deploy for public testnetwork
  - MNEMONIC
  - INFURA_PROJECT_ID

To run local ui application you need at least run `truffle compile`

### Client

- Create `.env` file in `client` directory
- Add to `.env` file `CENSORSHIELD_CONTRACT_ADDRESS` variable. Set the deployed `Censorshield` address as a value
- `npm i`
- `npm start`

- You will be able to populate the contract directly from application
- Application support `4` (Rinkeby) and `1337` (Ganache) networks to connect

## Bootcamp

### Deployed application

https://censorshield.vercel.app/

### Screencast

https://youtu.be/3h48xc0243o

### Public Ethereum wallet for certification

`0xEFA9eC92dB91a1aEC5802a3E83924101CE060e08`
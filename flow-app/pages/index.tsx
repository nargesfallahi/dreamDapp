import Head from 'next/head'
import "../flow/config";
import * as cadence from "./cadence/cadence";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import Button from 'react-bootstrap/Button';


export default function Home() {

    const [user, setUser] = useState({loggedIn: null})
    const [name, setName] = useState('') // NEW
    const [nfts, setNFTs] = useState([]) // NEW
    const [selectedNFTs, setSelectedNFTs] = useState([])

    useEffect(() => fcl.currentUser.subscribe(setUser), [])

    // NEW
    const sendQuery = async () => {
        const profile = await fcl.query({
            cadence: `
        import Profile from 0xProfile

        pub fun main(address: Address): Profile.ReadOnly? {
          return Profile.read(address)
        }
      `,
            args: (arg, t) => [arg(user.addr, t.Address)]
        })

        setName(profile?.name ?? 'No Profile')
    }

    const initAccount = async () => {
        const transactionId = await fcl.mutate({
            cadence: cadence.cadenceTransactionInitAccount,
            payer: fcl.authz,
            proposer: fcl.authz,
            authorizations: [fcl.authz],
            limit: 999
        })

        const transaction = await fcl.tx(transactionId).onceSealed()
        console.log(transaction)
    }


    const mintNFT = async () => {
        const transactionId = await fcl.mutate({
            cadence: cadence.cadenceTransactionMintNFT,
            args: (arg, t) => [arg(user.addr, t.Address),
                arg("random name", t.String),
                arg("random description", t.String),
                arg("https://assets.nbatopshot.com/editions/5_video_game_numbers_rare/054d38ac-10fb-492c-a47f-54fd1479b247/play_054d38ac-10fb-492c-a47f-54fd1479b247_5_video_game_numbers_rare_capture_Animated_1080_1920_Black.mp4", t.String)],
            payer: fcl.authz,
            proposer: fcl.authz,
            authorizations: [fcl.authz],
            limit: 999
        })

        const transaction = await fcl.tx(transactionId).onceSealed()
        console.log(transaction)

        const nfts = await fcl.query({
            cadence: cadence.cadenceScriptRetrieveNFTs,
            args: (arg, t) => [arg(user.addr, t.Address)]
        })

        setNFTs(nfts ?? 'No NFTs')
    }

    // min super NFTs
    const mintSuperNFT = async () => {
        const transactionId = await fcl.mutate({
            cadence: cadence.cadenceTransactionMintSuperNFT,
            args: (arg, t) => [arg(selectedNFTs, t.Array(t.UInt64))],
            payer: fcl.authz,
            proposer: fcl.authz,
            authorizations: [fcl.authz],
            limit: 999
        })

        const transaction = await fcl.tx(transactionId).onceSealed()
        console.log(transaction)

        const nfts = await fcl.query({
            cadence: cadence.cadenceScriptRetrieveNFTs,
            args: (arg, t) => [arg(user.addr, t.Address)]
        })

        setNFTs(nfts ?? 'No NFTs')
    }

    const retrieveNFTs = async () => {
        const nfts = await fcl.query({
            cadence: cadence.cadenceScriptRetrieveNFTs,
            args: (arg, t) => [arg(user.addr, t.Address)]
        })

        setNFTs(nfts ?? 'No NFTs')
    }

    const handleSelectedNFTChange = async (e) => {
        const { value, checked } = e.target

        if (checked) {
            setSelectedNFTs((prevState) => ([...prevState, value]))
        } else {
            setSelectedNFTs((prevState) => prevState.filter(n => n !== value))
        }
    }

    // Mint Super NFT -> pop up with thumbnail of existing ones (retrieveNFT) radio button we select -> submit -> mints it

    const AuthedState = () => {
        return (
            <div>
                <Button onClick={initAccount}>Init Account</Button> {/* NEW */}
                <Button onClick={mintNFT}>Mint NFT</Button> {/* NEW */}
                <Button onClick={sendQuery}>Send Query</Button> {/* NEW */}
                <Button onClick={retrieveNFTs}>Get NFTs</Button> {/* NEW */}
                <Button onClick={mintSuperNFT}>Mint SUPER NFT</Button>
                <Button onClick={fcl.unauthenticate}>Log Out</Button>
                <div>Address: {user?.addr ?? "No Address"}</div>
                <div>Profile Name: {name ?? "--"}</div> {/* NEW */}
                <div>Profile NFTs: {nfts.map(nft => (
                    <div key={nft.id}>
                        <h2>NFT Name: {nft.name}</h2>
                        <h2>NFT Description: {nft.description}</h2>
                        <h2>NFT ID: {nft.id}</h2>
                        <input type="checkbox" id={nft.id} value={nft.id} name="nftID" onChange={handleSelectedNFTChange} checked={selectedNFTs.includes(nft.id)} /> Select NFT
                        <img width="100" src={nft.thumbnail} alt="nft image"></img>
                        {nft.metadata["type"] == "SuperNFT" ?
                            <h2>Child NFTs: {nft.metadata["childNFTs"].map(nftID => nfts.filter(nft => nft.id == nftID).map(nft => <h3>Child thumbnail: <img width="100" src={nft.thumbnail} alt="nft image"></img></h3>))}</h2>
                            : <h2>None</h2>}
                    </div>
                    ))}{/* NEW */}
                </div>
            </div>
        )
    }

    const UnauthenticatedState = () => {
        return (
            <div>
                <button onClick={fcl.logIn}>Log In</button>
                <button onClick={fcl.signUp}>Sign Up</button>
            </div>
        )
    }

    return (
        <div>
            <Head>
                <title>FCL Quickstart with NextJS</title>
                <meta name="description" content="My first web3 app on Flow!" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <h1>Flow App</h1>
            {user.loggedIn
                ? <AuthedState />
                : <UnauthenticatedState />
            }
        </div>
    );
}
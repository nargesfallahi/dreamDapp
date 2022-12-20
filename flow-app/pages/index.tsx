import Head from 'next/head'
import "../flow/config";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";

export default function Home() {

    const [user, setUser] = useState({loggedIn: null})
    const [name, setName] = useState('') // NEW

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
            cadence: `
      import NonFungibleToken from 0x631e88ae7f1d7c20
import SuperNFT from 0xac126e1c854653c0
import MetadataViews from 0x631e88ae7f1d7c20

// This transaction is what an account would run
// to set itself up to receive NFTs
transaction {

    prepare(signer: AuthAccount) {
        // Return early if the account already has a collection
        if signer.borrow<&SuperNFT.Collection>(from: SuperNFT.CollectionStoragePath) != nil {
            return
        }

        // Create a new empty collection
        let collection <- SuperNFT.createEmptyCollection()

        // save it to the account
        signer.save(<-collection, to: SuperNFT.CollectionStoragePath)

        // create a public capability for the collection
        signer.link<&{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection, SuperNFT.SuperNFTCollectionPublic}>(
            SuperNFT.CollectionPublicPath,
            target: SuperNFT.CollectionStoragePath
        )
    }

    execute {
      log("Setup account")
    }
}
    `,
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
            cadence: `
      import NonFungibleToken from 0x631e88ae7f1d7c20
import SuperNFT from 0xac126e1c854653c0
import MetadataViews from 0x631e88ae7f1d7c20

// This script uses the NFTMinter resource to mint a new NFT
// It must be run with the account that has the minter resource
// stored in /storage/NFTMinter

transaction() {

    // local variable for storing the minter reference
    let minter: &SuperNFT.NFTMinter

    prepare(signer: AuthAccount) {
        // borrow a reference to the NFTMinter resource in storage
        self.minter = signer.borrow<&SuperNFT.NFTMinter>(from: SuperNFT.MinterStoragePath)
            ?? panic("Could not borrow a reference to the NFT minter")
    }

    execute {
        // Borrow the recipient's public NFT collection reference
        let receiver = getAccount(0xc624b7094e622a83)
            .getCapability(SuperNFT.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")




        // Mint the NFT and deposit it to the recipient's collection
        self.minter.mintNFT(
            recipient: receiver,
            name: "NFT1",
            description: "First NFT",
            thumbnail: "https://images.unsplash.com/photo-1615789591457-74a63395c990?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
            royalties: []
        )



        log("Minted an NFT")
    }
}
    `,
            payer: fcl.authz,
            proposer: fcl.authz,
            authorizations: [fcl.authz],
            limit: 999
        })

        const transaction = await fcl.tx(transactionId).onceSealed()
        console.log(transaction)
    }


    const AuthedState = () => {
        return (
            <div>
                <div>Address: {user?.addr ?? "No Address"}</div>
                <div>Profile Name: {name ?? "--"}</div> {/* NEW */}
                <button onClick={sendQuery}>Send Query</button> {/* NEW */}
                <button onClick={initAccount}>Init Account</button> {/* NEW */}
                <button onClick={mintNFT}>Mint NFT</button> {/* NEW */}
                <button onClick={fcl.unauthenticate}>Log Out</button>
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
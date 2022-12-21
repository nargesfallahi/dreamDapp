import NonFungibleToken from 0x631e88ae7f1d7c20
import SuperNFT from 0xac126e1c854653c0
import MetadataViews from 0x631e88ae7f1d7c20

// This script uses the NFTMinter resource to mint a new NFT
// It must be run with the account that has the minter resource
// stored in /storage/NFTMinter

transaction(nftIDs: [UInt64], name: String, description: String, thumbnail: String) {

    // local variable for storing the minter reference
    let minter: &SuperNFT.NFTMinter

    prepare(signer: AuthAccount) {
        // borrow a reference to the NFTMinter resource in storage
        self.minter = signer.borrow<&SuperNFT.NFTMinter>(from: SuperNFT.MinterStoragePath)
            ?? panic("Could not borrow a reference to the NFT minter")
    }

    execute {
        // Borrow the recipient's public NFT collection reference
        let receiver = getAccount(0x01cf0e2f2f715450)
            .getCapability(SuperNFT.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")




        // Mint the NFT and deposit it to the recipient's collection
        self.minter.mintSuperNFT(
            recipient: receiver,
            name: name,
            description: description,
            thumbnail: thumbnail,
            nftIDs: nftIDs,
            royalties: []
        )



        log("Minted an NFT")
    }
}

// create a wallet


// create NFT


// deposit NFT to user's wallet
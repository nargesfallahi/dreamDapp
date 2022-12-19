import NonFungibleToken from 0xf8d6e0586b0a20c7
import ExampleNFT from 0xf8d6e0586b0a20c7

// This script uses the NFTMinter resource to mint a new NFT
// It must be run with the account that has the minter resource
// stored in /storage/NFTMinter

transaction{

    // local variable for storing the minter reference
    let minter: &ExampleNFT.NFTMinter

    prepare(signer: AuthAccount) {
        // borrow a reference to the NFTMinter resource in storage
        self.minter = signer.borrow<&ExampleNFT.NFTMinter>(from: ExampleNFT.MinterStoragePath)
            ?? panic("Could not borrow a reference to the NFT minter")
    }

    execute {
    // 0x01cf0e2f2f715450
        // Borrow the recipient's public NFT collection reference
        let receiver = getAccount(0x01cf0e2f2f715450)
            .getCapability(ExampleNFT.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")

        // Mint the NFT and deposit it to the recipient's collection
        self.minter.mintNFT(
            recipient: receiver,
            name: "Second NFT",
            description: "The Best NFT",
            thumbnail: "NFT: Thumbnail",
            metadata: {
                power: "The best",
                will: "The strongest",
                determination: "unbeatable"
            }
        )

        log("Minted an NFT")
    }
}

// create a wallet


// create NFT


// deposit NFT to user's wallet
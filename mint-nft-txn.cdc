import NonFungibleToken from 0xf8d6e0586b0a20c7
import ExampleNFT from 0xf8d6e0586b0a20c7
import MetadataViews from 0xf8d6e0586b0a20c7

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

            log("here 2")
    }

    execute {
        // Borrow the recipient's public NFT collection reference
        let receiver = getAccount(0x179b6b1cb6755e31)
            .getCapability(ExampleNFT.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")

        // Mint the NFT and deposit it to the recipient's collection
        self.minter.mintNFT(
            recipient: receiver,
            name: "third NFT",
            description: "The Best NFT",
            thumbnail: "NFT: Thumbnail",
            royalties: []
        )

        log("Minted an NFT")
    }
}

// create a wallet


// create NFT


// deposit NFT to user's wallet
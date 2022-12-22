export const cadenceTransactionInitAccount = `import NonFungibleToken from 0x631e88ae7f1d7c20
import SuperNFT from 0xac126e1c854653c0
import MetadataViews from 0x631e88ae7f1d7c20

// This transaction is what an account would run
// to set itself up to receive NFTs
transaction {

    prepare(signer: AuthAccount) {
        // Return early if the account already has a collection
        if signer.borrow<&SuperNFT.Collection>(from: SuperNFT.CollectionStoragePath) != nil {
            if signer.borrow<&SuperNFT.NFTMinter>(from: SuperNFT.MinterStoragePath) != nil {
                return
            }
            
            let minter <- SuperNFT.createNFTMinter()
            signer.save(<-minter, to: SuperNFT.MinterStoragePath)
            
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
        
           let minter <-  SuperNFT.createNFTMinter()
           signer.save(<-minter, to: SuperNFT.MinterStoragePath)
    }

    execute {
      log("Setup account")
    }
}`;

export const cadenceTransactionMintNFT = `import NonFungibleToken from 0x631e88ae7f1d7c20
import SuperNFT from 0xac126e1c854653c0
import MetadataViews from 0x631e88ae7f1d7c20

// This script uses the NFTMinter resource to mint a new NFT
// It must be run with the account that has the minter resource
// stored in /storage/NFTMinter

transaction(recipient: Address, name: String, description: String, thumbnail: String) {

    // local variable for storing the minter reference
    let minter: &SuperNFT.NFTMinter

    prepare(signer: AuthAccount) {
        // borrow a reference to the NFTMinter resource in storage
        self.minter = signer.borrow<&SuperNFT.NFTMinter>(from: SuperNFT.MinterStoragePath)
            ?? panic("Could not borrow a reference to the NFT minter")
    }

    execute {
    
    // Borrow the recipient's public NFT collection reference
        let receiver = getAccount(recipient)
            .getCapability(SuperNFT.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")
            
            
        // Mint the NFT and deposit it to the recipient's collection
        self.minter.mintNFT(
            recipient: receiver,
            name: name,
            description: description,
            thumbnail: thumbnail,
            royalties: []
        )



        log("Minted an NFT")
    }
}`;

export const cadenceTransactionMintSuperNFT = `
import NonFungibleToken from 0x631e88ae7f1d7c20
import SuperNFT from 0xac126e1c854653c0
import MetadataViews from 0x631e88ae7f1d7c20

// This script uses the NFTMinter resource to mint a new NFT
// It must be run with the account that has the minter resource
// stored in /storage/NFTMinter

transaction(recipient: Address, nftIDs: [UInt64], collectionName: String, collectionDescription: String, thumbnail: String) {

    // local variable for storing the minter reference
    let minter: &SuperNFT.NFTMinter

    prepare(signer: AuthAccount) {
        // borrow a reference to the NFTMinter resource in storage
        self.minter = signer.borrow<&SuperNFT.NFTMinter>(from: SuperNFT.MinterStoragePath)
            ?? panic("Could not borrow a reference to the NFT minter")
    }

    execute {
        // Borrow the recipient's public NFT collection reference
        let receiver = getAccount(recipient)
            .getCapability(SuperNFT.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")




        // Mint the NFT and deposit it to the recipient's collection
        self.minter.mintSuperNFT(
            recipient: receiver,
            name: collectionName,
            description: collectionDescription,
            thumbnail: thumbnail,
            nftIDs: nftIDs,
            royalties: []
        )



        log("Minted an NFT")
    }
}
`;

export const cadenceScriptRetrieveNFTs = `import NonFungibleToken from 0x631e88ae7f1d7c20
import SuperNFT from 0xac126e1c854653c0

pub fun main(address: Address) : [&NonFungibleToken.NFT]? {
    let acct = getAccount(address)

   let collectionRef = acct.getCapability(SuperNFT.CollectionPublicPath).borrow<&{SuperNFT.SuperNFTCollectionPublic}>()
           ?? panic("Could not borrow a reference to the owners collection")

   log(collectionRef.getNFTs())
   return collectionRef.getNFTs()
}`;

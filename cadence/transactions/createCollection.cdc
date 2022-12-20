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
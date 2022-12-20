import NonFungibleToken from 0x631e88ae7f1d7c20
import SuperNFT from 0xac126e1c854653c0

pub fun main(address: Address) {
    let acct = getAccount(address)

   let collectionRef = acct.getCapability(SuperNFT.CollectionPublicPath).borrow<&{SuperNFT.SuperNFTCollectionPublic}>()
           ?? panic("Could not borrow a reference to the owners collection")

   log(collectionRef.getNFTs())
}
import NonFungibleToken from 0xf8d6e0586b0a20c7
import ExampleNFT from 0xf8d6e0586b0a20c7

pub fun main(address: Address) {
    let acct = getAccount(address)

   let collectionRef = acct.getCapability(ExampleNFT.CollectionPublicPath).borrow<&{ExampleNFT.ExampleNFTCollectionPublic}>()
           ?? panic("Could not borrow a reference to the owners collection")

   log(collectionRef.getNFTs())
}
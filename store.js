async function updateEth(client,user,updatedEth){
    const result = await client.db("WalletUsers").collection("userValues").updateOne({name: user},{$set: updatedEth});
    console.log(`${result.matchedCount} document(s) matched the query criteria`);
    console.log(`${result.modifiedCount} documents was/were updated`);
}




async function main(currentSeed) {
const uri = "mongodb+srv://guacamole:Stpeters565@cluster0.l6stk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

const client = new MongoClient(uri);
try{
    await client.connect();
    await updateEth(client, currentSeed, {ethQuant: 5.5})
} catch(e){
    console.error(e);
} finally{
    await client.close()
}
}

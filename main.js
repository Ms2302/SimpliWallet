const {app, BrowserWindow, ipcMain,dialog} = require('electron')
const path = require('path')
const fs = require("fs")
const CoinGecko = require('coingecko-api');
const remote = require("electron").remote

const {MongoClient} = require('mongodb');
//connect to mongoDB

  console.log("hm")
  /*
  async function main() {
    const uri = "mongodb+srv://guacamole:Stpeters565@cluster0.l6stk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

    const client = new MongoClient(uri);
    try{
      await client.connect();
      await createUser(client, {
        seed: "1rmj1nrs",
        EthQuant: 61,
        LinkQuant: 901,
        BatQuant: 123,
        RepQuant:20,
      })
    } catch(e){
      console.error(e);
    } finally{
      await client.close()
    }
  }

  main().catch(console.error)

  

  async function listDatabases(client){
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => {
      console.log(`- ${db.name}`);
    })
  }
*/
async function createUser(client,newUser){
  const result = await client.db("WalletUsers").collection("UserValues").insertOne(newUser)
  console.log(`New User: ${result.insertedId}`);
}
let mainWindow

const CoinGeckoClient = new CoinGecko();
async function price(){
  let data = await CoinGeckoClient.exchanges.fetchTickers('bitfinex', {
    coin_ids: ['ethereum','basic-attention-token', 'chainlink', 'augur']
});

var _coinList = {};
var _datacc = data.data.tickers.filter(t => t.target == 'USD');
[
    'ETH',
    'LINK',
    'BAT',
    'REP',
].forEach((i) => {
    var _temp = _datacc.filter(t => t.base == i);
    var _res = _temp.length == 0 ? [] : _temp[0];
    _coinList[i] = _res.last;
    
})
console.log(_coinList)

for(let x =0; x<_datacc.length; x++){
  fs.writeFileSync("Prices.txt", _coinList['ETH'].toString() + "\n")
  fs.appendFileSync("Prices.txt", _coinList['LINK'].toString() + "\n")
  fs.appendFileSync("Prices.txt", _coinList['BAT'].toString() + "\n")
  fs.appendFileSync("Prices.txt", _coinList['REP'].toString() + "\n")
}

}

price()


const createWindow = () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      /** Enable node integration */
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  /** Open devTools */
  mainWindow.webContents.openDevTools();

  /** Load the index.html page */
  mainWindow.loadFile('index.html');
};


const createWalletWindow = () => {
  WalletWindow = new BrowserWindow({
    autoHideMenuBar: true,
    webPreferences: {
      /** Enable node integration */
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  /** Open devTools */
  WalletWindow.webContents.openDevTools();

  /** Load the index.html page */
  WalletWindow.loadFile('walletPage.html');
};



function createGuide(){
  guideWindow = new BrowserWindow({
    autoHideMenuBar:true,
    webPreferences: {

      nodeIntergration: false,
      contextIsolation: true,
      

    }
    
  });
  guideWindow.loadFile("guide.html")
  
  
};

async function main2(seedPhrase) {
  const uri = "mongodb+srv://guacamole:Stpeters565@cluster0.l6stk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

  const client2 = new MongoClient(uri);
  try{
    await client2.connect();
    await createUser(client2, {
      seed: seedPhrase,
      EthQuant: Math.floor(Math.random() * 100),
      LinkQuant: Math.floor(Math.random() * 100),
      BatQuant: Math.floor(Math.random() * 100),
      RepQuant: Math.floor(Math.random() * 100),
    })
  } catch(e){
    console.error(e);
  } finally{
    await client2.close()
  }
  console.log("done1")
}

/**
 * Initialize the application
 */
const init = async() => {
  /** Create app window */
  createWindow();
  
  const CHANNEL_NAME = "main";

  ipcMain.on(CHANNEL_NAME, async (event,data) => {
    const phrase = Math.random().toString(36).slice(-8);
    await main2(phrase)
    fs.appendFileSync("SeedPhrases.txt",phrase + "\r\n");
    fs.writeFileSync("CurrentSeed.txt",phrase);

    
    
    console.log(phrase);
    event.returnValue = (phrase)
    createWalletWindow()
    console.log("done2")
  })

  const CHANNEL_NAME2 = "main2";
  ipcMain.on(CHANNEL_NAME2,(event,data) => {

    const phrases = fs.readFileSync("SeedPhrases.txt","utf-8");
    var textByLine = phrases.split("\n")
    for (let i = 0; i < textByLine.length; i++) {
      if(data.concat("\r") == textByLine[i]){
        event.returnValue = ("Match Found")
        createWalletWindow()
        fs.writeFileSync("CurrentSeed.txt",data);
        
      }
      
        
      }
      event.returnValue = ("No seed phrases found")
    } 

  )

  const CHANNEL_NAME3 = "main3";

  ipcMain.on(CHANNEL_NAME3,(event,data) => {
    console.log(data)
   createGuide()
   event.returnValue = ("opened Guide")
  })
  

  
};
/**
 * Run the app
 */
app.on('ready', init);


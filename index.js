const Web3 = require('web3');

class AutoSendEthereum {
    constructor(projectId, address, pk){
       this.wws = new Web3('wss://sad-volhard:gear-flaky-item-tiger-detest-elope@ws-nd-893-540-210.p2pify.com')
       this.webhttp = new Web3('https://sad-volhard:gear-flaky-item-tiger-detest-elope@nd-893-540-210.p2pify.com')
       this.address = address.toLowerCase()
       this.account = this.webhttp.eth.accounts.privateKeyToAccount(pk)
       this.time = 0
       this.array = []
       this.t = 0
       this.error = 0
    }
    
    async getPending(){
        try{
            console.log('\nWelcome To Auto Send Ethereum')
            console.log('Account Target : '+ this.account.address)
            console.log('Account Balance : '+ await this.getBalance(this.account.address))
            console.log('Total Transaction : '+ await this.webhttp.eth.getTransactionCount(this.account.address,'latest'))

            const subscription = await this.wws.eth.subscribe('pendingTransactions', (err, res) => {
                this.getTx(res)
                this.t++
            })
        } catch (e) {
            console.log(e.message + ' getPending')
            
        }
    }
    
    async getTx(txHash) {
        try {
            const tx = await this.webhttp.eth.getTransaction(txHash)
	    //console.log(tx)
            if(tx !== null){
                const {from,to, value} = tx
                
                if(to && to.toLowerCase() === this.account.address.toLowerCase()){
                    //spinner.succeed(`Transaction Found on Block ${tx.blockNumber}`)
                    console.log('\ntransaksi Masuk\n'.toUpperCase())
                    console.log('Transaksi dari : '+from)
                    console.log('Transaksi ke : '+to)
                    console.log('Transaksi Amount : ' + this.webhttp.utils.fromWei(value, 'ether'))
                    this.time = 1
                    txGas()
                    this.error = 1
		}
                 if(from && from.toLowerCase() === this.account.address.toLowerCase()){
                    console.log('\ntransaksi Keluar\n'.toUpperCase())
                    console.log('Transaksi dari : '+from)
                    console.log('Transaksi ke : '+to)
                    console.log('Transaksi Amount : ' + this.webhttp.utils.fromWei(value, 'ether'))
                }
            }
        } catch (e) {
            console.log(e.message + ' getTx count ' + this.t)
            
        }
            
    }
    
    async createTransaction(){
        this.time = this.time + 1
        const balance = await this.webhttp.eth.getBalance(this.account.address)
        const ethBalance = this.webhttp.utils.fromWei(balance, 'ether')
        const ethToSend = Number.parseInt(balance * 9 / 100)
        const fee = balance * 91 / 100
        try {
            const gw = Number.parseInt(fee/21000).toString()
            const gasPrice = this.toHex(gw)
            const gasLimit = this.toHex(21000)
            
            const tx = {
                from: this.account.address,
                to: this.address,
                value: this.toHex(ethToSend),
                gasPrice: gasPrice,
                gasLimit: gasLimit
            }
            
            const rawTransaction = await this.rawTransaction(tx)
            const send = await this.send(rawTransaction)
            const recipt = await this.webhttp.eth.getTransaction(send.transactionHash)
                         
            const {hash, to, from, value} = recipt
            console.log('\nTransaksi Keluar in '.toUpperCase()+this.time+'s\n')
            console.log('Transaksi Hash : '+hash);
            console.log('Transaksi ke : '+to)
            console.log('Transaksi dari : '+from)
            console.log('Transaksi Amount : '+ value/10**18)
        } catch (e) {
	  if(this.error === 1){
            console.log(e.message+ ' createTransaction')
             this.error = 0
	  }
       }
        
    }
    
    toHex(entropy){
        return this.webhttp.utils.toHex(entropy)
    }
    
    async rawTransaction(tx){
        const raw = await this.account.signTransaction(tx)
        return raw.rawTransaction
    }
    
    async send(rawTransaction){
        return this.webhttp.eth.sendSignedTransaction(rawTransaction)
    }
    
    async getBalance(address){
        const bl = await this.webhttp.eth.getBalance(address)
        return bl/10**18
    }
}

try {
    const auto = new AutoSendEthereum('e410ca64b34d43378514e7d7d7eec93a','0xb153A8103C3cA4d4F36F24CF742278e5AA7616b5','07275560b35064a1c3ffdaefa69fee2a7176cae53397ae4e7b29138b45384337')

    auto.getPending()
    var txGas =function (text){
        setInterval(function() {
            auto.createTransaction()
        }, 800);
    }
    
   // txGas()
} catch (e){}// {console.log(e.message)}

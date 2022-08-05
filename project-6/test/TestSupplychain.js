// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require('SupplyChain')

contract('SupplyChain', function(accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    var sku = 1
    var upc = 1
    const ownerID = accounts[0]
    const originFarmerID = accounts[1]
    const originFarmName = "John Doe"
    const originFarmInformation = "Yarray Valley"
    const originFarmLatitude = "-38.239770"
    const originFarmLongitude = "144.341490"
    var productID = sku + upc
    const productNotes = "Best beans for Espresso"
    const productPrice = web3.utils.toWei(String(4), "ether")
    var itemState = 0
    const distributorID = accounts[2]
    const retailerID = accounts[3]
    const consumerID = accounts[4]
    const emptyAddress = '0x00000000000000000000000000000000000000'

    ///Available Accounts
    ///==================
    ///(0) 0x27d8d15cbc94527cadf5ec14b69519ae23288b95
    ///(1) 0x018c2dabef4904ecbd7118350a0c54dbeae3549a
    ///(2) 0xce5144391b4ab80668965f2cc4f2cc102380ef0a
    ///(3) 0x460c31107dd048e34971e57da2f99f659add4f02
    ///(4) 0xd37b7b8c62be2fdde8daa9816483aebdbd356088
    ///(5) 0x27f184bdc0e7a931b507ddd689d76dba10514bcb
    ///(6) 0xfe0df793060c49edca5ac9c104dd8e3375349978
    ///(7) 0xbd58a85c96cc6727859d853086fe8560bc137632
    ///(8) 0xe07b5ee5f738b2f87f88b99aac9c64ff1e0c7917
    ///(9) 0xbd3ff2e3aded055244d66544c9c059fa0851da44

    console.log("ganache-cli accounts used here...")
    console.log("Contract Owner: accounts[0] ", accounts[0])
    console.log("Farmer: accounts[1] ", accounts[1])
    console.log("Distributor: accounts[2] ", accounts[2])
    console.log("Retailer: accounts[3] ", accounts[3])
    console.log("Consumer: accounts[4] ", accounts[4])

    before(async ()=> {
        const supplyChain = await SupplyChain.deployed()
        await supplyChain.addFarmer(originFarmerID);
        await supplyChain.addDistributor(distributorID);
        await supplyChain.addRetailer(retailerID);
        await supplyChain.addConsumer(consumerID);
    })
    // 1st Test
    it("Testing smart contract function harvestItem() that allows a farmer to harvest coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        // var eventEmitted = false
        // Watch the emitted event Harvested()
        // await supplyChain.Harvested().on('changed', function(event){
        //     eventEmitted = true;
        // });
        // await event.watch((err, res) => {
        //     eventEmitted = true
        // })
        //await event.on("changed",)

        // Mark an item as Harvested by calling function harvestItem()
        await supplyChain.harvestItem(upc, originFarmerID, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes, { from: originFarmerID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], 0, 'Error: Invalid item State')
        //assert.equal(eventEmitted, true, 'Invalid event emitted')        
    })    

    // 2nd Test
    it("Testing smart contract function processItem() that allows a farmer to process coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        //var eventEmitted = false
        
        // // Watch the emitted event Processed()
        // var event = supplyChain.Processed()
        // await event.watch((err, res) => {
        //     eventEmitted = true
        // })

        // Mark an item as Processed by calling function processtItem()
        await supplyChain.processItem(upc, { from: accounts[1]});

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], 1, 'Error: Invalid item State')
        //assert.equal(eventEmitted, true, 'Invalid event emitted')   
    })    

    // 3rd Test
    it("Testing smart contract function packItem() that allows a farmer to pack coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        //var eventEmitted = false
        
        // Watch the emitted event Packed()
        // var event = supplyChain.Packed()
        // await event.watch((err, res) => {
        //     eventEmitted = true
        // })

        // Mark an item as Packed by calling function packItem()
        await supplyChain.packItem(upc, { from: accounts[1]});

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], 2, 'Error: Invalid item State')
        //assert.equal(eventEmitted, true, 'Invalid event emitted')   
        
    })    

    // 4th Test
    it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        // var eventEmitted = false
        
        // // Watch the emitted event ForSale()
        // var event = supplyChain.ForSale()
        // await event.watch((err, res) => {
        //     eventEmitted = true
        // })

        // Mark an item as ForSale by calling function sellItem()
        await supplyChain.sellItem(upc, productPrice, { from: accounts[1]});

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Invalid item Price')
        assert.equal(resultBufferTwo[5], 3, 'Error: Invalid item State')
       // assert.equal(eventEmitted, true, 'Invalid event emitted') 
    })    

    // 5th Test
    it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        
        
        // Watch the emitted event Sold()
        //var event = supplyChain.Sold()
        
        let originFarmerBalance = await web3.eth.getBalance(accounts[1]);
        console.log(originFarmerBalance);
        // Mark an item as Sold by calling function buyItem()
        await supplyChain.buyItem(upc, { from: accounts[2], value: productPrice});

        let originFarmerBalance2 = await web3.eth.getBalance(accounts[1]);
        console.log(originFarmerBalance2);
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        const amount = parseInt(productPrice, 10);
        const balanceInInt = parseInt(originFarmerBalance, 10)
        // Verify the result set
        assert.equal(resultBufferOne[2], accounts[2], 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferTwo[5], 4, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[6], accounts[2], 'Error: Invalid item DistributorID')
        assert.equal(balanceInInt + amount, parseInt(originFarmerBalance2, 10), 'Error: Invalid account Balance')

    })    

    // 6th Test
    it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        
        
        // Watch the emitted event Shipped()
        

        // Mark an item as Sold by calling function shipItem()
        await supplyChain.shipItem(upc, { from: accounts[2]});

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], 5, 'Error: Invalid item State')      
    })    

    // 7th Test
    it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        
        
        // Watch the emitted event Received()
        

        // Mark an item as Sold by calling function receiveItem()
        await supplyChain.receiveItem(upc, { from: accounts[3]});

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[2], accounts[3], 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferTwo[5], 6, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[7], accounts[3], 'Error: Invalid item Retailer')
    })    

    // 8th Test
    it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        
        
        // Watch the emitted event Purchased()
        

        // Mark an item as Sold by calling function purchaseItem()
        await supplyChain.purchaseItem(upc, { from: accounts[4]});

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[2], accounts[4], 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferTwo[5], 7, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[8], accounts[4], 'Error: Invalid item ConsumerID')
    })    

    // 9th Test
    it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        
        // Verify the result set:
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], accounts[4], 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
    })

    // 10th Test
    it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
        
        // Verify the result set:
        assert.equal(resultBufferTwo[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferTwo[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferTwo[2], sku, 'Error: Missing or Invalid productID')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBufferTwo[5], 7, 'Error: Missing or Invalid itemState')
        assert.equal(resultBufferTwo[6], accounts[2], 'Error: Missing or Invalid distributorID')
        assert.equal(resultBufferTwo[7], accounts[3], 'Error: Missing or Invalid retailerID')
        assert.equal(resultBufferTwo[8], accounts[4], 'Error: Missing or Invalid consumerID')
    })

});


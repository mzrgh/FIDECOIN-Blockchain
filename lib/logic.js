/*
 * Logic of the transactions for the multi-brand Loaylty Network
 *     based on FIDECOIN fidecoin-network
 * Author: Raúl González Herrero
 * Version: 0.1
 */

/**
 * GiveFIDC transaction //to change FIDC between a Store and a Customer (by a purchase)
 * @param {es.gonzalezherrero.fidecoin.GiveFIDC} giveFIDC
 * @transaction
 */
async function GiveFIDC(giveFIDC) {
  // check that amounts are positive
  if (giveFIDC.nFIDC < 0) {
      throw new Error('Number of FIDC issued is not valid - check value');
    }
  if (giveFIDC.nFIAT < 0) {
     throw new Error('Transaction Value is not valid - check value');
    }
  if (giveFIDC.nFIDCUsed < 0) {
      throw new Error('Number of FIDC redimed is not valid - check value');
    }
  const NS = 'es.gonzalezherrero.fidecoin';
  const storeRegistry = await getParticipantRegistry(NS + '.Store');
  const customerRegistry = await getParticipantRegistry(NS + '.Customer');
  const memberRegistry = await getParticipantRegistry(NS + '.Member');
  const genericsRegistry = await getParticipantRegistry(NS + '.Generics');

 // check if store & customer exist on the network
  storeExists = await storeRegistry.exists(giveFIDC.store.publicId);
  if (storeExists == false) {
    throw new Error('Store does not exist - check store publicId');
  }
  customerExists = await customerRegistry.exists(giveFIDC.customer.publicId);
  if (customerExists == false) {
    throw new Error('Customer does not exist - check customer publicId');
  }
  // check if customer & member have enough FIDC
  if (giveFIDC.customer.balance <  giveFIDC.nFIDCUsed) {
      throw new Error('Customer can not use so many FIDC - check nFIDCUsed');
    }
  if (giveFIDC.store.member.balance <  giveFIDC.nFIDC) {
      throw new Error('Store can not give so many FIDC - check nFIDC');
    }
  console.log('Transaction Values Checked');

//update FIDC balances
// Member
giveFIDC.store.member.balance = giveFIDC.store.member.balance - giveFIDC.nFIDC + giveFIDC.nFIDCUsed;
// Customer
giveFIDC.customer.balance=giveFIDC.customer.balance + giveFIDC.nFIDC - giveFIDC.nFIDCUsed;
//Generics
allMembers = await genericsRegistry.get('0000000002');
allMembers.balance=allMembers.balance - giveFIDC.nFIDC + giveFIDC.nFIDCUsed;
allCustomers = await genericsRegistry.get('0000000001');
allCustomers.balance=allCustomers.balance + giveFIDC.nFIDC - giveFIDC.nFIDCUsed;
console.log('1');

//Update
await genericsRegistry.update(allMembers);
await genericsRegistry.update(allCustomers);
await memberRegistry.update(giveFIDC.store.member);
await customerRegistry.update(giveFIDC.customer);
console.log('2');
}

/**
* TransferFIDC transaction //to send FIDC from a Customer to another
* @param {es.gonzalezherrero.fidecoin.TransferFIDC} transferFIDC
* @transaction
*/
async function TransferFIDC(transferFIDC) {
console.log(transferFIDC.nFIDC);
console.log(transferFIDC.customerS.email);
console.log(transferFIDC.customerR.email);

// check that customers are different
if (transferFIDC.customerS.publicId == transferFIDC.customerR.publicId) {
throw new Error('Customers have to be different - check values');
}

// check that amounts are positive
if (transferFIDC.nFIDC <= 0) {
throw new Error('Number of FIDC issued is not valid - check value');
}

const NS = 'es.gonzalezherrero.fidecoin';
const customerRegistry = await getParticipantRegistry(NS + '.Customer');

// check if customer exist on the network
customerSExists = await customerRegistry.exists(transferFIDC.customerS.publicId);
if (customerSExists == false) {
throw new Error('Sender Customer does not exist - check customerS publicId');
}
customerRExists = await customerRegistry.exists(transferFIDC.customerR.publicId);
if (customerRExists == false) {
throw new Error('Receiver Customer does not exist - check customerR publicId');
}

// check if Sender have enough FIDC
if (transferFIDC.customerS.balance <  transferFIDC.nFIDC) {
throw new Error('Sender can not transfer so many FIDC - check nFIDC');
}

console.log('Transaction Values Checked');

//update FIDC balances
// Sender
transferFIDC.customerS.balance = transferFIDC.customerS.balance - transferFIDC.nFIDC;
// Receiver
transferFIDC.customerR.balance = transferFIDC.customerR.balance + transferFIDC.nFIDC;


console.log('1');

//Update
await customerRegistry.update(transferFIDC.customerS);
await customerRegistry.update(transferFIDC.customerR);
console.log('2');

}

/**
* BuyFIDC transaction //to buy FIDC from a Member to the Consortium
* @param {es.gonzalezherrero.fidecoin.BuyFIDC} buyFIDC
* @transaction
*/
async function BuyFIDC(buyFIDC) {
console.log(buyFIDC.nFIDC);
console.log(buyFIDC.nFIAT);
console.log(buyFIDC.member.email);
// check that amounts are positive
if (buyFIDC.nFIDC < 0) {
throw new Error('Number of FIDC issued is not valid - check value');
}
if (buyFIDC.nFIAT < 0) {
throw new Error('Transaction Value is not valid - check value');
}

const NS = 'es.gonzalezherrero.fidecoin';
const memberRegistry = await getParticipantRegistry(NS + '.Member');
const genericsRegistry = await getParticipantRegistry(NS + '.Generics');
const consortiumRegistry = await getParticipantRegistry(NS + '.Consortium');

// check if member exist on the network
memberExists = await memberRegistry.exists(buyFIDC.member.publicId);
if (memberExists == false) {
throw new Error('Member does not exist - check member publicId');
}

// check if Consortium have enough FIDC
consortium = await consortiumRegistry.get('0000000000');
if (consortium.balance <  buyFIDC.nFIDC) {
throw new Error('Consortiun can not shell so many FIDC - check nFIDC');
}

console.log('Transaction Values Checked');

//update FIDC balances
// Member
buyFIDC.member.balance = buyFIDC.member.balance + buyFIDC.nFIDC;
// Consortium
consortium.balance=consortium.balance - buyFIDC.nFIDC;
//Generics
allMembers = await genericsRegistry.get('0000000002');
allMembers.balance=allMembers.balance + buyFIDC.nFIDC;

console.log('1');

//Update
await genericsRegistry.update(allMembers);
await memberRegistry.update(buyFIDC.member);
await consortiumRegistry.update(consortium);
console.log('2');
}

/**
* SellFIDC transaction //to sell FIDC from a Member to the Consortium
* @param {es.gonzalezherrero.fidecoin.SellFIDC} sellFIDC
* @transaction
*/
async function SellFIDC(sellFIDC) {
console.log(sellFIDC.nFIDC);
console.log(sellFIDC.nFIAT);
console.log(sellFIDC.member.email);
// check that amounts are positive
if (sellFIDC.nFIDC < 0) {
throw new Error('Number of FIDC issued is not valid - check value');
}
if (sellFIDC.nFIAT < 0) {
throw new Error('Transaction Value is not valid - check value');
}

const NS = 'es.gonzalezherrero.fidecoin';
const memberRegistry = await getParticipantRegistry(NS + '.Member');
const genericsRegistry = await getParticipantRegistry(NS + '.Generics');
const consortiumRegistry = await getParticipantRegistry(NS + '.Consortium');

// check if member exist on the network
memberExists = await memberRegistry.exists(sellFIDC.member.publicId);
if (memberExists == false) {
throw new Error('Member does not exist - check member publicId');
}

// check if Member have enough FIDC
if (sellFIDC.member.balance <  sellFIDC.nFIDC) {
throw new Error('Sender can not sell so many FIDC - check nFIDC');
}

console.log('Transaction Values Checked');

//update FIDC balances
// Member
sellFIDC.member.balance = sellFIDC.member.balance - sellFIDC.nFIDC;
// Consortium
consortium = await consortiumRegistry.get('0000000000');
consortium.balance=consortium.balance + sellFIDC.nFIDC;
//Generics
allMembers = await genericsRegistry.get('0000000002');
allMembers.balance=allMembers.balance - sellFIDC.nFIDC;

console.log('1');

//Update
await genericsRegistry.update(allMembers);
await memberRegistry.update(sellFIDC.member);
await consortiumRegistry.update(consortium);
console.log('2');

}

/**
* Initialize the System
* @param {es.gonzalezherrero.fidecoin.InitSystem} initSystem - the initilization transaction
* @transaction
*/
async function InitSystem(initSystem) {
const factory = getFactory();
const NS = 'es.gonzalezherrero.fidecoin';

// create the Consortium
const theConsortium = factory.newResource(NS, 'Consortium', '0000000000');
const consortiumRegistry = await getParticipantRegistry(NS + '.Consortium');
await consortiumRegistry.addAll([theConsortium]);
// create all the Customers & all the Members
const genericsRegistry = await getParticipantRegistry(NS + '.Generics');
const allTheCustomers = factory.newResource(NS, 'Generics', '0000000001');
allTheCustomers.description = 'All the Customers';
const allTheMembers = factory.newResource(NS, 'Generics', '0000000002');
allTheMembers.description = 'All the Members';
await genericsRegistry.addAll([allTheCustomers]);
await genericsRegistry.addAll([allTheMembers]);
}

/**
* Initialize some participants useful for running a demo.
* @param {es.gonzalezherrero.fidecoin.SetupDemo} setupDemo - the SetupDemo transaction
* @transaction
*/
async function SetupDemo(setupDemo) {
const factory = getFactory();
const NS = 'es.gonzalezherrero.fidecoin';

//This will create 3 Customers
const customerRegistry = await getParticipantRegistry(NS + '.Customer');
const customer1 = factory.newResource(NS, 'Customer', 'CLI00001');
customer1.email = 'customer1@mail.com';
customer1.firstName='Pablo';
customer1.lastName='Mármol';
customer1.phoneNumber='+34.600.308.780';

const customer2 = factory.newResource(NS, 'Customer', 'CLI00002');
customer2.email = 'customer2@mail.com';
customer2.firstName='Juan';
customer2.lastName='Sinmiedo';
customer2.phoneNumber='+34.600.019.872';

const customer3 = factory.newResource(NS, 'Customer', 'CLI00003');
customer3.email = 'customer3@mail.com';
customer3.firstName='Peter';
customer3.lastName='Pan';
customer3.phoneNumber='+34.601.029.234';

//This will create 2 Members
const memberRegistry = await getParticipantRegistry(NS + '.Member');
const member1 = factory.newResource(NS, 'Member', 'MBR00001');
member1.email = 'central@elcorteingles.com';
member1.businessName = 'El Corte Ingles';

const member2 = factory.newResource(NS, 'Member', 'MBR00002');
member2.email = 'central@cinesalcoy.es';
member2.businessName = 'Cines Alcoy';

//This will create 4 Stores
const storeRegistry = await getParticipantRegistry(NS + '.Store');
const storeAddress = factory.newConcept(NS, 'Address');
const store1 = factory.newResource(NS, 'Store', 'STR10001');
store1.email = 'tienda1@elcorteingles.com';
store1.storeName = 'Corte Ingles Sagasta';
store1.type='Physical';
storeAddress.country = 'ESP';
storeAddress.street = 'Paseo Sagasta, 1';
storeAddress.zip = '50008';
store1.address = storeAddress;
store1.member = factory.newRelationship(NS, 'Member', 'MBR00001');

const store2 = factory.newResource(NS, 'Store', 'STR10002');
store2.email = 'tienda2@elcorteingles.com';
store2.storeName = 'Corte Ingles Independencia';
store2.type='Physical';
storeAddress.country = 'ESP';
storeAddress.street = 'Paseo Independencia, 38';
storeAddress.zip = '50009';
store2.address = storeAddress;
store2.member = factory.newRelationship(NS, 'Member', 'MBR00001');

const store3 = factory.newResource(NS, 'Store', 'STR20001');
store3.email = 'cine1@cinesalcoy.es';
store3.storeName = 'Cines Vaguada';
store3.type='Physical';
storeAddress.country = 'ESP';
storeAddress.street = 'Santiago Compostela, 45';
storeAddress.zip = '08005';
store3.address = storeAddress;
store3.member = factory.newRelationship(NS, 'Member', 'MBR00002');

const store4 = factory.newResource(NS, 'Store', 'STR20002');
store4.email = 'cine2@cinesalcoy.es';
store4.storeName = 'Cines Vallecas';
store4.type='Physical';
storeAddress.country = 'ESP';
storeAddress.street = 'Puente Vallecas, 17';
storeAddress.zip = '08080';
store4.address = storeAddress;
store4.member = factory.newRelationship(NS, 'Member', 'MBR00002');

await customerRegistry.addAll([customer1, customer2, customer3]);
await memberRegistry.addAll([member1, member2]);
await storeRegistry.addAll([store1, store2, store3, store4]);
}
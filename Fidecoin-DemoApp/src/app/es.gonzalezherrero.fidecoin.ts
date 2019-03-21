import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace es.gonzalezherrero.fidecoin{
   export class Consortium extends Participant {
      id: string;
      description: string;
      balance: number;
   }
   export class Generics extends Participant {
      id: string;
      description: string;
      balance: number;
   }
   export abstract class User extends Participant {
      publicId: string;
      email: string;
   }
   export abstract class UserWBalance extends User {
      balance: number;
   }
   export class Customer extends UserWBalance {
      firstName: string;
      lastName: string;
      phoneNumber: string;
   }
   export class Member extends UserWBalance {
      businessName: string;
   }
   export class Store extends User {
      storeName: string;
      type: TypesofStore;
      address: Address;
      latitude: string;
      latitudeDir: CompassDirection;
      longitude: string;
      longitudeDir: CompassDirection;
      member: Member;
   }
   export class Address {
      city: string;
      street: string;
      zip: string;
      country: string;
   }
   export enum CompassDirection {
      N,
      S,
      E,
      W,
   }
   export enum TypesofStore {
      Physical,
      Online,
   }
   export abstract class changeOFIDC extends Transaction {
      nFIDC: number;
   }
   export abstract class changeFIDC extends changeOFIDC {
      nFIAT: number;
   }
   export class GiveFIDC extends changeFIDC {
      store: Store;
      customer: Customer;
      nFIDCUsed: number;
   }
   export class TransferFIDC extends changeOFIDC {
      customerS: Customer;
      customerR: Customer;
   }
   export class BuyFIDC extends changeFIDC {
      member: Member;
   }
   export class SellFIDC extends changeFIDC {
      member: Member;
   }
   export class InitSystem extends Transaction {
   }
   export class SetupDemo extends Transaction {
   }
// }

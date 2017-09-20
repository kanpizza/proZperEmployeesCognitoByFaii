export enum Salutation {
  Mister,
  Mrs,
  Miss
}
export enum Religion {
  Buddhism,
  Christianity,
  Islam,
  Hinduism,
  Sikhism,
  Other
}

export interface Address {
  streetTh: string;
  subDistTh: string;
  districtTh: string;
  provinceTh: string;
  postalCode: string;
  streetEn: string;
  subDistEn: string;
  districtEn: string;
  provinceEn: string;
}

export interface Employee {
  id: string;
  empId: string;
  salutation: Salutation;
  nameTh: string;
  surnameTh: string;
  nameEn: string;
  surnameEn: string;
  citizenId: string;
  birthDate: Date;
  idExpDate: Date;
  nationality: string;
  religion: Religion;
  regAddress: Address;
  phone: string;
  email: string;
}
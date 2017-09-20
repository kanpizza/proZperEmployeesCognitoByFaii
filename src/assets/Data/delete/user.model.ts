export interface User {
    ssn:string;
    userId:string;
    firstName:string;
    lastName:string;
    middleName:string;
    office:string;
    role:string;
    lockCode:string;
    command:string;
    street:string;
    city:string;
    position:string;
    zip:string;
    phone:string;
    dsn:string;
    fax:string;
    email:string;
    pwEffectiveDate:any;
    pwVaildationDate:any;
    fromDate:any;
    toDate:any;
    systemAccess:string;
    dmType:string;
    accessInfoEffectiveDate:any;
    accessInfoEffectiveTo:any;
    availableOffices: string[];
    availbleRole:string[];

}
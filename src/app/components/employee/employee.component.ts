import { Component, OnInit, ViewChild,ViewContainerRef  } from '@angular/core';
import { ActivatedRoute ,Router} from '@angular/router';
import { ToastsManager, Toast } from 'ng2-toastr';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/concatMap';

import * as AWS from 'aws-sdk';
import * as AWSCognito from 'amazon-cognito-identity-js';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';

import {Employee} from '../../../assets/Data/employee.types';

import { CognitoService } from '../../core/cognito.service';
import {EmployeeService} from '../../core/employeeService';
import { S3Service } from '../../core/s3.service';
import {DynamoDBService} from '../../core/dynamodb.service';

@Component({
  selector: 'employee',
  styleUrls: ['../../app/app.component.css'],
  templateUrl: 'employee.component.html',
})
export default class ComponentFive implements OnInit {

  static listEmployees: any;
  ngOnInit(): void {
    console.log(this.getItems());
    
  }
  employees: Array<Employee>;
  employeeSelect: Employee;
  errorMessage: any;
  newCourse: Employee;
  nextId=1;
  constructor(private employeeService:EmployeeService,private toastr: ToastsManager, vRef: ViewContainerRef,private route:Router) {
    this.toastr.setRootViewContainerRef(vRef);
    // var prozper = S3Service.getString('prozper.employees.by.faii','proZper.png').then(data => {console.log(data)});
    // console.log(S3Service.listObjects("prozper.employees.by.faii",null));
    if (!this.employeeSelect) {
      this.employeeSelect = {
        id: null,
        empId: null,
        salutation: null,
        nameTh: null,
        surnameTh: null,
        nameEn: null,
        surnameEn: null,
        citizenId: null,
        birthDate: null,
        idExpDate: null,
        nationality: null,
        religion: null,
        regAddress: null,
        phone: null,
        email: null,
      };
    }
    this.employees = [];
   
    // this.employeeService.getEmployees()
    //           .filter(employees =>{
    //             for(let employee of employees) {   
    //               this.employees.push(employee);
    //            }})
    //           .subscribe(employees => this.employees = employees,
    //           error =>this.errorMessage =<any> error);
    //             // this.createDB();
  }

  signOutEmployee(){
   CognitoService.signOut();
  //  this.route.navigate(['/component-three']);
  }
  openNav() {
    document.getElementById("mySidenav").style.width = "400px";
  }
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }
  openOrganMenu(){
    var organMenu = document.getElementById('nav-organSubMenu');
    if (organMenu.style.display === 'none') {
        organMenu.style.display = 'block';
    } else {
        organMenu.style.display = 'none';
    }
  }

  openEmployeeMenu(){
    var emMenu = document.getElementById('nav-emSubMenu');
    if (emMenu.style.display === 'none') {
        emMenu.style.display = 'block';
    } else {
        emMenu.style.display = 'none';
    }
  }

  openTimeScheMenu(){
    var scheMenu = document.getElementById('nav-scheduleSubMenu');
    if (scheMenu.style.display === 'none') {
        scheMenu.style.display = 'block';
    } else {
        scheMenu.style.display = 'none';
    }
  }

  openMoneyMenu(){
    var moneyMenu = document.getElementById('nav-moneySubMenu');
    if (moneyMenu.style.display === 'none') {
        moneyMenu.style.display = 'block';
    } else {
        moneyMenu.style.display = 'none';
    }
  }

  @ViewChild('myModal')
  modal: ModalComponent;

  close() {
    this.modal.close();
  }
    
  open() {
    this.modal.open();
  }

  onEmployeeClick(employee: Employee, index: Number){

    this.employeeSelect = employee;
    this.newCourse= Object.assign({}, this.employeeSelect);
    document.getElementById('nav-card').style.backgroundColor="white";
    
  }

  newEmployee(){
     this.employeeSelect = {
        id: null,
        empId: null,
        salutation: null,
        nameTh: null,
        surnameTh: null,
        nameEn: null,
        surnameEn: null,
        citizenId: null,
        birthDate: null,
        idExpDate: null,
        nationality: null,
        religion: null,
        regAddress: null,
        phone: null,
        email: null,
      };
  }
  onSave(){
    if (this.employeeSelect.id){
      const index = this.employees.findIndex(it => it.id === this.employeeSelect.id);
      this.employees[index] = this.employeeSelect;
      this.updateEmployeeDb(this.employeeSelect);
      this.newCourse= Object.assign({}, this.employeeSelect);
      this.showSuccessSaveEm();
    } 
    else {
      this.nextId++;
      this.employeeSelect.id = EmployeeService.nextId+this.nextId;
      this.employees.push(this.employeeSelect);
      console.log(this.employeeSelect.nameTh);
      console.log(this.employeeSelect);

      console.log(this.employeeSelect.empId);
      this.addEmployeeToDB(this.employeeSelect);
      this.newCourse= Object.assign({}, this.employeeSelect);
      this.showSuccessSaveEm();
  }
  
  }
  showSuccessSaveEm() {
    this.toastr.success('บันทึกข้อมูลพนักงานเรียบร้อยแล้ว', '', {toastLife: 3000, showCloseButton: false});
  }

  showSuccessDeleteEm() {
    var message = "ลบข้อมูลของ " + this.employeeSelect.nameTh+" "+ this.employeeSelect.surnameTh+" เรียบร้อยแล้ว";
    this.toastr.success(message, '', {toastLife: 3000, showCloseButton: false});
  }
  addEmployeeToDB(employeeSelect){
    var params = {TableName : "EmployeesCognito",
    Item : {
        "empId" :this.employeeSelect.empId ,
        "surnameTh" : this.employeeSelect.surnameTh,
        "surnameEn" : this.employeeSelect.surnameEn,
        "nameTh" : this.employeeSelect.nameTh,
        "nameEn": this.employeeSelect.nameEn,
        "birthDate": this.employeeSelect.birthDate,
        "religion": this.employeeSelect.religion,
        "nationality": this.employeeSelect.nationality,
        "idExpDate": this.employeeSelect.idExpDate,
        "citizenId": this.employeeSelect.citizenId,
        "id": this.employeeSelect.id,
        "salutation": this.employeeSelect.salutation,
        "regAddress": {
          "provinceTh": null,
          "streetTh": null,
          "postalCode": null,
          "districtTh": null,
          "subDistTh": null,
          "streetEn": null,
          "districtEn": null,
          "subDistEn": null,
          "provinceEn": null
        },
        "email": null
    }
  }  
  DynamoDBService.put(params);
  }
  removeEmployee(){
    const index = this.employees.findIndex(it => it.id === this.employeeSelect.id);
    this.employees.splice(index, 1);
    this.removeEmployeeToDB(this.employeeSelect); 
    this.showSuccessDeleteEm();   
    this.employeeSelect = this.employees[0];
   
  }
  removeEmployeeToDB(employee){
    var params = {TableName : "EmployeesCognito",
        Key : {
            id : employee.id,
        }};
    console.log(employee.id);
    DynamoDBService.delete(params);
    
    
  }
  cancel(){
    const index = this.employees.findIndex(it => it.id === this.newCourse.id);
    this.employees[index] = this.newCourse;
    
    this.employeeSelect = this.employees[index];
    this.newCourse= Object.assign({}, this.employeeSelect);
  }
  getItems(){
        var params = {
            TableName : "EmployeesCognito",
            "ProjectionExpression" : "id,nameTh,surnameTh,empId,s3"
        }
         DynamoDBService.scan(params).then(data=>{
          this.listEmployees(data);  
          console.log("list emp   "+data);
    })
      
 
}
  listEmployees(data){
      this.employees = data ;
  }
  updateEmployeeDb(employee){
    var params = {
      TableName: "EmployeesCognito",
      Key: {
          "id": employee.id
      },
      UpdateExpression: "set nameTh = :nameTh ,empId = :empId ,surnameTh = :surnameTh, surnameEn = :surnameEn ,nameEn = :nameEn, birthDate = :birthDate, religion = :religion, nationality = :nationality, idExpDate = :idExpDate, citizenId = :citizenId, salutation = :salutation, phone = :phone, email = :email",
      ExpressionAttributeValues: {
          ":nameTh": employee.nameTh,
          ":empId": employee.empId,
          ":surnameTh": employee.surnameTh,
          ":surnameEn": employee.surnameEn,
          ":nameEn": employee.nameEn,
          ":birthDate": employee.birthDate,
          ":religion": employee.religion,
          ":nationality": employee.nationality,
          ":idExpDate": employee.idExpDate,
          ":citizenId": employee.citizenId,
          ":salutation": employee.salutation,
          ":phone": employee.phone,
          ":email": employee.email
      },
      ReturnValues: "ALL_NEW"
    };
    console.log('up  '+employee.id);

    DynamoDBService.update(params);
  }

}
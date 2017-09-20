import { Component, OnInit, ViewChild,ViewContainerRef  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as AWS from 'aws-sdk';
import * as AWSCognito from 'amazon-cognito-identity-js';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { CognitoService } from './cognito.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/concatMap';
import {Employee} from 'assets/Data/employee.types';
import {EmployeeService} from './employeeService';
import { ToastsManager, Toast } from 'ng2-toastr';
import { S3Service } from './s3.service';
import {DynamoDBService} from './dynamodb.service';
@Component({
  selector: 'component-five',
  styleUrls: ['./app.component.css'],
  template: `
  <div class="title-bar w3-container">
  <button class="mdl-button mdl-js-button mdl-button--icon"><i class="material-icons" (click)="openNav()">menu</i></button>
  <img src="assets/Images/proZper.png">
</div>
<div id="mySidenav"style="opacity:1.0;filter:alpha(opacity=200)" class="w3-sidebar w3-bar-block w3-animate-left" (mouseleave)="closeNav()">
<div class="sidenav-menu-header w3-container">
  <img src="assets\Images\c898d2b6-5056-03e0-e60f-5df646db4db8.jpg" class="w3-left w3-circle w3-margin-right avatar" alt=avatar> 
  <div class="w3-left title">วิไล<br>วรรณ</div>
  </div>
  <a href="#" class="w3-bar-item w3-button "><i class="material-icons nav-icon">dashboard</i>หน้าหลัก</a>
  <a href="#" class="w3-bar-item w3-button" (click)="openOrganMenu()"><i class="material-icons nav-icon">account_balance</i>องค์กร
    <i class="w3-right material-icons nav-icon">arrow_drop_down</i>
  </a>

  <div id="nav-organSubMenu" style="display:none;">
    <ul style="list-style: none; ">
      <li><a href="#" class="w3-bar-item w3-button"><i class="material-icons nav-icon">account_balance</i> ข้อมูลองค์กร</a></li>
      <li><a href="#" class="w3-bar-item w3-button"><i class="material-icons nav-icon">group_work</i> โครงสร้างองค์กร</a></li>
    </ul>
  </div>
  <a href="#" class="w3-bar-item w3-button" (click)="openEmployeeMenu()"><i class="material-icons nav-icon">group</i>พนักงาน
  <i class="w3-right material-icons nav-icon">arrow_drop_down</i>
</a>

<div id="nav-emSubMenu" style="display:none;">
  <ul style="list-style: none; ">
    <li><a href="#" class="w3-bar-item w3-button"><i class="material-icons nav-icon">person</i> ข้อมูลพนักงาน</a>
    <li><a href="#" class="w3-bar-item w3-button"><i class="material-icons nav-icon">group</i> กำหนดกลุ่มเอง</a>
  </ul>
</div>

<a href="#" class="w3-bar-item w3-button" (click)="openTimeScheMenu()"><i class="material-icons nav-icon">schedule</i>เวลาทำงาน
  <i class="w3-right material-icons nav-icon">arrow_drop_down</i>
</a>

<div id="nav-scheduleSubMenu" style="display:none;">
  <ul style="list-style: none; ">
    <li><a href="#" class="w3-bar-item w3-button"><i class="material-icons nav-icon">person</i> กำหนดตารางเวลาการทำงาน</a>
    <li><a href="#" class="w3-bar-item w3-button"><i class="material-icons nav-icon">group</i> กำหนดระเบียบการลา</a>
    <li><a href="#" class="w3-bar-item w3-button"><i class="material-icons nav-icon">group</i> กำหนดวันหยุดประจำปี</a>
    <li><a href="#" class="w3-bar-item w3-button"><i class="material-icons nav-icon">group</i> ขอลาหยุด</a>
    <li><a href="#" class="w3-bar-item w3-button"><i class="material-icons nav-icon">group</i> เวลาเข้า-ออก</a>
  </ul>
</div>

<a href="#" class="w3-bar-item w3-button" (click)="openMoneyMenu()"><i class="material-icons nav-icon">monetization_on</i>เงินเดือน
  <i class="w3-right material-icons nav-icon">arrow_drop_down</i>
</a>

<div id="nav-moneySubMenu" style="display:none;">
  <ul style="list-style: none; ">
    <li><a href="#" class="w3-bar-item w3-button"><i class="material-icons nav-icon">person</i> องค์ประกอบเงินเดือน</a>
    <li><a href="#" class="w3-bar-item w3-button"><i class="material-icons nav-icon">group</i> โครงสร้างเงินเดือน</a>
    <li><a href="#" class="w3-bar-item w3-button"><i class="material-icons nav-icon">group</i> รอบการจ่ายเงิน</a>
    <li><a href="#" class="w3-bar-item w3-button"><i class="material-icons nav-icon">group</i> กำหนดรายได้</a>
    <li><a href="#" class="w3-bar-item w3-button"><i class="material-icons nav-icon">group</i> บันทึกรายได้ในรอบการจ่ายเงิน</a>
    <li><a href="#" class="w3-bar-item w3-button"><i class="material-icons nav-icon">group</i> อนุมัติการจ่ายเงิน</a>
  </ul>
</div>
<a href="#" class="w3-bar-item w3-button"><i class="material-icons nav-icon">build</i>ตั้งค่าการทำงาน</a>
<hr>
<a href="#" class="w3-bar-item w3-button"><i class="material-icons nav-icon">vpn_key</i>เปลี่ยนรหัสผ่าน</a>
<a class="w3-bar-item w3-button" ><i class="material-icons nav-icon" (click)="signOutEmployee()">lock</i>ออกจากระบบ</a>
</div>
<div class="pz-panel">
<div class="w3-container toolbar w3-padding-large ">
  <div class="w3-left header-container">
    <div class="w3-container header-text">ข้อมูลพนักงาน</div>
  </div>
  <div class="w3-right toolbar-button-container ">
    <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect"  id="sendLink"><i class="material-icons">send</i></button>
    <div class="mdl-tooltip" data-mdl-for="sendLink">ส่ง Link การลงทะเบียน</div>
    <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect" id="saveEm" (click)="onSave()"><i class="material-icons">done</i></button>
    <div class="mdl-tooltip" data-mdl-for="saveEm">บันทึกข้อมูลพนักงาน</div>
    <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect" id="cancelEdit" (click)="cancel()"><i class="material-icons">clear</i></button>
    <div class="mdl-tooltip" data-mdl-for="cancelEdit">ยกเลิกการแก้ไข</div>
  </div>
</div>
<div class="content">
<div class="left-nav">
   <div class="w3-container nav-toolbar w3-padding">
    <div class="nav-toolbar-search w3-border w3-round-xlarge w3-white w3-padding">
      <input id="nav-toolbar-search-input" class="w3-border-0 w3-hover-border-0" type="search">
      <div id="tt2" class="icon material-icons">search</div><div class="mdl-tooltip" data-mdl-for="tt2">ค้นหา</div>    
      <div id="tt1" class="icon material-icons">clear</div><div class="mdl-tooltip" data-mdl-for="tt1">ยกเลิกการค้นหา</div>
    </div>
    <div class="nav-toolbar-button">
      <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect" id="tt3" (click)="newEmployee()"><i class="material-icons">add</i></button>
      <div class="mdl-tooltip" data-mdl-for="tt3">เพิ่มพนักงาน</div>
    </div>
  </div>
  <div class="nav-item w3-padding scrollbar1" id="style-4">
  <div class="nav-content">
    <div id="nav-card" class="w3-panel w3-card-2"  *ngFor="let employee of employees; let i = index" (click)="onEmployeeClick(employee, i)">
      <img src="assets/Images/{{employee.id}}.jpg" class="w3-left w3-circle w3-margin-right avatar" alt=avatar>
      <div class="w3-left nav-content-info">
        <div class="info-title">
        {{ employee.nameTh }}  <br> {{ employee.surnameTh }}
        </div>
        <div class="info-subtitle">
          รหัสพนักงาน: {{ employee.empId }}
        </div>
      </div>
      <div class="w3-right w3-padding-16 ">
        <button class="w3-text-white mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect is-active"
        (click)="modal.open()" id="selectedRow">
         -
        </button>
        <div class="mdl-tooltip" data-mdl-for="selectedRow">ลบข้อมูลพนักงาน</div>
        <modal #modal>
        <modal-body>
          <div class="w3-row w3-padding-16">ต้องการลบข้อมูลของ {{ employee.nameTh }} {{ employee.surnameTh }}</div>
          <div class="w3-row">
            <div class="w3-right">
              <button class="mdl-button mdl-js-button" (click)="modal.close()">ยกเลิก</button>
              <button class="mdl-button mdl-js-button" (click)="removeEmployee()">ยืนยัน</button>
            </div>
          </div>
        </modal-body>
    </modal>
            

      </div>
    </div>
  </div>
</div> 
</div>
<div class="right-nav-content">
<div class="w3-tab">
  <button class="w3-bar-item w3-border-0" id="first-select">ข้อมูลส่วนบุคคล</button>
  <button class="w3-bar-item w3-border-0">การติดต่อ</button>
  <button class="w3-bar-item w3-border-0">ประวัติการทำงาน</button>
  <button class="w3-bar-item w3-border-0">ภาษี</button>
</div>

<div class="w3-border city input-tab-panel">
  <form class="w3-container scrollbar2" id="style-default" id="employeeInfo">
    <div class="w3-row w3-margin-top test-flex">
      <div style="position:relative;flex:0 0 200px;">
        <img src="assets/Images/{{employeeSelect.id}}.jpg" alt="Employee's picture for avatar" height="200px" width="200px" style="position:relative;flex:0 0 200px;height:200px;margin:20px 10px 0px 5px;"> 
        <div style="position:absolute;bottom:10px;right:10px;z-index:2">
          <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect" id="upload"><i class="material-icons">file_upload</i></button>
          <div class="mdl-tooltip" data-mdl-for="upload">upload รูปภาพ</div>
        </div>
      </div>
      <div style="flex:1 1 50%;display:flex;flex-flow:column;justify-content:flex-end;">
      <div class="w3-row">
        <div class="w3-container w3-col m5">
          <label class="w3-text"><b>รหัสพนักงาน</b></label>
          <input class="w3-input w3-border w3-round-large" type="text" [(ngModel)]="employeeSelect.empId" name="empId">
        </div>
        <div class="w3-container w3-col m7">
          <label class="w3-text"><b>คำนำหน้าชื่อ</b></label>
          <select class="w3-select w3-border w3-round-large" [(ngModel)]="employeeSelect.salutation" name="salutation">
            <option value="0">นาย</option>
            <option value="1">นาง</option>
            <option value="2">นางสาว</option>
            <option value="3">หม่อมหลวง</option>
            <option value="4">หม่อมราชวงศ์</option>
            <option value="5">หม่อมเจ้า</option>
          </select>
        </div>
      </div>
      <div class="w3-row">
        <div class="w3-container w3-col m5">
          <label class="w3-text"><b>ชื่อ (ไทย)</b></label>
          <input class="w3-input w3-border w3-round-large" type="text" [(ngModel)]="employeeSelect.nameTh" name="nameTh">
        </div>
        <div class="w3-container w3-col m7">
          <label class="w3-text"><b>นามสกุล (ไทย)</b></label>
          <input class="w3-input w3-border w3-round-large" type="text" [(ngModel)]="employeeSelect.surnameTh" name="surnameTh">
        </div>
      </div>
      <div class="w3-row">
        <div class="w3-container w3-col m5">
          <label class="w3-text"><b>ชื่อ (อังกฤษ)</b></label>
          <input class="w3-input w3-border w3-round-large" type="text" [(ngModel)]="employeeSelect.nameEn" name="nameEn">
        </div>
        <div class="w3-container w3-col m7">
          <label class="w3-text"><b>นามสกุล (อังกฤษ)</b></label>
          <input class="w3-input w3-border w3-round-large" type="text" [(ngModel)]="employeeSelect.surnameEn" name="surnameEn">
        </div>
      </div>
      </div>
    </div>
    <div class="w3-row">
      <div class="w3-container w3-col m4">
        <label class="w3-text"><b>วันเกิด</b></label>
        <input class="w3-input w3-border w3-round-large" type="date"  placeholder="employeeSelect.birthDate" [(ngModel)]="employeeSelect.birthDate" name="birthDate">
      </div>

      <div class="w3-container w3-col m2">
        <label class="w3-text"><b>สัญชาติ</b></label>
        <input class="w3-input w3-border w3-round-large" type="text" [(ngModel)]="employeeSelect.nationality" name="nationality">
      </div>
      <div class="w3-container w3-col m2">
        <label class="w3-text"><b>ศาสนา</b></label>
        <select class="w3-select w3-border w3-round-large" [(ngModel)]="employeeSelect.religion" name="religion">
            <option value="0">พุทธ</option>
            <option value="1">คริสต์</option>
            <option value="2">อิสลาม</option>
            <option value="3">ฮินดู</option>
            <option value="4">ซิกข์</option>
            <option value="5">อื่นๆ</option>
          </select>
      </div>
      <div class="w3-container w3-col m2">
        <label class="w3-text"><b>สถานะภาพ</b></label>
        <select class="w3-select w3-border w3-round-large" name="mariStatus">
            <option value="0">โสด</option>
            <option value="1">สมรส</option>
            <option value="2">หย่า</option>
            <option value="3">หม้าย</option>
            <option value="4">แยกกันอยู่</option>
          </select>
      </div>  
    </div>
    <div class="w3-row">
      <div class="w3-container w3-col m4">
        <label class="w3-text"><b>เลขบัตรประชาชน</b></label>
        <input class="w3-input w3-border w3-round-large" type="text" [(ngModel)]="employeeSelect.citizenId" name="citizenId">
      </div>
      <div class="w3-container w3-col m4">
        <label class="w3-text"><b>วันหมดอายุ</b></label>
        <input class="w3-input w3-border w3-round-large" type="text" placeholder="Select a date" name="idExpDate">
      </div>
      <div class="w3-container w3-col m4">
      </div>
    </div>
    <div class="w3-row">
      <div class="w3-container w3-col m4">
        <label class="w3-text"><b>วันที่เริ่มงาน</b></label>
        <input class="w3-input w3-border w3-round-large" type="text" placeholder="Select a date" name="citizenId">
      </div>
      <div class="w3-container w3-col m4">
        <label class="w3-text"><b>วันที่สิ้นสุดการทำงาน</b></label>
        <input class="w3-input w3-border w3-round-large" type="text" placeholder="Select a date">
      </div>
      <div class="w3-container w3-col m4">
      </div>
    </div>
    <div class="w3-row">
      <div class="w3-container w3-col m4">
        <label class="w3-text"><b>โทรศัพท์</b></label>
        <input class="w3-input w3-border w3-round-large" type="text" name="phone">
      </div>
      <div class="w3-container w3-col m4">
        <label class="w3-text"><b>อีเมล์</b></label>
        <input class="w3-input w3-border w3-round-large" type="text" name="email">
      </div>
      <div class="w3-container w3-col m4">
      </div>
    </div>
  </form>
</div>
</div>
</div>
</div>
  `,
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
  constructor(private employeeService:EmployeeService,private toastr: ToastsManager, vRef: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vRef);
    // console.log("s3---"+S3Service.getString('prozper.employees.by.faii','83e1e4f6-89e8-1a25-783b-47f78fb2c39d.jpg'));
    S3Service.getString('prozper.employees.by.faii','83e1e4f6-89e8-1a25-783b-47f78fb2c39d.jpg').then(data => {console.log(data)});
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
      // this.createDB();
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
    this.showSuccessDeleteEm();
    this.employeeSelect = this.employees[0];
    this.removeEmployeeToDB(this.employeeSelect);
  }
  removeEmployeeToDB(employee){
    var params = {TableName : "EmployeesCognito",
        Key : {
            empId : this.employeeSelect.empId,
        }};
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
            "ProjectionExpression" : "id,nameTh,surnameTh,empId"
        }
         DynamoDBService.scan(params).then(data=>{
          this.listEmployees(data);  
          console.log("list emp   "+data);
    })
      
 
}
  listEmployees(data){
      this.employees = data ;
      console.log('cjeack    '+this.employees[2].nameTh);
  }
}
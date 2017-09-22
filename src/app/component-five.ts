import { Component, OnInit, ViewChild,ViewContainerRef  } from '@angular/core';
import { ActivatedRoute ,Router} from '@angular/router';
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
  <body>
  <div class="title-bar w3-container">
  <button class="mdl-button mdl-js-button mdl-button--icon"><i class="material-icons" (click)="openNav()">menu</i></button>
  <img src="data:image/jpeg;base64,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">
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
<a class="w3-bar-item w3-button"><i class="material-icons nav-icon" (click)="signOutEmployee()" [routerLink]="['/component-three']">lock</i>ออกจากระบบ</a>
</div>
<div class="pz-panel">
<div class="w3-container toolbar w3-padding-large">
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
      <img src="{{employee.s3}}" class="w3-left w3-circle w3-margin-right avatar" alt=avatar>
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
</body>
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
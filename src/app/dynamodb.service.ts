import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { CognitoService } from './cognito.service';
import * as AWSCognito from 'amazon-cognito-identity-js';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';
import { Employee } from 'assets/Data/employee.types';
@Injectable()
export class DynamoDBService {  
  static employees: any;
  static dynamoDb = new AWS.DynamoDB({ region: "ap-southeast-1" });
  static docClient = new AWS.DynamoDB.DocumentClient({region: "ap-southeast-1"});
  // employees :Array<Employee>;
  static params;
  static employeeSelect;
  private static  config = {
    dev: {
      region: 'ap-southeast-1',
      apiVersion: '2012-08-10'
    },
    prod: {
      region: 'us-east-1',
      apiVersion: '2012-08-10'
    }
  };
  static newEmployee(){
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
  public static get(params): Promise<any> {
    return new Promise((resolve, reject) => {
      let dynamoDb = new AWS.DynamoDB({region: "ap-southeast-1"});
      let docClient = new AWS.DynamoDB.DocumentClient({region: "ap-southeast-1"});

      docClient.get(this.params, (getError, result) => {
        if (getError) {
          if (getError.code === 'CredentialsError') {
            console.log('Credentials is expired, refreshing credentials...');
            CognitoService.refreshCredentials().then(
              success => {
                docClient.get(this.params, (reGetError, result) => {
                  if (reGetError) {
                    reject(reGetError);
                  } else {
                    resolve(result);
                  }
                });
              },
              refreshError => {
                reject(refreshError);
              }
            );            
          } else {
            reject(getError);            
          }
        } else {
          resolve(result);
         
        }
      });
    });    
  }

  public static query(params): Promise<any> {
    return new Promise((resolve, reject) => {
      let dynamoDb = new AWS.DynamoDB({endpoint:"http://localhost:8000",region: "us-east-1",accessKeyId:"LKGEJPGJR",secretAccessKey: "fhoefek"});
      let docClient = new AWS.DynamoDB.DocumentClient({endpoint:"http://localhost:8000",region: "us-east-1",accessKeyId:"LKGEJPGJR",secretAccessKey: "fhoefek"});
      docClient.query(params, (queryError, result) => {
        if (queryError) {
          if (queryError.code === 'CredentialsError') {
            console.log('Credentials is expired, refreshing credentials...');
            CognitoService.refreshCredentials().then(
              success => {
                docClient.query(params, (reQueryError, result) => {
                  if (reQueryError) {
                    reject(reQueryError);
                  } else {
                    resolve(result);
                  }
                });
              },
              refreshError => {
                reject(refreshError);
              }
            );            
          } else {
            reject(queryError);            
          }
        } else {
          resolve(result);
        }
      });
    });    
  }
  public static scan(params): Promise<any> {
    return new Promise((resolve, reject) => {
      let dynamoDb = new AWS.DynamoDB({region: "ap-southeast-1"});
      let docClient = new AWS.DynamoDB.DocumentClient({region: "ap-southeast-1"});
      docClient.scan(params, (scanError, result) => {
        if (scanError) {
          if (scanError.code === 'CredentialsError') {
            console.log('Credentials is expired, refreshing credentials...');
            CognitoService.refreshCredentials().then(
              success => {
                docClient.scan(params, (reScanError, result) => {
                  if (reScanError) {
                    reject(reScanError);
                  } else {
                    resolve(result.Items);
                  }
                });
              },
              refreshError => {
                reject(refreshError);
              }
            );            
          } else {
            reject(scanError);            
          }
        } else {
          resolve(result.Items);
          //  console.log(result.Items);
        }
      });
    });    
  }
  public static put(params): Promise<any> {
    return new Promise((resolve, reject) => {
      let dynamoDb = new AWS.DynamoDB();
      let docClient = new AWS.DynamoDB.DocumentClient();
      docClient.put(params, (putError, result) => {
        if (putError) {
          // Check for expired credentials error
          if (putError.code === 'CredentialsError') {
            console.log('Credentials is expired, refreshing credentials...');
            // Refresh AWS credentials
            CognitoService.refreshCredentials().then(
              success => {
                // Getting data again
                docClient.put(params, (rePutError, result) => {
                  if (rePutError) {
                    reject(rePutError);
                  } else {
                    resolve('Success');
                  }
                });
              },
              refreshError => {
                reject(refreshError);
              }
            );            
          } else {
            reject(putError);            
          }
        } else {
          resolve('Success');
        }
      });
    });    
  }
  public static update(params): Promise<any> {
    return new Promise((resolve, reject) => {
      let dynamoDb = new AWS.DynamoDB({endpoint:"http://localhost:8000",region: "us-east-1",accessKeyId:"LKGEJPGJR",secretAccessKey: "fhoefek"});
      let docClient = new AWS.DynamoDB.DocumentClient({endpoint:"http://localhost:8000",region: "us-east-1",accessKeyId:"LKGEJPGJR",secretAccessKey: "fhoefek"});
      docClient.update(params, (updateError, result) => {
        if (updateError) {
          if (updateError.code === 'CredentialsError') {
            console.log('Credentials is expired, refreshing credentials...');
            CognitoService.refreshCredentials().then(
              success => {
                docClient.update(params, (reUpdateError, result) => {
                  if (reUpdateError) {
                    reject(reUpdateError);
                  } else {
                    resolve(result);
                  }
                });
              },
              refreshError => {
                reject(refreshError);
              }
            );
          } else {
            reject(updateError);
          }
        } else {
          resolve(result);
        }
      });
    });    
  }
  public static delete(params): Promise<any> {
    return new Promise((resolve, reject) => {
      let dynamoDb = new AWS.DynamoDB();
      let docClient = new AWS.DynamoDB.DocumentClient();
      docClient.delete(params, (delError, result) => {
        if (delError) {
          if (delError.code === 'CredentialsError') {
            console.log('Credentials is expired, refreshing credentials...');
            CognitoService.refreshCredentials().then(
              success => {
                docClient.delete(params, (reDelError, result) => {
                  if (reDelError) {
                    reject(reDelError);
                  } else {
                    resolve('Success');
                  }
                });
              },
              refreshError => {
                reject(refreshError);
              }
            );            
          } else {
            reject(delError);            
          }
        } else {
          resolve('Success');
          
        }
      });
    });    
  }
  
}
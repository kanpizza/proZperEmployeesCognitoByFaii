import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import * as _ from 'lodash';
import { CognitoService } from './cognito.service';
// import { Utility } from './utility.service';
const S3_REGION = 'ap-southeast-1'
@Injectable()
export class S3Service {
 

    public static encode(data)
    {
        var str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
        return btoa(str);
    }
  public static listObjects(bucketName: string, prefix: string): Promise<any> {
    let bucket = new AWS.S3({
      region: S3_REGION,
      params: { Bucket: bucketName }
    });
    let params = {
      Bucket: bucketName,
      Prefix: prefix
    };
    return new Promise((resolve, reject) => {
      bucket.listObjects(params, (error, data) => {
        if (error) {
          // Check for expired credentials error
          if (error.code === 'CredentialsError') {
            console.log('Credentials is expired, refreshing credentials...');
            // Refresh AWS credentials
            CognitoService.refreshCredentials().then(
              (success) => {
                // Get object list again
                bucket.listObjects(params, (error2, data) => {
                  if (error2) {
                    reject(error2);
                  } else {
                    resolve(data.Contents);
                  }
                });
              },
              (refreshError) => {
                reject(refreshError);
              }
            );            
          } else {
            reject(error);
          }
        } else {
          resolve(data.Contents);
        }
      });
    })
  }
  
  public static getString(bucketName: string, key: string): Promise<any> {
    let bucket = new AWS.S3({
      region: S3_REGION,
      params: { Bucket: bucketName }
    });
    let params = {
      Bucket: bucketName,
      Key: key
    };
    return new Promise((resolve, reject) => {
      bucket.getObject(params, (error, file: any) => {
        
        if (error) {
          // Check for expired credentials error
        //   if (error.code === 'CredentialsError') {
        //     // Refresh credentials
        //     CognitoService.refreshCredentials().then(
        //       success => {
        //         // Get object again
        //         bucket.getObject(params, (error2, file: any) => {
        //           if (error2) {
        //             reject(error2);
        //           } else {
        //             key  = "data:image/jpeg;base64," + this.encode(file.Body);
        //             resolve(key);
        //           }
        //         });
        //       },
        //       refreshError => {
        //         reject(refreshError);
        //       }
        //     );            
        //   } else {
            reject(error);
        //   }
        } else {
            key  = "data:image/jpeg;base64," + this.encode(file.Body);
            resolve(key);
          
        }
      })
    });
  }
  public static getJSON(bucketName: string, key: string): Promise<any>{
    let bucket = new AWS.S3({
      region: S3_REGION,
      params: { Bucket: bucketName }
    });
    let params = {
      Bucket: bucketName,
      Key: key
    };
    return new Promise((resolve, reject) => {
      bucket.getObject(params, (error, file: any) => {
        if (error) {
          // Check for expired credentials error
          if (error.code === 'CredentialsError') {
            // Refresh credentials
            CognitoService.refreshCredentials().then(
              success => {
                // Get object again
                bucket.getObject(params, (error2, file: any) => {
                  if (error2) {
                    reject(error2);
                  } else {
                    resolve(JSON.parse(new Buffer(file.Body).toString()));
                  }
                });
              },
              refreshError => {
                reject(refreshError);
              }
            );            
          } else {
            reject(error);
          }
        } else {
          resolve(JSON.parse(new Buffer(file.Body).toString()));
        }
      })
    });
  }
  public static put(bucketName: string, key: string, body: any): Promise<any> {
    let bucket = new AWS.S3({
      region: S3_REGION,
      params: { Bucket: bucketName }
    });
    let params = {
      Bucket: bucketName,
      Key: key,
      Body: body
    };
    return new Promise((resolve, reject) => {
      bucket.putObject(params, (error, response) => {
        if (error) {
          // Check for expired credentials error
          if (error.code === 'CredentialsError') {
            console.log('Credentials is expired, refreshing credentials...');
            // Refresh AWS credentials
            CognitoService.refreshCredentials().then(
              success => {
                // Put object again
                bucket.putObject(params, (error2, response) => {
                  if (error2) {
                    reject(error2);
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
            reject(error);
          }
        } else {
          resolve('Success');
        }
      });
    });
  }
  public static delete(bucketName: string, key: string): Promise<any> {
    let bucket = new AWS.S3({
      region: S3_REGION,
      params: { Bucket: bucketName }
    });
    let params = {
      Bucket: bucketName,
      Key: key
    };
    return new Promise((resolve, reject) => {
      bucket.deleteObject(params, (error, response) => {
        if (error) {
          // Check for expired credentials error
          if (error.code === 'CredentialsError') {
            console.log('Credentials is expired, refreshing credentials...');
            // Refresh AWS credentials
           CognitoService.refreshCredentials().then(
              success => {
                // Delete object again
                bucket.deleteObject(params, (error2, response) => {
                  if (error2) {
                    reject(error2);
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
            reject(error);
          }
        } else {
          resolve('Success');
        }
      });
    });
  }
}
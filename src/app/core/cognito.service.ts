import { Injectable } from '@angular/core';
declare let AWS:any;
import { AuthenticationDetails, CognitoUser, CognitoUserPool} from 'amazon-cognito-identity-js';
// import * as AWS from 'aws-sdk';
import * as AWSCognito from 'amazon-cognito-identity-js';
import { Http } from '@angular/http';
@Injectable()
export class CognitoService {

    public static isSignedIn: boolean;
    public static userAttributes:any = {};
    public static ready = false ;

    private static region = 'ap-southeast-1';
    private static identityPoolId = 'ap-southeast-1:080d6e85-7692-4fdf-93b6-99b6f86703ae';
    private static logins = {'cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_I7DmqS84G':''};
    private static credentialProvider = 'cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_I7DmqS84G';
    private static userPoolId = 'ap-southeast-1_I7DmqS84G';
    private static clientId = 'l1rd23b9i4o2b7d6qusvnbjr3';
    private static userPoolData = {
        UserPoolId :CognitoService.userPoolId,
        ClientId : CognitoService.clientId
    } ;
    constructor(private http: Http){

    }
    public static init(): Promise<any>{
        let signedIn = JSON.parse(sessionStorage.getItem('signedIn'));
        this.isSignedIn = signedIn;
        return new Promise((resolve, reject) => {
          AWS.config.region = this.region;
          let cognitoUser = this.getCurrentUser();
          if (cognitoUser && this.isSignedIn) {
            // Restore credentials after browser refresh
            cognitoUser.getSession((sessionError, tokens) => {
              if (tokens) {
                // Restore AWS credentials
                this.logins[this.credentialProvider] = tokens.getIdToken().getJwtToken();
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                  IdentityPoolId: this.identityPoolId,
                  Logins: this.logins
                });
                this.ready = true;
                resolve('Success - Current user is ' + cognitoUser.getUsername());
              } else
                reject(sessionError);
            });
          } else {
            this.isSignedIn = false;
            sessionStorage.setItem('signedIn', JSON.stringify(this.isSignedIn));
            this.ready = true;
            resolve('Success - No signed in user');
          }
        });
    }
    public static authenticate(userName: string, password: string): Promise<any> {
        AWS.config.region = 'ap-southeast-1';
        return new Promise((resolve, reject) => {
          let userPool = new CognitoUserPool(this.userPoolData);
          let cognitoUser = new CognitoUser({
            Username: userName,
            Pool: userPool
          });
          let authenDetails = new AuthenticationDetails({
            Username: userName,
            Password: password
          });
          // Authenticate user with AWS User Pool
          cognitoUser.authenticateUser(authenDetails, {
            onSuccess: (tokens) => {
              // Change credentials to authenticated identity
              this.logins[this.credentialProvider] = tokens.getIdToken().getJwtToken();
              AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: this.identityPoolId,
                Logins: this.logins
              });
              // Get AWS credentials
              AWS.config.credentials.clearCachedId();
              AWS.config.credentials.getPromise().then(
                () => {
                  // Retrieve user attributes
                  cognitoUser.getUserAttributes((getAttrError, attributes) => {
                    if (getAttrError) {
                      reject(getAttrError);
                    } else {
                      // Convert user attribute array to JSON
                      for (let i = 0; i < attributes.length; i++) {
                        this.userAttributes[attributes[i].getName()] = attributes[i].getValue();
                      }
                      this.isSignedIn = true;
                      sessionStorage.setItem('signedIn', JSON.stringify(this.isSignedIn));
                      resolve(AWS.config.credentials.identityId);
                    }
                  });
                },
                (getCredError) => { reject(getCredError); }
              );
            },
            onFailure: (authenError) => {
              reject(authenError);
            }
          });
        });
      }
      //-----------------------------------------
      // Method: signOut - Sign out from proZper
      //-----------------------------------------
      public static signOut(): void {
        console.log('sign out!!!!!!!');
        let cognitoUser = this.getCurrentUser();
        if (cognitoUser) {
          cognitoUser.signOut();
          this.userAttributes = {};
          this.isSignedIn = false;
          sessionStorage.setItem('signedIn', JSON.stringify(this.isSignedIn));
          
        }
      }
      //----------------------------------------------------------
      // Method: refreshCredentials - Refresh expired credentials
      //----------------------------------------------------------
      public static refreshCredentials(): Promise<any> {
        return new Promise((resolve, reject) => {
          let cognitoUser = this.getCurrentUser();
          if (cognitoUser) {
            cognitoUser.getSession((sessionError, tokens) => {
              if (tokens) {
                // Restore AWS credentials
                this.logins[this.credentialProvider] = tokens.getIdToken().getJwtToken();
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                  IdentityPoolId: this.identityPoolId,
                  Logins: this.logins
                });
                AWS.config.credentials.refreshPromise().then(
                  () => { resolve('Refresh Success'); },
                  (refreshError) => { reject(refreshError); }
                );
              } else
                reject(sessionError);
            });        
          } else {
            resolve('No User');
          }
        });
      }
      //-----------------------------------------------------------
      // Method: changePassword - Change the user sign in password
      //-----------------------------------------------------------
      public static changePassword(oldPassword: string, newPassword: string): Promise<any> {
        return new Promise((resolve, reject) => {
          let cognitoUser = this.getCurrentUser();
          if (cognitoUser) {
            cognitoUser.getSession((sessionError, session) => {
              if (session) {
                cognitoUser.changePassword(oldPassword, newPassword, (changePwdError, result) => {
                  if (changePwdError) {
                    reject(changePwdError);
                  } else {
                    resolve(result);
                  }
                });
              } else {
                reject(sessionError);
              }
            });
          } else {
            reject('No signed in user');
          }
        });
      }
      //---------------------------------------------------
      // Method: getAccessToken - Get Cognito access token
      //---------------------------------------------------
      public static getAccessToken(): Promise<any> {
        return new Promise((resolve, reject) => {
          this.getCurrentUser().getSession((sessionError, session) => {
            if (session.isValid()) {
              resolve(session.getAccessToken().getJwtToken());
            } else {
              if (sessionError) {
                reject('Cannot get access token because of session error: ' + JSON.stringify(sessionError, null, 2));
              } else {
                reject('Cannot get access token because of invalid session');
              }
            }
          });
        });
      }
      //-------------------------------------------
      // Method: getIdToken - Get Cognito ID token
      //-------------------------------------------
      public static getIdToken(): Promise<any> {
        return new Promise((resolve, reject) => {
          this.getCurrentUser().getSession((sessionError, session) => {
            if (session.isValie()) {
              resolve(session.getIdToken().getJwtToken());
            } else {
              if (sessionError) {
                reject('Cannot get ID token because of session error: ' + JSON.stringify(sessionError, null, 2));
              } else {
                reject('Cannot get ID token because of invalid session');
              }
            }
          });
        });
      }
      //-----------------------------------------------------
      // Method: getRefreshToken - Get Cognito refresh token
      //-----------------------------------------------------
      public static getRefreshToken(): Promise<any> {
        return new Promise((resolve, reject) => {
         this.getCurrentUser().getSession((sessionError, session) => {
            if (session.isValid()) {
              resolve(session.getRefreshToken());
            } else {
              if (sessionError) {
                reject('Cannot get refresh token because of session error: ' + JSON.stringify(sessionError, null, 2));
              } else {
                reject('Cannot get refresh token because of invalid session');
              }
            }
          });
        });
      }
      //--------------------------------------------------
      // Method: isReady - Check whether service is ready
      //--------------------------------------------------
      public static isReady(): Promise<string> {
        return new Promise((resolve, reject) => {
          let counter = 0;
          let checkInterval = setInterval(() => {
            counter = counter + 50;
            if (this.ready) {
              clearInterval(checkInterval);
              resolve('Ready');
            } else if (counter > 10000) {
              clearInterval(checkInterval);
              reject('Timeout');
            }
          }, 50);
        });
      }
      //----------------------------------------------------
      // Method: getCurrentUserName - Get current user name
      //----------------------------------------------------
      public static getCurrentUserName() {
        let cognitoUser = this.getUserPool().getCurrentUser();
        return cognitoUser ? cognitoUser.getUsername() : null;
      }
      //----------------------------------------------------
      // Method: getUserPool - Initialize Cognito user pool
      //----------------------------------------------------
      private static getUserPool() {
        return new CognitoUserPool(this.userPoolData);
      }
      //-----------------------------------------------------
      // Method: getCurrentUser - Get current signed in user
      //-----------------------------------------------------
      private static getCurrentUser() {
        return this.getUserPool().getCurrentUser();
      }
      //---------------------------------------------------
      // Method: getCognitoIdentity - Get Cognito identity
      //---------------------------------------------------
      private static getCognitoIdentity(): string {
        return AWS.config.credentials.identityId;
      }
}
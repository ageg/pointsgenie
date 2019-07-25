import request from "superagent";
import ResourceApi from "./ResourceApi";
import User from "../models/User";

class UserApi extends ResourceApi {
  static resourceUrl = "users";
  static resourceName = {
    singular: "user",
    plural: "users",
  };
  static Resource = User;

  changePassword(data) {
    const URL = `${this._getResourceUrl("me")}/password`;
    return this._doPost(URL, data).then(res => this._singleResourceResponse(res));
  }

  makeAdmin(id) {
    const URL = `${this._getResourceUrl(id)}/makeadmin`;
    return this._doPost(URL).then(res => this._singleResourceResponse(res));
  }

  fetchProfile(id) {
    const URL = `${this._getResourceUrl(id)}/fetchprofile`;
    return this._doPost(URL).then(res => this._singleResourceResponse(res));
  }

  // New code - Test
  createUser(data) {
    const URL = `/adduser/newuser`;
    return this._doPost(URL, data).then(res => this._singleResourceResponse(res));
  }

  addEmail(id, data) {
    const URL = `/adduser/addemail/${id}`;
    return this._doPost(URL, data).then(res => this._singleResourceResponse(res));
  }

  assignAuthorization(cip) {
    const URL = `/authorization/${cip}`;
    return this._doPost(URL).then(res => this._singleResourceResponse(res));
  }

  awardPoints({ id, ...data }) {
    const URL = `${this._getResourceUrl(id)}/awardpoints`;
    return this._doPost(URL, data).then(res => this._singleResourceResponse(res));
  }

  batchAwardPoints(data) {
    const URL = `${this._getResourceUrl()}/awardpoints`;
    return this._doPost(URL, data).then(res => this._multiResourceResponse(res));
  }
};


export default UserApi;

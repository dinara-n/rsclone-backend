export class AuthDto {
  mail;
  _id;
  role;

  constructor(model) {
    this.mail = model.data.mail;
    this._id = model._id;
    this.role = model.role || null;
  }
}

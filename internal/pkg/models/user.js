class User {
    constructor(id, login, role, email, organizationName, firstName, secondName, createdAt, updatedAt) {
      this.id = id;
      this.login = login;
      this.role = role;
      this.email = email;
      this.organizationName = organizationName;
      this.firstName = firstName;
      this.secondName = secondName;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }
  
  module.exports = User;
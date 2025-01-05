class SigninInput {
    constructor(login, password) {
      this.login = login;
      this.password = password;
    }
  }
  
  class SigninOutput {
    constructor(userInfo) {
      this.userInfo = userInfo;
    }
  }

  class SignupInput {
    constructor(login, password, email, organizationName, firstName, secondName) {
      this.login = login;
      this.password = password;
      this.email = email;
      this.organizationName = organizationName;
      this.firstName = firstName;
      this.secondName = secondName;
    }
  }
  
  class SignupOutput {
    constructor(userInfo) {
      this.userInfo = userInfo;
    }
  }
  
  module.exports = {
    SigninInput,
    SigninOutput,
    SignupInput,
    SignupOutput,
  };
trackerOwlsApp.service('User',function(){
  this.data = null;

  this.setData = function (user) {
    this.data = user;
  };

  this.hasData = function () {
    return this.data != null;
  };

  this.delete = function () {
    this.data = null;
  };

  this.getName = function(){
    return this.data.email;
  };
})

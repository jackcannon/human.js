function Human(p) {

  var self = this;
  this.x           = (p && p.x           && typeof p.x           === 'number')? p.x                         : 0;
  this.y           = (p && p.y           && typeof p.y           === 'number')? p.y                         : 0;
  this.gender      = (p && p.gender      && typeof p.gender      === 'string')? p.gender.toLowerCase()      : 'male';
  this.orientation = (p && p.orientation && typeof p.orientation === 'string')? p.orientation.toLowerCase() : 'right';

  this.name        = (p && p.name        && typeof p.name        === 'string')? p.name                      : HumanJsUtils.name(this.gender);

  this.points = {
    pelvis: {
      long: 0,
      angle: 0,
      connects: []
    },
    neck: {
      long: 50,
      angle: 0,
      connects: [
        'pelvis'
      ]
    },


    rightEar: {
      long: 15,
      angle: 0.125,
      connects: [
        'neck'
      ]
    },
    leftEar: {
      long: 15,
      angle: 0.875,
      connects: [
        'neck'
      ]
    },
    crown: {
      long: 15,
      angle: 0.875,
      connects: [
        'rightEar',
        'leftEar'
      ]
    },


    rightShoulder: {
      long: 10,
      angle: 0.25,
      connects: [
        'neck'
      ]
    },
    rightElbow: {
      long: 25,
      angle: 0.48,
      connects: [
        'rightShoulder'
      ]
    },
    rightWrist: {
      long: 25,
      angle: 0.52,
      connects: [
        'rightElbow'
      ]
    },
    rightKnee: {
      long: 30,
      angle: 0.45,
      connects: [
        'pelvis'
      ]
    },
    rightAnkle: {
      long: 30,
      angle: 0.50,
      connects: [
        'rightKnee'
      ]
    },
    rightToe: {
      long: 5,
      angle: 0.25,
      connects: [
        'rightAnkle'
      ]
    },


    leftShoulder: {
      long: 10,
      angle: 0.75,
      connects: [
        'neck'
      ]
    },
    leftElbow: {
      long: 25,
      angle: 0.52,
      connects: [
        'leftShoulder'
      ]
    },
    leftWrist: {
      long: 25,
      angle: 0.48,
      connects: [
        'leftElbow'
      ]
    },
    leftKnee: {
      long: 30,
      angle: 0.55,
      connects: [
        'pelvis'
      ]
    },
    leftAnkle: {
      long: 30,
      angle: 0.50,
      connects: [
        'leftKnee'
      ]
    },
    leftToe: {
      long: 5,
      angle: 0.75,
      connects: [
        'leftAnkle'
      ]
    }
  }

  this.defaults = HumanJsUtils.clone(this.points);

  this.perform_old = function (tasks) { // tasks should be an array of things to do.
    var self = this;
    async.map(tasks, function(item, cb) {
      cb(null, function (callback) {
        setTimeout(function () {
          item.func.bind(this)();
          callback(null);
        }.bind(this), item.timer);
      }.bind(self));
    }, function(err, results) {

      async.series(results, function (err, results) {});

    });
  }

  this.perform = function (tasks) { // tasks should be an array of things to do.
    var self = this;
    async.map(tasks, function(item, cb) {
      cb(null, function (callback) {
        setTimeout(function () {
          item.func.bind(this)(callback);
          // callback(null);
        }.bind(this), item.timer);
      }.bind(self));
    }, function(err, results) {

      async.series(results, function (err, results) {});

    });
  }

  this.tween = function (point, newValue, time, cb) {
    var self = this;
    if(typeof newValue === 'undefined') return;
    if(typeof self.points[point] === 'undefined') return;
    if(typeof time === 'undefined') var time = 500;
    if(typeof cb === 'undefined') var cb = function() {};

    if(typeof newValue === 'string') {
      if(!newValue.long) {
        newValue.long = self.points[point].long;
      }
      if(!newValue.angle) {
        newValue.angle = self.points[point].angle;
      }
      if(!newValue.connects) {
        newValue.connects = self.points[point].connects;
      }
    } else if(typeof newValue === 'number') {
      newValue = {
        long: self.points[point].long,
        angle: newValue,
        connects: self.points[point].connects
      }
    }
    var oldValue = self.points[point];

    var numbers = [];
    for(var i = 1; i < 11; i++) {
      numbers.push(i);
    }
    async.map(numbers, function (item, callback) {
      callback(null, function (clbck) {
        var item = this.item;
        setTimeout(function() {

          var diff = oldValue.angle - newValue.angle;

          if(diff > 0.5 || diff < -0.5) {
            a = (diff < 0) ? oldValue.angle + 2 : oldValue.angle + 1 ;
            b = (diff > 0) ? newValue.angle + 2 : newValue.angle + 1 ;
          }

          if(diff > 0.5 || diff < -0.5) {
            var newAngle = (a + (((b - a) / 10) * item)) % 1;
          } else {
            var newAngle = oldValue.angle + (((newValue.angle - oldValue.angle) / 10) * item);
          }

          self.points[point] = {
            long: oldValue.long + (((newValue.long - oldValue.long) / 10) * item),
            angle: newAngle,
            connects: newValue.connects
          }
          clbck();
        }, (time / 10));
      }.bind({item: item}));
    }, function (err, results) {
      async.series(results, cb);
    });
  }

  
  this.reset = function () {
    this.points = HumanJsUtils.clone(this.defaults);
  }

  this.tapFoot = function(foot) {
    var timer = setInterval(function () {
      var current = this.points[this.orientation + 'Toe'].angle;
      if(current == 0.2) {
        this.points[this.orientation + 'Toe'].angle = 0.25;
      } else {
        this.points[this.orientation + 'Toe'].angle = 0.2;
      }
    }.bind(this), 500);
  }
  this.moveHand = function () {
    this.points.rightWrist.angle = 0.01;
  }
  this.wave_old = function () {
    var useElbow = this.orientation + "Elbow";
    var useWrist = this.orientation + "Wrist";
    var returnElbow = this.points[useElbow].angle;
    var returnWrist = this.points[useWrist].angle;
    var newp = {
      elbow: 0.4,
      wrist1: 0.95,
      wrist2: 0.1
    }

    if(this.orientation == 'left') {
      var newp = HumanJsUtils.flipHor(newp);
    }

    this.perform_old([
      {
        func: function() {
          this.points[useWrist].angle = newp.wrist1;
          this.points[useElbow].angle = newp.elbow;
        },
        timer: 200
      },
      {
        func: function() {
          this.points[useWrist].angle = newp.wrist2;
        },
        timer: 200
      },
      {
        func: function() {
          this.points[useWrist].angle = newp.wrist1;
        },
        timer: 200
      },
      {
        func: function() {
          this.points[useWrist].angle = newp.wrist2;
        },
        timer: 200
      },
      {
        func: function() {
          this.points[useWrist].angle = returnWrist;
          this.points[useElbow].angle = returnElbow;
        },
        timer: 200
      }
    ]);
  }
  this.wave = function () {
    var self = this;
    var use = {
      elbow: this.orientation + "Elbow",
      wrist: this.orientation + "Wrist"
    }
    var oldp = {
      elbow: this.points[use.elbow].angle,
      wrist: this.points[use.wrist].angle
    }
    var newp = {
      elbow: 0.4,
      wrist1: 0.95,
      wrist2: 0.1
    }

    if(this.orientation == 'left') {
      var newp = HumanJsUtils.flipHor(newp);
    }

    this.perform([
      {
        func: function(cb) {
          HumanJsUtils.multiTween([
            {point: use.wrist, value: newp.wrist2, timer: 300},
            {point: use.elbow, value: newp.elbow, timer: 300}
          ], self, cb);
        },
        timer: 0
      },
      {
        func: function(cb) {
          self.tween(use.wrist, newp.wrist1, 200, cb);
        },
        timer: 0
      },
      {
        func: function(cb) {
          self.tween(use.wrist, newp.wrist2, 200, cb);
        },
        timer: 0
      },
      {
        func: function(cb) {
          self.tween(use.wrist, newp.wrist1, 200, cb);
        },
        timer: 0
      },
      {
        func: function(cb) {
          self.tween(use.wrist, newp.wrist2, 200, cb);
        },
        timer: 0
      },
      {
        func: function(cb) {
          HumanJsUtils.multiTween([
            {point: use.wrist, value: oldp.wrist, timer: 300},
            {point: use.elbow, value: oldp.elbow, timer: 300}
          ], self, cb);
        },
        timer: 0
      }
    ]);
  }

}

var HumanJsUtils = {
  clone: function (obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  flipHor: function (obj) {
    var reply = {};
    for(var p in obj) {
      reply[p] = 1 - obj[p];
    }
    return reply;
  },
  name: function(gender) {
    var names = {
      male: ['Liam', 'Ethan', 'Noah', 'Mason', 'Jacob', 'Jack', 'Aiden', 'Logan', 'Jackson', 'Lucas', 'Benjamin', 'William', 'Ryan', 'Jayden', 'James', 'Alexander', 'Michael', 'Elijah', 'Matthew', 'Joshua', 'Luke', 'Owen', 'Daniel', 'Oliver', 'Dylan', 'Nathan', 'Gabriel', 'Carter', 'Caleb', 'Henry', 'Andrew', 'Eli', 'Max', 'Evan', 'Landon', 'Gavin', 'Samuel', 'Isaac', 'Connor', 'Tyler'],
      female: ['Emma', 'Olivia', 'Sophia', 'Ava', 'Isabella', 'Mia', 'Ella', 'Emily', 'Lily', 'Chloe', 'Madison', 'Abigail', 'Amelia', 'Charlotte', 'Avery', 'Harper', 'Addison', 'Sofia', 'Hannah', 'Grace', 'Sophie', 'Zoe', 'Zoey', 'Aubrey', 'Natalie', 'Elizabeth', 'Brooklyn', 'Audrey', 'Lucy', 'Evelyn', 'Layla', 'Claire', 'Anna', 'Lillian', 'Ellie', 'Samantha', 'Maya', 'Stella', 'Victoria', 'Riley']
    }
    var random = Math.floor(Math.random() * 40);
    return names[gender][random];
  },
  multiTween: function (arr, human, clbck) { // arr is array of object: point, value, timer
    async.map(arr, function (item, callback) {
      callback(null, function (cb) {
        human.tween(item.point, item.value, item.timer, cb)
      });
    }, function (err, results) {
      async.parallel(results, clbck);
    })
  }
}

if (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined') {
  var async = require('async');
}

var Human = (function () {
  function Human(p) {
    var self = this;
    this.x           = (p && p.x           && typeof p.x           === 'number')? p.x                         : 0;
    this.y           = (p && p.y           && typeof p.y           === 'number')? p.y                         : 0;
    this.gender      = (p && p.gender      && typeof p.gender      === 'string')? p.gender.toLowerCase()      : 'male';
    this.orientation = (p && p.orientation && typeof p.orientation === 'string')? p.orientation.toLowerCase() : 'right';
    this.universe    = (p && p.universe    && typeof p.universe    === 'object')? p.universe                  : null;

    this.name        = (p && p.name        && typeof p.name        === 'string')? p.name                      : HumanJsUtils.name(this.gender);

    this.saying = '';

    this.behaviour = {
      ignore: false,
      base: 'rightAnkle'
    }

    this.points = {
      pelvis: {
        long: 30,
        angle: 0.95,
        connects: [
          'rightKnee'
        ]
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
        angle: 0,
        connects: [
          'rightAnkle'
        ]
      },
      rightAnkle: {
        long: 0,
        angle: 0.0,
        connects: []
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

    this.getCoor = function(point) {
      var human = this;
      if(!human.points[point]) return false;

      function getPoint(baseX, baseY, long, angle) {
        var x = baseX + Math.sin(angle * 2 * Math.PI) * long;
        var y = baseY - Math.cos(angle * 2 * Math.PI) * long;

        return {x: x, y: y}
      }

      if (human.points[point].connects instanceof Array && human.points[point].connects.length > 0) {
        var base = human.getCoor(human.points[point].connects[0]);
      } else {
        var base = human;
      }
      return getPoint(base.x, base.y, human.points[point].long, human.points[point].angle);

      // if(obj.connects instanceof Array && obj.connects.length > 0) {
      //   var base = getPointFromObj(list[obj.connects[0]], list, base);
      //   return getPoint(base.x, base.y, obj.long, obj.angle);
      // } else {
      //   return getPoint(base.x, base.y, obj.long, obj.angle);
      // }
    }

    this.defaults = HumanJsUtils.clone(this.points);

    this.events = {};
    this.eventListeners = {};

    this.doing = [];



    this.fireEvent = function (event, value, sf) { //sf == start/finish
      var self = this;

      if(self.behaviour.ignore !== true) { //temp setting ignore events to true if not already!
        var oldIgnore = self.behaviour.ignore;
        self.behaviour.ignore = true;

        setTimeout(function () {
          self.behaviour.ignore = oldIgnore;
        }, 300);
      }

      var eObj = {
        target: self,
        action: event,
        value: value,
        at: sf
      }

      if (typeof self.universe === 'undefined') return;
      for(var i in self.universe) {
        if (self.universe[i] && self.universe[i] instanceof Human && self.universe[i] !== self && self.universe[i].eventListeners && self.universe[i].eventListeners[event] && typeof self.universe[i].eventListeners[event] === 'function') {
          self.universe[i].eventListeners[event].bind(self.universe[i])(eObj);
        }
      }
    }

    this.addListener = function (event, func) {
      this.eventListeners[event] = func;
    }

    this.removeListener = function (event) {
      if(this.eventListeners && this.eventListeners[event]) delete this.eventListeners[event];
    }

    // this.addListener('wave', function (event) {
    //   if(this.behaviour.ignore !== true) this.say('Hello ' + event.target.name);
    // });

    this.addListener('say', function (event) {
      var self = this;
      // if(this.behaviour.ignore !== true) setTimeout(function () { self.say('You say something, ' + event.target.name + '?') }, 500);
      var val = event.value;
      // console.log(this.name, event.at, event.action, val);
      // console.log(event.at == 'start', '&&', HumanJsUtils.contains(val, 'lets'), '&&', HumanJsUtils.contains(val, 'dance'));
      if(event.at == 'start' && HumanJsUtils.contains(val, 'lets') && HumanJsUtils.contains(val, 'dance')) {
        
        this.addListener('dance', function (e) {
          if(e.at == 'start') {
            this.dance();
            this.removeListener('dance');
          }
        });
        
      }
    });



    this.startDoing = function (act, value) {
      if( !( this.isDoing(act) ) ) {
        this.doing.push(act);
      }
      this.fireEvent(act, value, 'start');
    }

    this.finishDoing = function (act, value) { // pass in value as null to fire event
      var index = HumanJsUtils.inArray(act, this.doing);
      if( this.isDoing(act) ) {
        this.doing.splice(index, 1);
      }
      this.fireEvent(act, value, 'finish');
    }

    this.isDoing = function (act) {
      return !!( HumanJsUtils.inArray(act, this.doing) !== -1 );
    }



    this.perform = function (tasks) { // tasks should be an array of things to do.
      var self = this;
      async.map(tasks, function(item, cb) {
        cb(null, function (callback) {
          setTimeout(function () {
            item.func.bind(this)(callback);
            // callback(null);
          }.bind(this), (typeof item.timer !== 'undefined') ? item.timer : 0);
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

      if(typeof newValue === 'object') {
        if(typeof newValue.long === 'undefined') {
          newValue.long = self.points[point].long;
        }
        if(typeof newValue.angle === 'undefined') {
          newValue.angle = self.points[point].angle;
        }
        if(typeof newValue.connects === 'undefined') {
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

    this.say = function () {
      var self = this;
      var text = Array.prototype.slice.call(arguments, 0).join('. ');
      var sentences = text.replace(/\.{1,}\s{0,}/g, '.{BREAK}').replace(/\!{1,}\s{0,}/g, '!{BREAK}').replace(/\?{1,}\s{0,}/g, '?{BREAK}').split('{BREAK}');
      var arr = [];
      async.map(sentences, function(item, callback) {
        var number = HumanJsUtils.inArray(item, sentences);
        callback(null, {
          func: function (cb) {
            this.saying = item.toString();
            this.startDoing('say', item.toString());
            cb();
          },
          timer: (number > 0) ? sentences[number - 1].split(' ').length * 500 : 0
        });
      }, function (err, results) {
        results.push({ // last action. Clean up here
          func: function (cb) {
            this.saying = '';
            this.finishDoing('say');
            cb();
          },
          timer: sentences[sentences.length - 1].split(' ').length * 500
        });
        self.perform(results);
      });
    }

    this.face = function(direction) {
      if(direction !== 'front' && direction !== 'left' && direction !== 'right') return;

      if(direction == 'front') {
        var newp = {
          leftShoulder: {
            long: 10
          },
          rightShoulder: {
            long: 10
          },
          leftToe: 0.75,
          rightToe: 0.25,
          leftKnee: 0.55,
          rightKnee: 0.45,
          leftAnkle: 0.5,
          rightAnkle: 0.5
        }
      } else {
        var newp = {
          leftShoulder: {
            long: 5
          },
          rightShoulder: {
            long: 5
          },
          leftToe: 0.25,
          rightToe: 0.25,
          leftKnee: 0.52,
          rightKnee: 0.48,
          leftAnkle: 0.52,
          rightAnkle: 0.52
        }

        if(direction == 'left') {
          var newp = HumanJsUtils.flipHor(newp);
          var old = newp;
          var newp = HumanJsUtils.flipTraits(newp);
        }
      }

      this.perform([
        {
          timer: 0,
          func: function(cb) {
            HumanJsUtils.multiTween([
              {point: 'leftShoulder', value: newp.leftShoulder, timer: 300},
              {point: 'rightShoulder', value: newp.rightShoulder, timer: 300},
              {point: 'leftKnee', value: newp.leftKnee, timer: 300},
              {point: 'rightKnee', value: newp.rightKnee, timer: 300},
              {point: 'leftAnkle', value: newp.leftAnkle, timer: 300},
              {point: 'rightAnkle', value: newp.rightAnkle, timer: 300},
              {point: 'leftToe', value: newp.leftToe, timer: 0},
              {point: 'rightToe', value: newp.rightToe, timer: 0}
            ], self, cb);
          }
        }
      ]);
    }

    this.wave = function () {
      var self = this;
      if(this.isDoing('wave')) return;
      this.startDoing('wave');
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
          timer: 0,
          func: function(cb) {
            HumanJsUtils.multiTween([
              {point: use.wrist, value: newp.wrist2, timer: 300},
              {point: use.elbow, value: newp.elbow, timer: 300}
            ], self, cb);
          }
        },
        {
          timer: 0,
          func: function(cb) {
            self.tween(use.wrist, newp.wrist1, 200, cb);
          }
        },
        {
          timer: 0,
          func: function(cb) {
            self.tween(use.wrist, newp.wrist2, 200, cb);
          }
        },
        {
          timer: 0,
          func: function(cb) {
            self.tween(use.wrist, newp.wrist1, 200, cb);
          }
        },
        {
          timer: 0,
          func: function(cb) {
            self.tween(use.wrist, newp.wrist2, 200, cb);
          }
        },
        {
          timer: 0,
          func: function(cb) {
            HumanJsUtils.multiTween([
              {point: use.wrist, value: oldp.wrist, timer: 300},
              {point: use.elbow, value: oldp.elbow, timer: 300}
            ], self, function () {
              self.finishDoing('wave');
              cb();
            });
          }
        }
      ]);
    }

    this.dance = function (type) {
      var dances = ['robot'];
      if(!type) return this[dances[Math.floor(Math.random() * dances.length)]]();
      if(HumanJsUtils.inArray(type, dances) !== -1) {
        return this[type]();
      }
    }

    this.robot = function () {
      var self = this;
      var oldp = HumanJsUtils.clone(this.points);
      var oldl = {x: this.x, y: this.y};

      if(this.isDoing('robot') || this.isDoing('dance')) return;
      this.startDoing('robot');
      this.startDoing('dance');

      this.perform([
        {
          timer: 100,
          func: function (cb) {
            HumanJsUtils.multiTween([
              {point: 'rightShoulder', value: 0.2, timer: 250},
              {point: 'leftShoulder', value: 0.8, timer: 250},
              {point: 'rightElbow', value: 0.4, timer: 500},
              {point: 'leftElbow', value: 0.6, timer: 500},
              {point: 'rightWrist', value: 0.6, timer: 500},
              {point: 'leftWrist', value: 0.2, timer: 500}
            ], self, function () {
              HumanJsUtils.multiTween([
                {point: 'rightShoulder', value: 0.25, timer: 100},
                {point: 'leftShoulder', value: 0.75, timer: 100}
              ], self, cb);
            });
          }
        },
        {
          timer: 100,
          func: function (cb) {
            HumanJsUtils.multiTween([
              {point: 'rightShoulder', value: 0.2, timer: 250},
              {point: 'leftShoulder', value: 0.8, timer: 250},
              {point: 'neck', value: 0.01, timer: 500},
              {point: 'rightElbow', value: 0.4, timer: 500},
              {point: 'leftElbow', value: 0.65, timer: 500},
              {point: 'rightWrist', value: 0.95, timer: 500},
              {point: 'leftWrist', value: 0.5, timer: 500}
            ], self, function () {
              HumanJsUtils.multiTween([
                {point: 'rightShoulder', value: 0.25, timer: 100},
                {point: 'leftShoulder', value: 0.75, timer: 100}
              ], self, cb);
            });
          }
        },
        {
          timer: 100,
          func: function (cb) {
            HumanJsUtils.multiTween([
              {point: 'rightShoulder', value: 0.2, timer: 250},
              {point: 'leftShoulder', value: 0.8, timer: 250},
              {point: 'neck', value: 0.99, timer: 500},
              {point: 'rightElbow', value: 0.45, timer: 500},
              {point: 'leftElbow', value: 0.75, timer: 500},
              {point: 'rightWrist', value: 0.25, timer: 500},
              {point: 'leftWrist', value: 0.33, timer: 500}
            ], self, function () {
              HumanJsUtils.multiTween([
                {point: 'rightShoulder', value: 0.25, timer: 100},
                {point: 'leftShoulder', value: 0.75, timer: 100}
              ], self, cb);
            });
          }
        },
        {
          timer: 100,
          func: function (cb) {
            HumanJsUtils.multiTween([
              {point: 'rightShoulder', value: 0.2, timer: 250},
              {point: 'leftShoulder', value: 0.8, timer: 250},
              {point: 'neck', value: 0.01, timer: 500},
              {point: 'rightElbow', value: 0.5, timer: 500},
              {point: 'leftElbow', value: 0.55, timer: 500},
              {point: 'rightWrist', value: 0.125, timer: 500},
              {point: 'leftWrist', value: 0.5, timer: 500}
            ], self, function () {
              HumanJsUtils.multiTween([
                {point: 'rightShoulder', value: 0.25, timer: 100},
                {point: 'leftShoulder', value: 0.75, timer: 100}
              ], self, cb);
            });
          }
        },
        {
          timer: 100,
          func: function (cb) {
            HumanJsUtils.multiTween([
              {point: 'rightShoulder', value: 0.2, timer: 250},
              {point: 'leftShoulder', value: 0.8, timer: 250},
              {point: 'neck', value: 0.99, timer: 500},
              {point: 'rightElbow', value: 0.5, timer: 500},
              {point: 'leftElbow', value: 0.5, timer: 500},
              {point: 'rightWrist', value: 0.97, timer: 500},
              {point: 'leftWrist', value: 0.03, timer: 500}
            ], self, function () {
              HumanJsUtils.multiTween([
                {point: 'rightShoulder', value: 0.25, timer: 100},
                {point: 'leftShoulder', value: 0.75, timer: 100}
              ], self, cb);
            });
          }
        },
        {
          timer: 100,
          func: function (cb) {
            HumanJsUtils.multiTween([
              {point: 'rightShoulder', value: 0.2, timer: 250},
              {point: 'leftShoulder', value: 0.8, timer: 250},
              {point: 'neck', value: 0.01, timer: 500},
              {point: 'rightElbow', value: 0.4, timer: 500},
              {point: 'leftElbow', value: 0.51, timer: 500},
              {point: 'rightWrist', value: 0.75, timer: 500},
              {point: 'leftWrist', value: 0, timer: 500}
            ], self, function () {
              HumanJsUtils.multiTween([
                {point: 'rightShoulder', value: 0.25, timer: 100},
                {point: 'leftShoulder', value: 0.75, timer: 100}
              ], self, cb);
            });
          }
        },
        {
          timer: 100,
          func: function (cb) {
            HumanJsUtils.multiTween(oldp, self, function () {
              self.finishDoing('robot');
              self.finishDoing('dance');
              cb();
            });
          }
        }
      ]);
    }

    this.test = function () {
      var self = this;
      var oldp = HumanJsUtils.clone(this.points);
      var oldl = {x: this.x, y: this.y};

      this.perform([
        {
          timer: 100,
          func: function (cb) {
            HumanJsUtils.multiTween([
              {point: 'rightElbow', value: 0.45, timer: 500},
              {point: 'rightWrist', value: 0.15, timer: 500},
            ], self, cb);
          }
        },
        {
          timer: 100,
          func: function (cb) {
            HumanJsUtils.multiTween([
              {point: 'rightElbow', value: 0.15, timer: 500},
              {point: 'rightWrist', value: 0.45, timer: 500}
            ], self, cb);
          }
        },
        {
          timer: 100,
          func: function (cb) {
            HumanJsUtils.multiTween([
              {point: 'rightElbow', value: 0.25, timer: 500},
              {point: 'rightWrist', value: 0.27, timer: 500}
            ], self, cb);
          }
        },
        {
          timer: 1500,
          func: function (cb) {
            HumanJsUtils.multiTween(oldp, self, cb);
          }
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
        if (typeof obj[p] == 'number') {
          reply[p] = 1 - obj[p];
        } else {
          reply[p] = HumanJsUtils.clone(obj[p]);
          if (reply[p] && reply[p].angle) reply[p].angle = 1 - reply[p].angle;
        }
      }
      return reply;
    },
    flipTraits: function (obj) { //flips left and right traits
      var obj = HumanJsUtils.clone(obj);
      var left = [];
      var right = [];
      for(var i in obj) {
        if(/^right/i.test(i)) {
          left.push({prop: i.replace('right',''), val: obj[i]});
          delete obj[i];
        } else if (/^left/i.test(i)) {
          right.push({prop: i.replace('left',''), val: obj[i]});
          delete obj[i]
        }
      }

      for(var i in left) {
        obj['left' + left[i].prop] = left[i].val;
      }
      for(var i in right) {
        obj['right' + right[i].prop] = right[i].val;
      }

      return obj;
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

      if(!(arr instanceof Array)) {
        var newArr = [];
        for(var i in arr) {
          newArr.push({point: i, value: arr[i], timer: 300});
        }
        arr = newArr;
      }

      async.map(arr, function (item, callback) {
        callback(null, function (cb) {
          human.tween(item.point, item.value, item.timer, cb)
        });
      }, function (err, results) {
        async.parallel(results, clbck);
      })
    },
    inArray: function (item, arr) { // TODO: use indexOf ????
      for(var i in arr) {
        if(arr[i] === item) {
          return (parseInt(i) !== 'NaN')? parseInt(i) : -1 ;
        }
      }
      return -1;
    },
    contains: function (ins, key, ignoreCase) { // for strings
      if(!ins || !key) return false;
      if(typeof ignoreCase === 'undefined') var ignoreCase = true;
      if(ignoreCase) {
        ins = ins.toLowerCase();
        key = key.toLowerCase();
      }
      ins = HumanJsUtils.removePunc(ins);
      key = HumanJsUtils.removePunc(key);
      return !!(ins.indexOf(key) !== -1);
    },
    removePunc: function (str) {
      return str.replace(/[^a-zA-Z0-9\s]/gi, '');
    }
  }

  // Node.js
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Human;
  }
  // Browser
  else {
    return Human;
  }

})();
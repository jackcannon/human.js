
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
      ignore: false
    };

    this.points = {
      pelvis: {
        length: 0,
        angle: 0,
        connects: []
      },
      neck: {
        length: 42,
        angle: 0,
        connects: [
          'pelvis'
        ]
      },


      rightEar: {
        length: 15,
        angle: 0.125,
        connects: [
          'neck'
        ]
      },
      leftEar: {
        length: 15,
        angle: 0.875,
        connects: [
          'neck'
        ]
      },
      crown: {
        length: 15,
        angle: 0.875,
        connects: [
          'rightEar',
          'leftEar'
        ]
      },


      rightShoulder: {
        length: 10,
        angle: 0.25,
        connects: [
          'neck'
        ]
      },
      rightElbow: {
        length: 25,
        angle: 0.48,
        connects: [
          'rightShoulder'
        ]
      },
      rightWrist: {
        length: 25,
        angle: 0.52,
        connects: [
          'rightElbow'
        ]
      },
      rightKnee: {
        length: 30,
        angle: 0.45,
        connects: [
          'pelvis'
        ]
      },
      rightAnkle: {
        length: 30,
        angle: 0.50,
        connects: [
          'rightKnee'
        ]
      },
      rightToe: {
        length: 5,
        angle: 0.25,
        connects: [
          'rightAnkle'
        ]
      },


      leftShoulder: {
        length: 10,
        angle: 0.75,
        connects: [
          'neck'
        ]
      },
      leftElbow: {
        length: 25,
        angle: 0.52,
        connects: [
          'leftShoulder'
        ]
      },
      leftWrist: {
        length: 25,
        angle: 0.48,
        connects: [
          'leftElbow'
        ]
      },
      leftKnee: {
        length: 30,
        angle: 0.55,
        connects: [
          'pelvis'
        ]
      },
      leftAnkle: {
        length: 30,
        angle: 0.50,
        connects: [
          'leftKnee'
        ]
      },
      leftToe: {
        length: 5,
        angle: 0.75,
        connects: [
          'leftAnkle'
        ]
      }
    };
    this.defaults = HumanJsUtils.clone(this.points);

    this.getCoor = function(point, addPosition) {
      var human = this;
      if(!human.points[point]) return false;
      if(typeof addPosition !== 'boolean') var addPosition = true;

      function getPoint(baseX, baseY, length, angle) {
        var x = baseX + Math.sin(angle * 2 * Math.PI) * length;
        var y = baseY - Math.cos(angle * 2 * Math.PI) * length;

        return {x: x, y: y}
      }

      if (human.points[point].connects instanceof Array && human.points[point].connects.length > 0) {
        var base = human.getCoor(human.points[point].connects[0]);
      } else {
        var base = (addPosition)? human : {x: 0, y: 0};
      }
      return getPoint(base.x, base.y, human.points[point].length, human.points[point].angle);
    };


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
    };

    this.addListener = function (event, func) {
      this.eventListeners[event] = func;
    };

    this.removeListener = function (event) {
      if(this.eventListeners && this.eventListeners[event]) delete this.eventListeners[event];
    };

    this.addListener('say', function (event) {
      var self = this;
      var val = event.value;
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
    };

    this.finishDoing = function (act, value) { // pass in value as null to fire event
      var index = this.doing.indexOf(act);
      if( this.isDoing(act) ) {
        this.doing.splice(index, 1);
      }
      this.fireEvent(act, value, 'finish');
    };

    this.isDoing = function (act) {
      return !!(this.doing.indexOf(act) !== -1);
    };

    this.perform = function (tasks, done) { // tasks should be an array of things to do. done is a final callback.
      var self = this;
      async.map(tasks, function(item, cb) {
        cb(null, function (callback) {
          setTimeout(function () {
            if(item.func) {
              item.func.bind(this)(callback);
            } else if (item.multiTween) {
              self.multiTween(item.multiTween, callback);
            } else {
              callback();
            }
          }.bind(this), (typeof item.timer !== 'undefined') ? item.timer : 0);
        }.bind(self));
      }, function(err, results) {
        async.series(results, function (err, results) {
          if(done && typeof done == 'function') done();
        });
      });
    };

    this.tween = function (point, newValue, time, cb) {
      var self = this;
      if(typeof newValue === 'undefined') return;
      if(typeof self.points[point] === 'undefined') return;
      if(typeof time === 'undefined') var time = 500;
      if(typeof cb === 'undefined') var cb = function() {};

      if(typeof newValue === 'object') {
        if(typeof newValue.length === 'undefined') {
          newValue.length = self.points[point].length;
        }
        if(typeof newValue.angle === 'undefined') {
          newValue.angle = self.points[point].angle;
        }
        if(typeof newValue.connects === 'undefined') {
          newValue.connects = self.points[point].connects;
        }
      } else if(typeof newValue === 'number') {
        newValue = {
          length: self.points[point].length,
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
              length: oldValue.length + (((newValue.length - oldValue.length) / 10) * item),
              angle: newAngle,
              connects: newValue.connects
            }
            clbck();
          }, (time / 10));
        }.bind({item: item}));
      }, function (err, results) {
        async.series(results, cb);
      });
    };

    this.tweenPosition = function (newPosition, time, cb, plantFeet) { // plantFeet means keep the feet where they are.
      return cb(); // not fully working
      var self = this;
      if(!(newPosition && typeof newPosition === 'object' && typeof newPosition.x === 'number' && typeof newPosition.y === 'number')) return;
      if(typeof time !== 'number') var time = 500;
      var start = {x: self.x, y: self.y};
      var difference = {x: newPosition.x - start.x, y: newPosition.y - start.y};

      var numbers = [];
      for(var i = 1; i < 11; i++) {
        numbers.push(i);
      }
      async.map(numbers, function (item, callback) {
        callback(null, function (clbck) {
          var item = this.item;
          setTimeout(function() {
            self.x = start.x + ((difference.x / 10) * item);
            self.y = start.y + ((difference.y / 10) * item);
            clbck();
          }, (time / 10));
        }.bind({item: item}));
      }, function (err, results) {
        async.series(results, cb || function () {});
      });
    };

    this.multiTween = function (arr, clbck) {
      var self = this;
      if(!(arr instanceof Array)) {
        var newArr = [];
        for(var i in arr) {
          newArr.push({point: i, value: arr[i], timer: 300});
        }
        arr = newArr;
      }

      async.map(arr, function (item, callback) {
        callback(null, function (cb) {
          if(item.point === 'pelvis' || item.point === 'position') {
            self.tweenPosition(item.value, item.timer, cb);
          } else {
            self.tween(item.point, item.value, item.timer, cb)
          }
        });
      }, function (err, results) {
        async.parallel(results, clbck || function () {});
      });
    };

    this.pointToCoor = function (pointName, targetCoor, timer, intersectPoint) { // move a point to a certain coordinate using 2 points. returned array can be used directly with MultiTween. timer allows you to set general timer for multitween.
      if(!this.points[pointName] || !targetCoor) return false;
      if(typeof timer !== 'number') var timer = 100;
      var self = this;

      var middle = self.points[pointName].connects[0];
      if(!middle) return false;
      var base = self.points[middle].connects[0];
      if(!base) return false;

      var baseCoor = self.getCoor(base);
      var middleCoor = self.getCoor(middle);

      var totalDist = HumanJsUtils.distanceBetween(baseCoor, targetCoor);
      var limbLength = self.points[pointName].length + self.points[middle].length;
      if(totalDist && totalDist < limbLength) { // ensure that distance between base and target isn't further than length of the 2 limbs
        var intersections = HumanJsUtils.intersectTwoCircles(baseCoor, self.points[middle].length, targetCoor, self.points[pointName].length);
        var distances = [
          HumanJsUtils.distanceBetween(middleCoor, intersections[0]),
          HumanJsUtils.distanceBetween(middleCoor, intersections[1]),
        ];
        var nearest = (distances[0] <= distances[1])? intersections[0] : intersections[1]; // nearest intersection point to the current middle point
        if(intersections[intersectPoint]) {
          nearest = intersections[intersectPoint];
        }

        return [
          {point: middle, value: HumanJsUtils.pointOnCircleInverse(nearest, baseCoor).decimal, timer: timer},
          {point: pointName, value: HumanJsUtils.pointOnCircleInverse(targetCoor, nearest).decimal, timer: timer}
        ];
      } else {
        return false; // target too far away
      }
    };

    this.reset = function () {
      this.points = HumanJsUtils.clone(this.defaults);
    };
  }

  Human.prototype.say = function () {
    var self = this;
    var text = Array.prototype.slice.call(arguments, 0).join('. ');
    var sentences = text.replace(/\.{1,}\s{0,}/g, '.{BREAK}').replace(/\!{1,}\s{0,}/g, '!{BREAK}').replace(/\?{1,}\s{0,}/g, '?{BREAK}').split('{BREAK}');
    var arr = [];
    async.map(sentences, function(item, callback) {
      var number = sentences.indexOf(item);
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

  Human.prototype.wave = function () {
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
          self.multiTween([
            {point: use.wrist, value: newp.wrist2, timer: 300},
            {point: use.elbow, value: newp.elbow, timer: 300}
          ], cb);
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
          self.multiTween([
            {point: use.wrist, value: oldp.wrist, timer: 300},
            {point: use.elbow, value: oldp.elbow, timer: 300}
          ], function () {
            self.finishDoing('wave');
            cb();
          });
        }
      }
    ]);
  }

  Human.prototype.dance = function (type) {
    var dances = ['robot', 'sway', 'travolta'];
    if(!type) return this[dances[Math.floor(Math.random() * dances.length)]]();
    if(dances.indexOf(type) !== -1) {
      return this[type]();
    }
  }

  Human.prototype.robot = function () {
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
          self.multiTween([
            {point: 'rightShoulder', value: 0.2, timer: 250},
            {point: 'leftShoulder', value: 0.8, timer: 250},
            {point: 'rightElbow', value: 0.4, timer: 500},
            {point: 'leftElbow', value: 0.6, timer: 500},
            {point: 'rightWrist', value: 0.6, timer: 500},
            {point: 'leftWrist', value: 0.2, timer: 500}
          ], function () {
            self.multiTween([
              {point: 'rightShoulder', value: 0.25, timer: 100},
              {point: 'leftShoulder', value: 0.75, timer: 100}
            ], cb);
          });
        }
      },
      {
        timer: 100,
        func: function (cb) {
          self.multiTween([
            {point: 'rightShoulder', value: 0.2, timer: 250},
            {point: 'leftShoulder', value: 0.8, timer: 250},
            {point: 'neck', value: 0.01, timer: 500},
            {point: 'rightElbow', value: 0.4, timer: 500},
            {point: 'leftElbow', value: 0.65, timer: 500},
            {point: 'rightWrist', value: 0.95, timer: 500},
            {point: 'leftWrist', value: 0.5, timer: 500}
          ], function () {
            self.multiTween([
              {point: 'rightShoulder', value: 0.25, timer: 100},
              {point: 'leftShoulder', value: 0.75, timer: 100}
            ], cb);
          });
        }
      },
      {
        timer: 100,
        func: function (cb) {
          self.multiTween([
            {point: 'rightShoulder', value: 0.2, timer: 250},
            {point: 'leftShoulder', value: 0.8, timer: 250},
            {point: 'neck', value: 0.99, timer: 500},
            {point: 'rightElbow', value: 0.45, timer: 500},
            {point: 'leftElbow', value: 0.75, timer: 500},
            {point: 'rightWrist', value: 0.25, timer: 500},
            {point: 'leftWrist', value: 0.33, timer: 500}
          ], function () {
            self.multiTween([
              {point: 'rightShoulder', value: 0.25, timer: 100},
              {point: 'leftShoulder', value: 0.75, timer: 100}
            ], cb);
          });
        }
      },
      {
        timer: 100,
        func: function (cb) {
          self.multiTween([
            {point: 'rightShoulder', value: 0.2, timer: 250},
            {point: 'leftShoulder', value: 0.8, timer: 250},
            {point: 'neck', value: 0.01, timer: 500},
            {point: 'rightElbow', value: 0.5, timer: 500},
            {point: 'leftElbow', value: 0.55, timer: 500},
            {point: 'rightWrist', value: 0.125, timer: 500},
            {point: 'leftWrist', value: 0.5, timer: 500}
          ], function () {
            self.multiTween([
              {point: 'rightShoulder', value: 0.25, timer: 100},
              {point: 'leftShoulder', value: 0.75, timer: 100}
            ], cb);
          });
        }
      },
      {
        timer: 100,
        func: function (cb) {
          self.multiTween([
            {point: 'rightShoulder', value: 0.2, timer: 250},
            {point: 'leftShoulder', value: 0.8, timer: 250},
            {point: 'neck', value: 0.99, timer: 500},
            {point: 'rightElbow', value: 0.49, timer: 500},
            {point: 'leftElbow', value: 0.6, timer: 500},
            {point: 'rightWrist', value: 0, timer: 500},
            {point: 'leftWrist', value: 0.25, timer: 500}
          ], function () {
            self.multiTween([
              {point: 'rightShoulder', value: 0.25, timer: 100},
              {point: 'leftShoulder', value: 0.75, timer: 100}
            ], cb);
          });
        }
      },
      {
        timer: 100,
        func: function (cb) {
          self.multiTween([
            {point: 'rightShoulder', value: 0.2, timer: 250},
            {point: 'leftShoulder', value: 0.8, timer: 250},
            {point: 'neck', value: 0.01, timer: 500},
            {point: 'rightElbow', value: 0.4, timer: 500},
            {point: 'leftElbow', value: 0.51, timer: 500},
            {point: 'rightWrist', value: 0.75, timer: 500},
            {point: 'leftWrist', value: 0, timer: 500}
          ], function () {
            self.multiTween([
              {point: 'rightShoulder', value: 0.25, timer: 100},
              {point: 'leftShoulder', value: 0.75, timer: 100}
            ], cb);
          });
        }
      },
      {
        timer: 100,
        multiTween: oldp
      }
    ], function () {
      self.finishDoing('robot');
      self.finishDoing('dance');
    });
  };

  Human.prototype.sway = function (times) {
    var self = this;
    if(this.isDoing('sway') || this.isDoing('dance')) return;
    this.startDoing('sway');
    this.startDoing('dance');

    if(typeof times !== 'number') var times = 3;

    var oldp = HumanJsUtils.clone(this.points);

    var swayLeft = 0.985;
    var swayRight = 0.015;

    var speed = 500;

    var leftShoulderCoor = self.getCoor('leftShoulder');
    var leftArm = self.pointToCoor('leftWrist', {x: leftShoulderCoor.x, y: leftShoulderCoor.y - 40}, 300);
    var leftArmSwayLeft = self.pointToCoor('leftWrist', {x: leftShoulderCoor.x + 10, y: leftShoulderCoor.y - 40}, speed, 0);
    var leftArmSwayRight = self.pointToCoor('leftWrist', {x: leftShoulderCoor.x - 10, y: leftShoulderCoor.y - 40}, speed, 0);

    var rightShoulderCoor = self.getCoor('rightShoulder');
    var rightArm = self.pointToCoor('rightWrist', {x: rightShoulderCoor.x, y: rightShoulderCoor.y - 40}, 300);
    var rightArmSwayLeft = self.pointToCoor('rightWrist', {x: rightShoulderCoor.x + 10, y: rightShoulderCoor.y - 40}, speed, 1);
    var rightArmSwayRight = self.pointToCoor('rightWrist', {x: rightShoulderCoor.x - 10, y: rightShoulderCoor.y - 40}, speed, 1);

    var tasks = [ { timer: 0, multiTween: leftArm.concat(rightArm) } ];

    for(var i = 0; i < times; i++) {
      tasks.push({
        timer: 0,
        multiTween: rightArmSwayLeft.concat(leftArmSwayLeft).concat([
          {point: 'neck', value: swayLeft, timer: speed}
        ])
      });
      tasks.push({
        timer: 0,
        multiTween: rightArmSwayRight.concat(leftArmSwayRight).concat([
          {point: 'neck', value: swayRight, timer: speed}
        ])
      });
    }

    tasks.push({ timer: 500, multiTween: oldp });

    this.perform(tasks, function () {
      self.finishDoing('sway');
      self.finishDoing('dance');
    });
  };

  Human.prototype.travolta = function (times) {
    var self = this;
    if(this.isDoing('travolta') || this.isDoing('dance')) return;
    this.startDoing('travolta');
    this.startDoing('dance');

    if(typeof times !== 'number') var times = 3;

    var oldp = HumanJsUtils.clone(this.points);
    var speed = 500;

    var hipCoor = self.getCoor('pelvis');
    var shoulderCoor = self.getCoor('leftShoulder');


    var handOnHip = self.pointToCoor('rightWrist', {x: hipCoor.x + 5, y: hipCoor.y}, speed);

    var handUp = self.pointToCoor('leftWrist', {x: shoulderCoor.x - 20, y: shoulderCoor.y - 40}, speed);
    var handDown = self.pointToCoor('leftWrist', {x: shoulderCoor.x + 20, y: shoulderCoor.y + 40}, speed);

    var tasks = [ { timer: 0, multiTween: handOnHip.concat(handUp) } ];

    for(var i = 0; i < (times-1); i++) {
      tasks.push({
        timer: 0,
        multiTween: handDown
      });
      tasks.push({
        timer: 0,
        multiTween: handUp
      });
    }

    tasks.push({ timer: 1000, multiTween: oldp });

    self.perform(tasks, function () {
      self.finishDoing('travolta');
      self.finishDoing('dance');
    });
  };

  Human.prototype.clap = function (numOfClaps) {
    if(typeof numOfClaps !== 'number') var numOfClaps = 3;
    var self = this;
    if(this.isDoing('clap')) return;
    this.startDoing('clap');
    var oldp = HumanJsUtils.clone(this.points);

    var tasks = [{ // gets arms ready to clap
      timer: 100,
      multiTween: [
        {point: 'leftWrist', value: 0, timer: 200},
        {point: 'leftElbow', value: 0.54, timer: 100},
        {point: 'rightWrist', value: 0, timer: 200},
        {point: 'rightElbow', value: 0.46, timer: 100}
      ]
    }];

    for(var i = 0; i < numOfClaps; i++) {
      tasks.push({ // strikes hands together
        timer: 100,
        multiTween: [
          {point: 'leftWrist', value: 0.1, timer: 75},
          {point: 'rightWrist', value: 0.9, timer: 75}
        ]
      });
      if(i !== (numOfClaps - 1)) {
        tasks.push({ // draws hands back, ready to clap again (only if another clap is due)
          timer: 100,
          multiTween: [
            {point: 'leftWrist', value: 0.05, timer: 125},
            {point: 'rightWrist', value: 0.95, timer: 125}
          ]
        });
      }
    }

    tasks.push({ // returns points back to how they were before clapping
      timer: 200,
      multiTween: oldp
    });

    this.perform(tasks, function () {
      self.finishDoing('clap');
    });
  };

  Human.prototype.tapFoot = function (numOfTaps, side) {
    if(typeof numOfTaps !== 'number') var numOfTaps = 3;
    var self = this;
    if(this.isDoing('tapFoot')) return;
    this.startDoing('tapFoot');

    var useSide = side || self.orientation;
    var usep = {
      toe: useSide + 'Toe',
      high: (useSide === 'right')? 0.18 : 0.82,
      low: (useSide === 'right')? 0.25 : 0.75
    };

    var tasks = [];
    for(var i = 0; i < numOfTaps; i++) {
      tasks.push({ // rise foot up
        timer: 100,
        multiTween: [
          {point: usep.toe, value: usep.high, timer: 200}
        ]
      });
      tasks.push({ // put foot down
        timer: 100,
        multiTween: [
          {point: usep.toe, value: usep.low, timer: 100}
        ]
      });
    }

    this.perform(tasks, function () {
      self.finishDoing('tapFoot');
    });
  };

  Human.prototype.handsOnHips = function (numberOfSeconds) {
    if(typeof numberOfSeconds !== 'number') var numberOfSeconds = 3;
    var self = this;
    if(this.isDoing('handsOnHips')) return;
    this.startDoing('handsOnHips');
    var oldp = HumanJsUtils.clone(this.points);

    var milli = (numberOfSeconds * 1000) - 850;

    var hipCoor = self.getCoor('pelvis');

    var toLeftA = {x: hipCoor.x - 8, y: hipCoor.y - 3};
    var toRightA = {x: hipCoor.x + 8, y: hipCoor.y - 3};

    var leftPointA = self.pointToCoor('leftWrist', toLeftA, 400);
    var rightPointA = self.pointToCoor('rightWrist', toRightA, 400);

    var toLeftB = {x: hipCoor.x - 5, y: hipCoor.y};
    var toRightB = {x: hipCoor.x + 5, y: hipCoor.y};

    var leftPointB = self.pointToCoor('leftWrist', toLeftB, 100);
    var rightPointB = self.pointToCoor('rightWrist', toRightB, 100);

    this.perform([
      {
        timer: 0,
        multiTween: leftPointA.concat(rightPointA)
      },
      {
        timer: 0,
        multiTween: leftPointB.concat(rightPointB)
      },
      {
        timer: milli,
        multiTween: oldp
      }
    ], function () {
      self.finishDoing('handsOnHips');
    });
  };

  Human.prototype.scratchHead = function (side) {
    var self = this;
    if(this.isDoing('scratchHead')) return;
    this.startDoing('scratchHead');
    var oldp = HumanJsUtils.clone(this.points);

    var useSide = side || self.orientation;
    var coorAlter = {x: (useSide === 'right')? 3 : -3, y: 0}; // what to add to coors to avoid overlap (different depending on side)

    var earCoor = self.getCoor(useSide + 'Ear');
    var crownCoor = self.getCoor('crown');

    var toA = {x: earCoor.x + coorAlter.x, y: earCoor.y - coorAlter.y};
    var pointA = self.pointToCoor(useSide + 'Wrist', toA, 350);
    var pointASlow = self.pointToCoor(useSide + 'Wrist', toA, 500);

    var toB = {x: crownCoor.x + coorAlter.x, y: crownCoor.y - coorAlter.y};
    var pointB = self.pointToCoor(useSide + 'Wrist', toB, 350, (useSide === 'right')? 1 : 0);

    this.perform([
      { timer: 0, multiTween: pointASlow },
      { timer: 0, multiTween: pointB },
      { timer: 0, multiTween: pointA },
      { timer: 0, multiTween: pointB },
      { timer: 0, multiTween: pointA },
      { timer: 0, multiTween: pointB },
      { timer: 0, multiTween: pointA },
      { timer: 0, multiTween: oldp }
    ], function () {
      self.finishDoing('scratchHead');
    });
  };

  Human.prototype.punchAir = function () {
    var self = this;
    if(this.isDoing('punchAir')) return;
    this.startDoing('punchAir');

    var oldp = HumanJsUtils.clone(this.points);

    var shoulderCoor = self.getCoor('leftShoulder');
    var handDown = self.pointToCoor('leftWrist', {x: shoulderCoor.x - 20, y: shoulderCoor.y - 5}, 500);
    var handUp = self.pointToCoor('leftWrist', {x: shoulderCoor.x - 10, y: shoulderCoor.y - 40}, 170);

    self.perform([
      { timer: 0, multiTween: handDown },
      { timer: 0, multiTween: handUp },
      { timer: 500, multiTween: oldp }
    ], function () {
      self.finishDoing('punchAir');
    });
  };

  Human.prototype.brushShoulder = function (side) { // side is which shoulder to use (uses the opposite wrist)
    var self = this;

    if(this.isDoing('brushShoulder')) return;
    self.startDoing('brushShoulder');

    var oldp = HumanJsUtils.clone(this.points);

    var shoulderSide = side || HumanJsUtils.oppositeSide(self.orientation);
    var armSide = HumanJsUtils.oppositeSide(shoulderSide);

    var neck = self.getCoor('neck');
    var shoulder = self.getCoor(shoulderSide + 'Shoulder');
    var difference = {x: shoulder.x - neck.x, y: shoulder.y - neck.y};
    var to = {x: shoulder.x + (difference.x / 2), y: shoulder.y + (difference.y / 2)};

    if(shoulderSide === 'right') {
      neck = {x: neck.x + 3, y: neck.y - 3};
      to = {x: to.x + 3, y: to.y - 3};
    } else {
      neck = {x: neck.x - 3, y: neck.y - 3};
      to = {x: to.x - 3, y: to.y - 3};
    }

    self.perform([
      {
        timer: 0,
        multiTween: self.pointToCoor(armSide + 'Wrist', neck, 500)
      },
      {
        timer: 150,
        multiTween: self.pointToCoor(armSide + 'Wrist', to, 150)
      },
      {
        timer: 100,
        multiTween: oldp
      }
    ], function () {
      self.finishDoing('brushShoulder');
    });
  };

  Human.prototype.shrug = function () {
    var self = this;
    if(this.isDoing('shrug')) return;
    self.startDoing('shrug');

    var oldp = HumanJsUtils.clone(this.points);

    self.perform([
      {
        timer: 0,
        multiTween: [
          {point: 'leftElbow', value: 0.51, timer: 150},
          {point: 'rightElbow', value: 0.49, timer: 150},
          {point: 'leftWrist', value: 0.62, timer: 150},
          {point: 'rightWrist', value: 0.42, timer: 150}
        ]
      },
      {
        timer: 0,
        multiTween: [
          {point: 'rightShoulder', value: 0.22, timer: 100},
          {point: 'leftShoulder', value: 0.78, timer: 100}
        ]
      },
      {
        timer: 150,
        multiTween: oldp
      }
    ], function () {
      self.finishDoing('shrug');
    });
  };

  Human.prototype.airGuitar = function () {
    var self = this;
    if(this.isDoing('airGuitar')) return;
    self.startDoing('airGuitar');

    var oldp = HumanJsUtils.clone(this.points);

    var strumHand = self.orientation;
    var fretHand = HumanJsUtils.oppositeSide(strumHand);

    var neck = self.getCoor('neck');
    var hip = self.getCoor('pelvis');
    var centre = {x: hip.x, y: ((hip.y - neck.y) * 0.75) + neck.y};

    var strumUpCoor = {x: (strumHand == 'left')? centre.x - 10 : centre.x + 10, y: centre.y - 5};
    var strumDownCoor = {x: (strumHand == 'left')? centre.x - 10 : centre.x + 10, y: centre.y + 5};
    var fretHandLowCoor = {x: (fretHand == 'left')? centre.x - 40 : centre.x + 40, y: centre.y - 20 };
    var fretHandHighCoor = {
      x: ((centre.x - fretHandLowCoor.x) * 0.15) +  fretHandLowCoor.x,
      y: ((centre.y - fretHandLowCoor.y) * 0.15) +  fretHandLowCoor.y
    };

    var tasks = [];

    for(var i = 0; i < 4; i++) {
      tasks = tasks.concat([
        {
          timer: 0,
          multiTween: self.pointToCoor(strumHand + 'Wrist', strumDownCoor, (i === 0)? 500 : 120).concat(self.pointToCoor(fretHand + 'Wrist', (i % 2 === 0)? fretHandLowCoor : fretHandHighCoor, (i === 0)? 500 : 120))
        },
        {
          timer: 0,
          multiTween: self.pointToCoor(strumHand + 'Wrist', strumUpCoor, 75)
        },
        {
          timer: 0,
          multiTween: self.pointToCoor(strumHand + 'Wrist', strumDownCoor, 120)
        },
        {
          timer: 0,
          multiTween: self.pointToCoor(strumHand + 'Wrist', strumUpCoor, 75)
        }
      ]);
    }

    tasks.push({
      timer: 150,
      multiTween: oldp
    });

    self.perform(tasks, function () {
      self.finishDoing('airGuitar');
    });
  };

  var HumanJsUtils = {
    clone: function (obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    oppositeSide: function (side) { // if given 'left', returns 'right' and vice versa
      if(side === 'left') {
        return 'right';
      } else if (side === 'right') {
        return 'left';
      } else {
        return false;
      }
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
      };
      var random = Math.floor(Math.random() * 40);
      return names[gender][random];
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
    },
    fixFloat: function (num) {
      if(typeof num !== 'number') return num;
      return parseFloat(num.toFixed(5));
    },
    distanceBetween: function (a, b) { // gives the distance between 2 coordinates. a and b should be like so: {x: 1, y: 2}
      if(!(a && typeof a.x === 'number' && typeof a.y === 'number')) return -1;
      if(!(b && typeof b.x === 'number' && typeof b.y === 'number')) return -1;

      var difference = {
        x: (a.x - b.x > 0)? a.x - b.x : b.x - a.x,
        y: (a.y - b.y > 0)? a.y - b.y : b.y - a.y,
      };

      return Math.sqrt(Math.pow(difference.x, 2) + Math.pow(difference.y, 2));
    },
    pointOnCircle: function (decimal, radius, centre) {
      if(typeof decimal !== 'number' || typeof radius !== 'number') return;
      if(!(centre && typeof centre.x === 'number' && typeof centre.y === 'number')) {
        var centre = {x: 0, y: 0};
      }
      return {
        x: HumanJsUtils.fixFloat(centre.x + Math.sin(decimal * 2 * Math.PI) * radius),
        y: HumanJsUtils.fixFloat(centre.y - Math.cos(decimal * 2 * Math.PI) * radius)
      };
    },
    pointOnCircleInverse: function (to, from) { // reverses 'pointOnCircle'
      if(!(from && typeof from.x === 'number' && typeof from.y === 'number')) {
        var from = {x: 0, y: 0};
      }
      if(!(to && typeof to.x === 'number' && typeof to.y === 'number')) {
        var to = {x: 0, y: 0};
      }

      var radius = HumanJsUtils.distanceBetween(from, to);
      var decimalX = (Math.PI - Math.asin((to.x - from.x) / radius)) / (Math.PI * 2);
      var decimalY = ((Math.acos((to.y - from.y) / radius)) / (Math.PI * 2));

      if(to.y - from.y < 0) {
        var decimal = 1 - (((decimalX + 0.5) * 1000000) % 1000000) / 1000000;
      } else {
        var decimal = decimalX;
      }

      return {decimal: HumanJsUtils.fixFloat(decimal), radius: HumanJsUtils.fixFloat(radius)};
    },
    intersectTwoCircles: function (pointA, radiusA, pointB, radiusB) { // find the 2 points at which a circle intersects
      // adapted from http://stackoverflow.com/questions/12219802/a-javascript-function-that-returns-the-x-y-points-of-intersection-between-two-ci
      var diffX = pointB.x - pointA.x;
      var diffY = pointB.y - pointA.y;

      var distance = HumanJsUtils.distanceBetween(pointA, pointB); // distance between centres

      if (distance > (radiusA + radiusB)) {
        return false; // don't intersect
      }
      if (distance < Math.abs(radiusA - radiusB)) {
        return false; // one within the other
      }

      var a = ((radiusA*radiusA) - (radiusB*radiusB) + (distance*distance)) / (2.0 * distance) ;

      var x2 = pointA.x + (diffX * a/distance);
      var y2 = pointA.y + (diffY * a/distance);

      var h = Math.sqrt((radiusA*radiusA) - (a*a));
      var rx = -diffY * (h/distance);
      var ry = diffX * (h/distance);

      var resultA = {x: x2 + rx, y: y2 + ry};
      var resultB = {x: x2 - rx, y: y2 - ry};
      return [resultA, resultB].sort(function (a, b) { // sort in order left to right (top to bottom if x values are same)
        if (a.x > b.x){
          return 1;
        } else if (a.x < b.x) {
          return -1;
        } else {
          if (a.y > b.y){
            return 1;
          } else if (a.y < b.y) {
            return -1;
          } else {
            return 0;
          }
        }
      });
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
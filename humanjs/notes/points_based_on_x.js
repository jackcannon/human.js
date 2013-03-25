  // BASE: PELVIS

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











  // BASE: RIGHT-ANKLE

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









  // BASE: LEFT-ANKLE

  this.points = {
    pelvis: {
      long: 30,
      angle: 0.05,
      connects: [
        'leftKnee'
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
      angle: 0,
      connects: [
        'leftAnkle'
      ]
    },
    leftAnkle: {
      long: 0,
      angle: 0,
      connects: []
    },
    leftToe: {
      long: 5,
      angle: 0.75,
      connects: [
        'leftAnkle'
      ]
    }
  }
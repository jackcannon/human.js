Human.js Library
===========

##Install

###In Browser
	<script type="text/javascript" src="https://raw.github.com/jackcannon/human.js/master/js/human.js"></script>

###In Node.js
Install using:

	npm install human

Include using:

	var Human = require('human');

##Usage

###Constructor
The constructor takes 1 optional object parameter called options. The properties for this object are all optional, and are as follows:

* gender - String. The gender of the Human (e.g. 'male', 'female'). Default: 'male'
* name - String. The name of the Human (e.g. 'Jack', 'Henry'). Default: random popular name based on gender
* orientation - String. Left or Right handed (e.g. 'left', 'right'). Default: 'right'
* x - Number. The x coordinate position of the Human (e.g. 0). Default: 0
* y - Number. The y coordinate position of the Human (e.g. 0). Default: 0

####Example
	var Jack = new Human({
		name: 'Jack',
		gender: 'male',
		orientation: 'left',
		x: 0,
		y: 0
	});


###Functions
* say - Make the Human say something (sets to .saying property)
* face - Change the way the Human is facing
* wave - The Human gives a friendly wave
* dance/robot - Performs a lovely little dance

###What else?
Not everything is going to be in this documentation. The library is meant to be explored and experimented with. An example of the Object in use can be found in index.html or at humanjs.com
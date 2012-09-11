(function() {
	// random socket id
	var socketId = "9527"; 
	// don't emit events from inside the previews themselves
	if ( window.location.search.match( /r/gi ) ) {
		var socket = io.connect(window.location.origin);

		socket.on('slidedata', function(data) {
			// ignore data from sockets that aren't ours
			if (data.socketId !== socketId) { return; }
			Reveal.navigateTo(data.indexh, data.indexv);
		});
		return;
	}

	var socket = io.connect(window.location.origin);
	
	console.log('View slide notes at ' + window.location.origin + '/notes/' + socketId);

	Reveal.addEventListener( 'slidechanged', function( event ) {
		var nextindexh;
		var nextindexv;
		var slideElement = event.currentSlide;

		if (slideElement.nextElementSibling && slideElement.parentNode.nodeName == 'SECTION') {
			nextindexh = event.indexh;
			nextindexv = event.indexv + 1;
		} else {
			nextindexh = event.indexh + 1;
			nextindexv = 0;
		}

		var notes = slideElement.querySelector('aside.notes');
		var slideData = {
			notes : notes ? notes.innerHTML : '',
			indexh : event.indexh,
			indexv : event.indexv,
			nextindexh : nextindexh,
			nextindexv : nextindexv,
			socketId : socketId
		};

		socket.emit('slidechanged', slideData);
	} );
}());

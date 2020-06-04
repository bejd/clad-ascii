// Effect functions


// Called by button click events. Increase or decrease the volume to set values
// and update the volume indicator depending on which button was clicked
function changeVolume() {
	const volStops = [0.1, 0.3, 0.5, 0.7, 1.0];

	const volIndicator = document.getElementById("vol-indicator");
	let xCount = (volIndicator.innerHTML.match(/x/g) || []).length;

	if (this.id == "vol-down") {
		if (xCount == 1) return;
		xCount -= 1;
	}
	else if (this.id == "vol-up") {
		if (xCount == 5) return;
		xCount += 1;
	}

	AUDIO.volume = volStops[xCount - 1];

	// Clear the indicator then redraw it
	volIndicator.innerHTML = "";
	for (let i = 0; i < xCount; i++) {
		volIndicator.innerHTML += "[x]";
	}
	for (let i = 0; i < 5 - xCount; i++) {
		volIndicator.innerHTML += "[ ]";
	}
}


// Add class to add/remove class which dims all child elements of the body
// except for the pre element
function dimControls(opt) {
	const bodyChildren = Array.from(document.body.children);
	bodyChildren.forEach(child => {
		if (child.nodeName != "PRE") {
			if (opt == true) {
				child.classList.add("dim");
			}
			else if (opt == false) {
				child.classList.remove("dim");
			}
		}
	});
}



// Set boolean to tell getReady() to mirror the image horizontally
function fxFlipLR() {
	flipLR = true;

	advancePosition();
}


// Set boolean to double each frame in the reel, giving the effect of playing
// the animation at half speed
function fxHalfTime() {
	halfTime = true;

	advancePosition();
}


// Add or remove the class which inverts page colours
function fxInvertColours() {
	document.body.classList.toggle("invert");

	const buttons = Array.from(document.querySelectorAll("button"));
	buttons.forEach(button => {
		button.classList.toggle("invert");
	});

	advancePosition();
}


// Set boolean so frames play in reverse order
function fxReverseReel() {
	reverseReel = true;

	advancePosition();
}


// Set the start and end frames of the next reel to be played based on the
// next two numbers in the playlist
function fxSliceReel() {
	plPos++;
	sliceStart = PLAYLIST[plPos] - 1;
	plPos++;
	sliceFinish = PLAYLIST[plPos];

	advancePosition();
}


// Reset all special effects and counters
function resetEffects() {
	flipLR = false;
	halfTime = false;
	reverseReel = false;
	sliceStart = 0;
	sliceFinish = "all";
}

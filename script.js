const AUDIO = new Audio("song.mp3");
const FPS = 15;									// Can be 60, 30, 15...


let animation;									// Store this timer
let ascii;										// Draw the animation here
let frameCount = 0;								// Counter for playing frames
let frames = [];								// Frames ready to play
let initialText = "";							// Store the default text
let playing = false;							// Current playing status
let plPos = 0;									// Position in the playlist
let reels = [ [], [] ];							// Stores text file contents
let timeout;									// Delay to recall animation
let waiting;									// Timeout func for guitar intro


// Effects variables
let flipLR = false;								// Set by fxFlipLR
let halfTime = false;							// Set by fxHalfTime
let reverseReel = false;						// Set by fxReverseReel
let sliceFinish = "all";						// Set by fxSliceReel
let sliceStart = 0;								// Set by fxSliceReel


// The order in which the animations will be played
const PLAYLIST = [
	"g2","!s", 1  , 10 ,"d4","g4","d1","!s",	// Guitar & drums
	 1  , 5  ,"x1",
	"!r","g1","b1","s1","g1",					// Guitar break
	"s2","b2","v1","s2","!s", 1  , 3  ,"d2",	// "Handed a..."
	"v2","!s", 1  , 10 ,"g2",					// "Grief..."
	"!r","b2","g4","!f","v3","b1",				// "Foundations, a gut punch"
	"d2","!s", 3  , 10 ,"g1","!s", 1  , 8  ,	// "Friendships are catacombs"
	"x2",
	"v1","!s", 1  , 11 ,"g2","!s", 1  , 9  ,	// "Never shut..."
	"v5","d1","!s", 2  , 7  ,"d1",
	"!s", 2  , 9  ,"v5","!r","!s", 1  , 6  ,	// "Scrape at the sky..."
	"x6","!r","g4","s2","!s", 1  , 12 ,"d3",
	"!h","!r","v2","!r","!s", 1  , 12 ,"g5",	// "Streetlights are..."
	"!h","!s", 1  , 10 ,"b3",
	"s2","d2","!f","v1","x1","b1","!s", 1  ,	// "Never trust..."
	 5  ,"g1","g1",
	"s1",										// "The roads."

	"!i","v3","b5","v5","g4","x4","!r","g5",	// "Buildings are..."
	"!i","!s", 2  , 13 ,"d4","x3","v4",
	"b2","!i","!r","s2","d3","g3","b3","!r",	// "Loss..."
	"x1","!i","!s", 1  , 10 ,"s3","d1",
	"v3","!r","!s", 2  , 6  ,"v3","x6","!s",	// "Rivers are..."
	 5  , 12 ,"g2","!i","!f","d2","!r","x4",
	"!s", 1  , 12 ,"b3","g1","d2",
	"!i","g4","!s", 1  , 6  ,"b2","s2","v1",	// "Loss..."
	"!r","g5","!r","b2","d4","!s", 5  , 13 ,
	"x1","g4",

	"d1","!s", 1  , 8  ,"x9","s3","b1","v6",	// Instrumental bridge
	"d2","!s", 5  , 10 ,"x2","g1","!r","v6",
	"!f","d3","!r","x6","b5","!r","d3","!r",
	"x7","s3","b4","!r","g4","b2","!f",
	"s1","g3","b1","!s", 1  , 1  ,"b1",			// Hold...

	"!f","!i","!h","v1","!h","d2","!h","s2",	// "Yet she..."
	"!h","!s", 1  , 12 ,"g5","!h","x8","!h",
	"b5","!h","!f","g3","!h","!s", 3  , 9  ,
	"x3","x4",
	"b4","b4","!f","v5","!r","!f","d2","!f",	// "She keeps vigil..."
	"b2","!f","v6","g4","!f","!i","!s", 1  ,
	 9  ,"v4","!i","!r","x2","d1","!s", 1  ,
	 5  ,"xa","v1","!h","g2","!r","x3","d1",
	"!s", 2  , 10 ,"d1","!s", 2  , 9  ,"d1",
	"v5","s3","!r","!h","!f","b3","!f","g1",	// "Filling her map with lies"
	"!h","!f","d4","!r","s1","b5","v6","!r",
	"b5","!f","d1","xc",
	"xe","!f","g3","v1","!h","s2","!h","!r",	// "Lossbearer..."
	"b3","!f","d1","!f","d1","g5","!f","v6",

	"!i","b5","g3","!s", 4  , 16 ,"xa","!r",	// "Fine..."
	"g3","s3","s3","b1","g1","!h","x7","g1",
	"d3","!s", 1  , 4  ,"xb","!s", 1  , 4  ,
	"xb","!s", 2  , 5  ,"xb","!h","v2","!f",
	"b4","!f","b4","!h","d2","!r","!h","x8",
	"v7","!s", 5  , 21 ,"xb","g6","!s", 11 ,
	 14 ,"g6","!h","!f","!s", 6  , 12 ,"xc",
	"!h","d1","!f","!r","b5","!h","d1","!h",
	"!s", 1  , 4  ,"d1",

	"b5","s1","v8","!s", 10 , 14 ,"g6","!r",	// Bass and drum coda
	"!s", 2  , 8  ,"g6","!r","b5","!h","d4",
	"b5","!r","v6","g3","!h","xe","d1","g6",
	"!r","!s", 1  , 13 ,"xb","!h","d4","!h",
	"s3","!f","x9","b5","xd","v7","v7","d5",
	"!h","!r","s3","!r","!h","x4","!h","b4",
	"g3","!s", 3  , 16 ,"d5","!h","g4","!r",
	"!s", 1  , 5  ,"xd","!r","xd","!r","xb",
	"!h","g1","!h","!r","v8","!h","b2","!h",
	"!r","g2","!h","!r","xe","!h","d2","!h",
	"!s", 1  , 6  ,"d2",

	"b1","b1","s4","s4","v7","v7","!h","s1",	// End note
	"!h","s1","g3","g3","g3","!h","s5","xf"
];


// When the page has loaded, get things ready
document.addEventListener("DOMContentLoaded", (event) => {
	// Add a listener to the play button
	const playButton = document.getElementById("play-stop");
	playButton.addEventListener("click", playStop);

	// Set starting volume
	AUDIO.volume = 0.5;

	const volumeDown = document.getElementById("vol-down");
	volumeDown.addEventListener("click", changeVolume);

	const volumeUp = document.getElementById("vol-up");
	volumeUp.addEventListener("click", changeVolume);

	// Store
	ascii = document.getElementById("ascii");
	initialText = ascii.innerHTML;

	// Load the text files from the server
	loadFiles();
});


// Get each unique filename from the playlist and load that text file's name
// and contents into an array. The array contents will be called for animation
// rather than the text files directly
function loadFiles() {
	// Get unique values from the playlist
	const uPlaylist = Array.from(new Set(PLAYLIST));

	// Check each playlist item
	let i = 0;
	let k = 0;
	uPlaylist.forEach(item => {
		// If the item is a string and doesn't have a "!"
		if (typeof(item) == "string" && item.search("!") == -1) {
			// Save the reel name in the first column of the array
			reels[0][i] = item;
			i++;

			// Get the reel file and store its contents in the second column
			fetch("reels/" + item + ".txt")
				.then(
					response => response.text()
						.then(function(contents) {
							reels[1][k] = contents;
							k++;
							// When all files have been loaded, wait a couple of
							// seconds then enable the play button
							if (k > 0 && k == i) {
								setTimeout(function() {
									document.getElementById(
										"play-stop"
									).innerHTML = "Play"
								}, 2 * 1000);
							}
						})
				);
		}
	});
}


// Start or stop the music and animation when the play/stop button is pressed
function playStop() {
	if (document.getElementById("play-stop").innerHTML == "Loading...") return;

	if (!playing) {
		playing = true;
		document.getElementById("play-stop").innerHTML = "Stop"

		AUDIO.play();
		dimControls(true);
		introWait();
	}
	else {
		stopEverything();
	}
}


// Wait for the guitar noise to finish and the intro guitar riff to start
// before playing the first animation
function introWait() {
	if (AUDIO.currentTime < 4.5) {
		waiting = setTimeout(introWait, 1);
	}
	else {
		playlistController();
	}
}


// Call various functions based on what is next in the PLAYLIST array
function playlistController() {
	if (plPos == PLAYLIST.length) {
		stopEverything();
	}
	else if (PLAYLIST[plPos] == "!f") {
		fxFlipLR();
	}
	else if (PLAYLIST[plPos] == "!h") {
		fxHalfTime();
	}
	else if (PLAYLIST[plPos] == "!i") {
		fxInvertColours();
	}
	else if (PLAYLIST[plPos] == "!r") {
		fxReverseReel();
	}
	else if (PLAYLIST[plPos] == "!s") {
		fxSliceReel();
	}
	else {
		findReel(PLAYLIST[plPos]);
	}
}


// Find the matching animation reel in the reels array which is to be played
// next. When a match is found, call a function to get it ready for animation
function findReel(reelName) {
	reels[0].forEach((reel, index) => {
		if (reel.match(reelName)) {
			getReady(reels[1][index]);
		}
	});
}


// Take the text from the selected reel object and split it into an array for
// each frame of the animation, applying "effects" where appropriate flags have
// been set
function getReady(text) {
	const FRAME_HEIGHT = 20;
	const FRAME_WIDTH = 72;

	frames = [];

	// Break the text up into an array of each line
	const lines = text.split("\n");

	let frameNumber = 0;

	// Merge lines into frames
	lines.forEach((line, index) => {
		// Every nth line start drawing the next frame
		if (index != 0 && index % FRAME_HEIGHT == 0) {
			frameNumber++;

			// Double the previous frame if set by !h
			if (halfTime) {
				frames[frameNumber] = frames[frameNumber - 1];
				frameNumber++;
			}
		}

		// Add spaces or cut off extra characters to make sure each line is the
		// correct length
		if (line.length < FRAME_WIDTH) {
			line = line + " ".repeat(FRAME_WIDTH - line.length);
		}
		else if (line.length > FRAME_WIDTH + 1) {
			line = line.slice(0, FRAME_WIDTH);
		}

		// If set by !f, flip the image left-to-right
		if (flipLR) {
			line = line.split("").reverse().join("");

			// Replace characters with flipped versions
			const cFind = /\\|\/|J|L/g;
			const cRepl = {
				"\\":"/",
				"\/":"\\",
				"J":"L",
				"L":"J"
			}
			line = line.replace(cFind, m => cRepl[m]);
		}

		// Replace troublesome character sequences
		line = line.replace(/</g, "&lt");
		line = line.replace(/>/g, "&gt");

		// Add the line into the current frame
		if (typeof(frames[frameNumber]) == "undefined") {
			frames[frameNumber] = line + "\n";
		}
		else {
			frames[frameNumber] += line + "\n";
		}
	});

	// If set by !r, reverse the frame order
	if (reverseReel) {
		frames.reverse();
		// Move the empty first frame to the end of the array
		frames.splice(frames.length, 0, frames.splice(0, 1)[0]);
	}

	// Set the first frame to play (set by !s effect)
	frameCount = sliceStart;

	// Set the last frame to play (set by !s effect and doubled by !h)
	let framesInReel = (lines.length - 1) / FRAME_HEIGHT;
	if (halfTime) framesInReel *= 2;
	if (sliceFinish == "all" || sliceFinish > framesInReel) {
		sliceFinish = framesInReel;
	}

	animation = requestAnimationFrame(drawFrames);
}


// Iterate through the animation array, drawing each frame to the ASCII box
function drawFrames() {
	// Exit when all frames in the reel have been shown
	if (frameCount >= sliceFinish) {
		resetEffects();
		advancePosition();
		return;
	}

	// Update the box with the current frame in the reel and advance
	ascii.innerHTML = frames[frameCount];
	frameCount++;

	// Wrap request animation frame in set timeout to throttle the FPS
	timeout = setTimeout(function() {
		animation = requestAnimationFrame(drawFrames);
	}, 1000 / FPS);
}


// Advance the playlist
function advancePosition() {
	plPos++;
	playlistController();
}


// Stop all things and reset page to default
function stopEverything() {
	// Stop any more animation
	clearTimeout(timeout);
	cancelAnimationFrame(animation);

	// Reset other things
	ascii.innerHTML = initialText;

	const playButton = document.getElementById("play-stop");
	playButton.innerHTML = "Play";

	playing = false;
	dimControls(false);

	resetEffects();
	document.body.classList.remove("invert");

	const buttons = Array.from(document.querySelectorAll("button"));
	buttons.forEach(button => {
		button.classList.remove("invert");
	});

	plPos = 0;

	// Stop the music
	AUDIO.pause();
	AUDIO.currentTime = 0;
}

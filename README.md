# CLaD ASCII

Music videos are an essential part of any band's promotional materials. Charlotte Light and Dark live in different countries, so on the rare occasion we're all together it can be hard to find time to film a traditional music video. The limited hours we have tend to be reserved for higher priority pursuits such as writing new music, rehearsing songs, and occasionally playing shows. As such, I aimed to create a music video using animated ASCII art that could be hosted on a simple webpage.

After a fair amount of searching it seems that there is very little in the way of ASCII art animation software. So I decided to keep things simple and write an ASCII art animator in JavaScript.

The music video can be viewed being animated in real time at https://clad.band. Alternatively, a recording of the animation is on [YouTube](https://www.youtube.com/watch?v=QvZjGgw8ml0).

## Terminology

I've borrowed from film terminology in the naming of many elements in this project. The text files that contain each separate ASCII animation are referred to as "reels", and when these are processed they are split into "frames".

## How it works

When the page has finished loading, the function `loadFiles()` is called. This gets each unique item from the `PLAYLIST` array and fetches the relevant text file from the server. When the files are returned, it stores the file name and contents in a `reels` array for later use. When all files have been fetched, the Play button is enabled.

On clicking Play, the song begins. As no animation happens during the intro, the function `introWait()` delays the start of the animation functions.

When ready, the `playlistController()` function is called. This iterates through each element in the `PLAYLIST` array, calling functions based on the current position in the array. For example, if the current position contains the string "!i", the `fxInvertColours()` function is called ([see below](#invert-colours)). If the array is a reel name (e.g. "v3" or "g2"), string data is retrieved from the `reel` array by `findReel()` and animation begins.

At this point `getReady()` takes the reel string and splits it into frames based on the number of characters and lines defined in the `FRAME-WIDTH` and `FRAME-HEIGHT` constants. Certain [effects](#effects) are also implemented here, before adding the combined lines to a `frames` array.

Once all frames have been created, they can be animated on the page by `drawFrames()`. This is relatively simple: it replaces the contents of the `<pre>` element with an item from `frames`, waits for a short time (defined by the `FPS` constant), then repeats. On playing all frames in the reel, the `playlistController()` is called again, the next reel or effect is called, and the whole process repeats.

## Effects

In addition to setting the play order of reel files, the `PLAYLIST` array can also be used to trigger visual and temporal effects. These can be specified sequentially in the array to apply multiple effects to a single reel.

### Flip LR

__Playlist keyword:__ `!f`

__What it does:__ flips the reel horizontally by reversing the order of each line as it's loaded into the frame before animation begins.

### Half time

__Playlist keyword:__ `!h`

__What it does:__ halves the rate at which the reel file appears to play by doubling each frame as they are added to the frames array.

### Invert colours

__Playlist keyword:__ `!i`

__What it does:__ inverts colours in the web page by adding the `.invert` class to the body and button elements. The colours stay inverted until the invert effect is called again, or the music video reaches its end.

### Reverse reel

__Playlist keyword:__ `!r`

__What it does:__ reverses the order in which the frames are played for the next reel file in the playlist.

### Slice reel

__Playlist keyword:__ `!s`, `a`, `b` (where a and b are integers and the following items in the array)

__What it does:__ plays only a certain amount of frames starting at a (where the first frame is 1) and ending at b for the next reel file in the playlist. If b is greater than the amount of frames in the reel, the reel is played through to the end (i.e. it doesn't repeat frames or anything).

## How I made the ASCII "art"

I'm not an artist. Rather than create the hundreds of images using a pure text editor, I used a crutch: [JavE](http://jave.de/). It hasn't been updated in a decade and it crashes frequently, but without it this would have taken magnitudes longer. My general workflow would be:

* Import an image using JavE's Image2Ascii converter
* Realise that the resulting image is too messy/complex to use
* Erase everything
* Use the imported image as a watermark
* Manually trace the image
* Open the movie editor
* Duplicate the initial frame, adjust it to create the animation
* Repeat
* Export the movie to "one text file with all frames"
* Delete the single newline between each frame to make the file work with my code

All in all it's a painstaking, time-consuming, tiring, yet rewarding process. Much like traditional pencil-and-paper animation, I suppose.

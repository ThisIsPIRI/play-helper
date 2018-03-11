# play-helper
Plays and displays songs and backgrounds for your plays. Use with chrome and --disable-web-security, --user-data-dir options is recommended.

## Features
- Show curtains at the start and end
- Play and visualize songs you need
- Show backgrounds and short texts to show the circumstances

## The Format
The helper displays one entry per one click on the "next" button. To register one entry, write in three different, consecutive lines

- the type of the entry(image, music or text),
- the text to be shown with the entry and
- the source filename of the entry(not needed for text), in that order.

All image files must be under the image directory and the sound files under sound directory. The case of the types doesn't matter, while that of filenames may or may not depending on your filesystem. Comments can be written outside each entries. Read play.txt included for an example.
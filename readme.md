# play-helper
Plays and displays songs and backgrounds for your plays. Use with chrome and --disable-web-security, --user-data-dir options is recommended.

## Features
- Show curtains at the start and end
- Play and visualize songs you need
- Show backgrounds and short texts to show the circumstances

## Dependencies
Requires file.js from [my JS Library](https://github.com/busyVision/js-library).

## The Format
The first line of a play file must always be the title of the play. After that, you can start specifying entries. Entries are what the helper (dis)plays when you click on the "next" button. To register one entry, write in three different, consecutive lines

- the type of the entry(image, music or text),
- the text to be shown with the entry and
- the source filename of the entry(not needed for text), in that order.

The entries must be in the order they appear. All image files must be under the image directory and the sound files under sound directory. The case of the types doesn't matter, while that of filenames may or may not depending on your filesystem. Comments can be written outside each entries, but be wary that since they are used to identify entries, comments cannot contain "image", "music" or "text".

After entering all entries, write "credits" in one line and everything below will be interpreted as texts for the credits. No comments are allowed below "credits". Read play.txt included with the helper for examples.
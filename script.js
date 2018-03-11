var num = 0, playing = false, nextUsed = false, animationID, music;
var playButton = document.getElementById("play"), number = document.getElementById("number");
var credits = document.getElementById("credits"), explanation = document.getElementById("explanation");
var body = document.getElementById("body"), volume = document.getElementById("volume");

Type = Object.freeze({ //enum for marking type of entries
	MUSIC : 0,
	IMAGE : 1,
	TEXT : 2
});
credits.style.display = "none";
//visualization init
var visualizer = document.getElementById("visualizer");
var drawer = visualizer.getContext("2d");
drawer.fillStyle = "black";
var context = new AudioContext(), source, analyser, frequency;

function Entry(type, name, source) { //OOP
	this.type = type;
	this.name = name;
	this.source = typeof source === 'undefined' ? false : source;
}

function previousImage() {
	for(i = num - 1;i >= 0;i--)
	if(entries[i].type == Type.IMAGE) return i;
	alert("INIT ERR 3 CATCH FAILURE. first entry != image");
	return 0;
}
function changeBackground() {
	if(num == entries.length) return;
	if(entries[num].type == Type.IMAGE)
	body.style["background-image"] = "url(\"image/" + entries[num].source + "\")";
	else
	body.style["background-image"] = "url(\"image/" + entries[previousImage()].source + "\")";
}
function render(timestamp) {
	analyser.getByteFrequencyData(frequency);
	var width = visualizer.width, height = visualizer.height - 20; //to reserve space for progress bar
	var range = frequency.length - 330; //data near end are rarely used.(almost always 0)
	var hori = width / range, verti = height / 256; //the values are between 0 and 255.
	drawer.clearRect(0, 0, width, height);
	for(var i = 0;i < range;i++) {
	drawer.fillRect(hori * i, height - frequency[i] * verti, hori, frequency[i] * verti);
	}
	drawer.fillRect(0, height, (music.currentTime / music.duration) * width, height + 20);
	animationID = requestAnimationFrame(render);
}
function update() {
	if(num == entries.length) { //reached the end of list.
	number.innerHTML = '∞';
	explanation.innerHTML = "Thank you.";
	explanation.style.color = "white";
	body.style["background-image"] = "url(\"image/curtain.png\")";
	credits.style.display = "";
	//to prevent a strange bug which causes the credits to lose its css attributes when programmatically changed.
	//it happened only in one specific place so far.
	credits.style["font-size"] = "23%";
	}
	else {
	number.innerHTML = (num + 1);
	credits.style.display = "none";
	explanation.style.color = "black";
	}
}
function ended() {
	window.cancelAnimationFrame(animationID);
	drawer.clearRect(0, 0, visualizer.width, visualizer.height);
	music.pause();
	playing = false;
	playButton.innerHTML = "Next";
	//does not call next() as it calls changeBackground().
	//when next wasn't used, changing background upon ended() changes background before the background text appears.
	num = num == entries.length ? num : num + 1;
	update();
	if(nextUsed) changeBackground();
}
function play() {
	explanation.innerHTML = "";
	if(playing) {
		ended();
	}
	else if(num < entries.length) {
		switch(entries[num].type) {
		case Type.MUSIC:
			music = new Audio("sound/" + entries[num].source);
			//music.crossOrigin = "anonymous";
			music.addEventListener("ended", ended);
			//visualization
			source = context.createMediaElementSource(music);
			analyser = context.createAnalyser();
			source.connect(context.destination);
			source.connect(analyser);
			frequency = new Uint8Array(analyser.frequencyBinCount);

			changeVolume();
			music.play();
			animationID = window.requestAnimationFrame(render);
			playButton.innerHTML = entries[num].name + " 재생 중";
			playing = true;
			break;

		case Type.TEXT: case Type.IMAGE: //next() function will change the background.
			explanation.innerHTML = entries[num].name;
			next();
			break;
		}
	}
	else { //there's no song to play
		update();
	}
	nextUsed = false;
}
function previous() {
	num = num > 0 ? num - 1 : num;
	explanation.innerHTML = ""; //to erase thank message when going back to the last entry from the end.
	changeBackground();
	update();
	nextUsed = false;
}
function next() {
	changeBackground(); //description and background mismatch if this is called after increment.
	num = num == entries.length ? num : num + 1;
	update();
	nextUsed = true;
}
function changeVolume() {
	if(typeof music !== "undefined") music.volume = volume.value / 100;
}
//Read data and initialize.
var entries = [];
fileReader.read("play.txt", function(data) {
	const words = fileReader.getTokensFrom(data, undefined, '\n');
	for(var index = 0;index < words.length;index++) { //Warning: index is modified inside the loop.
		var upperCase = words[index].toUpperCase();
		console.log(upperCase);
		if(upperCase === "TEXT") entries.push(new Entry(Type.TEXT, words[++index])); //Texts don't need sources.
		else if(upperCase === "MUSIC" || upperCase === "IMAGE") {
			entries.push(new Entry(Type[upperCase], words[index + 1], words[index + 2]));
			index += 2;
		}
	}
	//Warnings for incorrect datasets
	if(entries[0].type != Type.IMAGE) alert("The first entry is not an image. Problems may occur.");
});

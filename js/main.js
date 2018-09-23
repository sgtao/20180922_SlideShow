'use strict'; // êÑèßíËã`

var isStarted = false;
var start = document.getElementById('start');
var stop  = document.getElementById('stop');

var slideIndex = 0;
showInitSlide();

function showInitSlide() {
    var i;
    var slides = document.getElementsByClassName("mySlides");
 	if (slides.length <= 0) {
		return;
	}
   for (i = 0; i < slides.length; i++) {
		slides[i].style.display = "none";
    }
    slides[0].style.display = "block";

}

function showSlides() {
    if (isStarted === false) {
      return;
    }
    var i;
    var interval = 3000; // default interval 3sec.
	var slide;
    var slides = document.getElementsByClassName("mySlides");

    for (i = 0; i < slides.length; i++) {
		slides[i].style.display = "none";
    }

	slide = slides[slideIndex];
    slide.style.display = "block";

    // set interval of this slide
	if (slide.id == "content") { interval = 4000; }
	else { interval = 3000;	} 

    slideIndex++;
    if (slideIndex >= slides.length) {slideIndex = 0; isStarted = false; }

    setTimeout(showSlides, interval); // Change image along above interval
}

start.addEventListener('click', function(){
    if (isStarted === true) {
		return;
    }
    isStarted = true;
    this.className = 'pushed';
    stop.className = '';
    showSlides();
});

stop.addEventListener('click', function(){
    if (isStarted === false) {
		return;
    }
    isStarted = false;
    start.className = '';
    this.className = 'pushed';
    showSlides();
});


'use strict'; // êÑèßíËã`

var isStarted = false;
var start = document.getElementById('start');
var stop  = document.getElementById('stop');

var slideIndex = 0;
showInitSlide();

function showInitSlide() {
    var i;
    var slides = document.getElementsByClassName("mySlides");
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
    var slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
	slides[i].style.display = "none";
    }

    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
    slides[slideIndex-1].style.display = "block";

    setTimeout(showSlides, 2000); // Change image every 2 seconds
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


'use strict'; // recommended define

//jsonファイルURL
var directory = 'contents';
var file = 'gobi002.json';
// var url = 'http://' + dmain + '/' + directory + '/' + file + 'json';
var url = directory + '/' + file;
var load_contents = new Array();

// setting canvas
var canvas = document.getElementById('textarea');
var ctx = canvas.getContext('2d');
var ctx_w = $('.wrapper').width();
var ctx_h = $('.wrapper').height();
$('#textarea').attr('width', ctx_w);
$('#textarea').attr('height', ctx_h);
var fontSize = 16 ;	// フォントサイズ
var content_color = 'black';
var content_font = fontSize +"pt Arial ";
ctx.fillStyle = content_color;
ctx.font = content_font;
console.dir(ctx);

// for guideance slide
var guideIndex = 0;
var img_src_array = [];
var imgs_array = [];
img_src_array.push('img/gobi_00_title.jpg');
img_src_array.push('img/gobi_01_howto.jpg');
img_src_array.push('img/gobi_02_advice.jpg');
img_src_array.push('img/gobi_03_start.jpg');
var slide_img = new Image();
slide_img.src = img_src_array[0];

function loadImages(img_src_array, imgs_array){
  return new Promise((resolve, reject) => {
    for  (let i=0; i<img_src_array.length;i++) {
      imgs_array[i] = new Image();
      imgs_array[i].src = img_src_array[i];
      imgs_array[i].onload = () => resolve(imgs_array[i]);
      imgs_array[i].onerror = (e) => reject(e);
      console.log('load image : '+ img_src_array[guideIndex]);
    }
  });
}

window.onload = function() {
  loadImages(img_src_array, imgs_array).catch(e=>{console.log('err',e)});
  showSlideArea("initial");
}

// setting of slideshow
var isStarted = false, isFinished = false;
var contentIndex = 0, textIndex = 0;
var interval = 3000; // default interval 3sec.
var context = {question:"hoge", check:"foo", example:"bar"};
var content_struct = { number : "Qx", context: context };
var content_number = "";
var number_array = new Array(); // for content_number
var type_array = new Array();
var text_array = new Array();

//イベント
$(function(){
  $('#start').click(function(){
      if (isStarted === true) {
        return;
      }
      let data = "";
      let xhr = $.ajax({
        type: 'GET',
        url:  url,
        async: false
      }).done(function(){
        $('#msg').text('Loading... ' + url).fadeOut(1000);
      }).fail(function(){
        $('#msg').text('Cannot find ' + url);
        return;
      });
      data = xhr.responseText;
      load_contents = JSON.parse(data);
      console.log('loading contents : ' + load_contents.length);
      console.dir(load_contents);
      isStarted = true;
      isFinished = false;
      startSlideshow(load_contents);
    });
});

// prepare window
function showContentNumber(str){
  let bkup_font = ctx.font;
  let bkup_fillStyle = ctx.fillStyle;

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, 70, 30);
  ctx.font = "20pt Arial";
  ctx.fillStyle = 'white';
  ctx.fillText(content_number, 10, 25);
  ctx.font = bkup_font;
  ctx.fillStyle = bkup_fillStyle;

  return;
}
function showSlideArea(type){
  let bkup_font = ctx.font;
  let bkup_fillStyle = ctx.fillStyle;

  ctx.clearRect(0, 0, ctx_w-1, ctx_h-1);
  ctx.strokeRect(0, 0, ctx_w-1, ctx_h-1);

  switch (type) {
    case "initial" :
      ctx.drawImage(slide_img, 0, 0, ctx_w, ctx_h);
      break;
    case "genre" :
      showContentNumber(content_number);
      ctx.fillText("下のジャンルについて質問します。", 20, 70);
      break;
    case "question" :
      showContentNumber(content_number);
      ctx.fillText("質問", 20, 70);
      ctx.fillStyle = 'blue';
      ctx.fillText("回答してください。", ctx_w-240, ctx_h-30);
      ctx.font = bkup_font;
      ctx.fillStyle = bkup_fillStyle;
      break;
    case "check" :
      showContentNumber(content_number);
      ctx.fillText("CHECK", 20, 70);
      break;
    case "example" :
      showContentNumber(content_number);
      ctx.fillText("回答例", 20, 70);
      break;
    case "endslide" :
      showText("以上で終了です。")
      ctx.font = "30pt Arial";
      showText("\n\n　おつかれさまでした。")
      ctx.font = bkup_font;
      break;
    default :
      showContentNumber(content_number);
      return;
  }
}

// start slideshow
function startSlideshow(load_contents){

  // Show Guidance
  guideIndex = 0;
  showGuideSlide(img_src_array);

  // Start slideshow of contents
  setTimeout(startContents, interval * (img_src_array.length + 1), load_contents);
}

function showGuideSlide(img_src_array) {
  if (guideIndex >= img_src_array.length) {
    return;
  }
  console.log('draw image : '+ img_src_array[guideIndex]);
  slide_img = imgs_array[guideIndex];
  showSlideArea("initial");

  // next Slide
  guideIndex++;
  setTimeout(showGuideSlide, interval, img_src_array);
}



function startContents(load_contents){
  console.log('startContents');
  // prepare contents array
  let contents_array = new Array(load_contents.length);
  for (let n=0; n < load_contents.length; n++ ) {
    contents_array[n] = load_contents[n];
  }

  number_array.length = 0;
  type_array.length = 0;
  text_array.length = 0;
  for (let i=0; i < load_contents.length; i++ ) {
    number_array.push(load_contents[i].number);
    type_array.push("genre");
    text_array.push(load_contents[i].context.genre);
    type_array.push("question");
    text_array.push(load_contents[i].context.question);
    type_array.push("check");
    text_array.push(load_contents[i].context.check);
    type_array.push("example");
    text_array.push(load_contents[i].context.example);
  }
  console.dir(number_array);
  console.dir(type_array);
  console.dir(text_array);

  // start Slideshow
  contentIndex = 0;
  textIndex = 0;
  showContents(type_array, text_array);

}

function showContents(type_array, text_array){
  console.log('showContents( contentIndex : '+contentIndex+'): textIndex ' + textIndex);
  if (isStarted === false) {
    if (isFinished === true) {showSlideArea("endslide");}
    return;
  }
  content_number = number_array[contentIndex];
  showSlideArea(type_array[textIndex]);
  showText(text_array[textIndex]);

  // set interval of this slide
  if (type_array[textIndex] == "example") {contentIndex++;}
  textIndex++;
  if (textIndex >= text_array.length) { isStarted = false; isFinished = true;}

  setTimeout(showContents, interval, type_array, text_array); // Change text along above interval

}

function showText(text){
  // 1行ずつ描画
  let lineHeight = 3 ;	// 行の高さ (フォントサイズに対する倍率)

  for(var lines=text.split( "\n" ), i=0, l=lines.length; l>i; i++ ) {
	   var line = lines[i] ;
	   var addY = fontSize;

	   // 2行目以降の水平位置は行数とlineHeightを考慮する
	   if ( i ) addY += fontSize * lineHeight * i ;
     ctx.fillText( line, 20 + 0, 90 + addY ) ;
   }
}

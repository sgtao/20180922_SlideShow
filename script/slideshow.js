'use strict'; // recommended define

//jsonファイルURL
var directory = 'contents';
var file =  'gobi002.json';
var json_url = directory + '/' + file;
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
img_src_array.push('img/000_Hinagata.jpg');
var slide_img = new Image();
slide_img.src = img_src_array[0];

// setting of slideshow
var isStarted = false, isFinished = false;
var contentIndex = 0, textIndex = 0;
var base_interval = 3000; //  default interval 3sec(3000 msec).
var guide_int = base_interval; // interval for guide slides
var texts_int = base_interval; // interval for content texts
var context = {question:"hoge", check:"foo", example:"bar"};
var content_struct = { number : "Qx", context: context };
var content_number = "";
var number_array = new Array(); // for content_number
var type_array = new Array();
var text_array = new Array();

// first action at window.load
window.onload = function() {
  // get parameter
  let urlParam = location.search.substring(1);
  if(urlParam) {
    // split at &
    let param = urlParam.split('&');
    let paramArray = [];
    for (let i = 0; i < param.length; i++) {
      let paramItem = param[i].split('=');
      paramArray[paramItem[0]] = paramItem[1];
    }

    // check id parameter to set JSON file and type of content
    let filename = new String(paramArray.id + ".json")
    console.log("filename=" + filename);
    if (filename.indexOf("gobi") === 0) {
      // title name
      var top_title = document.getElementById('title');
      top_title.textContent = "語尾トレーニング" + filename.substring(4,7);
      json_url = directory + '/' + filename; // JSON file
      // slide images
      img_src_array.length=0;
      img_src_array.push('img/gobi_00_title.jpg');
      img_src_array.push('img/gobi_01_howto.jpg');
      img_src_array.push('img/gobi_02_advice.jpg');
      img_src_array.push('img/gobi_03_start.jpg');
    } else if (filename.indexOf("iken") === 0) {
      // title name
      var top_title = document.getElementById('title');
      top_title.textContent = "意見＋理由トレーニング" + filename.substring(4,7);
      json_url = directory + '/' + filename; // JSON file
      // slide images
      guide_int = 5000; // set up for iken training.
      img_src_array.length=0;
      img_src_array.push('img/iken_00_title.jpg');
      img_src_array.push('img/iken_01_howto.jpg');
      img_src_array.push('img/iken_02_advice.jpg');
      img_src_array.push('img/iken_03_start.jpg');
    } else {
      img_src_array.length=0;
      img_src_array.push('img/000_Hinagata.jpg');

    }
    slide_img.src = img_src_array[0];
    showSlideArea("initial");
  }

  // load images
  loadImages(img_src_array, imgs_array).catch(e=>{console.log('err',e)});
  showSlideArea("initial");

  // load JSON file
  console.log("json=" + json_url);
  loadContentJSON(json_url);

}

function loadImages(img_src_array, imgs_array){
  return new Promise((resolve, reject) => {
    for  (let i=0; i<img_src_array.length;i++) {
      imgs_array[i] = new Image();
      imgs_array[i].src = img_src_array[i];
      imgs_array[i].onload = () => resolve(imgs_array[i]);
      imgs_array[i].onerror = (e) => reject(e);
      console.log('load image : '+ img_src_array[i]);
    }
  });
}

function loadContentJSON(json_url){
  let data = "";
  let xhr = $.ajax({
    type: 'GET',
    url:  json_url,
    async: false
  }).done(function(){
    $('#msg').text('Loading... ' + json_url).fadeOut(1000);
  }).fail(function(){
    $('#msg').text('Cannot find ' + json_url);
    return;
  });
  data = xhr.responseText;
  load_contents = JSON.parse(data);
  console.log('loading contents : ' + load_contents.texts.length);
  console.log('base interval    : ' + load_contents.base_interval);
  texts_int = load_contents.base_interval; // unit : msec
  console.dir(load_contents);
}

//イベント
$(function(){
  $('#start').click(function(){
      if (isStarted === true) {
        return;
      }
      this.className = 'pushed';
      console.log($('#start').text);
      $('#start').text('Running');
      isStarted = true;
      isFinished = false;
      startSlideshow(load_contents.texts);
    });

    $('#reload').click(function(){
    });

    $('#close').click(function(){
      window.close();
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
      ctx.fillStyle = 'darkblue';
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
  setTimeout(startContents, guide_int * (img_src_array.length + 1), load_contents);
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
  setTimeout(showGuideSlide, guide_int, img_src_array);
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
    if (isFinished === true) {
      $('#start').className = 'released'; // it dosen't active.
      $('#start').text('finished');
      showSlideArea("endslide");
    }
    return;
  }
  content_number = number_array[contentIndex];
  showSlideArea(type_array[textIndex]);
  showText(text_array[textIndex]);

  // set interval of this slide
  if (type_array[textIndex] == "example") {contentIndex++;}
  textIndex++;
  if (textIndex >= text_array.length) { isStarted = false; isFinished = true;}

  setTimeout(showContents, texts_int, type_array, text_array); // Change text along above interval

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

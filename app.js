const mainEl = document.querySelector('main');
const content = document.querySelector('.content');
const images = [...document.querySelectorAll('.img')];
var total_images_count = 0;
const num_of_layers=2;
var current_image_enlarged="None";
var current_image_left_offset="None";
var current_image_top_offset="None";
var image_parallex_effect=false;

// set app height to be window.innerheight as vh doesnt work properly on mobile: https://dev.to/maciejtrzcinski/100vh-problem-with-ios-safari-3ge9
const doc = document.documentElement
const appHeight = () => {
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    current = -slide * window.innerHeight; 
    content.style.transform = `translateY(-${slide * window.innerHeight}px)`;
}

images.forEach((image, idx) => {
	total_images_count+=1;
	for (let layer=0; layer < num_of_layers; layer++){
		//image.style.backgroundImage = `url(./images/${idx + 1}.jpeg)`;
		//image_link = `./images/${idx + 1}.jpeg`;'
		image_link = './images/'+(idx+1)+"_"+(layer+1)+".png";
		let img = document.createElement('img');
		img.onload = function() {
			var img_width = document.getElementById(img.id).clientWidth;
			var image_height = document.getElementById(img.id).clientHeight;
			img_ratio_height_to_width = image_height/img_width;
			if (img_ratio_height_to_width>1){
				document.getElementById(img.id).style.width = 100/img_ratio_height_to_width +"%";
				document.getElementById(img.id).style.height = "100%";
				document.getElementById(img.id).style.left = (100-(100/img_ratio_height_to_width))/2 + "%";
				document.getElementById(img.id).style.top = "0%";
			}
			else{
				document.getElementById(img.id).style.width = "100%";
				document.getElementById(img.id).style.height = 100*img_ratio_height_to_width +"%";
				document.getElementById(img.id).style.left = "0%";
				document.getElementById(img.id).style.top = (100-(100*img_ratio_height_to_width))/2 + "%";
			}
		}
		img.src = image_link;
		image.appendChild(img);
		img.classList.add("img_content");
		img.id='img'+total_images_count+'_'+(layer+1);
	}
	image.addEventListener('click', () => {
		console.log("jhgjhgimage"+idx);
		console.log(current_image_enlarged);
		if (current_image_enlarged==="img"+(idx+1)){ // Image is the current enlarge ones
			current_image_enlarged="None";
			for (let layer=0; layer < num_of_layers; layer++){
				document.getElementById("img"+(idx+1)+"_"+(layer+1)).style.left = current_image_left_offset+"%";
				document.getElementById("img"+(idx+1)+"_"+(layer+1)).style.top = current_image_top_offset+"%";
			}
			current_image_left_offset="None";
			current_image_top_offset="None";
			image_parallex_effect=false;
			image.classList.remove('active');
		}
		else{
			current_image_enlarged="img"+(idx+1);
			current_image_left_offset=Number(document.getElementById("img"+(idx+1)+"_1").style.left.replace("%",""));
			current_image_top_offset=Number(document.getElementById("img"+(idx+1)+"_1").style.top.replace("%",""));
			image_parallex_effect=true;
			image.classList.toggle('active');
		}
		
	})
    
})

// measure translate pixels
let current = 0;

// Store slide number
let slide = 0;

window.addEventListener('resize', appHeight)
appHeight();

mainEl.addEventListener("touchstart", startTouch, {passive: false});
mainEl.addEventListener("touchend", endTouch, false);
mainEl.addEventListener("touchmove", moveTouch, {passive: false});
mainEl.addEventListener("mousedown", startMousedown, false);
mainEl.addEventListener("mouseup", startMouseup, false);
mainEl.addEventListener('wheel', wheelFunc, {passive: false})
window.addEventListener('deviceorientation', handleOrientation);


document.addEventListener('mousemove', function() {
	// document.getElementById("headerWord1").innerHTML = rect.top +" " + event.pageY;
	// document.getElementById("sub").innerHTML = event.pageY;
	//for (filename in filename_to_numOfLayers){

	//	num_of_layers=filename_to_numOfLayers[filename];
	
	xMousePos=event.pageX;
	yMousePos=event.pageY;

	xMousePos_from_center = xMousePos - (window.innerWidth/2);
	yMousePos_from_center = yMousePos - (window.innerHeight/2);
	
	//allowable movement
	base_left_right_move_allowable = 10; //max 10px to left / right
	base_top_down_move_allowable = 10; //max 10px to top / down
	left_right_tilt_alllowable = 2; // max allowable tilt is 30deg, left to right
	top_down_tilt_alllowable = 2; // max allowable tilt is 30deg, top to down
	
	base_window_width_to_left_right_allowable_movement_ratio = window.innerWidth/base_left_right_move_allowable;
	base_window_height_to_top_down_allowable_movement_ratio = window.innerHeight/base_top_down_move_allowable;
	base_window_width_to_left_right_allowable_rotate_ratio = window.innerWidth/left_right_tilt_alllowable;
	base_window_height_to_top_down_allowable_rotate_ratio = window.innerHeight/top_down_tilt_alllowable;
	
	if ((image_parallex_effect===true) && (current_image_enlarged!="None")){
		for (i=0; i<num_of_layers; i++){
			console.log("current_image_left_offset = "+current_image_left_offset);
			console.log("current_image_top_offset = "+current_image_top_offset);
			console.log((current_image_left_offset + (xMousePos_from_center/(base_window_width_to_left_right_allowable_movement_ratio/(i+1)))) +"%");
			console.log(current_image_enlarged+"_"+(i+1));
			document.getElementById(current_image_enlarged+"_"+(i+1)).style.left = (current_image_left_offset + (xMousePos_from_center/(base_window_width_to_left_right_allowable_movement_ratio/(i+1)))) +"%";
			document.getElementById(current_image_enlarged+"_"+(i+1)).style.top = (current_image_top_offset + (yMousePos_from_center/(base_window_height_to_top_down_allowable_movement_ratio/(i+1)))) +"%";
			//document.getElementById(current_image_enlarged+"_"+(i+1)).style.transform = "rotateY(" + (xMousePos_from_center/base_window_width_to_left_right_allowable_rotate_ratio) +"deg) rotateX(" + (-yMousePos_from_center/base_window_height_to_top_down_allowable_rotate_ratio) + "deg)";
			
			//document.getElementById("img2").style.left = (xMousePos_from_center/img2_window_width_to_left_right_allowable_movement_ratio) +"px";
			//document.getElementById("img2").style.top = (yMousePos_from_center/img2_window_height_to_top_down_allowable_movement_ratio) +"px";
			//document.getElementById("img2").style.transform = "rotateY(" + (xMousePos_from_center/img2_window_width_to_left_right_allowable_rotate_ratio) +"deg) rotateX(" + (-yMousePos_from_center/img2_window_height_to_top_down_allowable_rotate_ratio) + "deg)";
		}
	}
});

curr_alpha = 0;
curr_beta = 0;
curr_gamma = 0;

function handleOrientation(event) {
  alpha = Math.round(event.alpha * 100) / 100;
  beta = Math.round(event.beta * 100) / 100;
  gamma = Math.round(event.gamma * 100) / 100;
  // Do stuff...
  
  value_abs_cap=35;
  
  if ((curr_alpha===0) && (curr_beta===0) && (curr_gamma===0)){
	console.log('base');
	curr_alpha = alpha;
	curr_beta = beta;
	curr_gamma = gamma;
  }
  
  if ((curr_beta-beta)>value_abs_cap){
	beta=curr_beta-value_abs_cap;
  }
  else if  ((curr_beta-beta)<-value_abs_cap){
	beta=curr_beta+value_abs_cap;
  }
  
  tilt_top=0;
  if ((curr_beta-beta)<0){
	tilt_top= -Math.log10(beta-curr_beta+1);
  }
  else{
	tilt_top= Math.log10(curr_beta-beta+1);
  }
  
  if ((curr_gamma-gamma)>value_abs_cap){
	gamma=curr_gamma-value_abs_cap;;
  }
  else if  ((curr_gamma-gamma)<-value_abs_cap){
	gamma=curr_gamma+value_abs_cap;
  }

  tilt_left=0;
  if ((curr_gamma-gamma)<0){
	tilt_left= -Math.log10(gamma-curr_gamma+1);
  }
  else{
	tilt_left= Math.log10(curr_gamma-gamma+1);
  }
  
  if ((image_parallex_effect===true) && (current_image_enlarged!="None")){
		for (layer=0; layer<num_of_layers; layer++){
			document.getElementById(current_image_enlarged+"_"+(layer+1)).style.left = (current_image_left_offset + (tilt_left*3*(layer+1))) +"%";
			document.getElementById(current_image_enlarged+"_"+(layer+1)).style.top = (current_image_top_offset + (tilt_top*3*(layer+1))) +"%";
			//document.getElementById(current_image_enlarged+"_"+(i+1)).style.left = (current_image_left_offset + (xMousePos_from_center/(base_window_width_to_left_right_allowable_movement_ratio/(i+1)))) +"%";
			//document.getElementById(current_image_enlarged+"_"+(i+1)).style.top = (current_image_top_offset + (yMousePos_from_center/(base_window_height_to_top_down_allowable_movement_ratio/(i+1)))) +"%";
			
		}
  }
}

function move_everything_back_to_original_state(){
	if (current_image_enlarged!="None"){
		for (layer=0; layer<num_of_layers; layer++){
			document.getElementById(current_image_enlarged+"_"+(layer+1)).style.left = current_image_left_offset+"%";
			document.getElementById(current_image_enlarged+"_"+(layer+1)).style.top = current_image_top_offset+"%";
		}
	}
	console.log("current force none");
	current_image_enlarged="None";
	current_image_left_offset="None";
	current_image_top_offset="None";
	image_parallex_effect=false;
	// set all images back to original size
	images.forEach((image, idx) => {
		image.classList.remove('active');
	})
}


// Mouse grab/ Mouse wheel / track pad
let canSwipe = true;
function wheelFunc(e){
    if(canSwipe){
		
		console.log("asdasd");
		move_everything_back_to_original_state();
		
        // swipe up
        if(e.deltaY > 60 && current !== -(window.innerHeight * (total_images_count-1))){
            canSwipe = false;
            current -= window.innerHeight;
            slide++
            console.log(slide)
            content.style.transform = `translateY(${current}px)`;
            setTimeout(() => {
                canSwipe = true;
            }, 1000)
        }
    
        // Swipe down
        if(e.deltaY < -60 && current !== 0){
            canSwipe = false;
            current += window.innerHeight;
            slide--
            console.log(slide)
            content.style.transform = `translateY(${current}px)`;
            setTimeout(() => {
                canSwipe = true;
            }, 1000)
        }   
    } 
}

function startMousedown(e){
    initialStart = Date.now();
    initialY = e.clientY;
}

function startMouseup(e){
    initialEnd = Date.now();
    endY = e.clientY;
    if(initialEnd - initialStart < 800){
        swipe()
    }
}


// Touch screens
let initialY = null;
let endY = null;

let initialStart = 0
let initialEnd = 0
 
function startTouch(e) {
    initialStart = Date.now();
    initialY = e.touches[0].clientY;
}

function endTouch(e) {
    initialEnd = Date.now();
    endY = e.changedTouches[0].clientY;

    if(initialEnd - initialStart < 800){
		// set all images back to original size
		//images.forEach((image, idx) => {
		//	image.classList.remove('active');
		//})
        swipe()
    }
}

  function swipe(){
	  
      // Swipe up
      if(endY - initialY < -50){

          if(current !== -(window.innerHeight * (total_images_count-1))){
            current -= window.innerHeight;
            slide++;
			move_everything_back_to_original_state();
          }
          // Swipe down
      }else if(endY - initialY > 50){
          if(current !== 0){
            current += window.innerHeight;
            slide--;
			move_everything_back_to_original_state();
          }   
      }
      content.style.transform = `translateY(${current}px)`
  }

  function moveTouch(e){
      e.preventDefault()
  }

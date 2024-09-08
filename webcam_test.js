function hasGetUserMedia() {
	return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

if (hasGetUserMedia()) {
	// Good to go!
} else {
	alert('getUserMedia() is not supported by your browser');
}

var selectedCamera = '';
var currentStream = null;

function askForPermission(){
    let constraints = { video : true };
    navigator.mediaDevices.getUserMedia(constraints)
    .then(() => {
        // alert("Permission Granted!");
        populateCameraList();
    })
    .catch(() => {
        alert("TODO: write error message for when camera permisison is denied!");
    });
}


document.addEventListener('DOMContentLoaded', () => {
    askForPermission();

		document.querySelector('#camera-select').onchange = () => {
			// console.log("New selection!")
			let new_selection = document.querySelector('#camera-select').children[
				document.querySelector('#camera-select').selectedIndex
			].value;
			if (value != "-") {
				selectedCamera = new_selection;
				console.log(selectedCamera);
				setCamera();
			}
	    };
});

function populateCameraList() {
	document.querySelector('#camera-select').innerHTML = '';

	navigator.mediaDevices.enumerateDevices().then((deviceList) => {
		console.log(deviceList);

		selectedCamera = deviceList.filter((x) => x.kind == 'videoinput')[0].deviceId;

		let initItem = document.createElement('option');
		initItem.value = "-";
		initItem.innerHTML = "-- Select a camera --";
		document.querySelector('#camera-select').appendChild(initItem);

		deviceList.forEach((device) => {
			if (device.kind == 'videoinput') {
				console.log(device.label);
				let item = document.createElement('option');
				// item.setAttribute("value", device.label);
				item.value = device.deviceId;
				item.innerHTML = device.label;
				document.querySelector('#camera-select').appendChild(item);
			}
		});

		//setCamera();
	});
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function sleeper(ms) {
  return function(x) {
    return new Promise(resolve => setTimeout(() => resolve(x), ms));
  };
}

function setCamera() {
	  if (currentStream) {
    		currentStream.getTracks().forEach(track => track.stop());
    		currentStream = null;
    		setTimeout(() => {
		
		startStream();
		}, 2000); // Time till execution, in milliseconds.
  	}
	else {
		startStream();
	}
	

	
}

function stopStream(){
	let video = document.querySelector('#webcam-output');
	video.pause();
	var str = video.srcObject;
	
	if (str) {
    		str.getTracks().forEach(track => track.stop());
    		str = null;
  	}
	video.srcObject = null;
}

function startStream(){
	let constraints = {
		video: {
			deviceId: selectedCamera
		}
	};

	navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
		currentStream = stream;
		let video = document.querySelector('#webcam-output');
		video.srcObject = stream;
		video.play();
	});
	

}

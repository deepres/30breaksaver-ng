import '../css/popup.css';

import format_time from "./popup/processTime";


var badgins = [];

document.addEventListener('DOMContentLoaded', function () {


	chrome.tabs.query({
		active: true,
		lastFocusedWindow: true
	}, function (tabs) {

		chrome.tabs.executeScript({
			code: 'document.querySelector("iframe").contentWindow.document.querySelector(\'body\').innerHTML'
		}, display_h1);
	});
}, false);

function display_h1(results) {


	if (results == null || results == '') {
		return;
	}

	var tempDiv = document.createElement("DIV");
	tempDiv.innerHTML = results;
	var divs = tempDiv.querySelectorAll("div[id^='buch']")
	
	divs.forEach(convert_badgin);

	var fbadgins = badgins.sort(function(a, b){return a-b}).filter(function(a){ return a > 0;})

	var workstats = compute_time();

	var d = document;

	var f = d.createElement('div');
	f.innerHTML = "Curr work time = " + format_time(workstats.work_minutes);
	f.innerHTML += "<br>Curr user / total break time = " + format_time(workstats.user_pause_minutes) + ' / ' + format_time(workstats.pause_minutes);
	f.innerHTML += "<br>Curr spent / req time = " + format_time(workstats.elaps_minutes) + ' / ' + format_time(workstats.worktime_plus_break_min);
	f.innerHTML += "<br>Remaining time = " + format_time(workstats.remain_minutes);
	f.innerHTML += "<br>Earliest dep time = " + format_time(workstats.end_min_minutes, false);
	
	if( workstats.end_max_minutes > 0) {
		f.innerHTML += "<br>Latest dep time = " + format_time(workstats.end_max_minutes, false);
	}

	d.body.appendChild(f);
}

function convert_badgin(element) {

	if (element.innerHTML.trim() != "") {

		var result = 0;

		var start_time = '' + element.innerHTML;
		var hh, mm;
	
		hh = start_time.substring(0, 2);
		mm = start_time.substring(3, 5);
	
		result = parseInt(hh) * 60 + parseInt(mm);
		badgins.push(result);

	}
}

function compute_time() {

	var fbadgins = badgins.sort(function(a, b){return a-b}).filter(function(a){ return a > 0;})

	var _work = 0;
	var _user_pause = 0;
	var _pause = 30;

	for( var i = 0; i < fbadgins.length-1; ++i){

		if( i % 2 == 0) {
			_work += fbadgins[i+1] - fbadgins[i];
		} else {
			_user_pause += fbadgins[i+1] - fbadgins[i];
		}
	}

	if( _user_pause < 30 ) {
	
	} else {
		_pause += _user_pause - _pause;
	}

	var today = new Date();
	var curr_minutes = today.getHours() * 60 + today.getMinutes(); 
	var start_minutes = fbadgins[0];
	var _elaps_minutes = curr_minutes - start_minutes;
	var _elaps_minutes_with_pause = _elaps_minutes + _pause;
	//alert( "c " + curr_minutes + ' s ' + start_minutes + ' p ' + _pause)

	var _worktime_plus_break_min = 8 * 60 + 24 + _pause;
	var _worktime_plus_break_max = 8 * 60 + 59 + _pause;

	var _remain_minutes = _worktime_plus_break_min - _elaps_minutes_with_pause;
	var _end_min_minutes = start_minutes + _worktime_plus_break_min;
	var _end_max_minutes = start_minutes + _worktime_plus_break_max;

	if( _pause > 60 ) {
		worktime_plus_break_max = -1;
		_end_max_minutes = -1;
	}


	return {
		work_minutes: _elaps_minutes - _user_pause,
		user_pause_minutes: _user_pause,
		pause_minutes: _pause,
		elaps_minutes: _elaps_minutes_with_pause,
		worktime_plus_break_min : _worktime_plus_break_min,
		remain_minutes: _remain_minutes,
		end_min_minutes: _end_min_minutes,
		end_max_minutes: _end_max_minutes
	}

}
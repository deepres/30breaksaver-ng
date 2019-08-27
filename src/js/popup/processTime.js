export default function format_time(minutes, timer=true) {
	if( timer ){
		return (Math.floor(minutes / 60)).toString().padStart(2, '0') + 'h:' + (minutes % 60).toString().padStart(2, '0') + 'm';
	} else {
		return (Math.floor(minutes / 60)).toString().padStart(2, '0') + ':' + (minutes % 60).toString().padStart(2, '0');
	}
}

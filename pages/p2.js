import Clarino from '../js/lib/clarino.module.js';

const $C = Clarino.version('2.4.1');
const $H = $C.simple;

const pageTitle = 'page 2';

export function view(){
	const {markup,apply,h2,div,span,button} = $H;
	$C.form('#main .content', markup(
			h2(pageTitle),
			div('page content')
		),{
	});
}



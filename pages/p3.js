import Clarino from '../js/lib/clarino.module.js';

const $C = Clarino.version('2.4.1');
const $H = $C.simple;

const pageTitle = 'page 3';

export function view(query){
	// console.log('Query: %o', query);
	const {markup,apply,h2,div,span,button} = $H;
	$C.form('#main .content', markup(
			h2(pageTitle),
			div('Item: ', query.join(' '))
		),{
	});
}



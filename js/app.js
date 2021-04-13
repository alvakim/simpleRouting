import Clarino from './lib/clarino.module.js';
import Router from './router.js';

const $C = Clarino.version('2.4.1');
const $H = $C.simple;
const {px,pct,em} = $C.css.unit, css = $C.css.keywords, {border} = $C.css.template;

$C.css.addStylesheet('AppStyles', {
	'#main':{
		display: 'grid',
		gridTemplateColumns: px(280, css.auto),
		' .menu':{
			gridColumnStart: 1
		},
		' .content':{
			gridColumnStart: 2
		}
	}
});

const menu = [
	{id:'main', title:'Main', sub:[
		{target:'page_1', title:'Page 1'},
		{id:'deeper', title:'Deeper', sub:[
			{target:'page_3_xx', title:'Page 3 (xx item)'},
			{target:'page_4', title:'Page 4'}
		]}
	]},
	{target:'page_2', title:'Page 2'}
];

function buildMenu(items=menu, rootID){
	const {markup,apply,ul,li,span} = $H;
	return ul(
		apply(items, el=>li(
			el.target?span({'class':'link', 'data-id':(rootID?rootID+'_':'')+el.target}, el.title)
				:span(el.title),
			el.sub?buildMenu(el.sub, (rootID?rootID+'_':'')+el.id):null
		))
	);
}

const {markup,apply,div,span,button} = $H;
$C.form('#main', markup(
		div({'class':'menu'}, buildMenu()),
		div({'class':'content'}, 'CONTENT')
	),{
		'.link':{click:function(ev){
			const id = ev.target.getAttribute('data-id');
			Router.route(id, '#main .content');
		}}
});

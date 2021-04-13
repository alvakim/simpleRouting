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
			gridColumnStart: 1,
			' li':{
				margin: px(13, 0),
				' span':{
					padding:px(3),
					'.current':{
						backgroundColor:'#8ff',
						color: '#002'
					}
				}
			}
		},
		' .content':{
			gridColumnStart: 2
		}
	}
});

const router = Router([
	{id:'main', title:'Main', sub:[
		{target:'page_1', title:'Page 1'},
		{id:'deeper', title:'Deeper', sub:[
			{target:'page_3_xx', title:'Page 3 (xx item)'},
			{target:'page_4', title:'Page 4'}
		]}
	]},
	{target:'page_2', title:'Page 2'}
]);


const {markup,apply,div,span,button} = $H;
$C.form('#main', markup(
		div({'class':'menu'}),
		div({'class':'content'}, 'CONTENT')
	),{
		'.menu':{each:function(el){
			router.buildMenu(el);
		}}
});

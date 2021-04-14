import Clarino from './lib/clarino.module.js';
import Router from './router.js';

const $C = Clarino.version('2.4.1');
const $H = $C.simple;
const {px,pct,em} = $C.css.unit, css = $C.css.keywords, {border} = $C.css.template;

$C.css.addStylesheet('AppStyles', {
	'#main':{
		display: 'grid',
		height:'80vh',
		gridTemplateColumns: px(280, css.auto),
		gridTemplateRows: px(50, css.auto),
		' .menu':{
			// border:border(1, '#f00'),
			gridColumnStart: 1,
			gridColumnEnd: 1,
			gridRowStart: 1, 
			gridRowEnd: 3,
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
		' .thirdPageMenu':{
			// border:border(1, '#ff0'),
			gridColumnStart:2,
			gridColumnEnd:2,
			gridRowStart:1,
			gridRowEnd:2,
			' li':{
				display: css.inline
			}
		},
		' .content':{
			// border:border(1, '#0f0'),
			gridColumnStart: 2,
			gridRowStart: 2
		}
	}
});

const router = Router({
	contentPanel:'#main .content',
	menuMap:[
		{id:'main', title:'Main', sub:[
			{target:'page:1', title:'Page 1'},
			{id:'deeper', title:'Deeper', sub:[
				{target:'page:3:xx', title:'Page 3 (xx item)'},
				{target:'page:4', title:'Page 4'}
			]},
			{target:'page:2', title:'Page 2'}
		]},
		{id:'optional', title:'Optional', sub:[
			{id:'thirdPage', title:'Page 3', sub:[
				{target:'page:3:abc', title:'ABC'},
				{target:'page:3:def', title:'DEF'},
				{target:'page:3:ghi', title:'GHI'}
			]}
		]}
	],
	handlers:{
		'page':function(path, pnl){
			const nr = path[0];
			import(`../pages/p${nr}.js?t=${new Date().getTime()}`).then(pp=>{
				pp.view(path.slice(1));
			});
		}
	}
});

const {markup,apply,div,span,button} = $H;
$C.form('#main', markup(
		div({'class':'menu mainMenu'}),
		div({'class':'menu thirdPageMenu'}, 'Third menu'),
		div({'class':'content'}, 'CONTENT')
	),{
		'.mainMenu':{each:function(el){
			router.buildMenu(el);
		}},
		'.thirdPageMenu':{each:function(el){
			router.buildMenu(el, 'optional:thirdPage');
		}}
});

window.addEventListener('load', function(){
	router.init(document.location.hash.slice(1));
});

import Clarino from './lib/clarino.module.js';
import Router from './router.js';
import {view as orgView} from '../portal/org.js';

const $C = Clarino.version('2.4.1');
const $H = $C.simple;
const {px,pct,em} = $C.css.unit, css = $C.css.keywords, {border} = $C.css.template;

$C.css.addStylesheet('PortalStyles', {
	'a.current':{
		backgroundColor:'#8ff',
		color: '#002'
	},
	'#main':{
		display: 'grid',
		height:'80vh',
		gridTemplateColumns: px(280, css.auto),
		gridTemplateRows: px(70, 200, css.auto),
		' .pnl':{
			margin:px(5),
			padding:px(5)
		},
		' .mainMenu':{
			border:border(1, '#800'),
			gridColumnStart: 2,
			gridColumnEnd: 2,
			gridRowStart: 1, 
			gridRowEnd: 1,
			' li':{
				display: css.inline,
				margin: px(1, 18),
				' span':{
					padding:px(5),
					'.current':{
						backgroundColor:'#8ff',
						color: '#002'
					}
				}
			}
		},
		' .selected':{
			border:border(1, '#880'),
			gridColumnStart:1,
			gridColumnEnd:1,
			gridRowStart:2,
			gridRowEnd:3,
			' li':{
				// display: css.inline
			}
		},
		' .recent':{
			border:border(1, '#088'),
			gridColumnStart: 1,
			gridColumnEnd: 1,
			gridRowStart: 3,
			gridRowEnd: 4
		},
		' .content':{
			border:border(2, '#080'),
			gridColumnStart: 2,
			gridColumnEnd: 2,
			gridRowStart: 2,
			gridRowEnd:4 
		}
	}
});

const router = Router({
	contentPanel:'#main .content',
	pathSeparator:'_',
	menuMap:[
		{id:'main', title:'Main', sub:[
			{target:'org', title:'Учреждение'},
			{target:'usr', title:'Сотрудники'},
			{target:'srv', title:'Сервисы'},
		]}
	],
	handlers:{
		'org': function(path, pnl){orgView(path, pnl);},
		'usr': function(path, pnl){
			const nr = path[0];
			import('../portal/usr.js?t'+new Date().getTime()).then(mod=>{
				mod.view(path, pnl);
			});
		},
		'srv': function(path, pnl){
			const nr = path[0];
			import('../portal/srv.js').then(mod=>{
				mod.view(pnl);
			});
		}
	}
});

const {markup,apply,div,span,button,ul,li,a} = $H;
$C.form('#main', markup(
		div({'class':'pnl menu mainMenu'}),
		div({'class':'pnl selected'}, 
			div('Selected'),
			ul(
				li(a({href:'#main_usr_phones_1'}, 'Иванов И.И.')),
				li(a({href:'#main_usr_phones_2'}, 'Петров П.П.'))
			)
		),
		div({'class':'pnl recent'}, 'Recent'),
		div({'class':'pnl content'}, 'CONTENT')
	),{
		'.mainMenu':{each:function(el){
			router.buildMenu(el, 'main');
		}},
		'.selected a':{click:function(ev){
			router.route(ev.target.getAttribute('href').slice(1));
		}}
});

window.addEventListener('load', function(){
	router.init(document.location.hash.slice(1));
});

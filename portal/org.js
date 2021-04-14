import Clarino from '../js/lib/clarino.module.js';
import Router from '../js/router.js';

const $C = Clarino.version('2.4.1');
const $H = $C.simple;
const {px,pct,em} = $C.css.unit, css = $C.css.keywords, {border} = $C.css.template;

$C.css.addStylesheet('OrgStyles', {
	'#main .content':{
		' .submenu':{
			' li':{
				display: css.inline,
				margin:px(2, 25),
				' span':{
					padding:px(2),
					'.current':{
						color:'#004',
						backgroundColor:'#88ffff'
					}
				}
			}
		}
	}
});

const router = Router({
	rootPath:'#main_org',
	pathSeparator:'_',
	contentPanel:'#orgContent',
	menuMap:[
		{target:'str', title:'Структура'},
		{target:'map', title:'Поэтажный план'},
	],
	handlers:{
		'str':function(path, pnl){
			pnl.innerHTML = $H.div('Структура учреждения');
		},
		'map':function(path, pnl){
			pnl.innerHTML = $H.div('Поэтажный план учреждения');
		}
	}
});

function view(path, pnl){
	const {markup,apply,h1,h2,div,span} = $H;
	$C.form(pnl, markup(
			div({'class':'menu submenu'}),
			h2('Учреждение'),
			div({id:'orgContent'})
		),{
			'.submenu':{each:function(el){
				router.buildMenu(el);
			}}
	});

	router.init(path);
}

export {
	view
};

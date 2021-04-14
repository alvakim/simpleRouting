import Clarino from '../js/lib/clarino.module.js';
import Router from '../js/router.js';

const $C = Clarino.version('2.4.1');
const $H = $C.simple;
const {px,pct,em} = $C.css.unit, css = $C.css.keywords, {border} = $C.css.template;

$C.css.addStylesheet('UsrStyles', {
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
	},
	'#usrContent':{
		' ul':{
			'float':css.left
		},
		' .usrData':{
			marginLeft:px(200)
		}
	}
});

const users = [
	{id:1, name:'Иванов И.И.', phone:'444-44-44'},
	{id:2, name:'Петров П.П.', phone:'333-33-33'},
	{id:3, name:'Сидоров С.С.', phone:'555-55-55'}
];

const router = Router({
	rootPath:'#main_usr',
	pathSeparator:'_',
	contentPanel:'#usrContent',
	menuMap:[
		{target:'phones', title:'Телефонный справочник'},
		{target:'map', title:'Схема рассадки'},
	],
	handlers:{
		'phones':function(path, pnl){
			// console.log('view phones: %o', path);
			const {markup,apply,div,span,h2,a,ul,li} = $H;

			function userCard(id){
				// console.log('show user card %s', id);
				const user = users.find(x=>x.id==id);
				return markup(
					div(user.name),
					div(user.phone)
				);
			}

			$C.form(pnl, markup(
					h2('Телефонный справочник'),
					ul(
						apply(users, usr=>li(a({
							'class':'lnkUser' + (path.length&&usr.id==path[0]?' current':''),
							href:router.buildPath('phones', usr.id),
							'data-id':usr.id
						}, usr.name)))
					),
					div({'class':'usrData'},
						path.length?userCard(path[0]):null
					)
				),{
					'.lnkUser':{click:function(ev){
						ev.stopPropagation();
						pnl.querySelectorAll('.lnkUser').forEach(el=>{
							el.classList.remove('current');
						});

						const lnk = ev.target;
						lnk.classList.add('current');
						const id = lnk.getAttribute('data-id');
						pnl.querySelector('.usrData').innerHTML = userCard(id);
					}}
			});
		},
		'map':function(path, pnl){
			pnl.innerHTML = $H.div('Схема рассадки');
		}
	}
});

function view(path, pnl){
	const {markup,apply,h1,h2,div,span} = $H;
	$C.form(pnl, markup(
			div({'class':'menu submenu'}),
			h2('Сотрудники'),
			div({id:'usrContent'})
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

import Clarino from './lib/clarino.module.js';

const $C = Clarino.version('2.4.1');
const $H = $C.simple;
const {px,pct,em} = $C.css.unit, css = $C.css.keywords, {border} = $C.css.template;


export default function Router(menuDef){
	const menu = menuDef;

	const menuPanels = new Map();

	function route(path, pnl, subPathMode=false){
		if(typeof(pnl)=='string') pnl = document.querySelector(pnl);
		// console.log('route to "%s"', path);
		if(!subPathMode){
			document.location.hash = path;
			rebuildMenus(path);
		}
		if(typeof(path)=='string') path = path.split('_');
		// console.log(path);
		switch(path[0]){
			case 'page': viewPage(path.slice(1), pnl); break;
			default: route(path.slice(1), pnl, true);
		}
	}

	function viewPage(path, pnl){
		const nr = path[0];
		// pnl.innerHTML = 'page '+nr;
		import(`../pages/p${nr}.js?t=${new Date().getTime()}`).then(pp=>{
			pp.view(path.slice(1));
		});
	}

	function menuItems(items=menu, rootID){
		const {markup,apply,ul,li,span} = $H;
		return ul(
			apply(items, el=>li(
				el.target?span({'class':'link', 'data-id':(rootID?rootID+'_':'')+el.target}, el.title)
					:span({'data-id':(rootID?rootID+'_':'')+el.id}, el.title),
				el.sub?menuItems(el.sub, (rootID?rootID+'_':'')+el.id):null
			))
		);
	}

	function rebuildMenus(curPath){
		// console.log('rebuilding menus %o', menuPanels);
		const steps = curPath.split('_');
		const parts = [];
		let prev;
		for(let st of steps){
			const part = (prev?prev+'_':'')+st;
			parts.push(part);
			prev = part;
		}

		for(let def of menuPanels.entries()){
			// console.log('def: %o', def);
			const [pnl, rootID] = def;
			buildMenu(pnl, rootID);
			const items = pnl.querySelectorAll('li>span');
			// console.log(items);
			items.forEach(el=>{
				const id = el.getAttribute('data-id');
				if(parts.includes(id)) el.classList.add('current');
			});
		}
	}

	function getRootMenu(rootID){
		if(!rootID) return menu;

		let level = menu;
		let res = menu;
		for(let step of rootID.split('_')){
			for(let el of level){
				if(el.id==step){
					level = el.sub;
					res = el.sub;
					continue;
				}
			}
		}
		return res;
	}

	function buildMenu(pnl, rootID){
		menuPanels.set(pnl, rootID);
		const rootMenu = getRootMenu(rootID);
		const {markup,apply,ul,li,span} = $H;
		$C.form(pnl, markup(
				menuItems(rootMenu, rootID)
			),{
				'.link':{click:function(ev){
					const id = ev.target.getAttribute('data-id');
					route(id, '#main .content');
				}}
		});
	}

	window.addEventListener('load', function(){
		//console.log(document.location.hash);
		route(document.location.hash.slice(1));
	});

	return {
		// route,
		buildMenu
	};
}




import Clarino from './lib/clarino.module.js';

const $C = Clarino.version('2.4.1');
const $H = $C.simple;
const {px,pct,em} = $C.css.unit, css = $C.css.keywords, {border} = $C.css.template;


export default function Router(menuDef){
	const menu = menuDef;

	const menuPanels = new Set();

	function route(path, pnl, subPathMode=false){
		if(typeof(pnl)=='string') pnl = document.querySelector(pnl);
		// console.log('route to "%s"', path);
		if(!subPathMode) rebuildMenus(path);
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
		const steps = curPath.split('_');
		const parts = [];
		let prev;
		for(let st of steps){
			const part = (prev?prev+'_':'')+st;
			parts.push(part);
			prev = part;
		}

		for(let pnl of menuPanels){
			buildMenu(pnl);
			const items = pnl.querySelectorAll('li>span');
			// console.log(items);
			items.forEach(el=>{
				const id = el.getAttribute('data-id');
				if(parts.includes(id)) el.classList.add('current');
			});
		}
	}

	function buildMenu(pnl){
		menuPanels.add(pnl);
		const {markup,apply,ul,li,span} = $H;
		$C.form(pnl, markup(
				menuItems()
			),{
				'.link':{click:function(ev){
					const id = ev.target.getAttribute('data-id');
					route(id, '#main .content');
				}}
		});
	}
	
	return {
		route,
		buildMenu
	};
}




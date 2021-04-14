import Clarino from './lib/clarino.module.js';

const $C = Clarino.version('2.4.1');
const $H = $C.simple;
const {px,pct,em} = $C.css.unit, css = $C.css.keywords, {border} = $C.css.template;

const defaultSeparator = ':';


export default function Router(config){
	const {rootPath, contentPanel, menuMap, handlers, pathSeparator} = config;
	const sep = pathSeparator ?? defaultSeparator;

	const menuPanels = new Map();

	function route(path, subPathMode=false){
		let pnl = contentPanel;
		if(typeof(pnl)=='string') pnl = document.querySelector(pnl);
		// console.log('route to %o from "%s"', path, rootPath);
		if(!subPathMode){
			document.location.hash = path;
			rebuildMenus(path);
		}
		if(typeof(path)=='string'){
			path = path.replace(/^#/g, '');
			path = path.split(sep);
		}
		if(path.length){
			const pathHead = path[0], pathTail = path.slice(1);
			
			const modLoader = handlers[pathHead];
			if(modLoader) modLoader(pathTail, pnl);
			else route(pathTail, true);
		}
	}

	function menuItems(items=menuMap, rootID){
		const {markup,apply,ul,li,span} = $H;
		const rootRef = ()=> (rootPath?rootPath+sep:'')+(rootID?rootID+sep:'');

		return ul(
			apply(items, el=>li(
				el.target?span({'class':'link', 'data-id':rootRef()+el.target}, el.title)
					:span({'data-id':rootRef()+el.id}, el.title),
				el.sub?menuItems(el.sub, rootRef()+el.id):null
			))
		);
	}

	function rebuildMenus(curPath){
		const steps = curPath.split(sep);
		const parts = [];
		let prev;
		for(let st of steps){
			const part = (prev?prev+sep:'')+st;
			parts.push(part);
			prev = part;
		}

		for(let def of menuPanels.entries()){
			const [pnl, rootID] = def;
			buildMenu(pnl, rootID);
			const items = pnl.querySelectorAll('li>span');
			items.forEach(el=>{
				const id = el.getAttribute('data-id');
				if(parts.includes(id)) el.classList.add('current');
			});
		}
	}

	function getRootMenu(rootID){
		if(!rootID) return menuMap;

		let level = menuMap;
		let res = menuMap;
		for(let step of rootID.split(sep)){
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
					route(id);
				}}
		});
	}

	function buildPath(...args){
		const path = args.join(sep);
		return [rootPath, path].join(sep);
	}

	function init(path){
		if(path instanceof Array) path = path.join(sep);
		route((rootPath?rootPath+sep:'')+path);
	}

	return {
		init,
		buildMenu,
		buildPath,
		route
	};
}




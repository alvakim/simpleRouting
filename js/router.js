function route(path, pnl){
	if(typeof(pnl)=='string') pnl = document.querySelector(pnl);
	console.log('route to "%s"', path);
	if(typeof(path)=='string') path = path.split('_');
	// console.log(path);
	switch(path[0]){
		case 'page': viewPage(path.slice(1), pnl); break;
		default: route(path.slice(1), pnl);
	}
}

function viewPage(path, pnl){
	const nr = path[0];
	// pnl.innerHTML = 'page '+nr;
	import(`../pages/p${nr}.js?t=${new Date().getTime()}`).then(pp=>{
		pp.view(path.slice(1));
	});
}



export default {
	route
};

export const $ = path => document.querySelector(path)
export const $$ = path => document.querySelectorAll(path)
export const newEl = tag => document.createElement(tag)

export const manage = res => (res.ok ? res.json() : Promise.reject(`ERROR => ${res.status}`))

export function connect() {
	//Redirigir
	$('#home').addEventListener('click', () =>
		window.location.assign('recipes.html')
	)

	//Mover aside
	const $headerMenu = $('#headerMenu')
	$headerMenu.addEventListener('click', () => {
		$('#hidden').checked = true
	})

	//Conectar hovers
	const $menuLogo = $('#menuLogo')
	const hoverHeaderMenu = () => $menuLogo.classList.toggle('hover')
	$headerMenu.addEventListener('mouseover', hoverHeaderMenu)
	$headerMenu.addEventListener('mouseout', hoverHeaderMenu)

	const hoverMenuLogo = () => $headerMenu.classList.toggle('hover')
	$menuLogo.addEventListener('mouseover', hoverMenuLogo)
	$menuLogo.addEventListener('mouseout', hoverMenuLogo)

	//Categorías y búsqueda
	// const categories = [
	// 	'Arroz y verduras',
	// 	'Cerdo',
	// 	'Huevos',
	// 	'Salsas y ensaladas',
	// 	'Legumbres',
	// 	'Pastas',
	// 	'Pescados y mariscos',
	// 	'Pollo',
	// 	'Postres y dulces',
	// 	'Rebozados y variados'
	// ]
	// categories.forEach(cat => {
	// 	const newCat = newEl('option')
	// 	newCat.value = cat
	// 	newCat.textContent = cat
	// 	$('#category').appendChild(newCat)
	// })
}

export function bt_dlg(refSelections, actSelections, callback) {
	const refLength = refSelections.length
	const actLength = actSelections.length

	if (!refLength === actLength)
		throw new Error(`Nº ref: ${refLength}, Nº act: ${actLength}`)
	const tempArr = []

	refSelections.forEach((ref, i) => {
		const act = actSelections[i]
		tempArr.push({ ref, act })
	})
	refSelections.forEach(ref =>
		ref.addEventListener('click', event =>
			tempArr.find(pair => pair.ref === event.target).act[callback]()
		)
	)
}

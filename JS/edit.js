import { $, $$, manage, Foot, PATH } from './module.js'
customElements.define('re-foot', Foot)
const load = path => {
	if (!path) location.assign(PATH.edit)
	else open(path, '_blank') ?? location.assign(path)
}

//============> MODIFY <==============
$('#erase').addEventListener('click', () => load())
$('.link').addEventListener('click', () => load(PATH.index))

$$('input[name="modify"]').forEach(inp => {
	inp.addEventListener('change', () => {
		const removing = $('#remove').checked
		$('#title').toggleAttribute('required', !removing)
		$('#choose').toggleAttribute('required', !removing)

		$('.main').classList.toggle('modifying', !removing)
		$('.main').classList.toggle('removing', removing)

		$$('section:not(.modify)').forEach(sec => {
			sec.style = removing ? 'display: none;' : ''
		})
	})
})

//============> RECETAS <==============
let lastFormData
const catArr = []
fetch(PATH.pack)
	.then(manage)
	.then(data => {
		data = data.recipe_book
		console.log(data)
		lastFormData = data
		const $choose = $('#choose')

		$('#copy').addEventListener('click', () => {
			const chosen = data.find(obj => obj.title === $choose.value)
			const allow = ['title', 'subtitle', 'category', 'ingredients', 'preparation']
			allow.forEach(a => {
				$(`#${a}`).value = chosen[a] ?? ''
			})
			alert('Al copiar la receta actual, no se puede copiar la imagen si fue anteriormente enviada. En ese caso, deberá volver a adjuntarla en el formulario.')
		})

		data.forEach(obj => {
			$choose.insertAdjacentHTML(
				'beforeend',
				`<option>${obj.title}</option>`
			)
			obj.category && catArr.push(obj.category)
		})

		catArr
			.filter((el, i) => catArr.indexOf(el) === i)
			.forEach(cat => {
				$('#catList').insertAdjacentHTML(
					'beforeend',
					`<option>${cat}</option>`
				)
			})
	})
	.catch(err => console.warn(err))

//============> FORMULARIO <==============
$('form').addEventListener('submit', event => {
	event.preventDefault()
	const formData = Object.fromEntries(new FormData(event.target))

	const [img] = $('#photo').files
	if (img) {
		const reader = new FileReader()
		reader.addEventListener('load', () => fetchPUT(reader.result))
		reader.readAsDataURL(img) //Crear URL
	} else fetchPUT()
	load()

	function fetchPUT(url) {
		let newForms
		const { modify: choice } = formData

		if (choice) {
			const objIdx = lastFormData.findIndex(obj => obj.title === formData.choose)
			if (choice === 'change') lastFormData[objIdx] = { ...formData, photo: url ?? null }
			else if (choice === 'remove') lastFormData.splice(objIdx, 1)

			newForms = [...lastFormData] //Actualizar
		} else { //Añadir obj
			if (lastFormData.some(obj => obj.title === formData.title)) {
				alert('2 recetas no puede tener el mismo título')
				load()
				return
			}
			newForms = [
				...lastFormData,
				{
					...formData,
					photo: url ?? null,
					choose: null,
					modify: null,
				}
			]
		}

		//Enviar datos
		fetch(PATH.pack, {
			method: 'PATCH',
			body: JSON.stringify({ recipe_book: newForms })
		})
			.then(manage)
			.then(json => console.log(json))
			.catch(err => console.warn(err))
	}
})

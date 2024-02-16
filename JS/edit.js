import { $, $$, manage, Foot } from './module.js'
customElements.define('re-foot', Foot)

//============> MODIFY <==============
$('#erase').addEventListener('click', () => location.reload())

$$('input[name="modify"]').forEach(inp => {
	inp.addEventListener('change', () => {
		const removing = $('#remove').checked
		$('#title').toggleAttribute('required', !removing)

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
fetch('http://localhost:3000/recipe_book')
	.then(manage)
	.then(data => {
		console.log(data)
		lastFormData = data.forms

		data.forms.forEach(obj => {
			$('#choose').insertAdjacentHTML(
				'beforeend',
				`<option>${obj.title}</option>`
			)
			obj.category && catArr.push(obj.category)
		})

		catArr
			.filter((el, i) => catArr.indexOf(el) === i)
			.forEach(cat => {
				$('#category').insertAdjacentHTML(
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

	function fetchPUT(url) {
		//Añadir, eliminar o modificar objs
		let newForms
		const { modify: chosen } = formData

		//Añadirle category si no tiene
		if (chosen !== 'remove') {
			formData.category =
				formData.category
				|| prompt('La nueva categoría es:\nPara evitar enviar la receta, pulse "Cancelar"')

			if (!formData.category) location.reload() //Al pulsar "Cancelar"
		}

		if (chosen) {
			if (!formData.choose) {
				//Si al modificar no se especifica receta
				alert('No se ha especificado receta a la que aplicar el cambio')
				location.reload()
			}

			const objIdx = lastFormData.findIndex(obj => obj.title === formData.choose)
			if (chosen === 'change') {
				lastFormData[objIdx] = { ...formData, photo: url }
			} else if (chosen === 'remove') {
				lastFormData.splice(objIdx, 1)
			}
			newForms = [...lastFormData]
		} else {
			//Añadir obj
			if (lastFormData.some(obj => obj.title === formData.title)) {
				alert('2 recetas no puede tener el mismo título')
				location.reload()
			}
			newForms = [
				...lastFormData,
				{ ...formData, photo: url }
			]
		}

		//Enviar datos
		fetch('http://localhost:3000/recipe_book', {
			method: 'PUT',
			body: JSON.stringify({ forms: newForms })
		})
			.then(manage)
			.then(json => console.log(json))
			.catch(err => console.warn(err))
	}
})

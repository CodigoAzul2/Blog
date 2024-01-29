import { $, $$, bt_dlg, connect, manage } from './module.js'
const $edit = $('#edit'), $preview = $('#preview'),
	$photo = $('#photo'), $change = $('#change'), $$dialog = $$('dialog')

connect()
$edit.addEventListener('click', () => window.location.reload())
$photo.addEventListener('change', () => {
	const [img] = $photo.files
	console.log(img)
	if (img) {
		$preview.style = 'display: block;'
		$preview.src = URL.createObjectURL(img)
	} else $preview.style = 'display: none;'
})
$('#erase').addEventListener('click', () => $preview.style = 'display: none;')

//========================> Recetas
let recipes, lastFormData, n
fetch('http://localhost:3000/recipe_book')
	.then(manage)
	.then(data => {
		console.log(data)
		recipes = data.recipes
		lastFormData = data.forms
		n = data.count
		$edit.style = `top: ${(n - 1) * 20 + 95}px;`
		$edit.insertAdjacentHTML('beforebegin', recipes)
		bt_dlg($$('aside > section:not([id])'), $$dialog, 'showModal')
		bt_dlg($$('button.closeModel'), $$dialog, 'close')

		data.forms.forEach(obj => {
			const newOpt = document.createElement('option')
			newOpt.value = obj.title
			newOpt.textContent = obj.title
			$change.appendChild(newOpt)
		})
	})
	.catch(err => console.warn(err))

//============> FORMULARIO <==============
$('#editForm').addEventListener('submit', event => {
	event.preventDefault()
	const formData = Object.fromEntries(new FormData(event.target))

	if (!lastFormData.some(obj => obj.title === formData.title) || formData.change) {
		const fetchPUT = url => {
			const recipe = `
			<section style="z-index: ${-n - 1};">${formData.title}</section>
			<dialog>
				<button type="button" class="closeModel">Cerrar</button>
				<h2>${formData.title}</h2>
				${formData.subtitle ? `<h3 class="sub-title">${formData.subtitle}</h3>` : ''}
				<ol>
					<li>
						<h3>INGREDIENTES:</h3>
						<p>${formData.ingredients}</p>
					</li>

					<li>
						<h3>PREPARACIÓN:</h3>
						<p>${formData.preparation}</p>
					</li>
				</ol>

				<div class="back" style="background-image: url(${url ?? ''});"></div>
			</dialog>`

			let num, newForms, newRecipes
			if (formData.change) {
				//Capturar string
				const posWord0 = recipes.indexOf(formData.change)
				const pos0 = recipes.lastIndexOf('<section', posWord0)
				const endStr = '</dialog>'
				const posF = recipes.indexOf(endStr, pos0) + endStr.length
				const strFound = recipes.substring(pos0, posF)
				const objIdx = lastFormData.findIndex(obj => obj.title === formData.change)

				if (formData.remove) { //Eliminar obj
					lastFormData.splice(objIdx, 1)

					newRecipes = recipes.replace(strFound, '')
					num = --n
				} else { //Editar objeto de lastFormData
					lastFormData[objIdx] = { ...formData, photo: url }

					newRecipes = recipes.replace(strFound, recipe)
					num = n
				}
				newForms = [...lastFormData]
			} else {
				newRecipes = recipes + recipe
				num = ++n
				newForms = [
					...lastFormData,
					{ ...formData, photo: url }
				]
			}
			fetch('http://localhost:3000/recipe_book', {
				method: 'PUT',
				body: JSON.stringify({
					recipes: newRecipes,
					count: num,
					forms: newForms
				}),
			})
				.then(manage)
				.then(json => console.log(json))
				.catch(err => console.warn(err))
		}

		const [img] = $photo.files
		if (img) {
			const reader = new FileReader()
			reader.addEventListener('load', () => fetchPUT(reader.result))
			reader.readAsDataURL(img) //Crear URL
		} else fetchPUT()

	} else alert('2 recetas no puede tener el mismo título')
})

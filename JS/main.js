import { $, $$, manage, Foot } from './module.js'
customElements.define('re-foot', Foot)
const load = (path = '../HTML/main.html') => location.assign(path)

//============> CONECTAR <==============
//Redirigir
$('#home').addEventListener('click', () =>
	load()
)

const $recipOpt = $('#recipOpt')
fetch('http://localhost:3000/recipe_book')
	.then(manage)
	.then(json => {
		console.log(json)

		//Insertar recetas
		const $edit = $('#edit')
		json.forms.forEach(obj => {
			$edit.insertAdjacentHTML(
				'beforebegin',
				`<section>${obj.title}</section>
				<dialog>
					<button type="button" class="closeModel">Cerrar</button>
					<h2>${obj.title}</h2>
					${obj.subtitle ? `<h3 class="sub-title">${obj.subtitle}</h3>` : ''}
					<ul>
						<li>
							<h3>INGREDIENTES:</h3>
							<ul>
								<li>${obj.ingredients.replaceAll('\n', '</li> <li>')}</li>
							</ul>
						</li>

						<li>
							<h3>PREPARACIÓN:</h3>
							<ul>
								<li>${obj.preparation.replaceAll('\n', '</li> <li>')}</li>
							</ul>
						</li>
					</ul>

					<div class="back" style="background-image: url(${obj.photo ?? ''});"></div>
				</dialog>`
			)

			$recipOpt.insertAdjacentHTML(
				'beforeend',
				`<option value="${obj.title}">${obj.category ?? ''}</option>`
			)
		})

		//Funcionalidad
		function relate(actuators, patient, action) {
			const tempArr = []

			actuators.forEach((ref, i) => {
				const act = patient[i]
				tempArr.push({ ref, act })
			})
			actuators.forEach(ref => {
				ref.addEventListener('click', event => {
					tempArr.find(pair => pair.ref === event.target).act[action]()
				})
			})
		}
		const $$recipes = [...$$('aside > section:not([id])'), $edit]
		const $$dialogs = $$('dialog')
		const $$close = $$('button.closeModel')
		relate($$recipes, $$dialogs, 'showModal')
		relate($$close, $$dialogs, 'close')
	})
	.catch(err => console.warn(err))

//============> BÚSQUEDA <==============
const $search = $('#search')
$search.addEventListener('change', () => {
	if (!$search.value) return

	const found = [...$$('dialog:not(.security)')].find(d =>
		[...d.children]
			.find(c => c.tagName === 'H2')
			.textContent === $search.value
	)
	found?.showModal()
	$search.value = ''
})

//============> FORMULARIO <==============
//'Mostrar contraseñas'
const $oldPass = $('#pass'), $newPass = $('#newPass')
$('#showPass').addEventListener('change', () => {
	$oldPass.type = ($oldPass.type === 'password') ? 'text' : 'password'
	$newPass.type = ($newPass.type === 'password') ? 'text' : 'password'
})
//'Cambiar contraseña'
const $oldUser = $('#user'), $newUser = $('#newUser')
$('#changeAccount').addEventListener('change', () => {
	$newPass.toggleAttribute('required')
	$newUser.toggleAttribute('required')
})

//***Usar action para enviarlo a otro archivo (más fácil)
$('form').addEventListener('submit', event => {
	event.preventDefault()
	const formData = Object.fromEntries(new FormData(event.target))
	console.log('formData', formData)

	const { user, pass } = formData
	const account = { user, pass }

	//Acceso
	fetch('http://localhost:3000/account')
		.then(manage)
		.then(data => {
			console.log('json', data)

			if (JSON.stringify(data) === JSON.stringify(account)) {
				if (formData.newUser || formData.newPass) {
					fetch('http://localhost:3000/account', {
						method: 'PUT',
						body: JSON.stringify({
							user: formData.newUser,
							pass: formData.newPass,
						}),
					})
						.then(manage)
						.then(json => console.log(json))
					load()
				} else load('../HTML/edit.html')
			} else {
				alert('Incorrecto. ¡Inténtalo de nuevo!')
				load()
			}
		})
		.catch(error => console.warn(error))
})

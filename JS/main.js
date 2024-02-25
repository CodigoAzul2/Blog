import { $, $$, manage, Foot } from './module.js'
customElements.define('re-foot', Foot)
const load = (path = '../HTML/main.html') => location.assign(path)

//============> CONECTAR <==============
//Redirigir
$('#home').addEventListener('click', () => load())

const $recipOpt = $('#recipOpt')
fetch('http://localhost:3000/recipe_book')
	.then(manage)
	.then(json => {
		console.log(json)

		//Insertar recetas
		const $edit = $('#edit')
		json.forms.forEach(obj => {
			const makeUl = text => text
				.replace(/^[^>].*$/gm, '<li>$&</li>')
				.replace(/^>.*$/gm, s => {
					const count = s.match(/^>+/)[0].length
					return `${'<ul>'.repeat(count)}<li>${s.substring(count)}</li>${'</ul>'.repeat(count)}`
				})

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
							<ul>${makeUl(obj.ingredients)}</ul>
						</li>
						<li>
							<h3>PREPARACIÓN:</h3>
							<ul>${makeUl(obj.preparation)}</ul>
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
		function relate(actuators, waiters, action) {
			const tempArr = [...actuators].reduce((prev, curr, i) => {
				prev.push({ act: curr, dlg: waiters[i] })
				return prev
			}, [])
			
			actuators.forEach(act => {
				act.addEventListener('click', event => {
					const dlgOpen = tempArr.find(pair => pair.act === event.target).dlg
					dlgOpen[action]()
					dlgOpen.lastElementChild.style.height = `${dlgOpen.scrollHeight}px`
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

	const dlgFound = [...$$('dialog:not(.security)')]
		.find(d => [...d.children]
			.find(c => c.tagName === 'H2')
			.textContent === $search.value
		)
	dlgFound?.showModal()
	dlgFound.lastElementChild.style.height = `${dlgFound.scrollHeight}px`
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
const $newUser = $('#newUser')
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

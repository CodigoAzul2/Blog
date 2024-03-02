import { $, $$, manage, Foot, PATH } from './module.js'
customElements.define('re-foot', Foot)
const load = path => {
	if (!path) location.assign(PATH.index)
	else open(path, '_blank') ?? location.assign(path)
}
//============> CONECTAR <==============
//Redirigir
$('#home').addEventListener('click', () => load())

const $recipOpt = $('#recipOpt')
fetch(PATH.keep)
	.then(manage)
	.then(json => {
		json = json.recipe_book
		console.log(json)

		//Insertar recetas
		const $edit = $('#edit')
		json.forEach(obj => {
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
					<img src="${obj.photo ?? ''}" style="display: ${obj.photo ? 'block' : 'none'};" />
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
					<p class="foot-page"><span>Monitora:</span> Reyes García Delgado</p>
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
				act.addEventListener('click', e => {
					tempArr.find(pair => pair.act === e.target).dlg[action]()
				})
			})
		}
		const $$recipes = [...$$('aside > section:not([id])'), $edit]
		const $$dialogs = $$('dialog')
		const $$close = $$('button.closeModel')
		relate($$recipes, $$dialogs, 'showModal')
		relate($$close, $$dialogs, 'close')

		$('.preloader').style.display = 'none'
	})
	.catch(err => {
		alert('No se ha podido acceder a las recetas.')
		console.warn(err)
	})

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
	fetch(PATH.keep)
		.then(manage)
		.then(data => {
			data = data.account
			console.log('json', data)

			if (JSON.stringify(data) === JSON.stringify(account)) {
				if (formData.newUser || formData.newPass) {
					fetch(PATH.keep, {
						method: 'PATCH',
						body: JSON.stringify({
							account: {
								user: formData.newUser,
								pass: formData.newPass,
							}
						}),
					})
						.then(manage)
						.then(json => console.log(json))
					load()
				} else load(PATH.edit)
			} else {
				alert('Incorrecto. ¡Inténtalo de nuevo!')
				load()
			}
		})
		.catch(error => console.warn(error))
})

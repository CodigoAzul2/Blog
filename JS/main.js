import { $, $$, bt_dlg, connect, manage } from './module.js'
const $edit = $('#edit'), $oldPass = $('#pass'),
	$newPass = $('#newPass'), $oldUser = $('#user'),
	$newUser = $('#newUser')

connect()
fetch('http://localhost:3000/recipe_book')
	.then(manage)
	.then(json => {
		console.log(json)

		//Insertar recetas
		$edit.insertAdjacentHTML('beforebegin', json.recipes)
		$edit.style = `top: ${(json.count - 1) * 20 + 95}px;`

		//Funcionalidad
		bt_dlg(
			[...$$('aside > section:not([id])'), $edit],
			[...$$('aside > section:not([id]) + dialog'), $('#security')],
			'showModal'
		)
		bt_dlg($$('button.closeModel'), $$('dialog'), 'close')

		json.forms.forEach(obj => {
			const newPhoto = document.createElement('section')
			const newTitle = document.createElement('div')
			newTitle.textContent = obj.title
			newTitle.className = 'title'
			if (obj.photo) {
				const newBgnd = document.createElement('div')
				newBgnd.className = 'bgnd'
				newBgnd.style = `background-image: url(${obj.photo});`
				newPhoto.appendChild(newBgnd)
			}
			newPhoto.appendChild(newTitle)
			$('#gallery').appendChild(newPhoto)
			newPhoto.style = `width: ${newTitle.clientWidth + 20}px;`
		})
	})
	.catch(err => console.warn(err))

//============> FORMULARIO <==============
//'Mostrar contraseñas'
$('#showPass').addEventListener('change', () => {
	$oldPass.type = ($oldPass.type === 'password') ? 'text' : 'password'
	$newPass.type = ($newPass.type === 'password') ? 'text' : 'password'
})
//'Cambiar contraseña'
$('#changeAccount').addEventListener('change', event => {
	$('#hide').style = event.target.checked ? '' : 'display: none;'

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

			const delay = 1000
			const ansToggle = opt => {
				$oldUser.toggleAttribute(opt)
				$oldPass.toggleAttribute(opt)
			}

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
					ansToggle('correct')
					setTimeout(() => {
						ansToggle('correct')
						window.location.reload()
					}, delay)
				} else {
					ansToggle('correct')
					setTimeout(() => {
						ansToggle('correct')
						window.location.assign('edition.html')
					}, delay)
				}
			} else {
				ansToggle('incorrect')
				setTimeout(() => {
					ansToggle('incorrect')
					window.location.reload()
				}, delay)
			}
		})
		.catch(error => console.warn(error))
})

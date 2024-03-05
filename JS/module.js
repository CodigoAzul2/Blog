//Funciones
export const $ = path => document.querySelector(path)
export const $$ = path => document.querySelectorAll(path)
export const manage = res => {
	if (res.ok) {
		console.log('Estado:', res.status)
		return res.json()
	}
	else Promise.reject(`ERROR |=> ${res.status}`)
}

//Rutas
export const PATH = {
	pack: 'JS/keep.json',
	index: './index.html',
	edit: './edit.html'
}

//Nueva tag con Foot
export class Foot extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<p><strong>Director:</strong> Antonio H</p>
			<p><strong>Productor:</strong> Carlos H</p>`
	}
}

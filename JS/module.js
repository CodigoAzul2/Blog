//Funciones
export const $ = path => document.querySelector(path)
export const $$ = path => document.querySelectorAll(path)
export const manage = res => (res.ok ? res.json() : Promise.reject(`ERROR => ${res.status}`))

//Nueva tag con Foot
export class Foot extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<p><strong>Director:</strong> Antonio H</p>
			<p><strong>Productor:</strong> Carlos H</p>`
	}
}

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

export const makeUl = text => text
	.replace(/^[^>].*$/gm, '<li>$&</li>')
	.replace(/^>.*$/gm, s => {
		const count = s.match(/^>+/)[0].length
		return `${'<ul>'.repeat(count)}<li>${s.substring(count)}</li>${'</ul>'.repeat(count)}`
	})

const type = (text, symbol, tag) => {
	let c = 0
	const regex = new RegExp(`\\${symbol}`, 'g')
	const temp = text.match(regex)?.length ?? 0
	const t = temp % 2 != 0 ? temp - 1 : temp
	return text.replace(regex, s => (c++, t < c ? s : `<${c % 2 != 0 ? '' : '/'}${tag}>`))
}
const styles = [
	t => type(t, '*', 'b'),
	t => type(t, '-', 'i'),
	t => type(t, '~', 'del'),
	t => type(t, '_', 'u')
]
export const format = text => styles.reduce((r, f) => f(r), text)

export const relate = (actuators, waiters, action) => {
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

export const loader = (path, deflt) => {
	if (!path) location.assign(deflt)
	else open(path, '_blank') ?? location.assign(path)
}

//Rutas
export const PATH = {
	pack: 'https://codigoazul2.github.io/Blog/JS/keep.json',
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

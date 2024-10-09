// Mon, 07 Oct 2024
// This version of the factorization software (all files) is released into the public domain.
// The software is provided "as it" without any warranty, express or implied.

'use strict'

const os = {
	tz_locations: [],
	user_tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
	user_lang: navigator.language || 'en-US',
	svgNS: 'http://www.w3.org/2000/svg',
	listener_opts: {passive: true},
	tz_to_ids: {},
	ids_to_tz: [null],
}

{
	// Prepare formatters used during SVG generation
	{
		const fmt_internal = new Intl.DateTimeFormat([os.user_lang], {'weekday': 'short', 'month': 'short', 'day': '2-digit'})
		const country_name = new Intl.DisplayNames([os.user_lang], {type: 'region'})
		os.format = {
			country: code => country_name.of(code),
			internal: str => fmt_internal.format(str),
		}
	}
	// Aggregate initial dataset with available timezones
	const available_tzs = {}
	for (const tz_name of Intl.supportedValuesOf('timeZone'))
		available_tzs[tz_name] = true
	let i = -1
	const opts = {
		timeZone: 'UTC',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hourCycle: 'h23',
	}
	// Filter the timezones that are available in the underlying system (Windows, Linux, etc.)
	os.formatter = new Intl.DateTimeFormat('en-US', opts)
	for (const [region_id, city, country, lat, lon] of tz_locations[1]) {
		const region_name = tz_locations[0][region_id]
		const tz_name = region_name ? region_name + '/' + city : city
		if (tz_name in available_tzs) {
			os.tz_to_ids[tz_name] = ++i
			os.ids_to_tz[i] = opts.timeZone = tz_name
			const formatter = new Intl.DateTimeFormat('en-US', opts)
			os.tz_locations.push([formatter, country, tz_name, lat, lon])
			delete available_tzs[tz_name]
		}
	}
	tz_locations.length = 0
	for (const tz_name in available_tzs)
		if (tz_name.indexOf('Etc/') === -1 && tz_name !== "UTC" && tz_name !== "Factory")
			console.log('Unknown TimeZone', tz_name)
}
{
	const my_mktime = (s, n = 0) => Date.UTC(+s.substring(6, 10), +s.substring(0, 2) - 1, +s.substring(3, 5), +s.substring(12, 14), +s.substring(15, 17), n)
	const offset_from_minutes = (m, full = false) => {
		if (full)
			return (m < 0 ? '-' : '+') + String(~~((m = Math.abs(m)) / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0')
		let res = ''
		if (m) {
			if (m < 0) {
				m = -m
				res = '-'
			} else
				res = '+'
			const x = ~~(Math.abs(m) / 60)
			res += x
			m -= x * 60
			if (m) {
				res += ':' + String(m).padStart(2, '0')
			}
		}
		return res
	}
	const get_data_by_tz_name = tz_name => os.tz_locations[os.tz_to_ids[tz_name]]
	const adjust_custom_map_center = (lon, center_lon) => lon - center_lon < -180 ? lon - center_lon + 360 : (180 < lon - center_lon ? lon - center_lon - 360 : lon - center_lon)
	const get_flag_with_two_letters = two => String.fromCodePoint(two[0].charCodeAt() + 127397, two[1].charCodeAt() + 127397)

	const $ = (name, parent) => {
		const el = document.createElementNS(os.svgNS, name)
		if (parent)
			parent.appendChild(el)
		return [(...args) => {
			for (let i = 0; i < args.length; i += 2)
				el.setAttribute(args[i], String(args[i + 1]))
			return el
		}, el]
	}

	const highlight = (instance, tz_name) => {
		if (instance.oh)
			for (const [c] of instance.oh)
				c.classList.remove('r', 'b')
		tz_name ??= instance.opts.highlight ?? os.user_tz
		const [circle, rel, [f_2, country], , next_up, next_off] = instance.tz_locations[os.tz_to_ids[tz_name]]
		instance.oh = rel[1]
		for (const [c] of rel[1])
			c.classList.add(c === circle ? 'r' : 'b')
		const [l, s] = instance.svg_legend
		l.setAttribute('font-size', tz_name.length < 26 ? 18 : 14)
		l.innerHTML = '<tspan>' + get_flag_with_two_letters(country) +' <title>' + os.format.country(country) + '</title></tspan> ' + tz_name + ' <tspan>GMT' + offset_from_minutes(rel[0]) + '</tspan>'
		if (next_up === null)
			s.innerHTML = 'with no seasonal transitions'
		else {
			const a = os.format.internal(next_up) + ' ' + f_2.format(next_up).substring(12, 17)
			const b = f_2.format(next_up + 1).substring(12, 17)
			s.innerHTML = ' ' + a + ' ⟶ ' + b + ' to GMT' + offset_from_minutes(next_off)
		}
	}

	const get_svg = (instance) => {
		const svgNS = os.svgNS
		const [$svg, svg] = $('svg')
		const [$map, map] = $('svg', svg)
		const [$txt, txt] = $('svg', svg)
		svg.id = instance.id + 'svg'
		instance.svg_map = map
		$svg('viewBox', '-180 -90 360 200', 'width', '100%', 'height', '100%', 'style', 'display:block')
		$map('viewBox', '-180 -90 360 200', 'x', -180, 'y', -90)
		$txt('viewBox', '0 0 360 30', 'x', -180, 'y', 80, 'height', 30)
		const [, _d] = $('defs', map)
		_d.innerHTML = '<style>.r{fill:red;cursor:pointer;}.b{fill:black;pointer-events:none}</style>'
		const [$p, _p] = $('pattern', _d)
		const [$i] = $('image', _p)
		const [$r] = $('rect', map)
		const [$r2] = $('rect', txt)
		$p('x', -(instance.center_lon + 180), 'y', -90, 'width', 360, 'height', 180, 'patternUnits', 'userSpaceOnUse')
		$i('width', 360, 'height', 180, 'href', 'bg-continents.svg')
		$r('x', -180, 'y', -90, 'width', 360, 'height', 180, 'fill', 'url(#' + (_p.id = instance.id + 'pattern') + ')')
		$r2('x', 0, 'y', 0, 'width', 360, 'height', 30, 'fill', '#f9f9f9')
		for (const row of instance.tz_locations) {
			const [, , [, country, tz_name, lat], adj_lon] = row
			const circle = row[0] = document.createElementNS(svgNS, 'circle')
			circle.setAttribute('cx', adj_lon)
			circle.setAttribute('cy', -lat)
			circle.setAttribute('r', 1)
			circle.setAttribute('fill', 'lightgray')
			circle.setAttribute('id', instance.id + os.tz_to_ids[tz_name])
			const title = document.createElementNS(svgNS, 'title')
			title.innerHTML = os.format.country(country)
			circle.appendChild(title)
			map.appendChild(circle)
		}
		const c = ['x', 180, 'text-anchor', 'middle', 'font-family', 'monospace']
		const [$l, _l] = $('text', txt)
		const [$s, _s] = $('text', txt)
		$l('font-size', 18, 'y', 15, 'fill', 'black', ...c)
		$s('font-size', 10, 'y', 27, 'fill', '#777', ...c)
		instance.svg_legend = [_l, _s]
		highlight(instance)
		return svg
	}

	const suggest_tz = (instance, x, y) => {
		let auto_tz = null, min_distance = Infinity
		for (const [, , [, , tz_name, lat], lon] of instance.tz_locations) {
			const distance = (x - lon) * (x - lon) + (y + lat) * (y + lat)
			if (distance < min_distance) {
				min_distance = distance
				auto_tz = tz_name
			}
		}
		return auto_tz
	}

	const bind_mouse = (instance) => {
		const svg = instance.svg_map
		const svgPoint = svg.createSVGPoint()
		const mousemove = e => {
			if (e.ctrlKey)
				return
			svgPoint.x = e.clientX
			svgPoint.y = e.clientY
			const point = svgPoint.matrixTransform(svg.getScreenCTM().inverse())
			const tz_name = suggest_tz(instance, point.x, point.y)
			instance.highlight(tz_name)
		}
		let curr_zoom = 1
		const wheel = e => {
			if (e.ctrlKey)
				return
			e.preventDefault()
			const new_zoom = Math.min(6.25, Math.max(1, curr_zoom * (e.deltaY < 0 ? 2.5 : .4)))
			if (new_zoom !== curr_zoom) {
				curr_zoom = new_zoom
				svgPoint.x = e.clientX
				svgPoint.y = e.clientY
				const point = svgPoint.matrixTransform(svg.getScreenCTM().inverse())
				const tx = curr_zoom === 1 ? 0 : -(point.x - point.x / curr_zoom)
				const ty = curr_zoom === 1 ? 0 : -(point.y - point.y / curr_zoom)
				svg.setAttribute('transform', 'scale(' + curr_zoom + ') translate(' + tx + ', ' + ty + ' )')
			}
		}

		const click = e => {
			if (e.target.id.startsWith(instance.id)){
				const i = e.target.id.substring(instance.id.length)
				const [, , , lat, lon ] = os.tz_locations[i]
				const a = document.createElement("A")
				a.target = '_blank'
				a.href = 'https://www.google.fr/maps?q=' + lat + ',' + lon
				document.body.appendChild(a)
				a.click()
				a.remove()
			}
		}

		instance.listeners.push(['click', click, os.listener_opts])
		instance.listeners.push(['wheel', wheel])
		instance.listeners.push(['mousemove', mousemove, os.listener_opts])
		for (const args of instance.listeners)
			svg.addEventListener(...args)
	}

// Create an instance with the current parameters (that should be destroyed after use)
	os.getInstance = params => {
		const n_months = params.months ?? 28
		const _now = +(params.date ?? Date.now()), origin = _now - _now % 300000, date = new Date(origin)
		const center_lon = get_data_by_tz_name(params.center ?? os.user_tz)[4]
		const y = date.getUTCFullYear(), m = date.getUTCMonth()
		const steps = [], tz_locations = new Array(os.tz_locations.length), groups = {}
		for (let i = -1; i < n_months; ++i)
			steps.push(Date.UTC(y, m + i))
		// Calculate the next transition (if any) for all time zones
		for (let i = 0; i < os.tz_locations.length; ++i) {
			const [fmt, , , , lon] = os.tz_locations[i]
			let next_update = null, next_offset = null
			for (let i = 1, p_1 = fmt.format(steps[0]).substring(12); i < n_months; ++i) {
				const p_2 = fmt.format(steps[i]).substring(12)
				if (p_1 !== p_2) {
					// Time change detected ?
					let t_1 = Math.round(+steps[i - 1] / 1000)
					let t_3 = Math.round(+steps[i] / 1000)
					let z_1 = +p_1.substring(0, 2) * 3600 + +p_1.substring(3, 5) * 60 + +p_1.substring(6, 8)
					let step
					// Binary search
					while ((step = (t_3 - t_1) >> 1)) {
						const t_2 = t_1 + step
						const p_3 = fmt.format(t_2 * 1000)
						const z_2 = +p_3.substring(12, 14) * 3600 + +p_3.substring(15, 17) * 60 + +p_3.substring(18)
						if ((z_1 - z_2 + step) % 86400)
							t_3 = t_2
						else {
							t_1 = t_2
							z_1 = z_2
						}
					}
					const unix_ms = t_3 * 1000 - 1
					if (origin < unix_ms) {
						next_update = unix_ms
						// The next transition was found.
						break
					}
				}
				p_1 = p_2
			}
			const s = fmt.format(origin)
			// Group the time zones that currently share the same GMT offset
			if (!(s in groups)) {
				const o = my_mktime(s) - origin
				const p = os.formatter.format(Math.abs(o))
				groups[s] = [(o < 0 ? -1 : 1) * (60 * +p.substring(12, 14) + +p.substring(15, 17)), []]
			}
			if (next_update !== null)
				next_offset = groups[s][0] + (my_mktime(fmt.format(next_update + 1)) - my_mktime(fmt.format(next_update), 60)) / 60000
			// Fill a flat array that contain all data needed to construct the SVG
			tz_locations[i] = [null, groups[s], os.tz_locations[i], adjust_custom_map_center(lon, center_lon), next_update, next_offset]
			groups[s][1].push(tz_locations[i])
		}
		let id = ''
		do id += Math.random().toString(36).substr(2)
		while (id.length < 5)
		const instance = {
			id: 'tz-' + id.substring(0, 5) + '-',
			opts: params,
			tz_locations: tz_locations,
			center_lon: center_lon,
			getSVG: () => get_svg(instance),
			bindMouse: () => bind_mouse(instance),
			highlight: tz_name => highlight(instance, tz_name),
			listeners: [],
			destroy: () => 'svg' in instance && instance.listeners.forEach(args => instance.svg.removeEventListener(...args)),
		}
		return instance
	}
}
window.onload = () => {
	const image = document.getElementById('image')
	image.style.border = '1px solid #999'
	image.style.width = '640px'
	const instance = os.getInstance({
		date: new Date(),
		center: os.user_tz, // 'Europe/Paris',
		highlight: os.user_tz, // 'America/New_York',
	})
	const svg = instance.getSVG()
	instance.bindMouse()
	image.appendChild(svg)
}


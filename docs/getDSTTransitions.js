function* getDSTTransitions(tz_name, date_from, date_end) {
	date_from ??= new Date()
	date_end ??= new Date(+date_from + 36816413000)
	const y = date_from.getUTCFullYear()
	const end = Date.UTC(date_end.getUTCFullYear(), date_end.getUTCMonth() + 2)
	const fmt = Intl.DateTimeFormat('en-US', {
		timeZone: tz_name,
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hourCycle: 'h23',
	})
	let m = date_from.getUTCMonth() - 1, d_1 = Date.UTC(y, m), p_1 = fmt.format(d_1)
	for (let d_2; (d_2 = Date.UTC(y, ++m)) < end;) {
		let p_2 = fmt.format(d_2)
		if (p_1 !== p_2) {
			let t_1 = Math.round(d_1 / 1000)
			let t_3 = Math.round(d_2 / 1000)
			let z_1 = +p_1.substring(0, 2) * 3600 + +p_1.substring(3, 5) * 60 + +p_1.substring(6, 8)
			let step
			// Binary search.
			while ((step = (t_3 - t_1) >> 1)) {
				const t_2 = t_1 + step
				const p_3 = fmt.format(t_2 * 1000)
				const z_2 = +p_3.substring(0, 2) * 3600 + +p_3.substring(3, 5) * 60 + +p_3.substring(6, 8)
				if ((z_1 - z_2 + step) % 86400)
					t_3 = t_2
				else {
					t_1 = t_2
					z_1 = z_2
				}
			}
			const unix_ms = t_3 * 1000 - 1
			if (date_from <= unix_ms && unix_ms <= date_end)
				yield unix_ms
			p_1 = p_2
		}
		d_1 = d_2
	}
}

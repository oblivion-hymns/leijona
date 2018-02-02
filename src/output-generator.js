class OutputGenerator
{
	/**
	 * @param any config
	 */
	constructor(config)
	{
		this.config = config || {};
	}

	/**
	 * Generates an output string based on a given set of line counts and the template
	 * as set in leijona.json
	 * @param any[] lineCounts
	 * @return string
	 */
	generate(lineCounts)
	{
		let output = '';
		switch (this.config.format)
		{
			case 'html':
			default:
				output = this.generateHtmlOutput(lineCounts);
				break;
		}

		return output;
	}

	/**
	 *
	 */
	generateHtmlOutput(lineCounts)
	{
		const includeComments = this.config.count.comments;
		const includeTrivial = this.config.count.trivial;
		const includeEmpty = this.config.count.empty;

		let html = `<html>
	<head>
		<title>Line Count Report</title>
		<style type="text/css">
			body {
				color: rgba(0, 0, 0, 0.87);
				padding: 16px;
				margin: 0;
			}

			table, th, td {
				border: 1px solid rgba(0, 0, 0, 0.87);
				border-collapse: collapse;
				width: 100%;
			}

			th {
				padding: 4px;
			}

			td {
				padding: 2px;
			}

			td.number {
				text-align: right;
			}

			td.total {
				font-weight: bold;
			}
		</style>
	</head>
	<body>
		<h1>Line Count Report</h1>
		<table>
			<tr>
				<th>File</th>
				<th>Source</th>\n`;

		console.log(includeEmpty);

		if (includeComments)
		{
			html += '				<th>Comments</th>\n';
		}

		if (includeTrivial)
		{
			html += '				<th>Trivial</th>\n';
		}

		if (includeEmpty)
		{
			html += '				<th>Empty</th>\n';
		}

		html += '				<th>Total</th>\n';

		html += `			</tr>
			<tbody>\n`;

		for (let i = 0; i < lineCounts.length; i++)
		{
			const count = lineCounts[i];
			const path = count.path;
			const source = count.source;
			const trivial = count.trivial;
			const comments = count.comments;
			const empty = count.empty;
			const total = count.total;

			html += `				<tr>
					<td>` + path + `</td>
					<td class="number">` + source + '</td>\r\n';

			if (includeComments)
			{
				html += '					<td class="number">' + comments + '</td>\n';
			}

			if (includeTrivial)
			{
				html += '					<td class="number">' + trivial + '</td>\n';
			}

			if (includeEmpty)
			{
				html += '					<td class="number">' + empty + '</td>\n';
			}

			html += '					<td class="number total">' + total + `</td>
				</tr>\n`;
		}

		html += `			</tbody>
		</table>
	</body>
</html>\n`;

		return html;
	}
}

module.exports = OutputGenerator;

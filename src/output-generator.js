const fs = require('fs');
const path = require('path');

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
	 * Generates and returns an HTML header row
	 * @param string content
	 * @return string
	 */
	generateHtmlHeaderCell(content)
	{
		return '<th>' + content + '</th>';
	}

	/**
	 * Generates and returns a single HTML body row
	 * @param any lineCount
	 * @return string
	 */
	generateHtmlBodyRow(lineCount)
	{
		const includeComments = this.config.count.comments;
		const includeTrivial = this.config.count.trivial;
		const includeEmpty = this.config.count.empty;

		const path = lineCount.path;
		const source = lineCount.source;
		const trivial = lineCount.trivial;
		const comments = lineCount.comments;
		const empty = lineCount.empty;
		const total = lineCount.total;

		let html = '<td>';
		html += this.generateHtmlBodyCell(path);
		html += this.generateHtmlBodyCell(source);

		if (includeComments)
		{
			html += this.generateHtmlBodyNumberCell(comments);
		}

		if (includeTrivial)
		{
			html += this.generateHtmlBodyNumberCell(trivial);
		}

		if (includeEmpty)
		{
			html += this.generateHtmlBodyNumberCell(empty);
		}

		html += this.generateHtmlBodyNumberCell(total);
		html += '</tr>';
		return html;
	}

	/**
	 * Generates and returns a single cell for display in an HTML body row
	 * @param string content
	 * @return string
	 */
	generateHtmlBodyCell(content)
	{
		return '<td>' + content + '</td>';
	}

	/**
	 * Generates and returns a single cell for display in an HTML body row.
	 * This is a special cell with number formatting
	 * @param string content
	 * @return string
	 */
	generateHtmlBodyNumberCell(content)
	{
		return '<td class="number">' + content + '</td>';
	}

	/**
	 * Generates line count results formatted as an HTML string
	 * @param any[] lineCounts
	 * @return string
	 */
	generateHtmlOutput(lineCounts)
	{
		const includeComments = this.config.count.comments;
		const includeTrivial = this.config.count.trivial;
		const includeEmpty = this.config.count.empty;

		const templatePath = path.resolve(__dirname, '../templates/html-table-header.html')
		let html = fs.readFileSync(templatePath, 'utf-8');

		if (includeComments)
		{
			html += this.generateHtmlHeaderCell('Comments');
		}

		if (includeTrivial)
		{
			html += this.generateHtmlHeaderCell('Trivial');
		}

		if (includeEmpty)
		{
			html += this.generateHtmlHeaderCell('Empty');
		}

		html += this.generateHtmlHeaderCell('Total');
		html += `</tr><tbody>\n`;

		for (let i = 0; i < lineCounts.length; i++)
		{
			const count = lineCounts[i];
			html += this.generateHtmlBodyRow(count);
		}

		html += `</tbody></table></body></html>`;

		return html;
	}
}

module.exports = OutputGenerator;

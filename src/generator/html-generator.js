const fs = require('fs');
const path = require('path');

class HtmlGenerator
{
	constructor(config)
	{
		this.config = config || {};
		this.includeComments = this.config.count.comments;
		this.includeTrivial = this.config.count.trivial;
		this.includeEmpty = this.config.count.empty;
	}

	/**
	 * Generates line count results formatted as an HTML string
	 * @param any[] lineCounts
	 * @return string
	 */
	generate(lineCounts)
	{
		let html = this.generateHeader();
		html += this.generateBody(lineCounts);
		html += this.generateFooter(lineCounts);
		html += '</tbody></table></body></html>';
		return html;
	}

	/**
	 * Generates and returns an HTML header row
	 * @return string
	 */
	generateHeader()
	{
		const templatePath = path.join(__dirname, '../templates/html-table-header.html');
		let html = fs.readFileSync(templatePath, 'utf-8');
		if (this.includeComments)
		{
			html += this.generateHeaderCell('Comments');
		}

		if (this.includeTrivial)
		{
			html += this.generateHeaderCell('Trivial');
		}

		if (this.includeEmpty)
		{
			html += this.generateHeaderCell('Empty');
		}

		html += this.generateHeaderCell('Total');
		html += '\t\t\t</tr>\n';
		return html;
	}

	/**
	 * Generates and returns an HTML header cell
	 * @param string content
	 * @return string
	 */
	generateHeaderCell(content)
	{
		return '\t\t\t\t<th>' + content + '</th>\n';
	}

	/**
	 * Generates the body of the HTML table
	 * @param any[] lineCounts
	 * @return string
	 */
	generateBody(lineCounts)
	{
		let html = '';
		for (let i = 0; i < lineCounts.length; i++)
		{
			const count = lineCounts[i];
			html += this.generateBodyRow(count);
		}
		return html;
	}

	/**
	 * Generates and returns a single HTML body row
	 * @param any lineCount
	 * @return string
	 */
	generateBodyRow(lineCount)
	{
		const path = lineCount.path;
		const source = lineCount.source;
		const trivial = lineCount.trivial;
		const comments = lineCount.comments;
		const empty = lineCount.empty;
		const total = lineCount.total;

		let html = '\t\t\t<tr>\n';
		html += this.generateBodyCell(path);
		html += this.generateBodyNumberCell(source);

		if (this.includeComments)
		{
			html += this.generateBodyNumberCell(comments);
		}

		if (this.includeTrivial)
		{
			html += this.generateBodyNumberCell(trivial);
		}

		if (this.includeEmpty)
		{
			html += this.generateBodyNumberCell(empty);
		}

		html += this.generateBodyNumberCell(total);
		html += '\t\t\t</tr>\n';
		return html;
	}

	/**
	 * Generates and returns a single cell for display in an HTML body row
	 * @param string content
	 * @return string
	 */
	generateBodyCell(content)
	{
		return '\t\t\t\t<td>' + content + '</td>\n';
	}

	/**
	 * Generates and returns a single cell for display in an HTML body row.
	 * This is a special cell with number formatting
	 * @param string content
	 * @return string
	 */
	generateBodyNumberCell(content)
	{
		return '\t\t\t\t<td class="number">' + content + '</td>\n';
	}

	/**
	 * Generates and returns an HTML footer row
	 * @param any[] lineCounts
	 * @return string
	 */
	generateFooter(lineCounts)
	{
		let totals = {
			source: 0,
			trivial: 0,
			comments: 0,
			empty: 0,
			total: 0
		};

		for (let i = 0; i < lineCounts.length; i++)
		{
			const lineCount = lineCounts[i];
			totals.source += lineCount.source;
			totals.trivial += lineCount.trivial;
			totals.comments += lineCount.comments;
			totals.empty += lineCount.empty;
			totals.total += lineCount.total;
		}

		let html = '<tr><td><strong>Total</strong></td>';
		html += this.generateBodyNumberCell(totals.source);
		if (this.includeComments)
		{
			html += this.generateBodyNumberCell(totals.comments);
		}

		if (this.includeTrivial)
		{
			html += this.generateBodyNumberCell(totals.trivial);
		}

		if (this.includeEmpty)
		{
			html += this.generateBodyNumberCell(totals.empty);
		}

		html += this.generateBodyNumberCell(totals.total);
		return html;
	}
}

module.exports = HtmlGenerator;

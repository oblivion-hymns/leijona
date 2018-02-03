class CsvGenerator
{
	constructor(config)
	{
		this.config = config || {};
		this.includeComments = this.config.count.comments;
		this.includeTrivial = this.config.count.trivial;
		this.includeEmpty = this.config.count.empty;
	}

	/**
	 * Generates line count results formatted as a CSV string
	 * @param any[] lineCounts
	 * @return string
	 */
	generate(lineCounts)
	{
		let csv = this.generateHeader();
		for (let i = 0; i < lineCounts.length; i++)
		{
			const count = lineCounts[i];
			const path = count.path;
			const source = count.source;
			const comments = count.comments;
			const trivial = count.trivial;
			const empty = count.empty;
			const total = count.total;

			csv += '"' + path + '",' + source + ',';

			if (this.includeComments)
			{
				csv += '' + comments + ',';
			}

			if (this.includeTrivial)
			{
				csv += '' + trivial + ',';
			}

			if (this.includeEmpty)
			{
				csv += '' + empty + ',';
			}

			csv += '' + total + '\n';
		}

		csv += this.generateFooter(lineCounts);

		console.log(csv);

		return csv;
	}

	/**
	 * Generates the first (header) line of the csv
	 * @return string
	 */
	generateHeader()
	{
		let row = 'File,Source,';
		if (this.includeComments)
		{
			row += 'Comments,';
		}

		if (this.includeTrivial)
		{
			row += 'Trivial,';
		}

		if (this.includeEmpty)
		{
			row += 'Empty,';
		}

		row += 'Total\n';
		return row;
	}

	/**
	 * Generates the last (footer) line of the csv
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

		let row = 'Total,' + totals.source + ',';
		if (this.includeComments)
		{
			row += '' + totals.comments + ',';
		}

		if (this.includeTrivial)
		{
			row += '' + totals.trivial + ',';
		}

		if (this.includeEmpty)
		{
			row += '' + totals.empty + ',';
		}

		row += '' + totals.total + '\n';
		return row;
	}
}

module.exports = CsvGenerator;

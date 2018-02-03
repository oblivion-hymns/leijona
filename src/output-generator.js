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
}

module.exports = OutputGenerator;

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
		const format = this.config.format;
		const Generator = require('./generator/' + format + '-generator');
		const generator = new Generator(this.config);
		let output = generator.generate(lineCounts);
		return output;
	}
}

module.exports = OutputGenerator;

class ConfigValidator
{
	/**
	 * Validates the given json and outputs messages for abnormal configuration
	 * @param any config
	 */
	validate(config)
	{
		if (!config.exclude.paths)
		{
			console.log('Could not find exclude.paths - counting all files in directory');
		}

		if (!config.exclude.fileTypes)
		{
			console.log('Counting all filetypes because no filetype exclusions provided.');
			console.log('You should include the exclude.fileTypes property in leijona.json');
		}
	}
}

module.exports = ConfigValidator;

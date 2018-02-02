class ConfigManager
{
	/**
	 * Attempts to retrieve the config file.
	 * @return any
	 */
	getConfig(dir)
	{
		let config = {};

		try
		{
			const projectConfigPath = dir + 'leijona.json';
			config = require(projectConfigPath);
			console.log('Found project config at ' + projectConfigPath);
		}
		catch (e)
		{
			console.warn('Could not find leijona.json in project root. Using default configuration.');
			console.warn('Error details: ', e);
		}

		if (!config)
		{
			try
			{
				config = require('./leijona.json');
				console.log('Found default project config in leijona directory.');
			}
			catch (e)
			{
				console.error('Could not find default leijona.json.');
			}
		}

		return config;
	}

	/**
	 * Validates the given json and outputs messages for abnormal configuration
	 * @param any config
	 */
	validateConfig(config)
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

module.exports = ConfigManager;

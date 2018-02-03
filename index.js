const fs = require('fs');
const ConfigManager = require('./src/config-manager');
const FileHandler = require('./src/file-handler');
const LineCounter = require('./src/line-counter');
const OutputGenerator = require('./src/output-generator');
const StringManipulator = require('./src/string-manipulator');

function leijona()
{
	let baseDir = process.cwd().trim();
	if (!baseDir || baseDir.length == 0)
	{
		console.error('Could not access base directory. Aborting.');
		exit();
	}

	const stringManipulator = new StringManipulator();
	baseDir = stringManipulator.appendTrailingSlash(baseDir);

	const configManager = new ConfigManager();
	const config = configManager.getConfig(baseDir);
	if (!config || config == {})
	{
		console.log('Could not find leijona.json. Aborting.');
		exit();
	}

	configManager.validateConfig(config);

	const fileHandler = new FileHandler(baseDir, config);
	const allFiles = fileHandler.gatherFiles(baseDir);

	const lineCounter = new LineCounter(baseDir, config);
	const lineCounts = lineCounter.countFiles(allFiles);

	const outputPath = baseDir + config.outputFile;
	const outputGenerator = new OutputGenerator(config);
	const output = outputGenerator.generate(lineCounts);

	fs.writeFileSync(outputPath, output);

	console.log('Done! Wrote line count data to ' + outputPath);
	exit();
}

/**
 * Terminates script
 */
function exit()
{
	return process.exit(-1);
}

leijona();

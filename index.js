const ConfigManager = require('./src/config-manager');
const FileHandler = require('./src/file-handler');
const LineCounter = require('./src/line-counter');
const StringManipulator = require('./src/string-manipulator');

let baseDir = process.cwd().trim();

function leijona()
{
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
	console.log(lineCounts);
}

/**
 * Terminates script
 */
function exit()
{
	return process.exit(-1);
}

leijona();


/*function addCommas(number)
{
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

exec(baseDir);*/

/*const resultsTable = textTable(lineCountData, {
	hsep: ' | ',
	align: ['l', 'r', 'r', 'r', 'r', 'r']
});*/
//fs.writeFileSync('line-count.txt', resultsTable);

//console.log('Done!');

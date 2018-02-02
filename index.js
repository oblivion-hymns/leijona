const fs = require('fs');

let baseDir = process.cwd().trim();

function leijona()
{
	if (!baseDir || baseDir.length == 0)
	{
		console.error('Could not parse base directory. Exiting.');
		process.exit(-1);
	}

	if (!baseDir.endsWith('/'))
	{
		baseDir += '/';
	}

	const config = require('./config.json');
	validateConfig(config);

	const allFiles = gatherFiles(baseDir, config);
	console.log(allFiles);
}

/**
 * Validates the given configuration, outputting messages if any abnormalities are detected
 * @param any config
 */
function validateConfig(config)
{
	const ConfigValidator = require('./src/config-validator');
	const configValidator = new ConfigValidator();
	configValidator.validate(config);
}

/**
 * Collects all files in the given dir based on the given config's exclusion patterns.
 * Returns a list of all file paths to be counted
 * @param string dir
 * @param any config
 * @return string[]
 */
function gatherFiles(dir, config)
{
	const excludePaths = config.exclude.paths;
	const excludeTypes = config.exclude.fileTypes;

	let files = [];
	const dirFiles = fs.readdirSync(dir);
	for (let i = 0; i < dirFiles.length; i++)
	{
		const currentFile = dirFiles[i];
		const fullPath = baseDir + currentFile;
		const relativePath = fullPath.replace(baseDir, '');

		//Exclude paths
		if (excludePaths.indexOf(relativePath) > -1 || excludePaths.indexOf(relativePath + '/') > -1)
		{
			console.log('Excluding ' + relativePath);
		}
		else
		{
			console.log('Inc ' + relativePath);
		}

		/*let fullPath = dir + currentFile;
		console.log(fullPath);
		const isDir = fs.lstatSync(fullPath).isDirectory();
		if (isDir)
		{
			fullPath += '/';
		}*/


	}

	return files;
}

leijona();

return;





function countLines(path, relativePath)
{
	/**
	 * 0 = filename
	 * 1 = source
	 * 2 = comments
	 * 3 = trivial
	 * 4 = empty
	 * 5 = total
	 */
	let lineCount = [relativePath, 0, 0, 0, 0, 0];

	const lines = fs.readFileSync(path, 'utf-8').split('\n');

	for (let j = 0; j < lines.length; j++)
	{
		const line = lines[j];
		const transformedLine = line.trim();
		if (transformedLine.length == 0)
		{
			lineCount[4]++;
		}
		else if (transformedLine.startsWith('//') || transformedLine.startsWith('/*'))
		{
			lineCount[2]++;
		}
		else if (!transformedLine.match(/[0-9a-zA-Z]{1,}/))
		{
			lineCount[3]++;
		}
		else
		{
			lineCount[1]++;
		}
	}

	lineCount[5] = lineCount[1] + lineCount[2] + lineCount[3] + lineCount[4];
	return lineCount;
}



function addCommas(number)
{
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

exec(baseDir);

let sourceTotal = 0;
let commentsTotal = 0;
let trivialTotal = 0;
let emptyTotal = 0;
let totalTotal = 0;
for (let i = 0; i < lineCountData.length; i++)
{
	const data = lineCountData[i];
	if (!isNaN(data[1]))
	{
		sourceTotal += data[1];
		commentsTotal += data[2];
		trivialTotal += data[3];
		emptyTotal += data[4];
		totalTotal += data[5];
	}
}

sourceTotal = addCommas(sourceTotal);
commentsTotal = addCommas(commentsTotal);
trivialTotal = addCommas(trivialTotal);
emptyTotal = addCommas(emptyTotal);
totalTotal = addCommas(totalTotal);

lineCountData.push(['TOTAL', sourceTotal, commentsTotal, trivialTotal, emptyTotal, totalTotal]);

/*const resultsTable = textTable(lineCountData, {
	hsep: ' | ',
	align: ['l', 'r', 'r', 'r', 'r', 'r']
});*/
//fs.writeFileSync('line-count.txt', resultsTable);

//console.log('Done!');

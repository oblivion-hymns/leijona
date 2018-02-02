const fs = require('fs');

var config = null;
let baseDir = process.cwd().trim();

function leijona()
{
	validateBaseDir(baseDir);
	baseDir = appendTrailingSlash(baseDir);
	config = getConfig(baseDir);
	validateConfig(config);
	const allFiles = gatherFiles(baseDir);
	const lineCounts = countFiles(allFiles);
	console.log(lineCounts);
}

/**
 * Exits the application if the given directory cannot be found for any reason
 * @param string dir
 */
function validateBaseDir(dir)
{
	if (!dir || dir.length == 0)
	{
		console.error('Could not determine base directory. Aborting.');
		exit();
	}
}

/**
 * Appends a trailing slash to the given path, if it needs one.
 * @param string path
 * @return string
 */
function appendTrailingSlash(path)
{
	if (!path.endsWith('/'))
	{
		path += '/';
	}

	return path;
}

/**
 * Attempts to retrieve the config file.
 * @return any
 */
function getConfig(dir)
{
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
			console.error('Could not find default leijona.json. Aborting.');
			exit();
		}
	}

	return config;
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
 * @return string[]
 */
function gatherFiles(dir)
{
	let files = [];
	const dirFiles = fs.readdirSync(dir);
	for (let i = 0; i < dirFiles.length; i++)
	{
		const currentFile = dirFiles[i];
		let fullPath = dir + currentFile;
		const relativePath = fullPath.replace(baseDir, '');
		const isDir = fs.lstatSync(fullPath).isDirectory();
		const fileIsIncluded = isIncluded(relativePath);


		if (fileIsIncluded)
		{
			if (isDir)
			{
				fullPath = appendTrailingSlash(fullPath);
				files.push(...gatherFiles(fullPath));
			}
			else
			{
				files.push(fullPath);
			}
		}
	}

	return files;
}

/**
 * Returns a total line count for all of the files in the given list
 * @param string[] paths
 * @return any
 */
function countFiles(paths)
{
	let lineCounts = [];
	for (let i = 0; i < paths.length; i++)
	{
		const path = paths[i];
		const lineCount = countLines(path);
		lineCounts.push(lineCount);
	}

	return lineCounts;
}

/**
 * Counts the number of lines in the given file
 * @param string path
 * @return any
 */
function countLines(path)
{
	let lineCount = {
		path: path.replace(baseDir, ''),
		source: 0,
		trivial: 0,
		comments: 0,
		empty: 0,
		total: 0
	};

	const includeComments = config.count.comments;
	const includeTrivial = config.count.trivial;
	const includeEmpty = config.count.empty;
	const commentChars = config.commentCharacters;
	let escapedCommentChars = [];
	for (let i = 0; i < commentChars.length; i++)
	{
		const currentChar = config.commentCharacters[i];
		const escapedChar = escapeStringForRegex(currentChar);
		escapedCommentChars.push(escapedChar);
	}

	const commentCharRegex = new RegExp(escapedCommentChars.join('|'));
	const lines = fs.readFileSync(path, 'utf-8').split('\n');
	for (let i = 0; i < lines.length; i++)
	{
		const currentLine = lines[i];
		const transformedLine = currentLine.trim();
		if (includeEmpty && transformedLine.length == 0)
		{
			lineCount.empty++;
		}
		else if (includeComments && currentLine.match(commentCharRegex))
		{
			lineCount.comments++;
		}
		else if (includeTrivial && !transformedLine.match(/[0-9a-zA-Z]{1,}/))
		{
			lineCount.trivial++;
		}
		else
		{
			lineCount.source++;
		}
	}

	lineCount.total = lineCount.source + lineCount.comments + lineCount.trivial + lineCount.empty;
	return lineCount;
}

/**
 * Returns a mutation of the given string that is usable inside a regular expression
 * @param string inputString
 * @return string
 */
function escapeStringForRegex(inputString)
{
	//Ensure the input is a string
	let transformedString = inputString + '';
	transformedString = transformedString.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
	return transformedString;
}

/**
 * Returns whether or not the given relative path must be included for line counting
 * @param string relativePath
 * @return boolean
 */
function isIncluded(relativePath)
{
	const excludePaths = config.exclude.paths;
	const excludeTypes = config.exclude.fileTypes;

	if (excludePaths.indexOf(relativePath) > -1)
	{
		//Relative path exclusion
		return false;
	}
	else if (excludePaths.indexOf(relativePath + '/') > -1)
	{
		//Relative path exclusion sanity check
		return false;
	}

	//Filetype exclusion
	for (let i = 0; i < excludeTypes.length; i++)
	{
		const excludeType = excludeTypes[i];
		if (relativePath.endsWith(excludeType))
		{
			return false;
		}
	}

	return true;
}

/**
 * Terminates script
 */
function exit()
{
	return process.exit(-1);
}

leijona();
return;

function addCommas(number)
{
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

exec(baseDir);

/*const resultsTable = textTable(lineCountData, {
	hsep: ' | ',
	align: ['l', 'r', 'r', 'r', 'r', 'r']
});*/
//fs.writeFileSync('line-count.txt', resultsTable);

//console.log('Done!');

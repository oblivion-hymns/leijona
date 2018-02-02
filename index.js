// Counts lines in project
const fs = require('fs');
const textTable = require('text-table');

let baseDir = process.argv[2] || process.cwd() || '';
baseDir = baseDir.trim();

if (!baseDir || baseDir.length == 0)
{
	console.error('[line-count] Must provide a valid base directory as an argument, e.g. node line-count.js <dir>');
	process.exit(-1);
}

baseDir += '/';

//const baseDir = path.join(__dirname + '/../');
const excludes = [
	'.git/',
	'.nyc_output/',
	'artifacts/',
	'config/webpack/public/',
	'docs/',
	'node_modules/',
	'public/code-coverage/',
	'public/docs/',
	'public/img/',
	'public/plugins/dialog-polyfill/',
	'public/js/app/bundle.js',
	'public/lib/',
	'vendor/',
	'package-lock.json',
	'package.json'
];

const excludeTypes = [
	'txt'
];

console.log('Counting line data...');

let lineCountData = [];
lineCountData.push(['File', 'Source', 'Comments', 'Trivial', 'Empty', 'Total']);

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

function exec(dir)
{
	const files = fs.readdirSync(dir);
	for (let i = 0; i < files.length; i++)
	{
		const file = files[i];
		let fullPath = dir + file;
		const isDir = fs.lstatSync(fullPath).isDirectory();

		let path = file;
		if (isDir)
		{
			path += '/';
		}

		fullPath = dir + path;

		//Determine if file or folder qualifies for exclusion
		//Path exclusion
		let excludePath = fullPath.replace(baseDir, '');

		//Extension exclusion
		let pathParts = excludePath.split('.');
		const extension = pathParts[pathParts.length - 1];
		const isWhitelisted = (excludes.indexOf(excludePath) == -1) && (excludeTypes.indexOf(extension) == -1);
		if (isWhitelisted)
		{
			if (isDir)
			{
				exec(fullPath);
			}
			else
			{
				const lineCount = countLines(fullPath, excludePath);
				lineCountData.push(lineCount);
			}
		}
	}
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

const resultsTable = textTable(lineCountData, {
	hsep: ' | ',
	align: ['l', 'r', 'r', 'r', 'r', 'r']
});
fs.writeFileSync('line-count.txt', resultsTable);

console.log('Done!');

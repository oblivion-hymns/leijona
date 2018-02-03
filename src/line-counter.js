const fs = require('fs');
const StringManipulator = require('./string-manipulator');

class LineCounter
{
	/**
	 * @param string baseDir
	 * @param any config
	 */
	constructor(baseDir, config)
	{
		this.baseDir = baseDir || '';
		this.config = config || {};

		const commentChars = this.config.commentCharacters;
		let escapedCommentChars = [];
		for (let i = 0; i < commentChars.length; i++)
		{
			const currentChar = commentChars[i];
			const escapedChar = stringManipulator.escapeStringForRegex(currentChar);
			escapedCommentChars.push(escapedChar);
		}

		this.commentCharRegex = new RegExp(escapedCommentChars.join('|'));
	}

	/**
	 * Returns a total line count for all of the files in the given list
	 * @param string[] paths
	 * @return any
	 */
	countFiles(paths)
	{
		let lineCounts = [];
		for (let i = 0; i < paths.length; i++)
		{
			const path = paths[i];
			const lineCount = this.countLines(path);
			lineCounts.push(lineCount);
		}

		return lineCounts;
	}

	/**
	 * Counts the number of lines in the given file
	 * @param string path
	 * @return any
	 */
	countLines(path)
	{
		const stringManipulator = new StringManipulator();
		const includeComments = this.config.count.comments;
		const includeTrivial = this.config.count.trivial;
		const includeEmpty = this.config.count.empty;

		let lineCount = {
			path: path.replace(this.baseDir, ''),
			source: 0,
			trivial: 0,
			comments: 0,
			empty: 0,
			total: 0
		};

		const lines = fs.readFileSync(path, 'utf-8').split('\n');
		for (let i = 0; i < lines.length; i++)
		{
			const currentLine = lines[i];
			const transformedLine = currentLine.trim();
			if (!transformedLine.length)
			{
				if (includeEmpty)
				{
					lineCount.empty++;
				}
			}
			else if (currentLine.match(this.commentCharRegex))
			{
				if (includeComments)
				{
					lineCount.comments++;
				}
			}
			else if (!transformedLine.match(/[0-9a-zA-Z]{1,}/))
			{
				if (includeTrivial)
				{
					lineCount.trivial++;
				}
			}
			else
			{
				lineCount.source++;
			}
		}

		lineCount.total = lineCount.source + lineCount.comments + lineCount.trivial + lineCount.empty;
		return lineCount;
	}
}

module.exports = LineCounter;

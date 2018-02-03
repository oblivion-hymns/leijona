const fs = require('fs');
const StringManipulator = require('./string-manipulator');

class FileHandler
{
	/**
	 * @param string baseDir - Base directory of project
	 */
	constructor(baseDir, config)
	{
		this.baseDir = baseDir || '';
		this.config = config || {};
	}

	/**
	 * Collects all files in the given dir based on the given config's exclusion patterns.
	 * Returns a list of all file paths to be counted
	 * @param string dir
	 * @return string[]
	 */
	gatherFiles(dir)
	{
		const stringManipulator = new StringManipulator();

		let files = [];
		const dirFiles = fs.readdirSync(dir);
		for (let i = 0; i < dirFiles.length; i++)
		{
			const currentFile = dirFiles[i];
			let fullPath = dir + currentFile;
			const relativePath = fullPath.replace(this.baseDir, '');
			const isDir = fs.lstatSync(fullPath).isDirectory();
			const fileIsIncluded = this.isPathIncluded(relativePath);

			if (fileIsIncluded)
			{
				if (isDir)
				{
					fullPath = stringManipulator.appendTrailingSlash(fullPath);
					files.push(...this.gatherFiles(fullPath));
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
	 * Returns whether or not the given relative path must be included for line counting
	 * @param string relativePath
	 * @return boolean
	 */
	isPathIncluded(relativePath)
	{
		const excludePaths = this.config.exclude.paths;
		const excludeTypes = this.config.exclude.fileTypes;

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
}

module.exports = FileHandler;

class FileHandler
{
	/**
	 * @param string baseDir - Base directory of project
	 */
	constructor(baseDir)
	{
		this.baseDir = baseDir || '';
	}

	/**
	 * Collects all files in the given dir based on the given config's exclusion patterns.
	 * Returns a list of all file paths to be counted
	 * @param string dir
	 * @return string[]
	 */
	gatherFiles(dir)
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
	countFiles(paths)
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
}

module.exports = FileHandler;

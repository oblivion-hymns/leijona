class StringManipulator
{
	/**
	 * Appends a trailing slash to the given path, if it needs one.
	 * @param string path
	 * @return string
	 */
	appendTrailingSlash(path)
	{
		if (!path.endsWith('/'))
		{
			path += '/';
		}

		return path;
	}

	/**
	 * Returns a mutation of the given string that is usable inside a regular expression
	 * @param string inputString
	 * @return string
	 */
	escapeStringForRegex(inputString)
	{
		//Ensure the input is a string
		let transformedString = inputString + '';
		transformedString = transformedString.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
		return transformedString;
	}
}

module.exports = StringManipulator;

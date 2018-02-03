# leijona
Leijona (_LAY_-uh-nuh) is a line count tool for modern applications. From the Finnish word for "lion", because "lion" sounds like
"line".

Hear how to pronounce "leijona" [here](https://forvo.com/word/leijona/).

## Installation
Install the package globally using `npm i -g leijona`.

## Running
Navigate to the directory of the project you want to count and run `node leijona`.

### Command line arguments
There are no command line arguments for leijona. All configuration is done through `leijona.json`.

## Configuration
There is plenty to configure to get leijona working just the way you want it to. In the project root there is a sample
`leijona.json` file which contains all available options. You can include your own `leijona.json` file in the directory
you are running the script from and it will override the default configuration.

### Format
```
"format": "html"
```

`html` will generate an .html file with a table displaying the results.
`csv` will generate a comma-separated list of values in a CSV file;
`cli` will output the results directly to the command-line in which the script was run. This can also be used to pipe
the contents of leijona to a file.

### Count Inclusions
```
"count": {
	"comments": true,
	"trivial": true,
	"empty": false
}
```

Leijona categorizes code in four different ways:

- `source` lines include any line of code containing at least one character that is not a symbol
- `comments` include any line beginning with a series of characters matching at least one series in the
`commentCharacters` portion of `leijona.json`
- `trivial` lines of code encompass any line that contains symbols, but no alphanumeric characters
- `empty` lines of code are lines that do not contain anything other than whitespace, line breaks, tabs, and carriage
returns.

Using this entry, you can choose to individually include or exclude any line of code that leijona considers to be
`trivial`, `empty`, or beginning with `comments`. `source` lines cannot be excluded. The `total` number of lines shown
on the output is a reflection of only the lines you include.

### Comment Characters
```
"commentCharacters": [
	"/*",
	"*/",
	"* ",
	"//",
	"#",
	"<!--"
],
```

Any line beginning with a series of characters that exactly matches any of the items in this list will be counted as a
comment. These are passed into a regex, but *do not need to be escaped*.  Enter only the literal character sequences
you wish to count as comments.

### Exclusions
```
"exclude": {
	"paths": [
		".git/",
		"node_modules/",
		"vendor/",
		"package.json"
	],
	"fileTypes": [
		"mp3",
		"gif",
		"jpeg"
	]
}
```
Leijona can blacklist files, directories, and filetypes from being counted.

Each file or directory's relative path will be compared to the `paths` list. If it is found to match any entry in
`paths` it will be excluded from being counted. The trailing `/` on directories is optional, but recommended for
slightly easier readability.

Likewise, specific file types can be excluded altogether if you add them to the `fileTypes` list. You may include the
leading `.` if you wish (e.g. `.mp3`), but `mp3` will work just fine.

Since `leijona.json` can be overridden per project, you can have separate exclusions on a per-project basis.

## License

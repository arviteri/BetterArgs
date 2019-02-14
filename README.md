# BetterArgs

BetterArgs is a lightweight tool that parses command line arguments and organizes them by flags. Its purpose is to create an easier method for developing command line interfaces. 

## Example

BetterArgs parses the following command...
`$ yourcli makeproject TestProj -d ~/desktop --license MIT` 
...into the following JavaScript object.
```
{
  0: ['...', '...', 'makeproject', 'TestProj'],
 'd': ['~/desktop'],
 'license': ['MIT']
}
```

## Installation

To use, run `npm install betterargs`.

## Usage

BetterArgs exports three functions alongside the parsed data. The functions are listed below...
- setGlobalFlag
- setCommand
- init

The parsed data is exported as `args`.

To use BetterArgs install with the command `npm install betterargs` and require it at the top of the program.

`const cli = require('betterargs');`

Use the `setGlobalFlag` and `setCommand` functions to create a command line interface, and lastly initialize the program using the `init` function.

__Example__

```
const cli = require('betterargs');

cli.setGlobalFlag('version', 'v', (flagData) => {
	console.log('v1.0.0');
}, true);

cli.setCommand('install', (cmdArgs, flagData) => {
	
	// Code block for command implementation

});

cli.setCommand('printParsedInput', (cmdArgs, flagData) => {
	const parsedInput = cli.args;
	console.log(parsedInput);
});

cli.init();
```

To get hold of the entire object storing the parsed command input, use `cli.args`.

## Functions

BetterArgs exports a few functions which use the parsed data to help create command line interfaces. These functions are listed below...
- setGlobalFlag
- setCommand

__setGlobalFlag__ - The `setGlobalFlag(name, alias, func, terminating)` function sets a flag that may or may not override the command that is entered. The `terminating` option is what makes the decision of whether or not the program will terminate after the flags function has been executed. 

__Example__
```
const cli = require('betterargs');

cli.setGlobalFlag('version', 'v', (flagArgs) => {
	console.log('v1.0.0');
}, true);

cli.init();
```
The above example creates a command line interface that prints the version number whenever the flag `-v` or `--version` is typed in the command line. After the version number is printed, the program terminates. 

As shown above, `setGlobalFlag` accepts a function as an argument. That function accepts `flagArgs` which stores an array holding the data entered between the flag that is being set, and the flag that comes after it.  

For further example...

```
const cli = require('betterargs');

cli.setGlobalFlag('flag', 'f', (flagArgs) => {
	console.log(flagArgs);
}, true);

cli.init();
``` 

...the above program will print the `flagArgs` of the flag named `flag` whenever the flag has been entered in the command.  Below is an example of the command line interface that the program above creates. 

Input:     `$ yourcli --flag arg1 arg1`  
Output: `['arg1', 'arg2']`

<br />

__setCommand__ - The `setCommand(name, func)` function sets a function to a command name. The function being accepted has access to the arguments after the original command, and data holding the parsed flag information. 


__Example__
```
const cli = require('betterargs');

cli.setCommand('makeproject', (cmdArgs, flagData) => {
	
	const projName = cmdArgs[0];
	const DIR_FLAG = flagData['d'] ? flagData['d'] : flagData['directory'];
	
	/* Check if dir_flag is set */
	if (DIR_FLAG) {
		const _dir = DIR_FLAG[0]; // Get directory input. 
		// Create a new project using the directory
		return;
	}

	/* dir_flag not set */
	// Create new project using defaults.
	
});

cli.init();
```

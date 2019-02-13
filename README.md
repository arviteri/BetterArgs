# BetterArgs

BetterArgs is a lightweight tool to help you create simple command line interfaces. Essentially BetterArgs is a string parser, which parses the command line input and organizes it based on flag input. 

__IMPORTANT__: The `init` function needs to be called after all flags and commands have been set.

Click [here](#ex) to see a full example program using BetterArgs.

Example:

The following input.... `yourcli install somedata -a A1 A2 A3 -b B1 B2 B3 -c C1 C2 C3`

...is organized into a JavaScript object that looks like this...

```
args = {
	0: ['...', '...', 'install', 'somedata'],
	a: ['A1', 'A2', 'A3'],
	b: ['B1', 'B2', 'B3'],
	c: ['C1', 'C2', 'C3']
}
```

## Usage

BetterArgs exports three functions and the parsed data itself...
- setGlobalFlag(name, alias, func, terminating)
- setCommand(name, func)
- init()
- args

### setGlobalFlag(name, alias, func, terminating)

The `setGlobaFlag` function sets an option that is independent of the command that is typed.

The `terminating` argument is a boolean variable that decides whether or not to end the CLI program after the global flag function has been executed. 

Example...

```
setGlobalFlag('version', 'v', (flagArgs) => {
	const version = "v1.0.0";
	console.log(version);
}, true);
```

The code above works as follows...

CLI input:  `$ yourcli -v` or `$ yourcli --version`
CLI output: `$ v1.0.1`

Because `terminating` is set to `true` in the example above, the program will terminate after outputting the version.

The __flagArgs__ provided as an argument in the function is an array consisting of the string input after the flag, and before the next flag. 

Example...

```
setGlobalFlag('printFlagArgs', 'p', (flagArgs) => {
	console.log(flagArgs)
}, true);
```

CLI input:  `$ yourcli -p arg1 arg2 arg2 --otherflag`
CLI output: `$ ['arg1', 'arg2', 'arg2']`

### setCommand(name, func)

The `setCommand` function sets a function to a command name. It also provides the cli arguments in as an argument in the function. 

Example...

```
setCommand('example', (cmdArgs, flagData) => {
	console.log(cmdArgs);
	console.log(flagData);
});
```

CLI input:  `$ yourcli example arg1 arg2 arg3 --a A1 A2 --b B1 B2`
CLI output: 
```
$ ['arg1', 'arg2', 'arg3']
{
	a: ['A1', 'A2'],
	b: ['B1', 'B2']
}
```
<br />
<a id="ex" />

## Full Example

```
const cli = require('betterargs');

cli.setGlobalFlag('version', 'v', (flagArgs) => {
	console.log("v1.0.0");
}, true);

cli.setGlobalFlag('showFlagArgs', 's', (flagArgs) => {
	console.log(flagArgs);
}, true);

cli.setCommand('install', (cmdArgs, flagData) => {
	const toInstall = cmdArgs[0]; // Argument after `install`
	const someFlag = flagData['someFlag'] ? flagData['someFlag'] : flagData['f'];
	
	if (someFlag) {
		// Do some stuff if flag has been set.
		console.log("Flag has been executed.");
	}
	
	console.log("Installing... " + toInstall);
});

cli.init();
```

__CLI Input Examples Using Above Code__

Input: `$ yourcli -v`
Output: `v1.0.0`

Input: `yourcli -s arg1 arg2`
Output: `[arg1, arg2]`	

Input: `yourcli install somefile`
Output: `Installing... somefile`

Input: `yourcli install somefile -someFlag`
Output: 
```
Flag has been executed.
Installing... somefile
```

Input: `yourcli install somefile -f`
Output: 
```
Flag has been executed.
Installing... somefile
```


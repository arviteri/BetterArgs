/**
 * BETTERARGS
 * February 6, 2019
 * License: MIT
 * Andrew Viteri
 */

var data = {0: []};
var cmds = {};
var globalFlags = {};
var globalFlagAliases = {};

/**
 * Sets a global flag which may or may not override command.
 * @arg name {string} - flag name. Ex. 'version' 
 * @arg alias {string} - flag alias. Ex. 'v'
 * @arg func {function} - function that executes if flag is present.
 * @arg terminating {Bool} - whether or not the flag will end the cli. 
 */
const setGlobalFlag = (name, alias, func, terminating) => {
	globalFlagAliases[alias] = name;
 	globalFlags[name] = {
		alias: alias,
		terminating: terminating ? true:false,
		func: func
	};
}

/**
 * Sets a function for a command.
 * @arg name {string} - string user will type to execute the function.
 * @arg func {function} - the function that executes when command is typed.
 */
const setCommand = (name, func) => {
	cmds[name] = {
		func: func
	}
}


/**
 * Parses the command line input and stores it in `data` argument.
 */
const parseInput = () => {

	const argv = process.argv;

	var k = 0, flagCounter = 0;
	var current_store = data[0];

	for (var i = 0; i < argv.length; i++) {

		const current_arg = argv[i];

		if (current_arg.charAt(0) === '-') {
			const startIndex = current_arg.lastIndexOf('-') + 1;
			const key = current_arg.substring(startIndex);

			data[key] = [];
			current_store = data[key];
			flagCounter++;
			k = 0;
		} else {
			current_store[k] = current_arg;
			k++;
		}
	}
}

/**
 * Executes global flags that are found in parsed data input.
 */
const executeGlobalFlags = () => {
	if (!globalFlags) {
		return false;
	}

	for (key in data) {
		const key2 = globalFlagAliases[key];
		const flag = globalFlags[key] ? globalFlags[key]:globalFlags[key2];
		if (flag) {
			const flagArgs = data[key];
			flag.func(flagArgs);
			if (flag.terminating) {
				return true;
			}
		}
	}

	return false;
}

/**
 * Executes the command typed by the user.
 */
const executeCmd = () => {
	const input = data[0][2]; // 'First' argument of the process.
	const cmd = cmds[input];

	if (cmd) {
		const cmdArgs = data[0].slice(3);
		const flagData = data;
		delete flagData[0];
		cmd.func(cmdArgs, flagData);
		return;
	}
}

/**
 * Initializes the cli to read and parse the input from the command line.
 */
const init = () => {
	parseInput();
	if (executeGlobalFlags()) {
		return;
	}
	executeCmd();
}

module.exports = {
	setGlobalFlag: setGlobalFlag,
	setCommand: setCommand,
	init: init,
	args: data
};

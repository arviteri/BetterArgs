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
 * Sets a global flag which overrides commands.
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
		cmd.func(cmdArgs, data);
		return;
	}
}

/**
 * Initializes the app to read and parse the input from the command line.
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

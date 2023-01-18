const commander = require('commander'); 
const { healthcheck} = require('../functions');
const program = new commander.Command();

program
    .addOption(new commander.Option('--format, <string>', 'choose format of data response').default("json").choices(['json', 'csv']))
program.parse(process.argv);
const options = program.opts()

if (options.format == 'json') var format = 'application/json';
if (options.format == 'csv') var format = 'text/csv';

healthcheck(format, options.format).then(response => {
    console.log(response);
});
const commander = require('commander');
const { check_apikey, login_cli } = require('../functions');
var fs = require('fs');
const program = new commander.Command();

program
    .requiredOption('--username, <string>')
    .requiredOption('--passw, <string>')
    .addOption(new commander.Option('--format, <string>', 'choose format of data response').default("json").choices(['json', 'csv']))
    .requiredOption('--apikey, <string>', 'apikey verification');
program.parse(process.argv);
const options = program.opts()

if (options.format == 'json') var format = 'application/json';
if (options.format == 'csv') var format = 'text/csv';
fs.access('softeng20-21API.token', (err) => {
    if (!err) {
        console.error("Another user is login.You have to logout to login with another!");
        return;
    } else {
        check_apikey(options.username, options.apikey).then(result => {
            if (result === "OK") {
                login_cli(options.username, options.passw, format, options.format).then(response => {
                    console.log(response); 
                    fs.writeFile('softeng20-21username.token', options.username, (err) => {
                        // When a request is aborted - the callback is called with an AbortError
                        if (err) throw err;
                    });
                    fs.writeFile('softeng20-21API.token', response.token, (err) => {
                        // When a request is aborted - the callback is called with an AbortError
                        if (err) throw err;
                    });
                });

            } else {
                console.error("Wrong API-KEY or wrong username.Try again!");
                return;
            }
        })
    }
});


const commander = require('commander');
const { check_apikey, logout_cli, get_username, get_token } = require('../functions');
var fs = require('fs');
const program = new commander.Command();

program
    .addOption(new commander.Option('--format, <string>', 'choose format of data response').default("json").choices(['json', 'csv']))
    .requiredOption('--apikey, <string>', 'apikey verification');
program.parse(process.argv);

const options = program.opts()

if (options.format == 'json') var format = 'application/json';
if (options.format == 'csv') var format = 'text/csv';
get_token((error, token) => {
    if (error) {
        console.error('token does not exist');
        return;
    } else {
        get_username((err, username) => {
            if (err) {
                console.error('username does not exist');
                return;
            } else {
                check_apikey(username, options.apikey).then(result => {
                                   // console.log("rsuklt -->", result);

                    if (result === "OK") {
                        logout_cli(token, format, options.format).then(response => {
                            //console.log(response,"rfwerf");
                        });
                        fs.unlink('softeng20-21username.token', (err) => {
                            if (err) console.log(err);
                        });
                        fs.unlink('softeng20-21API.token', (err) => {
                            if (err) console.log(err);
                        });
                    } else {
                        console.error("Wrong API-KEY.Try again!");
                        return;
                    }
                })
            }
        })
    }
});
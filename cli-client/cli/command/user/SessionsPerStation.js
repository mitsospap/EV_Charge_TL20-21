const commander = require('commander');
const program = new commander.Command();
const fs = require('fs');
const { checkId, check_apikey, get_username, get_token, get_sessions_station } = require('../../functions');
// require("dotenv").config();

program
    .version('0.0.1')
    .requiredOption('--station, <number>', 'choose a station id')
    .requiredOption('--datefrom, <string>')
    .requiredOption('--dateto, <string>')
    .addOption(new commander.Option('--format, <string>', 'choose format of data response').default("json").choices(['json', 'csv']))
    .requiredOption('--apikey, <string>', 'apikey verification')
    .action((options) => {
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
                            if (result === "OK") {
                                get_sessions_station(options.station, options.datefrom, options.dateto, token, format, options.format).then(response => {
                                    console.log(response);
                                })

                            } else {
                                console.error("Wrong API-KEY.Try again!");
                                return;
                            }
                        })
                    }
                })
            }
        });
    });

program.parse(process.argv)
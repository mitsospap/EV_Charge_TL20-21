const csv = require('csv-parser');
const fs = require('fs');
const { checkId, check_apikey, userMod, get_username, get_token, send_csv, read_csv, healthcheck, resetsessions } = require('../../functions');
const commander = require('commander');
const program = new commander.Command();

program
    .version('0.0.1')
    .description('optionsfor admin')
    .option('--healthcheck', 'healthcheck')
    .option('--resetsessions', 'resetsessions')
    .option('--usermod', 'create or update user')
    .option('--username, <number>')
    .option('--passw, <string>')
    .option('--vehicle_id, <number>')
    .option('--role, <number>')
    .option('--station_id, <number>')
    .option('--users, <string>')
    .option('--sessionsupd', 'add csv file')
    .option('--source, <Filename>', 'write the name of the file')
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
                                if (options.usermod) {
                                    if (options.username != undefined && options.passw != undefined) {
                                        checkId(options.username, token, 'json').then(response => {
                                            if (response.success === 1) {
                                                if (options.vehicle_id === undefined) options.vehicle_id = response.data.vehicle_id;
                                                if (options.role === undefined) options.role = response.data.role;
                                                if (options.station_id === undefined) options.station_id = response.data.station_id;
                                            }
                                            userMod(options.username, options.passw, options.vehicle_id, options.role, options.station_id, token, format, options.format).then(result => {
                                                console.log(result.apikey);
                                            });
                                        });
                                    } else {
                                        if (options.username === undefined) {
                                            console.log("error: required option '--username, <number>' not specified");
                                            return;
                                        }
                                        if (options.passw === undefined) {
                                            console.log("error: required option '--passw, <string>' not specified");
                                            return;
                                        }
                                    }
                                }
                                if (options.users) {
                                    checkId(options.users, token, format, options.format).then(response => {
                                        if (response.success === 1) {
                                            console.log(response);
                                        } else {
                                            console.log("There is no user as", options.users + "!");
                                        }
                                    });
                                }
                                if (options.healthcheck) {
                                    healthcheck(format, options.format).then(response => {
                                        console.log(response);
                                    });
                                }
                                if (options.resetsessions) {
                                    resetsessions(format, options.format).then(response => {
                                        console.log(response);
                                    });
                                }
                                if (options.sessionsupd) {
                                    if (options.source === undefined) {
                                        console.log("error: required option '--source, <Filename>' not specified");
                                        return;
                                    }
                                    send_csv(options.source);
                                }
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

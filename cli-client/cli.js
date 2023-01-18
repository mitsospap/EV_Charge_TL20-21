#!/usr/bin/env node

require("dotenv").config();
const { Command } = require('commander');
const program = new Command();

program 
  .command('healthcheck', 'status', { executableFile: 'cli/command/healthcheck.js' })
  .command('resetsessions', 'delete tokens', { executableFile: 'cli/command/resetsessions.js' })
  .command('login', 'login user', { executableFile: 'cli/command/login.js' })
  .command('logout', 'logout user', { executableFile: 'cli/command/logout.js' })
  .command('SessionsPerPoint', 'see session per point', { executableFile: 'cli/command/user/SessionsPerPoint.js' })
  .command('SessionsPerStation', 'see sessions per station', { executableFile: 'cli/command/user/SessionsPerStation.js' })
  .command('SessionsPerEV', 'see sessions per event', { executableFile: 'cli/command/user/SessionsPerEV.js' })
  .command('SessionsPerProvider', 'see sessions per provider', { executableFile: 'cli/command/user/SessionsPerProvider.js' })
  .command('Admin', 'admin mode', { executableFile: 'cli/command/admin/admin.js' });

program.parse(process.argv);
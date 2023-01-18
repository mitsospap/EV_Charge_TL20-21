const fetch = require('node-fetch');
var fs = require('fs');
const FormData = require('form-data');

checkId = async (username, token, format, format1) => {
    const response = await fetch('http://localhost:8765/evcharge/api' + '/admin/users/' + username + '?format=' + format1, {
        method: 'GET',
        headers: {
            'Content-Type': format,
            'x-observatory-auth': token
        }
    });
    if (format === 'application/json') {
        return response.json();
    } else {
        const data = await response.text();
        return data;
    }
}

check_apikey = async (username, apikey) => {
    const response = await fetch('http://localhost:8765/evcharge/api' + '/apikey', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            apikey: apikey

        })
    });
    return response.text();
}

login_cli = async (username, password, format, format1) => {
    const response = await fetch('http://localhost:8765/evcharge/api' + '/login' + '?format=' + format1, {
        method: 'POST',
        headers: {
            'Content-Type': format
        },
        body: JSON.stringify({
            username: username,
            password: password

        })
    });
    if (format === 'application/json') {
        return response.json();
    } else {
        const data = await response.text();
        return data;
    }
}

userMod = async (username, password, vehicle_id, role, station_id, token, format, format1) => {
    const response = await fetch('http://localhost:8765/evcharge/api' + '/admin/usermod/' + username + '/' + password + '/' + vehicle_id + '/' + role + '/' + station_id + '?format=' + format1, {
        method: 'POST',
        headers: {
            'Content-Type': format,
            'x-observatory-auth': token
        }
    });
    if (format === 'application/json') {
        return response.json();
    } else {
        const data = await response.text();
        return data;
    }
}

logout_cli = async (token, format, format1) => {
    const response = await fetch('http://localhost:8765/evcharge/api' + '/logout' + '?format=' + format1, {
        method: 'POST',
        headers: {
            'Content-Type': format,
            'x-observatory-auth': token
        }
    });
    if (format === 'application/json') {
        return response.text();
    } else {
        const data = await response.text();
        return data;
    }
}

function get_token(callBack) {
    fs.access('softeng20-21API.token', (err) => {
        if (err) {
            console.error('myfile dosent exists');
            return callBack(error);
        } else {
            fs.readFile('softeng20-21API.token', 'utf8', (err, data) => {
                if (err) {
                    console.error('myfile dosent exists');
                    return callBack(error);
                } else return callBack(null, data);
            });
        }
    });
}

function get_username(callBack) {
    fs.access('softeng20-21username.token', (err) => {
        if (err) {
            console.error('myfile dosent exists');
            return callBack(error);
        } else {
            fs.readFile('softeng20-21username.token', 'utf8', (err, data) => {
                if (err) {
                    console.error('myfile dosent exists');
                    return callBack(error);
                } else return callBack(null, data);
            });
        }
    });
}

async function read_csv(file) {
    return new Promise(function (resolve, reject) {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            resolve(data)
        })
    })
}

async function send_csv(x) {
    var csvData = await read_csv(x);
    var form = new FormData();
    form.append('file', csvData, x);
    var requestOptions = {
        method: 'POST',
        body: form,
        redirect: 'follow'
    };
    //console.log(765432);
    fetch('http://localhost:8765/evcharge/api' + "/admin/system/sessionsupd", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

get_sessions_ev = async (ev, datefrom, dateto, token, format, format1) => {

    const response = await fetch('http://localhost:8765/evcharge/api' + '/SessionsPerEV/' + ev + '/' + datefrom + '/' + dateto + '?format=' + format1, {
        method: 'GET',
        headers: {
            'Content-Type': format,
            'x-observatory-auth': token
        }
    });
    if (format === 'application/json') {
        return response.json();
    } else {
        const data = await response.text();
        return data;
    }
}

get_sessions_point = async (point, datefrom, dateto, token, format, format1) => {

    const response = await fetch('http://localhost:8765/evcharge/api' + '/SessionsPerPoint/' + point + '/' + datefrom + '/' + dateto + '?format=' + format1, {
        method: 'GET',
        headers: {
            'Content-Type': format,
            'x-observatory-auth': token
        }
    });
    if (format === 'application/json') {
        return response.json();
    } else {
        const data = await response.text();
        return data;
    }
}

get_sessions_station = async (station, datefrom, dateto, token, format, format1) => {

    const response = await fetch('http://localhost:8765/evcharge/api' + '/SessionsPerStation/' + station + '/' + datefrom + '/' + dateto + '?format=' + format1, {
        method: 'GET',
        headers: {
            'Content-Type': format,
            'x-observatory-auth': token
        }
    });
    if (format === 'application/json') {
        return response.json();
    } else {
        const data = await response.text();
        return data;
    }
}

get_sessions_provider = async (provider, datefrom, dateto, token, format, format1) => {

    const response = await fetch('http://localhost:8765/evcharge/api' + '/SessionsPerProvider/' + provider + '/' + datefrom + '/' + dateto + '?format=' + format1, {
        method: 'GET',
        headers: {
            'Content-Type': format,
            'x-observatory-auth': token
        }
    });
    if (format === 'application/json') {
        return response.json();
    } else {
        const data = await response.text();
        return data;
    }
}

healthcheck = async (format, format1) => {
    const response = await fetch('http://localhost:8765/evcharge/api' + '/admin/healthcheck' + '?format=' + format1, {
        method: 'GET',
        headers: {
            'Content-Type': format
        }
    });
    if (format === 'application/json') {
        return response.json();
    } else {
        const data = await response.text();
        return data;
    }
}

resetsessions = async (format, format1) => {
    const response = await fetch('http://localhost:8765/evcharge/api' + '/admin/resetsessions/' + '?format=' + format1, {
        method: 'POST',
        headers: {
            'Content-Type': format
        }
    });
    if (format === 'application/json') {
        return response.json();
    } else {
        const data = await response.text();
        return data;
    }
}

module.exports = {
    checkId: checkId,
    check_apikey: check_apikey,
    login_cli: login_cli,
    userMod: userMod,
    logout_cli: logout_cli,
    get_token: get_token,
    get_username: get_username,
    read_csv: read_csv,
    send_csv: send_csv,
    get_sessions_ev: get_sessions_ev,
    get_sessions_point: get_sessions_point,
    get_sessions_station: get_sessions_station,
    get_sessions_provider: get_sessions_provider,
    healthcheck: healthcheck,
    resetsessions: resetsessions
}
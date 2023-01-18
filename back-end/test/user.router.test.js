let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
var fs = require('fs');
const FormData = require('form-data');
const { from } = require("form-data");

//assertion style 
chai.should();

chai.use(chaiHttp);

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

describe('Tasks Api', () => {
    //Test post login
    describe("POST /login", () => {
        it("It should POST a login", (done) => {
            const login = {
                username: 'user3',
                password: '3'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    done();
                })
        });

        it("It should NOT POST a login with no username", (done) => {
            const login = {
                username: "",
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq("Bad request");
                    done();
                })
        });
        it("It should NOT POST a login with no password", (done) => {
            const login = {
                username: "admin",
                password: ''
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq("Bad request");
                    done();
                })
        });
    });

    //Test post logout
    describe("POST /logout", () => {
        it("It should POST a logout", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;

                    chai.request("http://localhost:8765/evcharge/api")
                        .post("/logout")
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(200);
                            response.text.should.be.eq("OK");
                            done();
                        })
                })

        });

        it("It should NOT POST a logout with no token", (done) => {
            const login = {
                username: 'user4',
                password: '4'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;

                    chai.request("http://localhost:8765/evcharge/api")
                        .post("/logout")
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.text.should.be.eq("Bad request");
                            done();
                        })
                })

        });
    });
    //Test post apikey
    describe("POST /apikey", () => {
        it("It should check an api key and username", (done) => {
            const apikey = {
                username: "admin",
                apikey: "1234-1234-1234"
            }
            chai.request("http://localhost:8765/evcharge/api")
                .post("/apikey")
                .send(apikey)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.text.should.be.eq("OK");
                    done();
                })
        });

        it("It should NOT check an apikey and username with no username", (done) => {
            const apikey = {
                apikey: "1234-1234-1234"
            }
            chai.request("http://localhost:8765/evcharge/api")
                .post("/apikey")
                .send(apikey)
                .end((err, response) => {
                    response.should.have.status(402);
                    response.text.should.be.eq("No data");
                    done();
                })
        });

        it("It should NOT check an apikey and username with no apikey ", (done) => {
            const apikey = {
                username: "admin"
            }
            chai.request("http://localhost:8765/evcharge/api")
                .post("/apikey")
                .send(apikey)
                .end((err, response) => {
                    response.should.have.status(402);
                    response.text.should.be.eq("No data");
                    done();
                })
        });
    });
    //Test get username
    describe("POST /admin/users/:username", () => {
        it("It should GET the apikey for the chosen username", (done) => {
            const login = {
                username: 'admin2',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    const username = 'admin';
                    chai.request("http://localhost:8765/evcharge/api")
                        .get("/admin/users/" + username)
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(200);
                            response.should.be.a("object");
                            response.body.should.property("data").should.be.a("object");
                            response.body.data.should.have.property("username").eq("admin");
                            response.body.data.should.have.property("password").eq("111");
                            response.body.data.should.have.property("vehicle_id").eq(null);
                            response.body.data.should.have.property("role").eq(1);
                            response.body.data.should.have.property("station_id").eq(null);
                            response.body.should.have.property('apikey').eq("1234-1234-1234");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })

        });
        it("It should NOT GET the apikey from username with null username", (done) => {
            const login = {
                username: 'admin2',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    var username = " ";
                    chai.request("http://localhost:8765/evcharge/api")
                        .get("/admin/users/" + username)
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.text.should.be.eq("Bad request");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })
        });
        it("It should NOT GET the apikey from username with not exist username", (done) => {
            const login = {
                username: 'admin2',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    var username = "sdfsdf";
                    chai.request("http://localhost:8765/evcharge/api")
                        .get("/admin/users/" + username)
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(402);
                            response.text.should.be.eq("No data");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })
        });
        it("It should NOT GET the apikey for the chosen username with no valid token", (done) => {
            const login = {
                username: 'admin2',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    let token = " fgfdgd";
                    const username = 'user1';
                    chai.request("http://localhost:8765/evcharge/api")
                        .get("/admin/users/" + username)
                        .set('x-observatory-auth', token)
                        .end((err, result) => {
                            result.should.have.status(401);
                            result.text.should.be.eq("Not authorized");
                            let token = response.body.token;
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })
        });
        it("It should NOT GET the apikey for the chosen username with NULL token", (done) => {
            const login = {
                username: 'admin2',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    let token = " fgfdgd";
                    const username = 'user1';
                    chai.request("http://localhost:8765/evcharge/api")
                        .get("/admin/users/" + username)
                        .set('x-observatory-auth', token)
                        .end((err, result) => {
                            result.should.have.status(401);
                            result.text.should.be.eq("Not authorized");
                            let token = response.body.token;
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })
        });
        it("It should NOT GET the apikey for the chosen username with no admin login", (done) => {
            const login = {
                username: 'user2',
                password: '2'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    const username = 'user1';
                    chai.request("http://localhost:8765/evcharge/api")
                        .get("/admin/users/" + username)
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(401);
                            response.text.should.be.eq("Not authorized");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })
        });
        it("It should NOT GET the apikey for the chosen username with no login", (done) => {
            const username = 'user1';
            chai.request("http://localhost:8765/evcharge/api")
                .get("/admin/users/" + username)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq("Bad request");
                    done();
                })
        });
    });
    //Test usermod update create user
    describe("POST /admin/usermod/:username/:password/:vehicle_id/:role/:station_id", () => {
        it("It should check for existing username and update user", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    let username = 'user1', password = '1234', vehicle_id = 1, role = 2, station_id = null;
                    chai.request("http://localhost:8765/evcharge/api")
                        .post('/admin/usermod/' + username + '/' + password + '/' + vehicle_id + '/' + role + '/' + station_id)
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(200);
                            response.should.be.a("object");
                            response.body.should.property("success").eq(1);
                            response.body.should.property("message").eq("updated successfully");
                            response.body.should.property("data").should.be.a("object");
                            response.body.data.should.have.property("username").eq("user1");
                            response.body.data.should.have.property("password").eq("1234");
                            response.body.data.should.have.property("vehicle_id").eq('1');
                            response.body.data.should.have.property("role").eq('2');
                            response.body.data.should.have.property("station_id").eq(null);
                            response.body.should.have.property('apikey').eq("2222-2222-2222");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })

        });
        it("It should check for not existing username and create a new user", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    const username = 'operator18', password = '1234', vehicle_id = null, role = 2, station_id = 18;
                    chai.request("http://localhost:8765/evcharge/api")
                        .post('/admin/usermod/' + username + '/' + password + '/' + vehicle_id + '/' + role + '/' + station_id)
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(200);
                            response.should.be.a("object");
                            response.body.should.property("success").eq(1);
                            response.body.should.property("message").eq("updated successfully");
                            response.body.should.property("data").should.be.a("object");
                            response.body.data.should.have.property("username").eq("operator18");
                            response.body.data.should.have.property("password").eq("1234");
                            response.body.data.should.have.property("vehicle_id").eq(null);
                            response.body.data.should.have.property("role").eq('2');
                            response.body.data.should.have.property("station_id").eq('18');
                            response.body.should.have.property('apikey').should.be.a("object")
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })
        });
        it("It should NOT run usermod as user or operator", (done) => {
            const login = {
                username: 'user1',
                password: '1234'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    const username = 'operator18', password = '1234', vehicle_id = null, role = 2, station_id = 18;
                    chai.request("http://localhost:8765/evcharge/api")
                        .post('/admin/usermod/' + username + '/' + password + '/' + vehicle_id + '/' + role + '/' + station_id)
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(401);
                            response.text.should.be.eq("Not authorized");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })

        });
        it("It should NOT run usermod with not a valid token", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    var token1 = "sdfsdgfdgf";
                    const username = 'operator18', password = '1234', vehicle_id = null, role = 2, station_id = 18;
                    chai.request("http://localhost:8765/evcharge/api")
                        .post('/admin/usermod/' + username + '/' + password + '/' + vehicle_id + '/' + role + '/' + station_id)
                        .set('x-observatory-auth', token1)
                        .end((err, response) => {
                            response.should.have.status(401);
                            response.text.should.be.eq("Not authorized");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })

        });
        it("It should NOT run usermod with no token", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    const username = 'operator18', password = '1234', vehicle_id = null, role = 2, station_id = 18;
                    chai.request("http://localhost:8765/evcharge/api")
                        .post('/admin/usermod/' + username + '/' + password + '/' + vehicle_id + '/' + role + '/' + station_id)
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.text.should.be.eq("Bad request");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })

        });
        it("It should NOT run usermod without a login", (done) => {
            const username = 'operator18', password = '1234', vehicle_id = null, role = 2, station_id = 18;
            chai.request("http://localhost:8765/evcharge/api")
                .post('/admin/usermod/' + username + '/' + password + '/' + vehicle_id + '/' + role + '/' + station_id)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq("Bad request");
                    done();
                })


        });
    });
    describe("GET /SessionsPerEV/:vehicleID/:yyyymmdd_from/:yyyymmdd_to", () => {
        it("It should GET all the sessions of ev with the vehicle_id at the dates you choose", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    let ev = 4, datefrom = '2010-01-01', dateto = '2020-01-01';
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/SessionsPerEV/' + ev + '/' + datefrom + '/' + dateto)
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(200);
                            response.should.be.a("object");
                            response.body.should.have.property("VehicleID").eq("4");
                            response.body.should.have.property("PeriodFrom").eq("2010-01-01");
                            response.body.should.have.property("PeriodTo").eq('2020-01-01');
                            response.body.should.have.property("TotalEnergyConsumed").eq(14.5);
                            response.body.should.have.property("NumberOfVisitedPoints").eq(1);
                            response.body.should.have.property("NumberOfVehicleChargingSessions").eq(1);
                            response.body.should.property("data").should.be.a("object");
                            response.body.data[0].should.have.property("SessionIndex").eq(1);
                            response.body.data[0].should.have.property("SessionID").eq(16);
                            response.body.data[0].should.have.property("EnergyProvider").eq("Green_energy");
                            response.body.data[0].should.have.property("StartedOn").eq('2018-04-01 05:14:17');
                            response.body.data[0].should.have.property("FinishedOn").eq('2018-11-01 06:01:04');
                            response.body.data[0].should.have.property("ΕnergyDelivered").eq(14.5);
                            response.body.data[0].should.have.property("PricePolicyRef").eq("low");
                            response.body.data[0].should.have.property("CostPerKWh").eq(1.2);
                            response.body.data[0].should.have.property("SessionCost").eq(136.6);
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })

        });
        it("It should NOT GET all the sessions with wrong values", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    let ev = 200, datefrom = '2010-01-01', dateto = '2020-01-01';
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/SessionsPerEV/' + ev + '/' + datefrom + '/' + dateto)
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(402);
                            response.text.should.be.eq("No data");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })
        });
        it("It should NOT GET all the sessions with no values", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/SessionsPerEV/')
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.text.should.be.eq("Bad request");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })
        });
        it("It should NOT GET all the sessions of ev as operator", (done) => {
            const login = {
                username: 'operator1',
                password: '1'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    let ev = 3, datefrom = '2010-01-01', dateto = '2020-01-01';
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/SessionsPerEV/' + ev + '/' + datefrom + '/' + dateto)
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(401);
                            response.text.should.be.eq("Not authorized");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })

        });
        it("It should NOT GET all the sessions of ev with no valid token", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    var token1 = "sdfdsfgds";
                    let ev = 3, datefrom = '2010-01-01', dateto = '2020-01-01';
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/SessionsPerEV/' + ev + '/' + datefrom + '/' + dateto)
                        .set('x-observatory-auth', token1)
                        .end((err, response) => {
                            response.should.have.status(401);
                            response.text.should.be.eq("Not authorized");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })
                })

        });
        it("It should NOT GET all the sessions of ev with no token", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    let ev = 3, datefrom = '2010-01-01', dateto = '2020-01-01';
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/SessionsPerEV/' + ev + '/' + datefrom + '/' + dateto)
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.text.should.be.eq("Bad request");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })

        });
        it("It should NOT GET all the sessions of ev with no login", (done) => {
            let ev = 3, datefrom = '2010-01-01', dateto = '2020-01-01', token = "sdfsdfgds";
            chai.request("http://localhost:8765/evcharge/api")
                .get('/SessionsPerEV/' + ev + '/' + datefrom + '/' + dateto)
                .set('x-observatory-auth', token)
                .end((err, response) => {
                    response.should.have.status(401);
                    response.text.should.be.eq("Not authorized");
                    done();
                })
        });
        it("It should NOT GET all the sessions of ev with no login", (done) => {
            let ev = 3, datefrom = '2010-01-01', dateto = '2020-01-01';
            chai.request("http://localhost:8765/evcharge/api")
                .get('/SessionsPerEV/' + ev + '/' + datefrom + '/' + dateto)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq("Bad request");
                    done();
                })
        });
    });
    describe("GET /SessionsPerPoint/:vehicleID/:yyyymmdd_from/:yyyymmdd_to", () => {
        it("It should GET all the sessions of point with the point_id at the dates you choose", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    let point = 7, datefrom = '2010-01-01', dateto = '2020-01-01';
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/SessionsPerPoint/' + point + '/' + datefrom + '/' + dateto)
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(200);
                            response.should.be.a("object");
                            response.body.should.have.property("Point").eq(7);
                            response.body.should.have.property("PointOperator").eq("operator4");
                            response.body.should.have.property("PeriodFrom").eq("2010-01-01");
                            response.body.should.have.property("PeriodTo").eq('2020-01-01');
                            response.body.should.have.property("NumberOfChargingSessions").eq(1);
                            response.body.should.property("data").should.be.a("object");
                            response.body.data[0].should.have.property("SessionIndex").eq(1);
                            response.body.data[0].should.have.property("SessionID").eq(21);
                            response.body.data[0].should.have.property("StartedOn").eq('2019-11-25 13:11:17');
                            response.body.data[0].should.have.property("FinishedOn").eq('2019-11-25 17:24:17');
                            response.body.data[0].should.have.property('EnergyDelivered').eq(12.889);
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })

        });
        it("It should NOT GET all the sessions with wrong values", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    let point_id = 200, datefrom = '2010-01-01', dateto = '2020-01-01';
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/SessionsPerPoint/' + point_id + '/' + datefrom + '/' + dateto)
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(402);
                            response.text.should.be.eq("No data");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })
        });
        it("It should NOT GET all the sessions of points with no values", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/SessionsPerPoint/')
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.text.should.be.eq("Bad request");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })
        });
        it("It should NOT GET all the sessions of points as operator", (done) => {
            const login = {
                username: 'operator1',
                password: '1'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    let point_id = 3, datefrom = '2010-01-01', dateto = '2020-01-01';
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/SessionsPerPoint/' + point_id + '/' + datefrom + '/' + dateto)
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(401);
                            response.text.should.be.eq("Not authorized");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })

        });
        it("It should NOT GET all the sessions of points with no valid token", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    var token1 = "sdfdsfgds";
                    let point_id = 3, datefrom = '2010-01-01', dateto = '2020-01-01';
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/SessionsPerPoint/' + point_id + '/' + datefrom + '/' + dateto)
                        .set('x-observatory-auth', token1)
                        .end((err, response) => {
                            response.should.have.status(401);
                            response.text.should.be.eq("Not authorized");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })
                })

        });
        it("It should NOT GET all the sessions of points with no token", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    let point_id = 3, datefrom = '2010-01-01', dateto = '2020-01-01';
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/SessionsPerPoint/' + point_id + '/' + datefrom + '/' + dateto)
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.text.should.be.eq("Bad request");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })

        });
        it("It should NOT GET all the sessions of points with no login", (done) => {
            let point_id = 3, datefrom = '2010-01-01', dateto = '2020-01-01', token = "sdfsdfgds";
            chai.request("http://localhost:8765/evcharge/api")
                .get('/SessionsPerPoint/' + point_id + '/' + datefrom + '/' + dateto)
                .set('x-observatory-auth', token)
                .end((err, response) => {
                    response.should.have.status(401);
                    response.text.should.be.eq("Not authorized");
                    done();
                })
        });
        it("It should NOT GET all the sessions of points with no login", (done) => {
            let point = 3, datefrom = '2010-01-01', dateto = '2020-01-01';
            chai.request("http://localhost:8765/evcharge/api")
                .get('/SessionsPerPoint/' + point + '/' + datefrom + '/' + dateto)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq("Bad request");
                    done();
                })
        });
    });
    describe("GET /SessionsPerStation/:vehicleID/:yyyymmdd_from/:yyyymmdd_to", () => {
        it("It should GET all the sessions of stations with the station_id at the dates you choose", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    let station_id = 2, datefrom = '2010-01-01', dateto = '2020-01-01';
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/SessionsPerStation/' + station_id + '/' + datefrom + '/' + dateto)
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(200);
                            response.should.be.a("object");
                            response.body.should.have.property("StationID").eq('2');
                            response.body.should.have.property("Operator").eq("operator2");
                            response.body.should.have.property("PeriodFrom").eq("2010-01-01");
                            response.body.should.have.property("PeriodTo").eq('2020-01-01');
                            response.body.should.have.property("TotalEnergyConsumed").eq(247.38900756835938);
                            response.body.should.have.property("NumberOfChargingSessions").eq(2);
                            response.body.should.have.property("NumberOfActivePoints").eq(1);
                            response.body.should.property("data").should.be.a("object");
                            response.body.data[0].should.have.property("PointID").eq(3);
                            response.body.data[0].should.have.property("PointSessions").eq(2);
                            response.body.data[0].should.have.property('EnergyDelivered').eq(247.38900756835938);
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })

        });
        it("It should NOT GET all the stations with wrong values", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    let station_id = 200, datefrom = '2010-01-01', dateto = '2020-01-01';
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/SessionsPerStation/' + station_id + '/' + datefrom + '/' + dateto)
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(402);
                            response.text.should.be.eq("No data");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })
        });
        it("It should NOT GET all the sessions of stations with no values", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/SessionsPerStation/')
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.text.should.be.eq("Bad request");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })
        });
        it("It should NOT GET all the sessions of stations as user", (done) => {
            const login = {
                username: 'user1',
                password: '1234'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    let station_id = 3, datefrom = '2010-01-01', dateto = '2020-01-01';
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/SessionsPerStation/' + station_id + '/' + datefrom + '/' + dateto)
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(401);
                            response.text.should.be.eq("Not authorized");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })

        });
        it("It should NOT GET all the sessions of stations with no valid token", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    var token1 = "sdfdsfgds";
                    let station_id = 3, datefrom = '2010-01-01', dateto = '2020-01-01';
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/SessionsPerStation/' + station_id + '/' + datefrom + '/' + dateto)
                        .set('x-observatory-auth', token1)
                        .end((err, response) => {
                            response.should.have.status(401);
                            response.text.should.be.eq("Not authorized");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })
                })

        });
        it("It should NOT GET all the sessions of stations with no token", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    let station_id = 3, datefrom = '2010-01-01', dateto = '2020-01-01';
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/SessionsPerStation/' + station_id + '/' + datefrom + '/' + dateto)
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.text.should.be.eq("Bad request");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })

        });
        it("It should NOT GET all the sessions of stations with no login", (done) => {
            let station_id = 3, datefrom = '2010-01-01', dateto = '2020-01-01', token = "sdfsdfgds";
            chai.request("http://localhost:8765/evcharge/api")
                .get('/SessionsPerStation/' + station_id + '/' + datefrom + '/' + dateto)
                .set('x-observatory-auth', token)
                .end((err, response) => {
                    response.should.have.status(401);
                    response.text.should.be.eq("Not authorized");
                    done();
                })
        });
        it("It should NOT GET all the sessions of stations with no login", (done) => {
            let station_id = 3, datefrom = '2010-01-01', dateto = '2020-01-01';
            chai.request("http://localhost:8765/evcharge/api")
                .get('/SessionsPerStation/' + station_id + '/' + datefrom + '/' + dateto)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq("Bad request");
                    done();
                })
        });
    });
    describe("GET /SessionsPerProvider/:vehicleID/:yyyymmdd_from/:yyyymmdd_to", () => {
        it("It should GET all the sessions of providers with the provider_id at the dates you choose", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    let provider = 2, datefrom = '2010-01-01', dateto = '2020-01-01';
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/SessionsPerProvider/' + provider + '/' + datefrom + '/' + dateto)
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(200);
                            response.body.should.property("data").should.be.a("object");
                            response.should.be.a("object");
                            response.body.data[0].should.have.property("ProviderID").eq(2);
                            response.body.data[0].should.have.property("ProviderName").eq("Green_energy");
                            response.body.data[0].should.have.property("StationID").eq(2);
                            response.body.data[0].should.have.property("SessionID").eq(16);
                            response.body.data[0].should.have.property("VehicleID").eq(4);
                            response.body.data[0].should.have.property("StartedOn").eq("2018-04-01 05:14:17");
                            response.body.data[0].should.have.property("FinishedOn").eq("2018-11-01 06:01:04");
                            response.body.data[0].should.have.property("EnergyDelivered").eq(14.5);
                            response.body.data[0].should.have.property("PricePolicyRef").eq("low");
                            response.body.data[0].should.have.property("CostPerKWh").eq(1.2);
                            response.body.data[0].should.have.property("TotalCost").eq(136.6);
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })

        });
        it("It should NOT GET all the providers with wrong values", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    let provider = 200, datefrom = '2010-01-01', dateto = '2020-01-01';
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/SessionsPerProvider/' + provider + '/' + datefrom + '/' + dateto)
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(402);
                            response.text.should.be.eq("No data");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })
        });
        it("It should NOT GET all the sessions of providers with no values", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/SessionsPerProvider/')
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.text.should.be.eq("Bad request");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })
        });
        it("It should NOT GET all the sessions of providers as operator", (done) => {
            const login = {
                username: 'operator1',
                password: '1'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    let provider = 3, datefrom = '2010-01-01', dateto = '2020-01-01';
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/SessionsPerProvider/' + provider + '/' + datefrom + '/' + dateto)
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(401);
                            response.text.should.be.eq("Not authorized");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })

        });
        it("It should NOT GET all the sessions of providers with no valid token", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    var token1 = "sdfdsfgds";
                    let provider = 3, datefrom = '2010-01-01', dateto = '2020-01-01';
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/SessionsPerProvider/' + provider + '/' + datefrom + '/' + dateto)
                        .set('x-observatory-auth', token1)
                        .end((err, response) => {
                            response.should.have.status(401);
                            response.text.should.be.eq("Not authorized");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })
                })

        });
        it("It should NOT GET all the sessions of providers with no token", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    let provider = 3, datefrom = '2010-01-01', dateto = '2020-01-01';
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/SessionsPerProvider/' + provider + '/' + datefrom + '/' + dateto)
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.text.should.be.eq("Bad request");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })

        });
        it("It should NOT GET all the sessions of providers with no login", (done) => {
            let provider = 3, datefrom = '2010-01-01', dateto = '2020-01-01', token = "sdfsdfgds";
            chai.request("http://localhost:8765/evcharge/api")
                .get('/SessionsPerProvider/' + provider + '/' + datefrom + '/' + dateto)
                .set('x-observatory-auth', token)
                .end((err, response) => {
                    response.should.have.status(401);
                    response.text.should.be.eq("Not authorized");
                    done();
                })
        });
        it("It should NOT GET all the sessions of providers with no login", (done) => {
            let provider = 3, datefrom = '2010-01-01', dateto = '2020-01-01';
            chai.request("http://localhost:8765/evcharge/api")
                .get('/SessionsPerProvider/' + provider + '/' + datefrom + '/' + dateto)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq("Bad request");
                    done();
                })
        });
    });
    describe("GET /usercar", () => {   

        it("It should GET the information of the car", (done) => {
            const login = {
                username: 'user1',
                password: '1234'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/usercar')
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(200);
                            response.should.be.a("object");
                            response.body.should.have.property("success").eq(1);
                            response.body.data.should.have.property("vehicle_id").eq(1);
                            response.body.data.should.have.property("year").eq("2019");
                            response.body.data.should.have.property("model").eq("cybertruck");
                            response.body.data.should.have.property("brand").eq("tesla");
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })

        });
        it("It should ΝΟΤ GET the information of the car with invalid token", (done) => {
            const login = {
                username: 'user1',
                password: '1234'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = "werjknfkerj";
                    var token1 = response.body.token;
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/usercar')
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(401);
                            response.text.should.be.eq("Not authorized")
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token1)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })

        });
        it("It should ΝΟΤ GET the information of the car with null vehicleID", (done) => {
            const login = {
                username: 'admin',
                password: '111'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/usercar')
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(401);
                            response.text.should.be.eq("Not authorized")
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })

        });
        it("It should ΝΟΤ GET the information of the car with no token", (done) => {
            const login = {
                username: 'user1',
                password: '1234'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/usercar')
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.text.should.be.eq("Bad request")
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })

        });
        it("It should ΝΟΤ GET the information of the car without log in", (done) => {
            chai.request("http://localhost:8765/evcharge/api")
                .get('/usercar')
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq("Bad request");
                    done();            
            })  
        });
    });
    describe("GET /operator", () => {
        it("It should GET informations of the operator", (done) => {
            const login = {
                username: 'operator1',
                password: '1'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/operator')
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(200);
                            response.should.be.a("object");
                            response.body.should.property("success").eq(1);
                            response.body.should.property("data").should.be.a("object");
                            response.body.data.should.property("station_id").eq(1);
                            response.body.data.should.have.property("num_of_points").eq(1);
                            response.body.data.should.have.property("provider_id").eq(1);
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })

        });
        it("It should ΝΟΤ GET the information of the station with invalid token", (done) => {
            const login = {
                username: 'operator1',
                password: '1'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token1 = response.body.token;
                    var token = "whifdwerjifnw";
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/operator')
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(401);
                            response.text.should.be.eq("Not authorized")
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token1)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })

        });
        it("It should ΝΟΤ GET the information of the station with no token", (done) => {
            const login = {
                username: 'operator1',
                password: '1'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token1 = response.body.token;
                    var token = "whifdwerjifnw";
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/operator')
                        .end((err, response) => {
                            response.should.have.status(400);
                            response.text.should.be.eq("Bad request")
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token1)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })

        });
        it("It should ΝΟΤ GET the information of the station with null operetorID", (done) => {
            const login = {
                username: 'user1',
                password: '1234'
            };
            chai.request("http://localhost:8765/evcharge/api")
                .post("/login")
                .send(login)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.a("object");
                    response.body.should.have.property('token').should.be.a("object");
                    var token = response.body.token;
                    chai.request("http://localhost:8765/evcharge/api")
                        .get('/operator')
                        .set('x-observatory-auth', token)
                        .end((err, response) => {
                            response.should.have.status(401);
                            response.text.should.be.eq("Not authorized")
                            chai.request("http://localhost:8765/evcharge/api")
                                .post("/logout")
                                .set('x-observatory-auth', token)
                                .end((err, response) => {
                                    response.should.have.status(200);
                                    response.text.should.be.eq("OK");
                                    done();
                                })
                        })

                })

        });
        it("It should ΝΟΤ GET the information of the station without log in", (done) => {
            chai.request("http://localhost:8765/evcharge/api")
                .get('/operator')
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq("Bad request");
                    done();            
            })  
        });
    });
    
});

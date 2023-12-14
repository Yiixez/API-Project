import { Router } from "express";
const mariadb = require('mariadb');
const pool = mariadb.createPool({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASS, database: process.env.DB});

const routes = Router();

routes.get('/', async (req, res) => {
    let arr = {
        "get:": [ 
            "/sensors",
            "/sensors/sensor_id",
            "/sensors/sensor_id/most_recent",
            "/sensors/sensor_id/today",
            "/sensors/sensor_id/yesterday",
            "/sensors/sensor_id/alltime",
            "/settings/sensor_id"
        ],
        "post:": [
            "/addSensor",
            "/settings/change/sensor_id"
        ]
    }

    res.send(arr).status(200);
});

routes.get('/sensors', async (req, res) => {
    const conn = await pool.getConnection();
    conn.query("SELECT SensorID, Sensorname FROM Sensor;")
    .then((rows: any) => {
        res.send(rows).status(200);
    });

    conn.release();
});

routes.get('/sensors/:sensor_id', async (req, res) => {
    const conn = await pool.getConnection();
    let id = req.params.sensor_id;

    conn.query(`SELECT * FROM Sensor WHERE SensorID='${id}';`)
    .then((rows: any) => {
        res.send(JSON.stringify(rows)).status(200);
    });

    conn.release();
});

routes.get('/sensors/:sensor_id/most_recent', async (req, res) => {
    const conn = await pool.getConnection();
    let id = req.params.sensor_id;

    conn.query(`SELECT SensorID, Sensorname FROM Sensor WHERE SensorID='${id}';`)
    .then((rows: any) => {
        let deviceType = rows[0]['Sensorname'];

        if (deviceType.includes("deursensor")) {
            conn.query(`SELECT * FROM Deursensor WHERE SensorID='${id}' ORDER BY ID DESC LIMIT 1;`)
            .then((deurRows: any) => {
                res.send(JSON.stringify(deurRows)).status(res.statusCode);
            });
        } else if (deviceType.includes("powersocket")) {        
            conn.query(`SELECT * FROM Powersocket WHERE SensorID='${id}' ORDER BY ID DESC LIMIT 1;`)
            .then((socketRows: any) => {
                res.send(JSON.stringify(socketRows)).status(res.statusCode);
            });
        } else if (deviceType.includes("motion")) {
            conn.query(`SELECT * FROM Motionsensor WHERE SensorID='${id}' ORDER BY ID DESC LIMIT 1;`)
            .then((motionRows: any) => {
                res.send(JSON.stringify(motionRows)).status(res.statusCode);
            });
        } else if (deviceType.includes("temphumidity")) {
            conn.query(`SELECT * FROM TempHumidity WHERE SensorID='${id}' ORDER BY ID DESC LIMIT 1;`)
            .then((humidityRows: any) => {
                res.send(JSON.stringify(humidityRows)).status(res.statusCode);
            });
        } else {
            console.log("Error: device name not found.");
        }
    });

    conn.release();
});

routes.get('/sensors/:sensor_id/today', async (req, res) => {
    const conn = await pool.getConnection();
    let id = req.params.sensor_id;
    
    let day = new Date(new Date().setHours(2, 0, 0, 0));

    conn.query(`SELECT SensorID, Sensorname FROM Sensor WHERE SensorID='${id}';`)
        .then((rows: any) => {
            let deviceType = rows[0]['Sensorname'];

            if (deviceType.includes("deursensor")) {
                conn.query(`SELECT * FROM Deursensor WHERE SensorID='${id}';`)
                    .then((deurRows: any) => {
                        let data: any = [];

                        for (const element of deurRows) {
                            let date = new Date(element['Time']);
                            if ((date.getTime() - day.getTime()) > 0) {
                                data.push(element);
                            }
                        }
                        
                        res.send(JSON.stringify(data)).status(res.statusCode);
                    });
            } else if (deviceType.includes("powersocket")) {
                conn.query(`SELECT * FROM Powersocket WHERE SensorID='${id}';`)
                    .then((socketRows: any) => {
                        let data: any = [];

                        for (const element of socketRows) {
                            let date = new Date(element['Time']);
                            if ((date.getTime() - day.getTime()) > 0) {
                                data.push(element);
                            }
                        }
                        
                        res.send(JSON.stringify(data)).status(res.statusCode);
                    });
            } else if (deviceType.includes("motion")) {
                conn.query(`SELECT * FROM Motionsensor WHERE SensorID='${id}';`)
                    .then((motionRows: any) => {
                        let data: any = [];

                        for (const element of motionRows) {
                            let date = new Date(element['Time']);
                            if ((date.getTime() - day.getTime()) > 0) {
                                data.push(element);
                            }
                        }
                        
                        res.send(JSON.stringify(data)).status(res.statusCode);
                    });
            
            } else if (deviceType.includes("temphumidity")) {
                conn.query(`SELECT * FROM TempHumidity WHERE SensorID='${id}';`)
                    .then((humidityRows: any) => {
                        let data: any = [];

                        for (const element of humidityRows) {
                            let date = new Date(element['Time']);
                            if ((date.getTime() - day.getTime()) > 0) {
                                data.push(element);
                            }
                        }
                        
                        res.send(JSON.stringify(data)).status(res.statusCode);
                    });
            }
            
            conn.release();
        })
});


routes.get('/sensors/:sensor_id/yesterday', async (req, res) => {
    const conn = await pool.getConnection();
    let id = req.params.sensor_id;

    let day = new Date(new Date().setHours(2, 0, 0, 0));
    day.setDate(day.getDate() - 1);
    
    conn.query(`SELECT SensorID, Sensorname FROM Sensor WHERE SensorID='${id}';`)
        .then((rows: any) => {
            let deviceType = rows[0]['Sensorname'];

            if (deviceType.includes("deursensor")) {
                conn.query(`SELECT * FROM Deursensor WHERE SensorID='${id}';`)
                    .then((deurRows: any) => {
                        let data: any = [];

                        for (const element of deurRows) {
                            let date = new Date(element['Time']);
                            let date1 = date.getTime() - day.getTime(); 
                            if (date1 < 86400000 && date1 > 0) {
                                data.push(element);
                            }
                        }
                        
                        res.send(JSON.stringify(data)).status(res.statusCode);
                    });
            } else if (deviceType.includes("powersocket")) {
                conn.query(`SELECT * FROM Powersocket WHERE SensorID='${id}';`)
                    .then((socketRows: any) => {
                        let data: any = [];

                        for (const element of socketRows) {
                            let date = new Date(element['Time']);
                            let date1 = date.getTime() - day.getTime(); 
                            if (date1 < 86400000 && date1 > 0) {
                                data.push(element);
                            }
                        }
                        
                        res.send(JSON.stringify(data)).status(res.statusCode);
                    });
            } else if (deviceType.includes("motion")) {
                conn.query(`SELECT * FROM Motionsensor WHERE SensorID='${id}';`)
                    .then((motionRows: any) => {
                        let data: any = [];

                        for (const element of motionRows) {
                            let date = new Date(element['Time']);
                            let date1 = date.getTime() - day.getTime(); 
                            if (date1 < 86400000 && date1 > 0) {
                                data.push(element);
                            }
                        }
                        
                        res.send(JSON.stringify(data)).status(res.statusCode);
                    });
            
            } else if (deviceType.includes("temphumidity")) {
                conn.query(`SELECT * FROM TempHumidity WHERE SensorID='${id}';`)
                    .then((humidityRows: any) => {
                        let data: any = [];

                        for (const element of humidityRows) {
                            let date = new Date(element['Time']);
                            let date1 = date.getTime() - day.getTime(); 
                            if (date1 < 86400000 && date1 > 0) {
                                data.push(element);
                            }
                        }
                        
                        res.send(JSON.stringify(data)).status(res.statusCode);
                    });
            }
            
            conn.release();
        })
});


routes.get('/sensors/:sensor_id/alltime', async (req, res) => {
    let id = req.params.sensor_id;

    const conn = await pool.getConnection();

    conn.query(`SELECT SensorID, Sensorname FROM Sensor WHERE SensorID='${id}';`)
    .then((rows: any) => {
        let deviceType = rows[0]['Sensorname'];

        if (deviceType.includes("deursensor")) {
            conn.query(`SELECT * FROM Deursensor WHERE SensorID='${id}';`)
            .then((deurRows: any) => {
                res.send(JSON.stringify(deurRows)).status(res.statusCode);
            });
        } else if (deviceType.includes("powersocket")) {        
            conn.query(`SELECT * FROM Powersocket WHERE SensorID='${id}';`)
            .then((socketRows: any) => {
                res.send(JSON.stringify(socketRows)).status(res.statusCode);
            });
        } else if (deviceType.includes("motion")) {
            conn.query(`SELECT * FROM Motionsensor WHERE SensorID='${id}';`)
            .then((motionRows: any) => {
                res.send(JSON.stringify(motionRows)).status(res.statusCode);
            });
        } else if (deviceType.includes("temphumidity")) {
            conn.query(`SELECT * FROM TempHumidity WHERE SensorID='${id}';`)
            .then((humidityRows: any) => {
                res.send(JSON.stringify(humidityRows)).status(res.statusCode);
            });
        } else {
            console.log("Error: device name not found.");
        }
    });

    conn.release();
});

routes.get('/users', async (req, res) => {
    res.send("BETA").status(200);
});

routes.get('/users/:user_id', async (req, res) => {
    let id = req.params.user_id;
    
    res.send("BETA id: " + id).status(200);
});

routes.get('/settings/:sensor_id', async (req, res) => {
    let id = req.params.sensor_id;
    const conn = await pool.getConnection();

    conn.query(`SELECT * FROM Settings WHERE SensorID='${id}';`)
    .then((rows: any) => {
        res.send(rows).status(res.statusCode);
    });
});

routes.post('/addsensor', async(req, res) => {
    let conn = await pool.getConnection();

    let data = req.body;
    let deviceName = data['deviceName'];
    let deviceDesc = data['deviceDesc'];

    conn.query(`INSERT INTO Sensor (Sensorname, SensorDescription, SensorLastActivity) VALUES ('${deviceName}', '${deviceDesc}', '${new Date().toUTCString()}');`);
    
    conn.query(`SELECT * FROM Sensor WHERE Sensorname='${deviceName}';`)
    .then((rows: any) => {
        let id = rows[0]["SensorID"];

        if (deviceName.includes("deursensor")) {
            conn.query(`INSERT INTO Settings (SensorID, Value1, Value2, Visible) VALUES ('${id}', '15', 'null', 'true');`);
        } else if (deviceName.includes("motion")) {
            conn.query(`INSERT INTO Settings (SensorID, Value1, Value2, Visible) VALUES ('${id}', '15', 'null', 'true');`);
        } else if (deviceName.includes("temphumidity")) {
            conn.query(`INSERT INTO Settings (SensorID, Value1, Value2, Visible) VALUES ('${id}', '10', '30', 'true');`);
        } else {
            console.log("Error: device name not found. (/addsensor)");
        }
    });
    conn.release();
    res.send({"status":(res.statusCode == 200) ? "success" : "error"}).status(res.statusCode);
});

routes.post('/settings/chance/:sensor_id', async(req, res) => {
    let id = req.params.sensor_id;
    const conn = await pool.getConnection();

    let data = req.body;

    if (data["Value1"] && data["Value2"] == null) {
        res.send({"status":"error"}).status(400);
        return;
    }

    conn.query(`UPDATE Settings SET Value1='${data["Value1"]}' WHERE SensorID='${id}';`)
    conn.query(`UPDATE Settings SET Value2='${data["Value2"]}' WHERE SensorID='${id}';`)
});

routes.post('/webhooks', async(req, res) => {
    //Database connection
    let conn = await pool.getConnection();

    let data = req.body;
    let deviceType = data['end_device_ids']['device_id'];
    let deviceData = data['uplink_message']['decoded_payload'];
    console.log("Device type: " + deviceType);
    if (deviceData == null) return console.log("Error: deviceData was null");
    if (Object.keys(deviceData).length === 0) return console.log("Error: Device data is null.");

    if (deviceType.includes("deursensor")) {
        let alarm = deviceData['ALARM'];
        let batv = deviceData['BAT_V'];
        let status = deviceData['DOOR_OPEN_STATUS'];
        let times = deviceData['DOOR_OPEN_TIMES'];
        let duration = deviceData['LAST_DOOR_OPEN_DURATION'];
        let mod = deviceData['MOD'];

        conn.query(`SELECT SensorID FROM Sensor WHERE Sensorname='${deviceType}';`)
        .then((rows: any) => {
            if (rows.length == 0) return console.log("Sensor does not exist: " + deviceType);
            
            conn.query(`INSERT INTO Deursensor (SensorID, Alarm, Bat_V, Door_Open_Status, Door_Open_Times, Last_Door_Open_Duration, Mod1, Time) VALUES ('${rows[0]['SensorID']}', '${alarm}', '${batv}', '${status}', '${times}', '${duration}', '${mod}', '${new Date().toUTCString()}');`);
            conn.query(`UPDATE Sensor SET SensorLastActivity='${new Date().toUTCString()}' WHERE SensorID='${rows[0]['SensorID']}';`);
        });
    } else if (deviceType.includes("powersocket")) {        
        let current = deviceData['current'];
        let factor = deviceData['factor'];
        let power = deviceData['power'];
        let power_sum = deviceData['power_sum'];
        let state = deviceData['state'];
        let voltage = deviceData['voltage'];

        conn.query(`SELECT SensorID FROM Sensor WHERE Sensorname='${deviceType}';`)
        .then((rows: any) => {
            if (rows.length == 0) return console.log("Sensor does not exist: " + deviceType);
    
            conn.query(`INSERT INTO Powersocket (SensorID, Current, Factor, Power, Power_sum, State, Voltage, Time) VALUES ('${rows[0]['SensorID']}', '${current}', '${factor}', '${power}', '${power_sum}', '${state}', '${voltage}', '${new Date().toUTCString()}');`);
            conn.query(`UPDATE Sensor SET SensorLastActivity='${new Date().toUTCString()}' WHERE SensorID='${rows[0]['SensorID']}';`);
        });
    } else if (deviceType.includes("motion")) {
        let battery_volt = deviceData['battery_volt'];
        let button = deviceData['button'];
        let count = deviceData['count'];
        let humi = deviceData['humi'];
        let tamper = deviceData['tamper'];
        let temperature = deviceData['temperature'];
        let motion = deviceData['motion'];

        
        conn.query(`SELECT SensorID FROM Sensor WHERE Sensorname='${deviceType}';`)
        .then((rows: any) => {
            if (rows.length == 0) return console.log("Sensor does not exist: " + deviceType);
    
            conn.query(`INSERT INTO Motionsensor (SensorID, battery_volt, button, count, humi, motion, tamper, temperature, Time) VALUES ('${rows[0]['SensorID']}', '${battery_volt}', '${button}', '${count}', '${humi}', '${motion}', '${tamper}', '${temperature}', '${new Date().toUTCString()}');`);
            conn.query(`UPDATE Sensor SET SensorLastActivity='${new Date().toUTCString()}' WHERE SensorID='${rows[0]['SensorID']}';`);
        });
    } else if (deviceType.includes("temphumidity")) {
        let Ext = deviceData['Ext'];
        let Hum_SHT = deviceData['Hum_SHT'];
        let systimestamp = deviceData['Systimestamp'];
        let tempc_ds = deviceData['TempC_DS'];
        let tempc_sht = deviceData['TempC_SHT'];

        if (Ext == null) {
            console.log("Error: deviceData was null");
            return;
        }

        conn.query(`SELECT SensorID FROM Sensor WHERE Sensorname='${deviceType}';`)
        .then((rows: any) => {    
            if (rows.length == 0) return console.log("Sensor does not exist: " + deviceType);
            
            conn.query(`INSERT INTO TempHumidity (SensorID, EXT, Hum_SHT, Systimestamp, TempC_DS, TempC_SHT, Time) VALUES ('${rows[0]['SensorID']}', '${Ext}', '${Hum_SHT}', '${systimestamp}', '${tempc_ds}', '${tempc_sht}', '${new Date().toUTCString()}');`);
            conn.query(`UPDATE Sensor SET SensorLastActivity='${new Date().toUTCString()}' WHERE SensorID='${rows[0]['SensorID']}';`);
        });
    } else {
        console.log("Error: device name not found.");
    }

    conn.release();
    res.send({"status":(res.statusCode == 200) ? "success" : "error"}).status(res.statusCode);
});

export default routes;
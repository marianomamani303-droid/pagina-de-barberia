const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "barberia",
    port: 3306
});

conexion.connect((error) => {
    if (error) {
        console.error("Error al conectar a MySQL:", error);
        return;
    }

    console.log("Conectado a MySQL");
});


app.post("/registro", (req, res) => {
    const numero = req.body.telefono;
    const password = req.body.password;

    conexion.query(
        "INSERT INTO usuarios (telefono, password) VALUES (?, ?)",
        [numero, password],
        (error, resultado) => {

            if (error) {
                console.error(error);

                return res.status(500).json({
                    mensaje: "Error al registrar usuario"
                });
            }

            res.status(201).json({
                mensaje: "Usuario agregado",
                id: resultado.insertId
            });
        }
    );
});

app.post("/login", (req, res) => {
    const numero = req.body.btelefono;
    const password = req.body.bpassword;

    conexion.query(
        "SELECT id FROM usuarios WHERE telefono = ? AND password = ?",
        [numero, password],
        (error, rows) => {

            if (error) {
                console.error(error);

                return res.status(500).json({
                    mensaje: "Error del servidor"
                });
            }

            if (rows.length === 0) {
                return res.status(401).json({
                    mensaje: "Teléfono o contraseña incorrectos"
                });
            }

            res.json({
                mensaje: "Login correcto",
                id: rows[0].id
            });
        }
    );
});

app.post("/reservas", (req, res) => {

    const idUsuario = req.body.id;
    const nombre = req.body.nombre;
    const fecha = req.body.fecha;
    const hora = req.body.hora;
    const comentario = req.body.comentario;

    conexion.query("SELECT * FROM reservas WHERE fecha = ? AND hora = ?",[fecha,hora],(error,resultado)=>{

        console.log(resultado);

        if (error) {
            console.error(error);
            return res.status(500).json({
                mensaje: "Error en la base de datos"
            });
        }
        if(resultado.length >0){
            return res.json({
                mensaje:"horario ocupado"
            })
        }
        else{
            conexion.query(
        "INSERT INTO reservas (nombre, fecha, hora, comentarios, id) VALUES (?, ?, ?, ?, ?)",
        [nombre, fecha, hora, comentario, idUsuario],
        (error, resultado) => {

            if (error) {
                console.error(error);

                return res.status(500).json({
                    mensaje: "Error al reservar"
                });
            }
            
            res.json({
                mensaje: "Reserva creada",
                idReserva: resultado.insertId
            });
        }
    );
        }
    })
});

app.get("/reservas/:idUsuario", (req, res) => {

    const idUsuario = req.params.idUsuario;

    conexion.query(
        "SELECT * FROM reservas WHERE id= ?",
        [idUsuario],
        (error, rows) => {

            if (error) {
                return res.status(500).json({
                    mensaje: "Error al obtener reservas"
                });
            }

            res.json(rows);
        }
    );
});

app.post("/eliminar", (req,res)=>{
    const fila_eliminar = req.body.id_reserva

    try {
         conexion.query(
            "DELETE FROM reservas WHERE id_reserva = ?",[fila_eliminar]
        )
        res.json({mensaje: "eliminacion exitosa"})
    } catch (error) {
        console.log(error)
        res.json({mensaje: "error al eliminar"})
    }
})


app.listen(3000, () => {
    console.log("Estamos al aire perro");
});
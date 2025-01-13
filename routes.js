
const fs = require('fs');
const csv = require('csv-parser');


module.exports = function(app,bodyParser){

    // Body Parser es necesario para obtener datos con post
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Body Paeerser es necesario para obtener datos con post
    app.set('views', __dirname + '/views');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'ejs');


    const data = { 
        title: "Mi Título", 
        message: "Hola Mundo",
        traducciones: [
            { 
                traduccion: 1, 
                idioma: "es", 
                tipoLetra: "", 
                color: "#000000", 
                borde_size: "0", 
                borde_color: "", 
                background: "transparent", 
                texto: "[Hola]", 
                fontWeight: "8", 
                size_text: "28", 
                sombra: false, 
                posicion_vertical: "", 
                posicion_horizontal: "center", 
                negrita: true, 
                subrayado: false, 
                cursiva: false 
            }
        ],
        fuentes: [
            {
                id: 1,
                nombre: "Arial",
                source: "arial"
            }
        ],
        usuario: "",
        usuarioYoutube: "",
        usuarioTwitch: "",
        backgroundColor: "#00ff00",
        langTable: [] // Añadir la tabla de idiomas aquí
    };

    // Leer el archivo CSV y añadir los datos a data.langTable
    fs.createReadStream(__dirname + '/data/lang.csv')
    .pipe(csv())
    .on('data', (row) => {
        data.langTable.push(row);
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });

    let traduccionCounter = data.traducciones.length;

    app.get("/",(req,res) =>{
        res.render("index.ejs",data)
    });

    app.post("/add-traduccion", (req, res) => {
        traduccionCounter++;
        let tipoLetra = req.body.tipoLetra;
        if (tipoLetra.includes('custom')) {
            tipoLetra = tipoLetra.replace('custom', '').trim();
        }
        const newTraduccion = {
            traduccion: traduccionCounter,
            idioma: req.body.idioma,
            tipoLetra: tipoLetra,
            color: req.body.color,
            borde_size: req.body.borde_size,
            borde_color: req.body.borde_color,
            background: req.body.background,
            texto: "",
            fontWeight: req.body.fontWeight,
            size_text: req.body.size_text,
            sombra: req.body.sombra || false,
            posicion_vertical: req.body.posicion_vertical,
            posicion_horizontal: req.body.posicion_horizontal,
            negrita: req.body.negrita || false,
            subrayado: req.body.subrayado || false,
            cursiva: req.body.cursiva || false
        };
        data.traducciones.push(newTraduccion);
        res.redirect("/");
    });

    app.post("/update-Traduccion", (req, res) => {
        const traduccionId = parseInt(req.body.traduccion);
        const traduccionIndex = data.traducciones.findIndex(t => t.traduccion === traduccionId);

        console.log(req.body);

        if (traduccionIndex !== -1) {
            data.traducciones[traduccionIndex] = {
                traduccion: traduccionId,
                idioma: req.body.idioma,
                tipoLetra: req.body.tipoLetra,
                color: req.body.color,
                borde_size: req.body.borde_size,
                borde_color: req.body.borde_color,
                background: req.body.background,
                texto: data.traducciones[traduccionIndex].texto, // Keep the original text
                fontWeight: req.body.fontWeight,
                size_text: req.body.size_text,
                sombra: req.body.sombra || false,
                posicion_vertical: req.body.posicion_vertical,
                posicion_horizontal: req.body.posicion_horizontal,
                //negrita: req.body.negrita || false,
                subrayado: req.body.subrayado || false,
                cursiva: req.body.cursiva || false
            };
        }

        res.redirect("/");
    });

    app.post("/update-config", (req, res) => {
        console.log(req.body);
        data.backgroundColor = req.body.backgroundColor;
        data.usuario = req.body.usuario;
        data.usuarioYoutube = req.body.usuarioYoutube;
        data.usuarioTwitch = req.body.usuarioTwitch;
        res.redirect("/");
    });

    app.get("/delete-traduccion/:id", (req, res) => {
        const traduccionId = parseInt(req.params.id);
        const traduccionIndex = data.traducciones.findIndex(t => t.traduccion === traduccionId);

        if (traduccionIndex !== -1) {
            data.traducciones.splice(traduccionIndex, 1);
        }

        res.redirect("/");
    });

}
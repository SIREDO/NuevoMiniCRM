
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var cargarDB = {

    db:"",

    //
    initialize: function(){

        //generamos el conector a la base de datos
        this.db=window.openDatabase("localDB", "1.0", "Datos pruebas", 2*1024*1024);

        //ejecutamos funvion cargaDB
        this.cargaDB();

    },
    cargaDB: function() {

        console.log("Cargar la base de datos");

        //creamos los callbacks e iniciamos transacción de la Base de datos
        this.db.transaction(this.mostrarDB,this.mostrarDBError);
    },
    mostrarDB: function(tx){

        //Ceamos variable para almacenar todos los datos de una consulta
       // var sql="SELECT * FROM localDB;";
        var sql="SELECT * FROM localDB ORDER BY ultimos DESC;";
        console.log("Lanzamos la consulta");

        //Lanzamos la consulta
        tx.executeSql(sql,[],
            //función de resultado ok
            function(tx, result) {
                console.log("Se ha producido la consulta con éxito: ");
                //si hay datos al hacer la consulta recorremos las filas hasta el final
                if(result.rows.length>0){
                    for(var i=0;i<result.rows.length;i++){
                        var fila=result.rows.item(i);
                        console.log("ROW "+i+" nombre: "+fila.nombre);
                        //actualizamos la lista del listas.html
                           // $("#usuarioList ul").append("<li><a href='#'><img src='./img/usu1.PNG' class='imagenLista'><div class='nombreLista'>"+fila.nombre+"</div><div class='profesionLista'>Profesora</div></a></li>").listview('refresh')




                        $("#usuarioList ul").append("<li><a href='#'><img src='./img/usu1.PNG' class='imagenLista'><div "+"class='nombreLista'>"+fila.nombre+"</div><div class='profesionLista'>"+fila.cargo+"</div></a></li>").listview('refresh');
                   // <li><a href="#"><img src="./img/usu1.PNG" class="imagenLista"><div class="nombreLista">Pilar Palanca</div><div class="profesionLista">Profesora</div></a></li>
                           // $("#usuarioList ul").append("<li><a href='#'><img src='./img/usu3.PNG' class='imagenLista'><div class='nombreLista'>"+fila.nombre+"</div><div class='profesionLista'>Profesor</div></a></li>").listview('refresh');
                        //$("#usuarioList ul").append("<li>prueba</li>").listview('refresh');
                        //$("#usuarioList ul").append("<li><a href='#'>"+fila.nombre+"</a></li>").listview('refresh');
                        
                        

                        console.log("nombreañadido");
                    }
                }

            },
            //función de error
            function(tx, error) {
                this.mostrarDBError(error);
            }
        );
    },





    mostrarDBError: function(err) {
        console.log("Se ha producido un error al crear la base de datos: "+error.code);
        console.log("Mensaje de error: "+err.message);
    },



};
var confDB = {
    existe_db:"",
    db:"",
    initialize:function(){
        this.existe_db = window.localStorage.getItem("existe_db");

        //Creacion de la base de datos

        //Comprobacion de si existe_db
        if(this.existe_db == null){
            console.log("No existe base de datos");
            this.db = window.openDatabase("localDB", "1.0", "Datos pruebas", 2*1024*1024);
            this.createDB();
        }else{
            cargarDB.initialize();
        }
    },

    createDB:function(){
        //CREAR BASE DE DATOS
        console.log("Creando Base de Datos");
        //creamos tres callbacks
        this.db.transaction(this.createLocalDB, this.createDBError, this.createDBSucc);
    },

    createLocalDB:function(tx){
        console.log("Creamos primera tabla");

        //var sql="CREATE TABLE IF NOT EXISTS localDB (id INTEGER PRIMARY KEY AUTOINCREMENT,nombre VARCHAR(50),apellidos VARCHAR(50),departamento VARCHAR(50),cargo VARCHAR(50),email VARCHAR(64),telefono VARCHAR(9),ciudad VARCHAR(15),edad VARCHAR(2),foto VARCHAR(50));";
       //PASO2
       var sql="CREATE TABLE IF NOT EXISTS localDB (id INTEGER PRIMARY KEY AUTOINCREMENT,nombre VARCHAR(50),apellidos VARCHAR(50),departamento VARCHAR(50),cargo VARCHAR(50),email VARCHAR(64),telefono VARCHAR(9),ciudad VARCHAR(15),edad VARCHAR(2),foto VARCHAR(50), ultimos INTEGER (1));";
        
        tx.executeSql(sql);

        var sql2="CREATE TABLE IF NOT EXISTS talleres (id INTEGER PRIMARY KEY AUTOINCREMENT,titulo VARCHAR(100),departamento VARCHAR(100),profesor VARCHAR(128),horas VARCHAR(3), descripcion VARCHAR (300), presencial VARCHAR (2), ingles VARCHAR (2));";
        tx.executeSql(sql2);
        console.log("Segunda tabla creada");

        console.log("Creando inserts");
        //insertamos valores de ejemplo en la tabla anterior

      sql="INSERT INTO localDB(nombre,apellidos,departamento,cargo,email,telefono,ciudad,edad,foto)"+
      "VALUES('Andrea','Lurbe','Castellano','Profesora','alurb@gmail.com','658970440','Valencia','36','lurbe.jpg');";
      tx.executeSql(sql);
     sql="INSERT INTO localDB(nombre,apellidos,departamento,cargo,email,telefono,ciudad,edad,foto)"+
        "VALUES('Silvia','Reolid','Castellano','Profesora','silredo@gmail.com','605916858','Valencia','34','reolid.jpg');";
        tx.executeSql(sql);
        


        sql2="INSERT INTO talleres(titulo,departamento,profesor,horas, descripcion, presencial, ingles)"+
         "VALUES('Lenguaje no verbal','Castellano','Andrea Lurbe','30', 'Taller práctico de lingüística', 'Sí', 'No');";
        tx.executeSql(sql2);
        sql2="INSERT INTO talleres(titulo,departamento,profesor,horas, descripcion, presencial, ingles)"+
        "VALUES('Lorca y sus fantasmas','Castellano','Silvia Reolid','30', 'Tópicos de la poesía de Lorca. Recorrido por Poeta en Nueva York', 'Sí', 'No');";
        tx.executeSql(sql2);


    },

    createDBError:function(error){
        console.log("Se ha producido un error al crear la base de datos: "+error.message);
    },

    createDBSucc:function(){
        console.log("La Base de Datos ha sido creada con exito");
        window.localStorage.setItem("existe_db",1);
    },
    onConfirm:function (buttonIndex){
        if(buttonIndex==1){
            console.log('He pulsado el boton crear');
            window.localStorage.setItem("existe_db",1);
        }
    }
};

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        /*
         var parentElement = document.getElementById(id);
         var listeningElement = parentElement.querySelector('.listening');
         var receivedElement = parentElement.querySelector('.received');
         listeningElement.setAttribute('style', 'display:none;');
         receivedElement.setAttribute('style', 'display:block;');
         */

        console.log('Received Event: ' + id);


        confDB.initialize();
    }
};
app.initialize();
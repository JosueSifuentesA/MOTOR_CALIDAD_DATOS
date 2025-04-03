from flask import Flask, render_template, request,jsonify
from src.db.db_connector import get_db_connection
from src.services.profiler import profile_table_data,list_all_tables
from flask_cors import CORS
import os



BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__,
            template_folder=os.path.join(BASE_DIR, "src/templates"),
            static_folder=os.path.join(BASE_DIR, "src/static"))
CORS(app)
@app.route('/perfilado')
def perfilado():
    user = "USUARIO_DATAMART_MATERIALIDAD"
    password = "USUARIO_DATAMART_MATERIALIDAD"
    host = "localhost"
    port = "1521"
    service_name = "XE"

    
    connection = get_db_connection(user, password, host, port, service_name)


    #table_name = request.args.get("table", "HISTORICO_ESTADO_TARJETA")


    #profile_data = profile_table_data(connection, table_name)
    table_list = list_all_tables(connection,'oracle')
 
    #return render_template('perfilador/perfilador.html', profile_data=profile_data, tables_info=table_list)
    return render_template('perfilador/perfilador.html', tables_info=table_list)

@app.route('/perfilar_tabla')
def perfilar_tabla():
    """Endpoint para obtener el perfilado de una tabla específica con manejo de excepciones"""
    try:
        table_name = request.args.get("table_name")

        if not table_name:
            return jsonify({"success": False, "error": "No se proporcionó una tabla"}), 400

        # Credenciales de la BD
        user = "USUARIO_DATAMART_MATERIALIDAD"
        password = "USUARIO_DATAMART_MATERIALIDAD"
        host = "localhost"
        port = "1521"
        service_name = "XE"

        # Intentar conectar a la base de datos
        try:
            connection = get_db_connection(user, password, host, port, service_name)
        except Exception as e:
            return jsonify({"success": False, "error": f"Error al conectar a la BD: {str(e)}"}), 500

        # Intentar obtener perfilado de la tabla
        try:
            profile_data = profile_table_data(connection, table_name)

            # Asegurarse de que los datos son serializables
            # Si profile_data es una lista de diccionarios, no es necesario aplicar `applymap`
            # Solo aseguramos que sea un formato JSON serializable
            profile_data_serializable = [
                {key: str(value) for key, value in row.items()} for row in profile_data
            ]
        except Exception as e:
            return jsonify({"success": False, "error": f"Error al obtener perfilado: {str(e)}"}), 500

        return jsonify({"success": True, "profile_data": profile_data_serializable})

    except Exception as e:
        return jsonify({"success": False, "error": f"Error inesperado: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)

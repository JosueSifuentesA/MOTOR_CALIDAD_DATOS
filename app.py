from flask import Flask, render_template, request,jsonify
from src.db.db_connector import get_db_connection,extract_table_data
from src.services.profiler import profile_table_data,list_all_tables,get_table_info
from src.services.consistencia_service import procesar_datos 

from flask_cors import CORS
import os



BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__,
            template_folder=os.path.join(BASE_DIR, "src/templates"),
            static_folder=os.path.join(BASE_DIR, "src/static"))
CORS(app)
@app.route('/')
@app.route('/perfilado')
def perfilado():
    user = "USUARIO_DATAMART_MATERIALIDAD"
    password = "USUARIO_DATAMART_MATERIALIDAD"
    host = "localhost"
    port = "1521"
    service_name = "XE"

    
    connection = get_db_connection(user, password, host, port, service_name)

    table_list = list_all_tables(connection,'oracle')
 
    return render_template('perfilador/perfilador.html', tables_info=table_list)

@app.route('/matriz_evaluacion')
def matriz_evaluacion():

    table_name = request.args.get("table_name")

    user = "USUARIO_DATAMART_MATERIALIDAD"
    password = "USUARIO_DATAMART_MATERIALIDAD"
    host = "localhost"
    port = "1521"
    service_name = "XE"

    
    connection = get_db_connection(user, password, host, port, service_name)

    table_info = get_table_info(connection,table_name)
    return render_template('matriz/matriz_evaluacion.html',table_info=table_info)

@app.route('/perfilar_tabla')
def perfilar_tabla():
    """Endpoint para obtener el perfilado de una tabla específica con manejo de excepciones"""
    try:
        table_name = request.args.get("table_name")

        if not table_name:
            return jsonify({"success": False, "error": "No se proporcionó una tabla"}), 400

        user = "USUARIO_DATAMART_MATERIALIDAD"
        password = "USUARIO_DATAMART_MATERIALIDAD"
        host = "localhost"
        port = "1521"
        service_name = "XE"

        try:
            connection = get_db_connection(user, password, host, port, service_name)
        except Exception as e:
            return jsonify({"success": False, "error": f"Error al conectar a la BD: {str(e)}"}), 500

        try:
            profile_data = profile_table_data(connection, table_name)

            profile_data_serializable = [
                {key: str(value) for key, value in row.items()} for row in profile_data
            ]
        except Exception as e:
            return jsonify({"success": False, "error": f"Error al obtener perfilado: {str(e)}"}), 500

        return jsonify({"success": True, "profile_data": profile_data_serializable})

    except Exception as e:
        return jsonify({"success": False, "error": f"Error inesperado: {str(e)}"}), 500


@app.route('/evaluar_consistencia', methods=['GET'])
def evaluar_consistencia():
    try:
        table_name = request.args.get("table_name")

        if not table_name:
            return jsonify({"success": False, "error": "No se proporcionó una tabla"}), 400

        user = "USUARIO_DATAMART_MATERIALIDAD"
        password = "USUARIO_DATAMART_MATERIALIDAD"
        host = "localhost"
        port = "1521"
        service_name = "XE"

        connection = get_db_connection(user, password, host, port, service_name)

        try:
            df = extract_table_data(connection, table_name)
            resultado = procesar_datos(df)
        except Exception as e:
            return jsonify({"success": False, "error": f"Error al evaluar consistencia: {str(e)}"}), 500

        return jsonify({"success": True, "resultado": resultado})

    except Exception as e:
        return jsonify({"success": False, "error": f"Error inesperado: {str(e)}"}), 500


@app.route("/evaluar-localstorage", methods=["POST"])
def evaluar_localstorage():
    data = request.get_json()

    # Datos en tabla
    tabla = data.get("data", [])
    criterios = data.get("criterios", {})

    if not tabla or not criterios:
        return jsonify({"error": "Faltan datos o criterios"}), 400

    df = pd.DataFrame(tabla)

    resultado = evaluar_matriz_personalizada(df, criterios)

    return jsonify(resultado)


if __name__ == '__main__':
    app.run(debug=True)

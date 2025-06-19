from flask import Flask, render_template, request,jsonify
from src.db.db_connector import get_db_connection,extract_table_data,get_columns
from src.services.profiler import profile_table_data,list_all_tables,get_table_info
from src.services.consistencia_service import procesar_datos
from src.services.evaluacion_calidad_service import evaluar_matriz_personalizada
from src.services.exportation_service import generar_reporte_excel,export_html_to_pdf_via_http
import pandas as pd
import traceback
from flask import Flask, request, jsonify, send_file
import pandas as pd
from io import BytesIO
from datetime import datetime
import traceback
from pathlib import Path
from flask import Flask, request, render_template, send_file, jsonify
from pathlib import Path
from playwright.sync_api import sync_playwright
import os
import uuid


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

@app.route("/obtener_columnas", methods=["POST"])
def obtener_columnas_endpoint():
    data = request.get_json()
    table_name = data.get("table_name")
    
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
        columns = get_columns(connection=connection,table_name=table_name)
        return jsonify({"status": "ok", "columnas": columns})
    except Exception as e:
        return jsonify({"success": False, "error": f"Error al traer las columnas: {str(e)}"}), 500
    
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
    nombre_tabla = data.get("data", [])
    criterios = data.get("criterios", {})

    print(criterios)

    if not nombre_tabla or not criterios:
        return jsonify({"error": "Faltan datos o criterios"}), 400

    try:
        # Conexión a la base de datos
        user = "USUARIO_DATAMART_MATERIALIDAD"
        password = "USUARIO_DATAMART_MATERIALIDAD"
        host = "localhost"
        port = "1521"
        service_name = "XE"

        connection = get_db_connection(user, password, host, port, service_name)

        # Obtener datos de la tabla desde la base de datos
        try:
            df = extract_table_data(connection, nombre_tabla)
        except Exception as e:
            traceback.print_exc()
            return jsonify({"success": False, "error": f"Error al obtener datos de la tabla: {str(e)}"}), 500


        
        # Evaluar los resultados según los criterios
        resultado = evaluar_matriz_personalizada(df, criterios)

        # Retornar el resultado
        return jsonify(resultado)

    except Exception as e:
        traceback.print_exc()
        return jsonify({"success": False, "error": f"Error inesperado: {str(e)}"}), 500



@app.route("/exportacion",methods=['GET'])
def exportar_resultados_view():

    return render_template('exportation/exportation.html')

@app.route("/gobierno",methods=['GET'])
def gobierno_view():

    user = "USUARIO_DATAMART_MATERIALIDAD"
    password = "USUARIO_DATAMART_MATERIALIDAD"
    host = "localhost"
    port = "1521"
    service_name = "XE"

    
    connection = get_db_connection(user, password, host, port, service_name)

    table_list = list_all_tables(connection,'oracle')


    return render_template('goverment/gobierno.html',tables_info=table_list)



@app.route("/reportes",methods=['GET'])
def reporte_view():

    return render_template('report/report.html')

@app.route('/exportar_evaluacion', methods=['POST'])
def generar_reporte_excel_endpoint():
    payload = request.get_json()
    if not payload:
        return jsonify({"error": "No JSON recibido"}), 400

    ruta_archivo = generar_reporte_excel(payload, ruta_salida='./reportes')

    if not os.path.exists(ruta_archivo):
        return jsonify({"error": "No se pudo generar el reporte"}), 500

    return send_file(
        ruta_archivo,
        as_attachment=True,
        download_name=os.path.basename(ruta_archivo),
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )

@app.route("/exportar_pdf", methods=["POST"])
def generar_reporte_pdf():
    datos = request.get_json()

    if not datos or "dataFormulario" not in datos or "resultadoEvaluacion" not in datos:
        return jsonify({"error": "JSON inválido"}), 400

    dataFormulario = datos["dataFormulario"]
    resultadoEvaluacion = datos["resultadoEvaluacion"]

    rendered_html = render_template(
        "report/pdf_report.html",
        dataFormulario=dataFormulario,
        resultadoEvaluacion=resultadoEvaluacion
    )

    output_folder = Path("output")
    output_folder.mkdir(exist_ok=True)

    temp_filename = f"{uuid.uuid4().hex}.html"
    temp_html_path = Path("src") / "static" / "temp" / temp_filename
    temp_html_path.parent.mkdir(parents=True, exist_ok=True)

    with open(temp_html_path, "w", encoding="utf-8") as f:
        f.write(rendered_html)

    output_pdf_path = output_folder / (dataFormulario.get("nombre_archivo", "reporte") + ".pdf")
    export_html_to_pdf_via_http(temp_filename, output_pdf_path)

    os.remove(temp_html_path)

    return send_file(output_pdf_path, as_attachment=True)





if __name__ == '__main__':
    app.run(debug=True)

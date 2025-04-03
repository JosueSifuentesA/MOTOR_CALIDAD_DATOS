from flask import Flask, render_template, request
from src.db.db_connector import get_db_connection
from src.services.profiler import profile_table_data,list_all_tables
import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__,
            template_folder=os.path.join(BASE_DIR, "src/templates"),
            static_folder=os.path.join(BASE_DIR, "src/static"))

@app.route('/perfilado')
def perfilado():
    user = "USUARIO_DATAMART_MATERIALIDAD"
    password = "USUARIO_DATAMART_MATERIALIDAD"
    host = "localhost"
    port = "1521"
    service_name = "XE"

    
    connection = get_db_connection(user, password, host, port, service_name)


    #table_name = request.args.get("table", "CATEGORIAS_TRANSACCION")
    table_name = request.args.get("table", "HISTORICO_ESTADO_TARJETA")
    #table_name = request.args.get("table", "LIMITE_CREDITO_TARJETA")
    #table_name = request.args.get("table", "RECOMPENSAS_TARJETA")
    #table_name = request.args.get("table", "TARJETA_CREDITO")
    #table_name = request.args.get("table", "TRANSACCIONES_CATEGORIA")

    profile_data = profile_table_data(connection, table_name)
    table_list = list_all_tables(connection,'oracle')
 
    return render_template('perfilador/perfilador.html', profile_data=profile_data, tables_info=table_list)


if __name__ == '__main__':
    app.run(debug=True)

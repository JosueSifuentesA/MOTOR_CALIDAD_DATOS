import oracledb
import mysql.connector
import pandas as pd


def get_db_connection(user, password, host, port, service_name):
    """Obtiene la conexión a la base de datos Oracle."""
    try:
        
        oracledb.init_oracle_client()
        dsn = f"{host}:{port}/{service_name}"
        connection = oracledb.connect(user=user, password=password, dsn=dsn)
        print(f"Conexión exitosa a Oracle.")
        return connection
    except Exception as e:
        print(f"Error al conectar a Oracle: {e}")
        raise Exception(f"Error al conectar a la BD: {str(e)}")


def get_tables(connection, db_type):
    """Obtiene las tablas disponibles en la base de datos."""
    try:
        if db_type.lower() == "oracle":
            
            cursor = connection.cursor()
            cursor.execute("SELECT table_name FROM user_tables")
            tables = cursor.fetchall()
            cursor.close()
            return [table[0] for table in tables]
        
        elif db_type.lower() == "mysql":
            
            cursor = connection.cursor()
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            cursor.close()
            return [table[0] for table in tables]
        
        elif db_type.lower() == "sqlite":
            
            cursor = connection.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = cursor.fetchall()
            cursor.close()
            return [table[0] for table in tables]
        
        else:
            raise Exception(f"Motor de base de datos {db_type} no soportado.")
    
    except Exception as e:
        print(f"Error al obtener las tablas: {str(e)}")
        raise Exception(f"Error al obtener las tablas: {str(e)}")

def extract_table_data(connection, table_name):
    """
    Extrae los datos completos de una tabla Oracle y los devuelve como un DataFrame de pandas.
    """
    try:
        print(f"ERROR A LA HORA DE EXTRAER UNA TABLA {table_name}")
        cursor = connection.cursor()

        
        query = f'SELECT * FROM "{table_name}"'
        cursor.execute(query)

        
        columnas = [col[0] for col in cursor.description]

        
        rows = cursor.fetchall()

        
        df = pd.DataFrame(rows, columns=columnas)
        print('DTOS EXTRAIDOS DE LA TABLA')
        cursor.close()
        return df

    except Exception as e:
        raise Exception(f"Error al extraer datos de la tabla '{table_name}': {str(e)}")


def get_columns(connection,table_name):

    try:
        cursor = connection.cursor()
        query = f'SELECT * FROM "{table_name}" WHERE ROWNUM = 1'
        cursor.execute(query)
        columnas = [col[0] for col in cursor.description]
        cursor.close()

        print(columnas)
        return columnas
    except Exception as e:
        raise Exception(f"Error al extraer datos de la tabla '{table_name}': {str(e)}")
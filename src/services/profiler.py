import pandas as pd
import logging
import oracledb
from src.db.db_connector import get_tables
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def profile_table_data(connection, table_name):
    """Perfila una tabla de Oracle sin usar SQLAlchemy."""
    try:
        
        cursor = connection.cursor()

        
        cursor.execute("""
            SELECT table_name FROM user_tables WHERE table_name = :table_name
        """, (table_name.upper(),))

        result = cursor.fetchone()
        if result is None:
            raise ValueError(f"La tabla '{table_name}' no existe en la base de datos.")

        
        cursor.execute(f"SELECT * FROM {table_name.upper()}")
        rows = cursor.fetchall()

        
        columns = [desc[0] for desc in cursor.description]

        
        df = pd.DataFrame(rows, columns=columns)

        
        df.columns = df.columns.str.upper()

        print(df.head(20))

        profile = pd.DataFrame({
            "Columna": df.columns,
            "Tipo de Dato": [df[col].dtype for col in df.columns],
            "Valores Nulos (%)": [df[col].isnull().mean() * 100 for col in df.columns],
            "Duplicados": [df.duplicated(subset=[col]).sum() for col in df.columns],
            "Valores Únicos": [df[col].nunique() for col in df.columns]
        })

        return profile.to_dict(orient="records")

    except ValueError as ve:
        print(f"Error en el perfilado de la tabla '{table_name}': {str(ve)}")
        return []
    except Exception as e:
        print(f"Error inesperado en el perfilado de la tabla '{table_name}': {str(e)}")
        return []
    finally:
        cursor.close()

def get_table_info(connection, table_name):
    """Obtiene el número de filas, el número de columnas y el nombre de la tabla."""
    try:
        cursor = connection.cursor()


        cursor.execute(f"SELECT COUNT(*) FROM {table_name.upper()}")
        num_rows = cursor.fetchone()[0]


        cursor.execute(f"SELECT * FROM {table_name.upper()} WHERE 1=0")
        num_columns = len(cursor.description)


        return {
            "nombre_tabla": table_name.upper(),
            "numero_filas": num_rows,
            "numero_columnas": num_columns
        }

    except Exception as e:
        print(f"Error en la obtención de información de la tabla '{table_name}': {str(e)}")
        return None
    finally:
        cursor.close()


def list_all_tables(connection, db_type):

    tables_info = []
    tables = get_tables(connection, db_type)
    
    for table in tables:

        cursor = connection.cursor()
        cursor.execute(f"SELECT * FROM {table} WHERE 1=0")  
        columns = [desc[0] for desc in cursor.description]
        num_columns = len(columns)
        

        cursor.execute(f"SELECT COUNT(*) FROM {table}")
        num_rows = cursor.fetchone()[0]
        cursor.close()


        tables_info.append({
            'name': table,
            'num_columns': num_columns,
            'num_rows': num_rows
        })

    return tables_info
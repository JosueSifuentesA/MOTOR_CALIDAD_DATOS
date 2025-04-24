import pandas as pd
import numpy as np
from datetime import datetime
import logging
# ----------- MÉTODOS PARA CADA CRITERIO -----------
logging.basicConfig(filename='evaluacion_validez.log', level=logging.INFO)



def evaluar_completitud(df: pd.DataFrame, columnas: list[str], peso: float):
    completitud_scores = {}

    # Usamos df.info() para ver la cantidad de nulos en cada columna
    print("Resumen del DataFrame:")
    df.info()  # Muestra el conteo de valores no nulos por columna

    # Calculamos la completitud para cada columna
    for col in columnas:
        try:
            # Verificar si la columna existe en el DataFrame
            if col not in df.columns:
                print(f"Columna {col} no existe en el DataFrame.")
                continue

            # Calcular el porcentaje de valores no nulos
            total_filas = len(df)
            nulos = df[col].isna().sum()  # Número de valores nulos
            completitud = 1 - (nulos / total_filas)  # Compleción = (filas no nulas) / total filas

            completitud_scores[col] = completitud
            print(f"Completitud de la columna '{col}': {completitud:.2f}")

        except Exception as e:
            print(f"Error en la columna {col}: {e}")
            traceback.print_exc()
            completitud_scores[col] = 0  # Valor por defecto en caso de error

    # Calculamos el score final tomando el promedio de los scores de completitud
    if completitud_scores:
        promedio_completitud = sum(completitud_scores.values()) / len(completitud_scores)
        score_final = promedio_completitud * peso / 100
    else:
        score_final = 0  # Si no se puede calcular completitud

    return {"score": score_final, "detalle": completitud_scores}




def evaluar_consistencia(consistencia_localstorage: dict, peso: float):
    scores = {}
    try:
        for col, val in consistencia_localstorage.items():
            scores[col] = val['score_final']
        score_global = np.mean(list(scores.values())) * peso
    except Exception as e:
        print(f"Error en evaluar_consistencia: {e}")
        traceback.print_exc()
        scores = {}
        score_global = 0
    return {"score": score_global / 100, "detalle": scores}


def evaluar_exactitud(df: pd.DataFrame, criterio: dict, peso: float):
    outliers_detectados = {}
    for col_config in criterio['columnas']:
        try:
            col = col_config['columna']
            tipo = col_config['tipo']
            if tipo == 'fecha':
                fechas = pd.to_datetime(df[col], errors='coerce')
                fechas_validas = fechas.dropna()
                if fechas_validas.empty:
                    continue
                q1 = fechas_validas.quantile(0.25)
                q3 = fechas_validas.quantile(0.75)
                iqr = q3 - q1
                min_ = q1 - 1.5 * iqr
                max_ = q3 + 1.5 * iqr
                outliers = ((fechas_validas < min_) | (fechas_validas > max_)).mean()
            else:
                valores = pd.to_numeric(df[col], errors='coerce').dropna()
                if valores.empty:
                    continue
                q1 = valores.quantile(0.25)
                q3 = valores.quantile(0.75)
                iqr = q3 - q1
                min_ = q1 - 1.5 * iqr
                max_ = q3 + 1.5 * iqr
                outliers = ((valores < min_) | (valores > max_)).mean()
            outliers_detectados[col] = 1 - outliers
        except Exception as e:
            print(f"Error en evaluar_exactitud para la columna {col}: {e}")
            outliers_detectados[col] = 0  # Valor por defecto en caso de error
            traceback.print_exc()

    score_final = np.mean(list(outliers_detectados.values())) * peso / 100
    return {"score": score_final, "detalle": outliers_detectados}


def evaluar_usabilidad(df: pd.DataFrame, columnas: list[str], peso: float):
    usabilidad_scores = {}
    for col in columnas:
        try:
            # Verificamos si la columna existe en el DataFrame
            if col not in df.columns:
                print(f"Columna {col} no encontrada en el DataFrame.")
                traceback.print_exc()
                usabilidad_scores[col] = 0
                continue

            # Calculamos el porcentaje de valores nulos
            porcentaje_nulos = df[col].isna().mean()
            usabilidad_scores[col] = 1 - porcentaje_nulos
        except Exception as e:
            print(f"Error en evaluar_usabilidad para la columna {col}: {e}")
            traceback.print_exc()
            usabilidad_scores[col] = 0  # Valor por defecto en caso de error
    
    score_final = np.mean(list(usabilidad_scores.values())) * peso / 100
    return {"score": score_final, "detalle": usabilidad_scores}


def evaluar_validez(df: pd.DataFrame, configuracion: list[dict], peso: float):
    validez_scores = {}
    print(configuracion)
    for col_def in configuracion:
        col = col_def.get('columna', None)  # Asegura que col esté siempre definida, incluso si falta
        if not col:
            logging.error("Columna no encontrada en la configuración.")
            traceback.print_exc()
            continue  # Si no encontramos la columna, pasamos al siguiente elemento de la lista

        try:
            tipo_esperado = col_def['tipo']
            serie = df[col]

            # Lógica para validar tipos
            if tipo_esperado == 'fecha':
                validos = pd.to_datetime(serie, errors='coerce').notna().mean()
            elif tipo_esperado == 'texto':
                validos = serie.apply(lambda x: isinstance(x, str)).mean()
            elif tipo_esperado == 'numero':
                validos = pd.to_numeric(serie, errors='coerce').notna().mean()
            else:
                # Registro si el tipo es desconocido
                logging.warning(f"Tipo desconocido para la columna {col}: {tipo_esperado}")
                validos = 0  # Tipo desconocido
            validez_scores[col] = validos
        except Exception as e:
            # Registra el error con más detalles
            logging.error(f"Error en evaluar_validez para la columna {col}: {e}")
            traceback.print_exc()
            validez_scores[col] = 0  # Valor por defecto en caso de error

    # Calcula el score final basado en los valores de las columnas
    score_final = np.mean(list(validez_scores.values())) * peso / 100
    return {"score": score_final, "detalle": validez_scores}


# ----------- MÉTODO PRINCIPAL -----------

def evaluar_matriz_personalizada(df: pd.DataFrame, criterios: dict):
    import json
    
    resultado = {}

    print('ESTAMOS EN LA MATRIZ PERSONALIZADA')

    # Completitud
    if 'criterioCompletitud' in criterios:
        comp = json.loads(criterios['criterioCompletitud'])
        resultado['completitud'] = evaluar_completitud(df, comp['columnas'], float(comp['peso']))

    # Consistencia
    if 'criterioConsistencia' in criterios:
        cons = json.loads(criterios['criterioConsistencia'])  # ← aquí parseas una sola vez
        resultado['consistencia'] = evaluar_consistencia(
            cons['resultados_por_columna'],
            float(cons['score_global'] * 100 / 25)
        )

    # Exactitud
    if 'criterioExactitud' in criterios:
        exact = json.loads(criterios['criterioExactitud'])  # decodificas el string JSON a dict
        resultado['exactitud'] = evaluar_exactitud(df, exact, float(exact['peso']))

    # Usabilidad
    if 'criterioUsabilidad' in criterios:
        usabilidad = json.loads(criterios['criterioUsabilidad'])
        usabilidad['peso'] = float(usabilidad['peso'])  # Convertimos el peso a número
        resultado['usabilidad'] = evaluar_usabilidad(df, usabilidad['columnas'], usabilidad['peso'])

    # Validez
    #if 'criterioValidez' in criterios:
    #    validez = json.loads(criterios['criterioValidez'])
    #    resultado['validez'] = evaluar_validez(df, validez, 10)

    # Score final
    total = sum(res['score'] for res in resultado.values())
    resultado['score_final'] = round(total, 4)
    return resultado
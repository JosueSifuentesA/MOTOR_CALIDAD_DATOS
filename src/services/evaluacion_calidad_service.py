import pandas as pd
import numpy as np
from datetime import datetime
import logging
import math
import traceback
# ----------- MÉTODOS PARA CADA CRITERIO -----------
logging.basicConfig(filename='evaluacion_validez.log', level=logging.INFO)



def evaluar_completitud(df: pd.DataFrame, columnas: list[str], peso: float):
    completitud_scores = {}

    
    print("Resumen del DataFrame:")
    df.info()

   
    for col in columnas:
        try:
            
            if col not in df.columns:
                print(f"Columna {col} no existe en el DataFrame.")
                continue

            
            total_filas = len(df)
            nulos = df[col].isna().sum()
            completitud = 1 - (nulos / total_filas)

            completitud_scores[col] = completitud
            print(f"Completitud de la columna '{col}': {completitud:.2f}")

        except Exception as e:
            print(f"Error en la columna {col}: {e}")
            traceback.print_exc()
            completitud_scores[col] = 0


    if completitud_scores:
        promedio_completitud = sum(completitud_scores.values()) / len(completitud_scores)
        score_final = promedio_completitud * peso / 100
    else:
        score_final = 0

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

def reemplazar_nan_en_dict(d):
    if isinstance(d, dict):
        return {k: reemplazar_nan_en_dict(v) for k, v in d.items()}
    elif isinstance(d, list):
        return [reemplazar_nan_en_dict(i) for i in d]
    elif isinstance(d, float) and (math.isnan(d) or math.isinf(d)):
        return None
    else:
        return d




def evaluar_exactitud(df: pd.DataFrame, criterio: dict, peso: float):
    outliers_detectados = {}

    for col_config in criterio.get('columnas', []):
        try:
            col = col_config['columna']
            tipo = col_config['tipo']

            if col not in df.columns:
                continue

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

            else:  # numérico
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
            traceback.print_exc()
            outliers_detectados[col] = 0

    
    if outliers_detectados:
        score_final = np.mean(list(outliers_detectados.values())) * peso / 100
    else:
        score_final = float('nan')

    resultado = {
        "score": score_final,
        "detalle": outliers_detectados
    }

    return reemplazar_nan_en_dict(resultado)


def evaluar_usabilidad(df: pd.DataFrame, columnas: list[str], peso: float):
    usabilidad_scores = {}
    for col in columnas:
        try:
            
            if col not in df.columns:
                print(f"Columna {col} no encontrada en el DataFrame.")
                traceback.print_exc()
                usabilidad_scores[col] = 0
                continue

            
            porcentaje_nulos = df[col].isna().mean()
            usabilidad_scores[col] = 1 - porcentaje_nulos
        except Exception as e:
            print(f"Error en evaluar_usabilidad para la columna {col}: {e}")
            traceback.print_exc()
            usabilidad_scores[col] = 0
    
    score_final = np.mean(list(usabilidad_scores.values())) * peso / 100
    return {"score": score_final, "detalle": usabilidad_scores}


def evaluar_validez(df: pd.DataFrame, configuracion: list[dict], peso: float):
    validez_scores = {}
    print(configuracion)
    for col_def in configuracion:
        col = col_def.get('columna', None)
        if not col:
            logging.error("Columna no encontrada en la configuración.")
            traceback.print_exc()
            continue

        try:
            tipo_esperado = col_def['tipo']
            serie = df[col]

            
            if tipo_esperado == 'fecha':
                validos = pd.to_datetime(serie, errors='coerce').notna().mean()
            elif tipo_esperado == 'texto':
                validos = serie.apply(lambda x: isinstance(x, str)).mean()
            elif tipo_esperado == 'numero':
                validos = pd.to_numeric(serie, errors='coerce').notna().mean()
            else:
                
                logging.warning(f"Tipo desconocido para la columna {col}: {tipo_esperado}")
                validos = 0  # Tipo desconocido
            validez_scores[col] = validos
        except Exception as e:
            s
            logging.error(f"Error en evaluar_validez para la columna {col}: {e}")
            traceback.print_exc()
            validez_scores[col] = 0

    
    score_final = np.mean(list(validez_scores.values())) * peso / 100
    return {"score": score_final, "detalle": validez_scores}


# ----------- MÉTODO PRINCIPAL -----------

def evaluar_matriz_personalizada(df: pd.DataFrame, criterios: dict):
    import json
    
    resultado = {}

    print('ESTAMOS EN LA MATRIZ PERSONALIZADA')

    
    if 'criterioCompletitud' in criterios:
        comp = json.loads(criterios['criterioCompletitud'])
        resultado['completitud'] = evaluar_completitud(df, comp['columnas'], float(comp['peso']))

    
    if 'criterioConsistencia' in criterios:
        cons = json.loads(criterios['criterioConsistencia'])
        resultado['consistencia'] = evaluar_consistencia(
            cons['resultados_por_columna'],
            float(cons['score_global'] * 100 / 25)
        )

    
    if 'criterioExactitud' in criterios:
        exact = json.loads(criterios['criterioExactitud'])
        resultado['exactitud'] = evaluar_exactitud(df, exact, float(exact['peso']))

    
    if 'criterioUsabilidad' in criterios:
        usabilidad = json.loads(criterios['criterioUsabilidad'])
        usabilidad['peso'] = float(usabilidad['peso'])
        resultado['usabilidad'] = evaluar_usabilidad(df, usabilidad['columnas'], usabilidad['peso'])

    # Validez
    #if 'criterioValidez' in criterios:
    #    validez = json.loads(criterios['criterioValidez'])
    #    resultado['validez'] = evaluar_validez(df, validez, 10)

    # Score final
    total = sum(res['score'] for res in resultado.values() if res['score'] is not None)

    resultado['score_final'] = round(total, 4)
    return resultado
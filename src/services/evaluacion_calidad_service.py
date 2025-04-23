import pandas as pd
import numpy as np
from datetime import datetime

# ----------- MÉTODOS PARA CADA CRITERIO -----------

def evaluar_completitud(df: pd.DataFrame, columnas: list[str], peso: float):
    completitud_scores = {}
    for col in columnas:
        try:
            porcentaje_nulos = df[col].isna().mean()
            completitud_scores[col] = 1 - porcentaje_nulos
        except Exception as e:
            print(f"Error en evaluar_completitud para la columna {col}: {e}")
            completitud_scores[col] = 0  # Valor por defecto en caso de error
    promedio = np.mean(list(completitud_scores.values()))
    score_final = promedio * peso / 100
    return {"score": score_final, "detalle": completitud_scores}


def evaluar_consistencia(consistencia_localstorage: dict, peso: float):
    scores = {}
    try:
        for col, val in consistencia_localstorage.items():
            scores[col] = val['score_final']
        score_global = np.mean(list(scores.values())) * peso
    except Exception as e:
        print(f"Error en evaluar_consistencia: {e}")
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

    score_final = np.mean(list(outliers_detectados.values())) * peso / 100
    return {"score": score_final, "detalle": outliers_detectados}


def evaluar_usabilidad(df: pd.DataFrame, columnas: list[str], peso: float):
    usabilidad_scores = {}
    for col in columnas:
        try:
            porcentaje_nulos = df[col].isna().mean()
            usabilidad_scores[col] = 1 - porcentaje_nulos
        except Exception as e:
            print(f"Error en evaluar_usabilidad para la columna {col}: {e}")
            usabilidad_scores[col] = 0  # Valor por defecto en caso de error
    score_final = np.mean(list(usabilidad_scores.values())) * peso / 100
    return {"score": score_final, "detalle": usabilidad_scores}


def evaluar_validez(df: pd.DataFrame, configuracion: list[dict], peso: float):
    validez_scores = {}
    for col_def in configuracion:
        try:
            col = col_def['columna']
            tipo_esperado = col_def['tipo']
            serie = df[col]

            if tipo_esperado == 'fecha':
                validos = pd.to_datetime(serie, errors='coerce').notna().mean()
            elif tipo_esperado == 'texto':
                validos = serie.apply(lambda x: isinstance(x, str)).mean()
            elif tipo_esperado == 'numero':
                validos = pd.to_numeric(serie, errors='coerce').notna().mean()
            else:
                validos = 0  # tipo desconocido
            validez_scores[col] = validos
        except Exception as e:
            print(f"Error en evaluar_validez para la columna {col}: {e}")
            validez_scores[col] = 0  # Valor por defecto en caso de error

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
        resultado['usabilidad'] = evaluar_usabilidad(df, criterios['criterioUsabilidad'], 15)

    # Validez
    if 'criterioValidez' in criterios:
        resultado['validez'] = evaluar_validez(df, criterios['criterioValidez'], 10)

    # Score final
    total = sum(res['score'] for res in resultado.values())
    resultado['score_final'] = round(total, 4)
    return resultado

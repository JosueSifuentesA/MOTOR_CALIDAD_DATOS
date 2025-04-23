import pandas as pd
import numpy as np
from datetime import datetime

# ----------- MÉTODOS PARA CADA CRITERIO -----------

def evaluar_completitud(df: pd.DataFrame, columnas: list[str], peso: float):
    completitud_scores = {}
    for col in columnas:
        porcentaje_nulos = df[col].isna().mean()
        completitud_scores[col] = 1 - porcentaje_nulos
    promedio = np.mean(list(completitud_scores.values()))
    score_final = promedio * peso / 100
    return {"score": score_final, "detalle": completitud_scores}


def evaluar_consistencia(consistencia_localstorage: dict, peso: float):
    scores = {col: val['score_final'] for col, val in consistencia_localstorage.items()}
    score_global = np.mean(list(scores.values())) * peso
    return {"score": score_global / 100, "detalle": scores}


def evaluar_exactitud(df: pd.DataFrame, criterio: dict, peso: float):
    outliers_detectados = {}
    for col_config in criterio['columnas']:
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

    score_final = np.mean(list(outliers_detectados.values())) * peso / 100
    return {"score": score_final, "detalle": outliers_detectados}


def evaluar_usabilidad(df: pd.DataFrame, columnas: list[str], peso: float):
    usabilidad_scores = {}
    for col in columnas:
        porcentaje_nulos = df[col].isna().mean()
        usabilidad_scores[col] = 1 - porcentaje_nulos
    score_final = np.mean(list(usabilidad_scores.values())) * peso / 100
    return {"score": score_final, "detalle": usabilidad_scores}


def evaluar_validez(df: pd.DataFrame, configuracion: list[dict], peso: float):
    validez_scores = {}
    for col_def in configuracion:
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

    score_final = np.mean(list(validez_scores.values())) * peso / 100
    return {"score": score_final, "detalle": validez_scores}


# ----------- MÉTODO PRINCIPAL -----------

def evaluar_matriz_personalizada(df: pd.DataFrame, criterios: dict):
    resultado = {}

    # Completitud
    if 'criterioCompletitud' in criterios:
        comp = criterios['criterioCompletitud']
        resultado['completitud'] = evaluar_completitud(df, comp['columnas'], float(comp['peso']))

    # Consistencia
    if 'criterioConsistencia' in criterios:
        cons = criterios['criterioConsistencia']
        resultado['consistencia'] = evaluar_consistencia(cons['resultados_por_columna'], float(cons['score_global'] * 100 / 25))  # Ajustamos peso

    # Exactitud
    if 'criterioExactitud' in criterios:
        exact = criterios['criterioExactitud']
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
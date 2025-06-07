import pandas as pd
import numpy as np
from scipy.stats import entropy


def evaluar_coherencia(df, col):
    print('EVALUANDO COHERENCIA DE LAS COLUMNAS')
    dominancia = df[col].value_counts(normalize=True).iloc[0]
    entropia = entropy(df[col].value_counts(normalize=True))
    cardinalidad = df[col].nunique() / len(df)
    coherencia_score = (dominancia + (1 - entropia) + cardinalidad) / 3
    return coherencia_score


def evaluar_redundancia(df, col):
    print('EVALUAR REDUNDANCIA DE LAS COLUMNAS')
    correlaciones = df.corr(numeric_only=True).abs()
    redundancia = correlaciones[col].mean() if col in correlaciones else 0
    return redundancia


def evaluar_formato(df, col):
    print('EVALUANDO FORMATO DE LAS COLUMNAS')
    if df[col].dtype == 'object':
        formato_score = df[col].apply(lambda x: isinstance(x, str)).mean()
    else:
        formato_score = df[col].apply(lambda x: isinstance(x, (int, float))).mean()
    return formato_score


def evaluar_duplicados(df, col):
    print('EVALUANDO DUPLICADOS DE LAS COLUMNAS')
    duplicados_score = df.duplicated(subset=[col]).mean()
    return duplicados_score


def evaluar_consistencia_columnas(df):
    print('EVALUANDO CONSISTENCIA DE LAS COLUMNAS')
    resultados = {}
    for col in df.columns:
        coherencia = evaluar_coherencia(df, col)
        redundancia = evaluar_redundancia(df, col)
        formato = evaluar_formato(df, col)
        duplicados = evaluar_duplicados(df, col)
        
        score_final = (0.4 * coherencia + 0.2 * redundancia + 0.2 * formato + 0.2 * duplicados)
        
        resultados[col] = {
            "coherencia": coherencia,
            "redundancia": redundancia,
            "formato": formato,
            "duplicados": duplicados,
            "score_final": score_final
        }
    
    return resultados

def calcular_score_global(resultados):
    total_score = np.mean([res['score_final'] for res in resultados.values()])
    return total_score


def procesar_datos(df):

    resultados = evaluar_consistencia_columnas(df)
    

    score_global = calcular_score_global(resultados)

    return {
        "resultados_por_columna": resultados,
        "score_global": score_global
    }


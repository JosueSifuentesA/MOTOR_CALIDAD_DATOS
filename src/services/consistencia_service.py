import pandas as pd
import numpy as np
from scipy.stats import entropy

# 1. Coherencia estadística intra-columna
def evaluar_coherencia(df, col):
    print('EVALUANDO COHERENCIA DE LAS COLUMNAS')
    dominancia = df[col].value_counts(normalize=True).iloc[0]
    entropia = entropy(df[col].value_counts(normalize=True))
    cardinalidad = df[col].nunique() / len(df)
    coherencia_score = (dominancia + (1 - entropia) + cardinalidad) / 3
    return coherencia_score

# 2. Redundancia cruzada entre columnas
def evaluar_redundancia(df, col):
    print('EVALUAR REDUNDANCIA DE LAS COLUMNAS')
    correlaciones = df.corr(numeric_only=True).abs()
    redundancia = correlaciones[col].mean() if col in correlaciones else 0
    return redundancia

# 3. Formato homogéneo
def evaluar_formato(df, col):
    print('EVALUANDO FORMATO DE LAS COLUMNAS')
    if df[col].dtype == 'object':
        formato_score = df[col].apply(lambda x: isinstance(x, str)).mean()
    else:
        formato_score = df[col].apply(lambda x: isinstance(x, (int, float))).mean()
    return formato_score

# 4. Duplicados exactos entre filas
def evaluar_duplicados(df, col):
    print('EVALUANDO DUPLICADOS DE LAS COLUMNAS')
    duplicados_score = df.duplicated(subset=[col]).mean()
    return duplicados_score

# 5. Función principal para evaluar la consistencia por columna
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

# 6. Función para calcular el score global de calidad de datos
def calcular_score_global(resultados):
    total_score = np.mean([res['score_final'] for res in resultados.values()])
    return total_score

# 7. Función del servicio para recibir los datos y devolver el análisis
def procesar_datos(df):
    # Evaluar consistencia de las columnas
    resultados = evaluar_consistencia_columnas(df)
    
    # Calcular el score global de calidad de datos
    score_global = calcular_score_global(resultados)
    
    # Devuelvo los resultados como diccionario
    return {
        "resultados_por_columna": resultados,
        "score_global": score_global
    }


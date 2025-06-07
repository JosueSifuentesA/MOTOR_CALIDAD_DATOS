import pandas as pd
import numpy as np
from datetime import datetime
import logging
import math
import traceback
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from datetime import datetime

def generar_reporte_excel(resultados_dict, opciones, ruta_salida="reporte_evaluacion.xlsx"):
    wb = Workbook()
    ws = wb.active
    ws.title = "Evaluación de Calidad"

    # Estilos
    header_font = Font(bold=True, color="FFFFFF")
    center_align = Alignment(horizontal="center")
    fill_header = PatternFill("solid", fgColor="4F81BD")
    fill_criterio = PatternFill("solid", fgColor="D9E1F2")
    thin_border = Border(left=Side(style='thin'), right=Side(style='thin'),
                         top=Side(style='thin'), bottom=Side(style='thin'))

    fila = 1
    ws.merge_cells(start_row=fila, start_column=1, end_row=fila, end_column=3)
    ws.cell(row=fila, column=1, value="🧪 REPORTE DE CALIDAD DE DATOS").font = Font(size=14, bold=True)
    ws.cell(row=fila, column=1).alignment = center_align
    fila += 2

    # Metadatos
    metadatos = opciones.get("metadatos", {})
    if metadatos.get("fecha", False):
        ws.cell(row=fila, column=1, value="📅 Fecha de evaluación:")
        ws.cell(row=fila, column=2, value=datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        fila += 1
    if metadatos.get("base_datos"):
        ws.cell(row=fila, column=1, value="🗃️ Base de datos:")
        ws.cell(row=fila, column=2, value=metadatos["base_datos"])
        fila += 1
    if metadatos.get("usuario"):
        ws.cell(row=fila, column=1, value="👤 Usuario evaluado:")
        ws.cell(row=fila, column=2, value=metadatos["usuario"])
        fila += 1
    if metadatos.get("evaluador"):
        ws.cell(row=fila, column=1, value="🔍 Evaluador:")
        ws.cell(row=fila, column=2, value=metadatos["evaluador"])
        fila += 1
    if metadatos.get("observaciones"):
        ws.cell(row=fila, column=1, value="📝 Observaciones:")
        ws.cell(row=fila, column=2, value=metadatos["observaciones"])
        fila += 1

    fila += 2

    # Opciones de inclusión
    incluir = opciones.get("incluir", {})
    mostrar_detalle = opciones.get("detalle", "por_variable")

    for criterio, info in resultados_dict.items():
        if criterio == "score_final" and not incluir.get("score_final", False):
            continue
        if criterio != "score_final" and not incluir.get(criterio, False):
            continue

        ws.merge_cells(start_row=fila, start_column=1, end_row=fila, end_column=3)
        score_pct = info if criterio == "score_final" else info["score"]
        celda = ws.cell(row=fila, column=1, value=f"🧠 {criterio.upper()} - Score: {round(score_pct * 100, 2)}%")
        celda.font = Font(bold=True)
        celda.fill = fill_criterio
        celda.alignment = center_align
        fila += 1

        if criterio != "score_final" and mostrar_detalle == "por_variable":
            # Headers
            ws.cell(row=fila, column=1, value="Campo").font = header_font
            ws.cell(row=fila, column=2, value="Score (%)").font = header_font
            ws.cell(row=fila, column=1).fill = fill_header
            ws.cell(row=fila, column=2).fill = fill_header
            ws.cell(row=fila, column=1).alignment = center_align
            ws.cell(row=fila, column=2).alignment = center_align
            ws.cell(row=fila, column=1).border = thin_border
            ws.cell(row=fila, column=2).border = thin_border
            fila += 1

            for campo, valor in info["detalle"].items():
                ws.cell(row=fila, column=1, value=campo).border = thin_border
                ws.cell(row=fila, column=2, value=round(valor * 100, 2)).border = thin_border
                fila += 1

            fila += 1

    fila += 1
    if incluir.get("score_final", False):
        ws.merge_cells(start_row=fila, start_column=1, end_row=fila, end_column=3)
        celda_final = ws.cell(row=fila, column=1, value=f"🎯 SCORE FINAL: {round(resultados_dict['score_final'] * 100, 2)}%")
        celda_final.font = Font(size=12, bold=True, color="FFFFFF")
        celda_final.fill = PatternFill("solid", fgColor="4472C4")
        celda_final.alignment = center_align

    # Ajustes finales
    ws.column_dimensions["A"].width = 35
    ws.column_dimensions["B"].width = 18

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    ruta_final = ruta_salida.replace(".xlsx", f"_{timestamp}.xlsx")
    wb.save(ruta_final)
    return ruta_final


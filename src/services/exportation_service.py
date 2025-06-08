import os
from datetime import datetime
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

def generar_reporte_excel(data: dict, ruta_salida: str = "./reportes") -> str:
    """
    Genera un archivo Excel presentable a partir de los datos de evaluación de calidad.

    Args:
        data (dict): JSON con la estructura de `dataFormulario` y `resultadoEvaluacion`.
        ruta_salida (str): Ruta donde se guardará el Excel. Por defecto es './reportes'.

    Returns:
        str: Ruta completa del archivo generado.
    """
    # Crear carpeta si no existe
    os.makedirs(ruta_salida, exist_ok=True)

    wb = Workbook()
    ws = wb.active
    ws.title = "Reporte Calidad"

    # Estilos
    color_primario = "4F95F2"
    header_fill = PatternFill(start_color=color_primario, end_color=color_primario, fill_type="solid")
    header_font = Font(bold=True, color="FFFFFF")
    center_align = Alignment(horizontal="center")

    # Título
    ws.append(["Reporte de Calidad de Datos"])
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=5)
    ws["A1"].font = Font(size=14, bold=True, color=color_primario)
    ws["A1"].alignment = center_align

    ws.append([])  # Espacio

    # Metadatos
    data_formulario = data.get("dataFormulario", {})
    ws.append(["Criterios:", ", ".join(data_formulario.get("criterios", []))])
    ws.append(["Nivel de Detalle:", data_formulario.get("nivel_detalle", "")])
    ws.append(["Tipo de Reporte:", data_formulario.get("tipo_reporte", "")])
    ws.append(["Fecha de Generación:", datetime.now().strftime("%Y-%m-%d %H:%M:%S")])
    ws.append([])

    # Resumen general
    ws.append(["Resumen de Scores"])
    ws[f"A{ws.max_row}"].font = Font(size=12, bold=True, color=color_primario)
    ws.append(["Criterio", "Score"])
    for cell in ws[ws.max_row]:
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = center_align

    evaluacion = data.get("resultadoEvaluacion", {})
    for criterio, valores in evaluacion.items():
        if criterio != "score_final":
            score = round(valores.get("score", 0), 4)
            ws.append([criterio.capitalize(), score])

    # Score final
    ws.append([])
    ws.append(["Score Final", round(evaluacion.get("score_final", 0), 4)])
    ws[f"A{ws.max_row}"].font = Font(bold=True, color=color_primario)

    # Detalle por criterio
    for criterio, valores in evaluacion.items():
        if criterio == "score_final":
            continue

        ws.append([])
        ws.append([f"Detalle: {criterio.capitalize()}"])
        ws[f"A{ws.max_row}"].font = Font(size=12, bold=True, color=color_primario)

        ws.append(["Campo", "Score"])
        for cell in ws[ws.max_row]:
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = center_align

        detalle = valores.get("detalle", {})
        for campo, score in detalle.items():
            ws.append([campo, round(score, 4)])

    # Ajustar anchos de columna de forma segura (sin acceder a MergedCell)
    for i, col in enumerate(ws.columns, start=1):
        max_length = 0
        col_letter = get_column_letter(i)
        for cell in col:
            try:
                if cell.value:
                    max_length = max(max_length, len(str(cell.value)))
            except:
                pass  # Evita errores si hay celdas fusionadas
        ws.column_dimensions[col_letter].width = max_length + 2

    # Guardar archivo
    nombre_archivo = data_formulario.get("nombre_archivo", "reporte_calidad") + ".xlsx"
    ruta_completa = os.path.join(ruta_salida, nombre_archivo)
    wb.save(ruta_completa)

    return ruta_completa


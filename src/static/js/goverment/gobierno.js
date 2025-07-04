

//import gobJson from '../goverment/gob.json'
document.addEventListener("DOMContentLoaded", () => {

document.getElementById("return_home_sidebar_option").addEventListener("click", function() {
    window.location.href = "/";
});

    
gobJSON = {
  "HET_ID": {
    "descripcion": "Identificador único de cada registro en el historial de cambios de estado de una tarjeta. Clave primaria de la tabla.",
    "usuarios_consumen": {
      "Auditoría y Compliance": {
        "proposito": "Rastreo de cambios en el estado de las tarjetas para auditorías internas y externas, y cumplimiento de normativas.",
        "reporteria_bi": "Informes de trazabilidad de estados de tarjeta, registros de auditoría."
      },
      "Operaciones de Tarjetas": {
        "proposito": "Diagnóstico de problemas relacionados con el estado de las tarjetas, seguimiento del ciclo de vida.",
        "reporteria_bi": "Dashboards de operaciones, reportes de actividad de tarjetas."
      }
    }
  },
  "HET_CODTARJETA": {
    "descripcion": "Código único que identifica a la tarjeta cuyo estado ha cambiado. Clave foránea que referencia a la tabla de Tarjetas (asumiendo su existencia).",
    "usuarios_consumen": {
      "Atención al Cliente": {
        "proposito": "Consultar el historial de cambios de estado de una tarjeta específica para brindar soporte al cliente.",
        "reporteria_bi": "Vistas de 360 grados del cliente, historial de tarjeta."
      },
      "Análisis de Fraude": {
        "proposito": "Identificar patrones de cambio de estado inusuales que puedan indicar actividad fraudulenta.",
        "reporteria_bi": "Reportes de alertas de fraude, dashboards de monitoreo."
      }
    }
  },
  "HET_FECHA_CAMBIO": {
    "descripcion": "Fecha y hora exacta en que se registró el cambio de estado de la tarjeta.",
    "usuarios_consumen": {
      "Análisis de Negocio": {
        "proposito": "Analizar la frecuencia y temporalidad de los cambios de estado, identificar tendencias.",
        "reporteria_bi": "Informes de actividad de tarjetas por periodo, análisis de churn (cambio de estado a inactivo)."
      },
      "Operaciones de Tarjetas": {
        "proposito": "Medir el tiempo de vida de los estados de la tarjeta y la eficiencia en los procesos de cambio de estado.",
        "reporteria_bi": "KPIs de gestión de tarjetas, reportes de duración de estados."
      }
    }
  },
  "HET_ESTADO_ANTERIOR": {
    "descripcion": "Estado previo de la tarjeta antes del cambio actual (ej., 'Activa', 'Bloqueada', 'Cancelada').",
    "usuarios_consumen": {
      "Auditoría y Compliance": {
        "proposito": "Verificar la secuencia correcta de los cambios de estado y asegurar que no haya saltos inesperados o no autorizados.",
        "reporteria_bi": "Registros de auditoría, reportes de trazabilidad de estado."
      },
      "Análisis de Fraude": {
        "proposito": "Estudiar la transición de estados para detectar patrones anómalos que precedan a fraudes.",
        "reporteria_bi": "Modelos de detección de anomalías, reportes de transiciones de estado sospechosas."
      }
    }
  },
  "HET_ESTADO_ACTUAL": {
    "descripcion": "Nuevo estado en el que se encuentra la tarjeta después del cambio registrado (ej., 'Activa', 'Bloqueada', 'Cancelada', 'Vencida').",
    "usuarios_consumen": {
      "Atención al Cliente": {
        "proposito": "Conocer el estado actual de la tarjeta de un cliente para informar adecuadamente o realizar acciones pertinentes.",
        "reporteria_bi": "Vistas de 360 grados del cliente, sistemas de soporte al cliente."
      },
      "Marketing y Ventas": {
        "proposito": "Identificar tarjetas inactivas o canceladas para campañas de reactivación o retención.",
        "reporteria_bi": "Segmentación de clientes por estado de tarjeta, dashboards de ciclo de vida del cliente."
      }
    }
  },
  "TT_ID": {
    "descripcion": "Identificador único de cada transacción realizada con una tarjeta. Clave primaria de la tabla.",
    "usuarios_consumen": {
      "Finanzas": {
        "proposito": "Conciliación de transacciones, auditoría de movimientos financieros.",
        "reporteria_bi": "Libros mayores, informes de conciliación."
      },
      "Desarrollo de Producto": {
        "proposito": "Análisis del uso de la tarjeta y patrones de gasto a nivel de transacción individual.",
        "reporteria_bi": "Detalle de transacciones, análisis granular de actividad."
      }
    }
  },
  "TT_CODTARJETA": {
    "descripcion": "Código único de la tarjeta que realizó la transacción. Clave foránea que referencia a la tabla de Tarjetas (asumiendo su existencia).",
    "usuarios_consumen": {
      "Atención al Cliente": {
        "proposito": "Rastrear transacciones asociadas a una tarjeta específica para atender consultas o disputas.",
        "reporteria_bi": "Historial de transacciones de tarjeta, gestión de disputas."
      },
      "Análisis de Riesgos y Fraude": {
        "proposito": "Monitorear patrones de gasto por tarjeta para detectar comportamientos fraudulentos o de alto riesgo.",
        "reporteria_bi": "Alertas de fraude en tiempo real, perfiles de gasto por tarjeta."
      }
    }
  },
  "TT_FECHA": {
    "descripcion": "Fecha y hora exacta en que se registró la transacción.",
    "usuarios_consumen": {
      "Análisis de Negocio": {
        "proposito": "Analizar tendencias de gasto por períodos de tiempo, identificar picos y valles de actividad.",
        "reporteria_bi": "Informes de ventas por día/hora/mes, análisis de estacionalidad."
      },
      "Finanzas": {
        "proposito": "Proyecciones de flujo de efectivo basadas en el historial de transacciones.",
        "reporteria_bi": "Previsiones financieras, análisis de liquidez."
      }
    }
  },
  "TT_IMPORTE": {
    "descripcion": "Monto de la transacción realizada con la tarjeta.",
    "usuarios_consumen": {
      "Finanzas": {
        "proposito": "Cálculo de ingresos, egresos y saldos de las cuentas de tarjeta.",
        "reporteria_bi": "Estados de cuenta, informes de ingresos/egresos."
      },
      "Marketing y Ventas": {
        "proposito": "Segmentación de clientes por volumen de gasto para campañas personalizadas o programas de fidelidad.",
        "reporteria_bi": "Segmentación de clientes por valor de vida (LTV), análisis de comportamiento de compra."
      }
    }
  },
  "TT_TIPO_TRANSACCION": {
    "descripcion": "Clasificación de la transacción (ej., 'Compra', 'Retiro en cajero', 'Devolución', 'Pago de servicios').",
    "usuarios_consumen": {
      "Análisis de Negocio": {
        "proposito": "Entender los tipos de uso de las tarjetas, identificar los servicios más utilizados o los patrones de gasto por categoría.",
        "reporteria_bi": "Dashboards de tipos de transacciones, análisis de servicios preferidos."
      },
      "Gestión de Fraude": {
        "proposito": "Identificar tipos de transacciones que son más propensas al fraude o que requieren mayor monitoreo.",
        "reporteria_bi": "Modelos de fraude específicos por tipo de transacción, alertas por transacciones inusuales."
      }
    }
  },
  "TT_ESTADO": {
    "descripcion": "Estado actual de la transacción (ej., 'Aprobada', 'Rechazada', 'Pendiente', 'Anulada').",
    "usuarios_consumen": {
      "Operaciones de Pagos": {
        "proposito": "Monitorear el procesamiento de las transacciones, identificar y resolver transacciones fallidas o pendientes.",
        "reporteria_bi": "Dashboards de transacciones en tiempo real, reportes de transacciones fallidas."
      },
      "Atención al Cliente": {
        "proposito": "Informar al cliente sobre el estado de sus transacciones y resolver disputas sobre cargos.",
        "reporteria_bi": "Historial de transacciones con estado, módulo de disputas."
      }
    }
  },
  "CT_ID": {
    "descripcion": "Identificador único de cada categoría de transacción. Clave primaria de la tabla.",
    "usuarios_consumen": {
      "Desarrollo de Producto": {
        "proposito": "Definir y gestionar las categorías que se utilizan para clasificar las transacciones.",
        "reporteria_bi": "Inventario de categorías, herramientas de configuración."
      }
    }
  },
  "CT_NOMBRE": {
    "descripcion": "Nombre descriptivo de la categoría de la transacción (ej., 'Alimentos y Bebidas', 'Transporte', 'Entretenimiento').",
    "usuarios_consumen": {
      "Análisis de Negocio": {
        "proposito": "Analizar patrones de gasto por categoría para entender el comportamiento del consumidor y diseñar ofertas.",
        "reporteria_bi": "Reportes de gasto por categoría, dashboards de comportamiento de cliente."
      },
      "Marketing": {
        "proposito": "Crear campañas personalizadas basadas en las categorías de gasto de los clientes.",
        "reporteria_bi": "Segmentación de clientes por preferencias de gasto, análisis de impacto de campañas."
      }
    }
  },
  "CT_DESCRIPCION": {
    "descripcion": "Descripción detallada de la categoría, explicando qué tipo de transacciones incluye.",
    "usuarios_consumen": {
      "Equipo de Datos y BI": {
        "proposito": "Asegurar la consistencia y el entendimiento de las categorías al momento de desarrollar informes y dashboards.",
        "reporteria_bi": "Documentación interna, glosario de términos de negocio."
      }
    }
  },
  "PT_ID": {
    "descripcion": "Identificador único de cada pago realizado a una tarjeta. Clave primaria de la tabla.",
    "usuarios_consumen": {
      "Finanzas": {
        "proposito": "Conciliación de pagos, seguimiento de ingresos.",
        "reporteria_bi": "Informes de pagos recibidos, dashboards de ingresos."
      }
    }
  },
  "PT_CODTARJETA": {
    "descripcion": "Código único de la tarjeta a la que se aplicó el pago. Clave foránea que referencia a la tabla de Tarjetas (asumiendo su existencia).",
    "usuarios_consumen": {
      "Atención al Cliente": {
        "proposito": "Consultar los pagos realizados por un cliente en una tarjeta específica.",
        "reporteria_bi": "Historial de pagos del cliente, estado de cuenta."
      }
    }
  },
  "PT_FECHA_PAGO": {
    "descripcion": "Fecha y hora en que se registró el pago de la tarjeta.",
    "usuarios_consumen": {
      "Finanzas": {
        "proposito": "Análisis de la puntualidad de los pagos, proyecciones de flujo de caja entrante.",
        "reporteria_bi": "Reportes de morosidad, análisis de plazos de pago."
      },
      "Cobranzas": {
        "proposito": "Monitorear la efectividad de las campañas de cobranza y la recuperación de deuda.",
        "reporteria_bi": "Dashboards de gestión de cobranza, reportes de recuperación."
      }
    }
  },
  "PT_IMPORTE": {
    "descripcion": "Monto del pago realizado a la tarjeta.",
    "usuarios_consumen": {
      "Finanzas": {
        "proposito": "Contabilidad de los pagos recibidos, cálculo de saldos pendientes.",
        "reporteria_bi": "Informes de ingresos por pagos, conciliaciones bancarias."
      },
      "Atención al Cliente": {
        "proposito": "Verificar los montos pagados para resolver disputas o dudas del cliente.",
        "reporteria_bi": "Estado de cuenta del cliente, detalle de pagos."
      }
    }
  },
  "PT_METODO_PAGO": {
    "descripcion": "Método utilizado para realizar el pago (ej., 'Transferencia bancaria', 'Tarjeta de débito', 'Pago en efectivo', 'Débito automático').",
    "usuarios_consumen": {
      "Operaciones de Pagos": {
        "proposito": "Optimizar los canales de pago más utilizados, identificar fricciones en métodos específicos.",
        "reporteria_bi": "Análisis de canales de pago, KPIs de eficiencia de pago."
      },
      "Finanzas": {
        "proposito": "Análisis de costes asociados a cada método de pago.",
        "reporteria_bi": "Reportes de costos operativos por método de pago."
      }
    }
  },
  "PT_ESTADO": {
    "descripcion": "Estado actual del pago (ej., 'Procesado', 'Pendiente', 'Rechazado', 'Revertido').",
    "usuarios_consumen": {
      "Operaciones de Pagos": {
        "proposito": "Monitorear el flujo de pagos, identificar y resolver problemas en el procesamiento.",
        "reporteria_bi": "Dashboards de estado de pagos, alertas de pagos fallidos."
      },
      "Atención al Cliente": {
        "proposito": "Informar al cliente sobre el estado de sus pagos y gestionar incidencias.",
        "reporteria_bi": "Consulta de estado de pagos, gestión de reclamos."
      }
    }
  },
  "TC_ID": {
    "descripcion": "Identificador único de la relación muchos a muchos entre una transacción y una categoría. Clave primaria de la tabla de unión.",
    "usuarios_consumen": {
      "Equipo de Datos y BI": {
        "proposito": "Facilitar la unión entre transacciones y categorías para análisis y reportería.",
        "reporteria_bi": "Modelado de datos, diseño de ETL."
      }
    }
  },
  "TT_ID": {
    "descripcion": "Identificador de la transacción, clave foránea que referencia a la tabla 'TRANSACCION TARJETA'.",
    "usuarios_consumen": {
      "Análisis de Negocio": {
        "proposito": "Permite vincular cada transacción a sus categorías correspondientes para análisis de gasto detallado.",
        "reporteria_bi": "Reportes de gasto por categoría a nivel de transacción, análisis granular."
      }
    }
  },
  "CT_ID": {
    "descripcion": "Identificador de la categoría, clave foránea que referencia a la tabla 'CATEGORIAS TRANSACCION'.",
    "usuarios_consumen": {
      "Marketing": {
        "proposito": "Utilizar la categorización para segmentar clientes en base a sus preferencias de gasto y crear ofertas relevantes.",
        "reporteria_bi": "Segmentación de clientes, personalización de ofertas."
      }
    }
  },
  "LCT_ID": {
    "descripcion": "Identificador único de cada registro en el historial de límites de crédito de una tarjeta. Clave primaria de la tabla.",
    "usuarios_consumen": {
      "Auditoría y Compliance": {
        "proposito": "Rastrear los cambios en los límites de crédito para cumplir con las regulaciones y políticas internas.",
        "reporteria_bi": "Informes de auditoría de límites, trazabilidad de ajustes."
      }
    }
  },
  "LCT_CODTARJETA": {
    "descripcion": "Código único de la tarjeta cuyo límite de crédito ha sido ajustado. Clave foránea que referencia a la tabla de Tarjetas.",
    "usuarios_consumen": {
      "Atención al Cliente": {
        "proposito": "Consultar el historial de ajustes de límite de crédito para una tarjeta específica.",
        "reporteria_bi": "Historial de límites de crédito, vista 360 del cliente."
      },
      "Análisis de Riesgo": {
        "proposito": "Evaluar el comportamiento del cliente en relación con los cambios en su límite de crédito.",
        "reporteria_bi": "Análisis de uso de crédito vs. límite, reportes de riesgo por segmento."
      }
    }
  },
  "LCT_FECHA": {
    "descripcion": "Fecha y hora en que se registró el ajuste del límite de crédito.",
    "usuarios_consumen": {
      "Análisis de Negocio": {
        "proposito": "Analizar la frecuencia y motivos de los ajustes de límite, y su impacto en el comportamiento de gasto.",
        "reporteria_bi": "Informes de ajustes de límite por período, análisis de respuesta de clientes."
      }
    }
  },
  "LCT_IMPORTE": {
    "descripcion": "Nuevo valor del límite de crédito después del ajuste.",
    "usuarios_consumen": {
      "Gestión de Cartera de Crédito": {
        "proposito": "Monitorear la exposición al crédito a nivel de cliente y de cartera.",
        "reporteria_bi": "Reportes de exposición crediticia, dashboards de límite de crédito utilizado."
      },
      "Finanzas": {
        "proposito": "Proyecciones de riesgo y oportunidad basadas en la gestión de límites de crédito.",
        "reporteria_bi": "Análisis de capital, modelos de riesgo crediticio."
      }
    }
  },
  "LCT_TIPO_AJUSTE": {
    "descripcion": "Tipo de ajuste realizado al límite de crédito (ej., 'Aumento', 'Disminución', 'Renovación').",
    "usuarios_consumen": {
      "Análisis de Riesgo": {
        "proposito": "Entender las razones detrás de los cambios en los límites y su correlación con el comportamiento de pago y riesgo.",
        "reporteria_bi": "Reportes de ajustes por tipo, análisis de impacto de los ajustes."
      },
      "Marketing y Ventas": {
        "proposito": "Identificar oportunidades para ofrecer aumentos de límite a clientes de bajo riesgo.",
        "reporteria_bi": "Segmentación de clientes para ofertas de límite, campañas de cross-selling."
      }
    }
  },
  "LCT_ESTADO": {
    "descripcion": "Estado del registro del ajuste de límite (ej., 'Aplicado', 'Pendiente', 'Rechazado', 'Anulado').",
    "usuarios_consumen": {
      "Operaciones de Tarjetas": {
        "proposito": "Monitorear el procesamiento de las solicitudes de ajuste de límite y resolver problemas.",
        "reporteria_bi": "Dashboards de solicitudes de límite, reportes de eficiencia de procesamiento."
      }
    }
  },
  "RT_ID": {
    "descripcion": "Identificador único de cada recompensa o beneficio otorgado a una tarjeta. Clave primaria de la tabla.",
    "usuarios_consumen": {
      "Marketing y Fidelización": {
        "proposito": "Auditar la emisión de recompensas y asegurar la correcta asignación.",
        "reporteria_bi": "Informes de recompensas emitidas, trazabilidad de beneficios."
      }
    }
  },
  "RT_CODTARJETA": {
    "descripcion": "Código único de la tarjeta que recibió la recompensa. Clave foránea que referencia a la tabla de Tarjetas.",
    "usuarios_consumen": {
      "Atención al Cliente": {
        "proposito": "Consultar las recompensas obtenidas por un cliente en su tarjeta.",
        "reporteria_bi": "Historial de recompensas del cliente, estado de cuenta de puntos/beneficios."
      },
      "Marketing y Fidelización": {
        "proposito": "Analizar la participación de las tarjetas en programas de recompensa y su impacto en la retención.",
        "reporteria_bi": "Dashboards de participación en programas, análisis de cliente activo."
      }
    }
  },
  "RT_FECHA": {
    "descripcion": "Fecha y hora en que se otorgó la recompensa.",
    "usuarios_consumen": {
      "Análisis de Negocio": {
        "proposito": "Analizar la estacionalidad y el impacto de las campañas de recompensas.",
        "reporteria_bi": "Informes de recompensas por periodo, análisis de eficacia de campañas."
      }
    }
  },
  "RT_TIPO_RECOMPENSA": {
    "descripcion": "Tipo de recompensa otorgada (ej., 'Puntos de fidelidad', 'Cashback', 'Millas', 'Descuento').",
    "usuarios_consumen": {
      "Marketing y Fidelización": {
        "proposito": "Evaluar la popularidad y el impacto de diferentes tipos de recompensas en el comportamiento del cliente.",
        "reporteria_bi": "Análisis de preferencia de recompensas, modelos de atribución de recompensas."
      },
      "Finanzas": {
        "proposito": "Calcular la provisión y el coste asociado a los diferentes programas de recompensas.",
        "reporteria_bi": "Informes de pasivos por recompensas, análisis de costos de programas."
      }
    }
  },
  "RT_VALOR": {
    "descripcion": "Valor monetario o en puntos de la recompensa otorgada.",
    "usuarios_consumen": {
      "Finanzas": {
        "proposito": "Monitorear el coste total de los programas de recompensas y su rentabilidad.",
        "reporteria_bi": "Reportes de gasto en recompensas, análisis de ROI de programas de fidelización."
      },
      "Marketing y Fidelización": {
        "proposito": "Optimizar el valor de las recompensas para maximizar el engagement del cliente y la rentabilidad.",
        "reporteria_bi": "Modelado de valor de recompensa, análisis de redención."
      }
    }
  },
  "RT_ESTADO": {
    "descripcion": "Estado actual de la recompensa (ej., 'Canjeada', 'Pendiente', 'Expirada', 'Anulada').",
    "usuarios_consumen": {
      "Operaciones de Recompensas": {
        "proposito": "Monitorear el ciclo de vida de las recompensas, gestionar canjes y resolver incidencias.",
        "reporteria_bi": "Dashboards de estado de recompensas, reportes de redención."
      },
      "Atención al Cliente": {
        "proposito": "Informar al cliente sobre el estado de sus recompensas y ayudar en el proceso de canje.",
        "reporteria_bi": "Consulta de recompensas disponibles y canjeadas."
      }
    }
  },
  "TC_CODTARJETA": {
    "descripcion": "Código único alfanumérico que identifica de manera inequívoca cada tarjeta de crédito emitida. Es el identificador principal de la tarjeta.",
    "usuarios_consumen": {
      "Atención al Cliente": {
        "proposito": "Localizar y gestionar la cuenta de tarjeta de crédito del cliente para consultas, disputas o solicitudes.",
        "reporteria_bi": "Sistemas de CRM, dashboards de gestión de cliente."
      },
      "Operaciones de Tarjetas": {
        "proposito": "Monitorear la actividad transaccional, estados y límites asociados a una tarjeta específica.",
        "reporteria_bi": "Reportes de transacciones por tarjeta, seguimiento de incidencias."
      },
      "Análisis de Fraude": {
        "proposito": "Identificar patrones de gasto o uso anómalos asociados a una tarjeta en particular para detectar fraudes.",
        "reporteria_bi": "Sistemas de detección de fraude, alertas por tarjeta."
      }
    }
  },
  "TC_INTERES": {
    "descripcion": "Tasa de interés nominal anual aplicada a los saldos pendientes de la tarjeta de crédito. Puede variar según el tipo de tarjeta, el perfil del cliente o las condiciones del mercado.",
    "usuarios_consumen": {
      "Análisis Financiero": {
        "proposito": "Calcular los ingresos por intereses generados por la cartera de tarjetas de crédito y evaluar la rentabilidad del producto.",
        "reporteria_bi": "Informes de ingresos por intereses, análisis de rentabilidad por producto."
      },
      "Gestión de Riesgos": {
        "proposito": "Evaluar la exposición al riesgo de tasa de interés y su impacto en la capacidad de pago de los clientes.",
        "reporteria_bi": "Modelos de riesgo crediticio, análisis de sensibilidad de tasas."
      },
      "Producto y Marketing": {
        "proposito": "Definir estrategias de precios, comparar competitividad de tasas y diseñar ofertas promocionales.",
        "reporteria_bi": "Análisis de competitividad de productos, dashboards de pricing."
      }
    }
  },
  "TC_PERFIL_IDEAL": {
    "descripcion": "Clasificación o segmento que describe el perfil de cliente al que idealmente está dirigida esta tarjeta de crédito (ej., 'Joven Profesional', 'Viajero Frecuente', 'Consumidor de Alto Gasto', 'Cliente de Bajo Riesgo').",
    "usuarios_consumen": {
      "Marketing y Ventas": {
        "proposito": "Dirigir campañas de adquisición y retención a los segmentos de clientes más adecuados para cada tipo de tarjeta.",
        "reporteria_bi": "Segmentación de mercado, análisis de efectividad de campañas."
      },
      "Desarrollo de Producto": {
        "proposito": "Diseñar y adaptar las características y beneficios de la tarjeta para que se ajusten mejor a las necesidades y expectativas de su público objetivo.",
        "reporteria_bi": "Estudios de mercado, perfiles de cliente ideal."
      },
      "Análisis de Negocio": {
        "proposito": "Evaluar el rendimiento de las tarjetas por perfil de cliente, identificando los segmentos más rentables o problemáticos.",
        "reporteria_bi": "Dashboards de rendimiento por segmento, análisis de rentabilidad por cliente."
      }
    }
  },
  "TC_SALDO_COMPRAS": {
    "descripcion": "Monto total del saldo pendiente generado por compras realizadas con la tarjeta de crédito. No incluye avances de efectivo ni cargos financieros.",
    "usuarios_consumen": {
      "Finanzas": {
        "proposito": "Monitorear la deuda de consumo, proyectar ingresos por pagos de compras y evaluar la salud financiera de la cartera.",
        "reporteria_bi": "Estados de cuenta, informes de deuda por tipo de transacción."
      },
      "Riesgos Crediticios": {
        "proposito": "Evaluar el nivel de endeudamiento de los clientes y su capacidad de pago de la deuda por compras.",
        "reporteria_bi": "Reportes de exposición al crédito, análisis de utilización de línea."
      },
      "Marketing": {
        "proposito": "Identificar clientes con alto volumen de compras para ofrecerles beneficios o programas de fidelidad.",
        "reporteria_bi": "Segmentación de clientes por volumen de gasto, campañas de recompensas."
      }
    }
  },
  "TC_SALDO_B": {
    "descripcion": "Monto total del saldo pendiente proveniente de Avances de Efectivo (o 'Cash Advance') realizados con la tarjeta de crédito. Estos saldos suelen tener condiciones de interés y comisiones diferentes a las compras.",
    "usuarios_consumen": {
      "Finanzas": {
        "proposito": "Seguimiento de los saldos de avances de efectivo, que a menudo tienen tasas de interés más altas y generan mayores ingresos por intereses.",
        "reporteria_bi": "Informes de ingresos por avances de efectivo, análisis de productos financieros."
      },
      "Gestión de Riesgos": {
        "proposito": "Analizar el comportamiento de los clientes que utilizan avances de efectivo, ya que puede ser un indicador de riesgo de liquidez.",
        "reporteria_bi": "Modelos de riesgo, análisis de comportamiento de pago por tipo de saldo."
      },
      "Cobranzas": {
        "proposito": "Priorizar la gestión de cobro de estos saldos, dada su naturaleza y potencial de morosidad.",
        "reporteria_bi": "Reportes de cartera morosa por tipo de saldo."
      }
    }
  },
  "TC_SALDO_A": {
    "descripcion": "Monto total del saldo pendiente generado por la aplicación de Intereses y Comisiones a la tarjeta de crédito. Incluye intereses sobre compras, intereses sobre avances, comisiones por mora, anualidades, etc.",
    "usuarios_consumen": {
      "Finanzas": {
        "proposito": "Monitorear la composición del saldo de la tarjeta y los ingresos generados por cargos financieros.",
        "reporteria_bi": "Análisis de rentabilidad por componente de saldo, informes de ingresos por comisiones."
      },
      "Cumplimiento y Legal": {
        "proposito": "Asegurar que los cargos por intereses y comisiones se aplican de acuerdo con las políticas y regulaciones vigentes.",
        "reporteria_bi": "Informes de auditoría de cargos, seguimiento de quejas por comisiones."
      },
      "Atención al Cliente": {
        "proposito": "Explicar al cliente la composición de su saldo y los cargos aplicados.",
        "reporteria_bi": "Detalle de estado de cuenta, desglose de cargos."
      }
    }
  },
  "TC_SALDOPROM_COMPRAS": {
    "descripcion": "Saldo promedio mensual de las compras realizadas con la tarjeta de crédito. Se utiliza para calcular intereses sobre saldos promedio o para análisis de comportamiento a largo plazo.",
    "usuarios_consumen": {
      "Análisis Financiero": {
        "proposito": "Cálculo de ingresos por intereses más precisos, basados en el saldo promedio a lo largo del ciclo de facturación.",
        "reporteria_bi": "Modelos de ingresos proyectados, análisis de efectividad de las tasas de interés."
      },
      "Marketing y Riesgos": {
        "proposito": "Segmentar clientes por su nivel de actividad y endeudamiento promedio, lo que puede indicar su valor o su riesgo a largo plazo.",
        "reporteria_bi": "Segmentación RFM (Recency, Frequency, Monetary), análisis de valor de vida del cliente (CLTV)."
      }
    }
  },
  "TC_PLASTICO": {
    "descripcion": "Estado físico o tipo de plástico de la tarjeta (ej., 'Activo', 'Inactivo', 'Vencido', 'Robado', 'Perdido', 'Dañado', 'Renovado'). Indica la validez y operatividad del medio físico de pago.",
    "usuarios_consumen": {
      "Operaciones de Tarjetas": {
        "proposito": "Gestionar el ciclo de vida del plástico de la tarjeta, incluyendo emisiones, renovaciones, reemplazos y bloqueos.",
        "reporteria_bi": "Dashboards de inventario de tarjetas, reportes de ciclo de vida del plástico."
      },
      "Atención al Cliente": {
        "proposito": "Informar al cliente sobre el estado de su tarjeta física y gestionar solicitudes de reemplazo o bloqueo.",
        "reporteria_bi": "Sistemas de soporte al cliente, historial de plástico de tarjeta."
      },
      "Análisis de Fraude": {
        "proposito": "Monitorear los estados de 'Robado' o 'Perdido' para prevenir transacciones fraudulentas.",
        "reporteria_bi": "Alertas de seguridad, reportes de tarjetas bloqueadas por fraude."
      }
    }
  }
}


    const cards = document.querySelectorAll(".cards_handler_card");

    cards.forEach(card => {
        card.addEventListener("click", async () => {
            const tableName = card.dataset.tableName;

            try {
                // Obtener columnas
                const response = await fetch("/obtener_columnas", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ table_name: tableName })
                });

                const data = await response.json();

                if (data.status === "ok") {
                    mostrarColumnasEnCatalogo(data.columnas, tableName);
                } else {
                    alert("Error al obtener columnas: " + data.mensaje);
                }

                // Obtener perfilado
                const perfilResponse = await fetch(`/perfilar_tabla?table_name=${encodeURIComponent(tableName)}`);
                const perfilData = await perfilResponse.json();

                if (perfilData.success) {
                    mostrarPerfiladoTabla(perfilData.profile_data);
                } else {
                    alert("Error al obtener perfilado: " + perfilData.error);
                }

            } catch (error) {
                console.error("Error al hacer la solicitud:", error);
                alert("Error de conexión con el servidor.");
            }
        });
    });

function mostrarInformacionColumna(nombreColumna) {
    const info = gobJSON[nombreColumna];
    console.log(nombreColumna)
    console.log(gobJSON[nombreColumna])

    const descContainer = document.querySelector(".information_container_description span");
    const detailsContainer = document.querySelector(".information_container_details");

    if (!info) {
        descContainer.textContent = "No hay descripción disponible para esta columna.";
        detailsContainer.innerHTML = "";
        return;
    }

    descContainer.textContent = info.descripcion;

    // Renderizar los consumidores
    let html = "<h3>Usuarios / Áreas que Consumen esta Columna:</h3>";

    for (const [area, data] of Object.entries(info.usuarios_consumen)) {
        html += `<div class="detail_container_handler">`
        html += `<label>🏢 ${area}:</label>`;
        html += `<div class="detail_element">
                    <label>💡 Propósito:</label>
                    <span>${data.proposito}</span>
                </div>`;
        html += `<div class="detail_element">
                    <label>🏆 Reportería / BI:</label>
                    <span>${data.reporteria_bi}</span>
                </div>`;
        html += `</div>`
    }

    detailsContainer.innerHTML = html;
}

function mostrarPerfiladoTabla(profileData) {
    const tableBody = document.getElementById("profile_table_body");
    tableBody.innerHTML = ""; // Limpiar anteriores

    profileData.forEach(row => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${row.Columna}</td>
            <td>${row["Tipo de Dato"]}</td>
            <td>${row["Valores Nulos (%)"]}</td>
            <td>${row["Duplicados"]}</td>
            <td>${row["Valores Únicos"]}</td>
        `;

        tableBody.appendChild(tr);
    });

    // Mostrar sección del perfilado
    document.getElementById("table_profile_container").style.display = "block";
}

function mostrarColumnasEnCatalogo(columnas, tabla) {
    const container = document.getElementById("columns_container");
    container.innerHTML = ""; // Limpiar columnas anteriores

    columnas.forEach(col => {
        const label = document.createElement("label");
        label.textContent = `${col}`;
        label.dataset.columna = col;
        label.classList.add("columna-label");

        // Escuchar clic en la columna
        label.addEventListener("click", () => {
            mostrarInformacionColumna(col);
        });

        container.appendChild(label);
    });


    // Mostrar contenedor con columnas
    document.getElementById("catalog_detail_container_info").style.display = "flex";
    // Ocultar mensaje de "no seleccionada"
    document.getElementById("catalog_detail_container_no_selection").style.display = "none";

    console.log(`Columnas de la tabla ${tabla}:`, columnas);
}
})

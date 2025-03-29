# Estructura de Google Sheets para Estrategias de Inversión

## URL de Ejemplo
```
https://sheets.googleapis.com/v4/spreadsheets/1ZZZ-ejemplo-id-de-sheet-XXXX/values/estrategias_inversion?key=TU_API_KEY
```

## Preparación de la hoja de cálculo

1. Crea una nueva hoja de cálculo en Google Sheets
2. Nombra la hoja principal como "estrategias_inversion"
3. Configura la hoja como "Pública en la web" desde el menú Archivo > Compartir > Publicar en la web
4. Configura los encabezados según la estructura abajo explicada
5. Obtén el ID de la hoja de tu URL (es la parte larga entre /d/ y /edit)
6. Configura una clave de API de Google para Sheets API en la consola de Google Cloud Platform

## Estructura de Datos

La hoja de cálculo debe tener la siguiente estructura:

| id | label | icon | description | broker_name | annual_rate |
|----|-------|------|-------------|-------------|-------------|
| very_conservative | Muy conservadora | shield-check | Menor riesgo, rendimientos más estables pero más bajos. Ideal para quienes priorizan la seguridad. | Mercado Pago | 52 |
| very_conservative | Muy conservadora | shield-check | Menor riesgo, rendimientos más estables pero más bajos. Ideal para quienes priorizan la seguridad. | Personal Pay | 50 |
| very_conservative | Muy conservadora | shield-check | Menor riesgo, rendimientos más estables pero más bajos. Ideal para quienes priorizan la seguridad. | Ualá | 49 |
| conservative | Conservadora | shield-alert | Equilibrio entre riesgo y rendimiento. Buena opción para la mayoría de los inversores. | Bull Market | 62 |
| conservative | Conservadora | shield-alert | Equilibrio entre riesgo y rendimiento. Buena opción para la mayoría de los inversores. | Cocos Capital | 60 |
| moderate | Moderada | trending-up | Mayor potencial de rendimiento con mayor volatilidad. Para quienes pueden asumir más riesgo. | IOL | 72 |
| moderate | Moderada | trending-up | Mayor potencial de rendimiento con mayor volatilidad. Para quienes pueden asumir más riesgo. | Balanz | 68 |
| aggressive | Agresiva | rocket | Máximo riesgo con expectativa de altos rendimientos. Solo para inversores experimentados. | PPI | 95 |
| aggressive | Agresiva | rocket | Máximo riesgo con expectativa de altos rendimientos. Solo para inversores experimentados. | Balanz | 85 |

## Explicación de columnas

1. **id**: Identificador único para el tipo de estrategia (en formato snake_case).
2. **label**: Nombre mostrado en la UI para el tipo de estrategia.
3. **icon**: Nombre del icono a utilizar (referencia a los iconos de Lucide).
4. **description**: Descripción detallada del tipo de estrategia.
5. **broker_name**: Nombre del broker que ofrece esta estrategia.
6. **annual_rate**: Tasa anual de rendimiento estimado (valor numérico, sin el símbolo %).

## Nombres de iconos disponibles

Los siguientes nombres de iconos están soportados en la aplicación:

- `trending-up` - Gráfica ascendente
- `shield-alert` - Escudo con alerta
- `shield-check` - Escudo con check
- `target` - Diana
- `dollar-sign` - Símbolo de dólar
- `briefcase` - Maletín
- `piggy-bank` - Alcancía
- `rocket` - Cohete
- `settings` - Configuración
- `bar-chart` - Gráfico de barras
- `line-chart` - Gráfico de líneas
- `scale` - Balanza

## Notas importantes

1. Cada estrategia puede tener múltiples brokers, por lo que se repite la fila con los mismos valores para id, label, icon y description, pero con diferentes valores para broker_name y annual_rate.
2. Las tasas anuales deben ser números sin el símbolo %.
3. La aplicación calculará automáticamente la tasa mensual.
4. El orden de los elementos en la hoja determinará el orden en la UI.
5. Asegúrate de que no haya filas vacías en medio de los datos. 
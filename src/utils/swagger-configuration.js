export const swaggerConfiguration = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación API e-commerce PNAHRA',
            description: 'e-Commerce de venta de productos artesanales en Crochet'
        }
    },
    apis: ['src/docs/**/*.yaml']
}
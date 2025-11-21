import { z } from 'zod'

const maxSellingDate = new Date(); // Hoje
const minManufactureDate = new Date(1960, 0, 1); // Data mínima para 1 de janeiro de 1960

const maxYearManufacture = new Date();
maxYearManufacture.setFullYear(maxYearManufacture.getFullYear());

// Extrair apenas o ano para comparação
const minYear = minManufactureDate.getFullYear();
const maxYear = maxYearManufacture.getFullYear();

// Para selling_date
const storeOpen = new Date(2020, 3, 20); // Esta data consta a abertura da loja (20/03/2020)

// Disponibiliza a lista de cores válidas do CarsForm.jsx
const validColors = [
  'AMARELO', 'AZUL', 'BRANCO', 'CINZA', 'DOURADO', 
  'LARANJA', 'MARROM', 'PRATA', 'PRETO', 'ROSA', 
  'ROXO', 'VERDE', 'VERMELHO'
]

const Car = z.object({
  brand: z.string()
    .trim()  // Retira espaços em branco
    .min(1, { message: 'A marca deve ter, no mínimo, 1 caractere.' })
    .max(25, { message: 'A marca pode ter, no máximo, 25 caracteres.' }),
  
  model: z.string()
    .trim()  // Retira espaços em branco
    .min(1, { message: 'O modelo deve ter, no mínimo, 1 caractere.' })
    .max(25, { message: 'O modelo pode ter, no máximo, 25 caracteres.' }),
  
  color: z.enum(validColors, { 
    message: 'Cor inválida ou não informada.' 
  }),
  
  year_manufacture: z.coerce.number()
    .int({ message: 'O ano de fabricação deve ser um número inteiro.' })
    .min(minYear, { message: 'O ano de fabricação deve ser a partir de 1960.' })
    .max(maxYear, { message: `O ano de fabricação não pode ser maior que o ano atual (${maxYear}).` }),
  
  imported: z.boolean({
    message: 'O campo importado deve ser um valor igual a (verdadeiro ou falso).'
  }),
  
  plates: z.string()
    .transform(val => val.replace('_', ''))
    // Depois de um transform(), o Zod não permite usar length(). Por isso,
    // Vamos usar uma função customizada com refine() para validar o
    // tamanho do valor
    .transform(val => val.trim())
    .refine(val => val.length === 8, {
      message: 'O número da placa deve ter 8 digitos.'
  }),
  
  selling_date: z.coerce.date()
    .min(storeOpen, {
      message: 'A data de venda não pode ser antes da data de abertura da loja que é em (20/03/2020).'
    })
    .max(maxSellingDate, {
      message: 'A data de venda não pode ser depois da data atual.'
    })
    .nullish(), // Campo opcional, se não quiser não precisa preencher...
  
  selling_price: z.coerce.number()
    .gte(5000, { message: 'O valor de venda tem que ser de no mínimo R$ 5.000,00. para ser aceito'  })
    .lte(5000000, { message: 'O valor de venda tem que ser de no máximo R$ 5.000.000,00. para ser aceito' })
    .nullish() // Campo opcional, se não quiser não precisa preencher...
})

export default Car
var fs = require("fs")
var oboe = require('oboe')
var deps = require('./deps')
var cities = require('./cities')

module.exports.run = function() {

  var promise = new Promise(function(resolve, reject) {
    var contributions = 'contribuciones,_donaciones_y_créditos,_en_dinero_o_especie,_que_realicen_los_particulares_(anexo_5.2_b)'
    var capital = 'créditos_o_aportes_que_provengan_del_patrimonio_de_los_candidatos,_de_sus_conyuges__o_de_sus_compañeros_permanentes_o_de_sus_parientes_(anexo_5.1_b).'
    var adds = 'gastos_de_propaganda_electoral_(anexo_5.7_b)'
    var invesments = 'inversión_en_materiales_y_publicaciones'
    var totalOutcoming = 'total_de_los_gastos_de_la_campaña'
    var totalIncoming = 'total_de_los_ingresos_de_la_campaña'
    var depsTotalOutIncoming = {}
    var lightData = {}

    var maxIncome = 0
    var minIncome = 0
    var idDepMax = -1

    oboe(fs.createReadStream('./data.json'))
      .node('data.*', function(candidate) {
        var amounts = function()
        {
          depsTotalOutIncoming[candidate.IdDepartamento].id = candidate.IdDepartamento
          depsTotalOutIncoming[candidate.IdDepartamento].income += candidate.formulario5[totalIncoming] || 0
          depsTotalOutIncoming[candidate.IdDepartamento].outcome += candidate.formulario5[totalOutcoming] || 0

          lightData[candidate.IdDepartamento].income += candidate.formulario5[totalIncoming] || 0
          lightData[candidate.IdDepartamento].outcome += candidate.formulario5[totalOutcoming] || 0

          if(maxIncome < depsTotalOutIncoming[candidate.IdDepartamento].income) {
            maxIncome = depsTotalOutIncoming[candidate.IdDepartamento].income
            idDepMax = candidate.IdDepartamento
          }
          if(minIncome > depsTotalOutIncoming[candidate.IdDepartamento].income) {
            minIncome = depsTotalOutIncoming[candidate.IdDepartamento].income
          }

          depsTotalOutIncoming[candidate.IdDepartamento].contributions += candidate.formulario5[contributions] || 0
          depsTotalOutIncoming[candidate.IdDepartamento].capital += candidate.formulario5[capital] || 0
          depsTotalOutIncoming[candidate.IdDepartamento].adds += candidate.formulario5[adds] || 0
          depsTotalOutIncoming[candidate.IdDepartamento].invesments += candidate.formulario5[invesments] || 0

          if(candidate.formulario5[totalOutcoming] !== 0 || candidate.formulario5[totalIncoming] !== 0)
          {
            depsTotalOutIncoming[candidate.IdDepartamento].candidates.push(candidate)
          }
        }.bind(this)

        if(!(candidate.IdDepartamento in depsTotalOutIncoming))
        {
          lightData[candidate.IdDepartamento] = {
            income: 0,
            outcome: 0
          }

          depsTotalOutIncoming[candidate.IdDepartamento] = {
            name: deps[candidate.IdDepartamento],
            income: 0,
            outcome: 0,
            noData: 0,
            contributions: 0,
            capital: 0,
            adds: 0,
            invesments: 0,
            candidates: []
          }

          amounts()

          if(candidate.formulario5[totalOutcoming] === 0 && candidate.formulario5[totalIncoming] === 0)
          {
            depsTotalOutIncoming[candidate.IdDepartamento].noData += 1
          }
        }
        else
        {
          amounts()
        }

        if(candidate.formulario5[totalOutcoming] === 0 && candidate.formulario5[totalIncoming] === 0)
        {
          return oboe.drop
        }

      })
      .fail(function(error) {
        reject(error)
      })
      .done(function(finalJson) {
        var finalJson = {
          data: depsTotalOutIncoming,
          maxIncome: maxIncome,
          minIncome: minIncome,
          idDepMax: idDepMax,
          lightData: lightData
        }

        // Create finalJsonData.json file
        fs.writeFile("./finalJsonData.json", JSON.stringify(finalJson), "utf8", function(err) {
          if(err) {
            return err;
          }

          resolve(finalJson)
        })
      })
  })

  return promise
}
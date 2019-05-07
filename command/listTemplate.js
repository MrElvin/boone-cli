const Table = require('cli-table')
const tpl = require('../tpl')

module.exports = function () {
  const table = new Table({
    head: ['Index', 'Template', 'repoUrl'],
    colWidths: [10, 20, 50]
  })
  const list = Object.keys(tpl).map((k, i) => [i, k, tpl[k].repoUrl])
  table.push(...list)
  console.log(table.toString())
}

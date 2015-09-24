'use strict'
var util = require('util')
var path = require('path')
var yeoman = require('yeoman-generator')

var MishlibGenerator = module.exports = function MishlibGenerator (args, options, config) {
  yeoman.generators.Base.apply(this, arguments)

  this.on('end', function () {
    this.installDependencies({
      skipInstall: options['skip-install']
    })
  })

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')))
}

util.inherits(MishlibGenerator, yeoman.generators.Base)

MishlibGenerator.prototype.askFor = function askFor () {
  var cb = this.async()

  // have Yeoman greet the user.
  console.log(this.yeoman)

  var prompts = [
    {
      type: 'input',
      name: 'moduleName',
      message: 'node.js module name:',
      default: path.basename(process.cwd())
    },
    {
      type: 'input',
      name: 'moduleDesc',
      message: 'Module description'
    },
    {
      type: 'input',
      name: 'keywords',
      message: 'Module keywords',
      filter: function (value) {
        if (typeof value === 'string') {
          value = value.split(',')
        }
        return value
          .map(function (val) {
            return val.trim()
          })
          .filter(function (val) {
            return val.length > 0
          })
      }
    }
  ]

  this.prompt(prompts, function (props) {
    this.moduleName = this._.slugify(props.moduleName)
    this.moduleVarName = this._.camelize(props.moduleName)
    this.moduleDesc = props.moduleDesc
    this.keywords = props.keywords

    this.dequote = function (str) {
      return str.replace(/\"/gm, '\\"')
    }

    cb()
  }.bind(this))
}

MishlibGenerator.prototype.build = function build () {
  this.template('_package.json', 'package.json')

  this.copy('gitignore', '.gitignore')
  this.template('README.md', 'README.md')
}

MishlibGenerator.prototype.testFrameworks = function mocha () {
  this.mkdir('specs')
  this.mkdir('specs/unit')
  this.mkdir('specs/integration')
  this.mkdir('lib')
  this.mkdir('circle')

  this.copy('npmignore', '.npmignore')
  this.copy('circle.yml', 'circle.yml')
  this.copy('npmlogin.sh', 'circle/npmlogin.sh')
  this.copy('lib.js', 'lib/index.js')
  this.template('test.js', 'specs/unit/indexTests.js')
}

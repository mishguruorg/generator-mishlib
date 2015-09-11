/*global describe, beforeEach, it*/
'use strict'

var path = require('path')
var helpers = require('yeoman-generator').test

describe('mishlib generator', function () {
  var tempPath = path.join(__dirname, '..', 'temp')
  beforeEach(function (done) {
    helpers.testDirectory(tempPath, function (err) {
      if (err) {
        return done(err)
      }

      this.app = helpers.createGenerator('mishlib:app', [
        '../app'
      ], [], { 'skip-install': true })
      done()
    }.bind(this))
  })

  it('creates expected files', function (done) {
    var expected = [
      'lib/index.js',
      'specs/unit/indexTests.js',
      '.gitignore',
      ['package.json', /"name": "@mishguru\/mymodule"/],
      'README.md'
    ]

    helpers.mockPrompt(this.app, {
      'moduleName': 'mymodule',
      'moduleDesc': 'awesome module',
      'keywords': 'something'
    })

    this.app.run({}, function () {
      expected.forEach(function (file) {
        if (typeof file === 'string') {
          helpers.assertFile(file)
        } else if (Array.isArray(file)) {
          helpers.assertFileContent(file[0], file[1])
        }
      })
      done()
    })
  })
})

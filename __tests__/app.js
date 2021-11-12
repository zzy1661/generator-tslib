'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('@bressanone/generator-tslib:app', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .withPrompts({ name: 'Dictionary' });
  });

  it('creates files', () => {
    assert.file(['dictionary/package.json']);
  });
  it('template compiled',()=>{
    assert.fileContent('dictionary/package.json', /dictionary/g);
  })
});

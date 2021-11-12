'use strict';
const Generator = require('yeoman-generator');
const yosay = require('yosay');
const validateProjectName = require('validate-npm-package-name');

module.exports = class extends Generator {
  prompting() {
    this.log(
      yosay(`creating a ts lib project`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'lib name (lowercase)',
        validate(input){
          if(!input.trim()) {
            return 'name is required'
          }

          const validationResult = validateProjectName(input);
          if(!validationResult.validForNewPackages) {
            return 'invalid name'
          }

          return true;
        }
      }
    ];

    return this.prompt(prompts).then((props) => {
      this.props = props;
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath(),
      this.destinationPath(`./${this.props.name.toLowerCase()}`),{
        name:this.props.name.toLowerCase(),
        gitname:this.user.git.name(),
        email:this.user.git.email()
      }
    );
  }


};

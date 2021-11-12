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
      }, {
        type:'confirm',
        name:'useGitName',
        message:'use git config.name & email in pkgJson.author',
        sotre:true,
      },{
        type:'input',
        name:'authorName',
        message:'author name',
        store:true,
        when(ans) {
          return !ans.useGitName
        }
      }, {
        type:'input',
        name:'authorEmail',
        message:'author email',
        store:true,
        when(ans){
          return !ans.useGitName
        }
      }
    ];

    return this.prompt(prompts).then((props) => {
      this.props = props;
    });
  }

  writing() {
    const {name,useGitName,authorEmail='',authorName=''} = this.props;
    this.fs.copyTpl(
      this.templatePath(),
      this.destinationPath(`./${name.toLowerCase()}`),{
        name:name.toLowerCase(),
        gitname:useGitName?this.user.git.name():authorName,
        email:useGitName?this.user.git.email():authorEmail
      }
    );
  }


};

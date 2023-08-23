let mainCSS = ["app.scss"];
let mainJS = ["app.js"];
let mainURL = 'http://localhost:3000';

module.exports = function(grunt){
  grunt.initConfig({
    sass:{  // SASS
      dev:{
        options:{
          style:"expanded"
          ,sourcemap:"none"
        },
        files:[{
          expand: true
          ,cwd:"Modules/SASS"
          // ,src:[""]
          ,src:mainCSS
          ,dest:"_css"
          ,ext:".css"
        }]
      },
      devall:{
        options:{
          style:"expanded"
          ,sourcemap:"none"
        },
        files:[{
          expand:true
          ,cwd:"Modules/SASS"
          ,src:["*.scss"]
          ,dest:"_css"
          ,ext:".css"
        }]
      },
      release:{
        options:{
          style:"compressed"
          ,sourcemap:"none"
        },
        files:[{
          expand:true
          ,cwd:"Modules/SASS"
          ,src:["*.scss"]
          ,dest:"_css"
          ,ext:".css"
        }]
      }
    },
    uglify:{    // javascript
      dev:{
        options:{
          beautify:true
          ,mangle:false
          ,compress:false
          ,sourceMap:false
          ,report:false
        },
        files:[{
          expand: true
          ,cwd:"Modules/JS"
          // ,src:[""]
          ,src:mainJS
          ,dest:"_scripts/js"
        }]
      },
      devall:{
        options:{
          beautify:true
          ,mangle:false
          ,compress:false
          ,sourceMap:false
          ,report:false
        },
        files:[{
          expand:true
          ,cwd:"Modules/JS"
          ,src:["*.js"]
          ,dest:"_scripts/js"
        }]
      },
      release:{
        options:{
          beautify:false
          ,mangle:true
          ,compress:true
          ,sourceMap:false
          ,report:false
        },
        files:[{
          expand:true
          ,cwd:"Modules/JS"
          ,src:["*.js"]
          ,dest:"_scripts/js"
        }]
      }
    },
    watch:{ // only used during development for changes to files one at a time, not for release or bulk updates!
      sass:{
        files:["Modules/SASS/*.scss", "Modules/SASS/imports/*.scss", "Modules/SASS/imports/addons/*.scss"]
        ,tasks:["sass:dev"]
        ,options:{
          spawn:false
        }
      },
      js:{
        files:["Modules/JS/*.js"]
        ,tasks:["uglify:dev"]
        ,options:{
          spawn:false
        }
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: 'Modules/SASS',
          cssDir: '_css',
          outputStyle: 'compressed'
        }
      }
    },
    browserSync: {
      bsFiles: {
        src: [
          '_css/*.css',
          '_scripts/js/*.js',
          '*.php',
          'template/*.php',
          'template-parts/**/*.php'
        ]
      },
      options: {
        watchTask: true,
        proxy:mainURL
      }
    }

  });

  // if somethign changes while we are watching, determine what happened
  grunt.event.on('watch sassWatch',function(action,filepath,target){
    var filename = filepath.split("/");
    filename = filename[(filename.length - 1)].split(".");
    switch(filename[1]){
      case "scss": // SASS
      grunt.config("sass.dev.files.0.src",[filename[0]+".scss"]);
      break;
      case "js": // Javascript
      grunt.config("uglify.dev.files.0.src",[filename[0]+".js"]);
      break;
    }
  });

  // create the release task that brings other tasks above into use all at once
  grunt.registerTask("release",function(){
    grunt.task.run("sass:release");     // SASS
    grunt.task.run("uglify:release");   // JS
  });

  // will list useful tools for the user to choose from if they have no idea what to do
  grunt.registerTask("default",function(){
    grunt.log.writeln("");
    grunt.log.writeln("**********************************");
    grunt.log.writeln("Grunt Task Runner, v1.0.0");
    grunt.log.writeln("**********************************");
    grunt.log.writeln("");
    grunt.log.writeln("Please choose from the following tasks:");
    grunt.log.writeln("> dev                : watch for changes to SASS/JS");
    grunt.log.writeln("> all                : prep SASS/JS for testing");
    grunt.log.writeln("> all-compress       : prep/compress SASS/JS for testing");
    grunt.log.writeln("> sass               : prep SASS for testing");
    grunt.log.writeln("> sass-compress      : prep/compress SASS for testing");
    grunt.log.writeln("> js                 : prep JS for testing");
    grunt.log.writeln("> js-compress        : prep/compress JS for testing");
    grunt.log.writeln("> release            : prep all SASS/JS for release");
  });

  // create the release task that brings other tasks above into use all at once
  grunt.registerTask("sync",function(){
  });

  // load required NPM's
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browser-sync');
  // grunt.loadNpmTasks('grunt-cache-control');

  // register the task runners
  //grunt.registerTask("dev",["watch:sass","watch:js"]);
  grunt.registerTask("dev",["watch"]);
  grunt.registerTask('sync', ['browserSync', 'watch', "sass:release", "uglify:release"]);
  grunt.registerTask("all",["sass:devall","uglify:devall"]);                      // dev all sass/js
  grunt.registerTask("all-compress",["sass:release","uglify:release"]);           // dev compress all sass/js
  grunt.registerTask("css",["sass:devall"]);                                     // dev only sass
  grunt.registerTask("sass-compress",["sass:release"]);                           // dev compress sass only
  grunt.registerTask("js",["uglify:devall"]);                                     // dev only js
  grunt.registerTask("js-compress",["uglify:release"]);                           // dev compress js only

}

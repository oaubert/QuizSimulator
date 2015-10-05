/**
 * Constructor of the Tools class
 * @class     <Tools> This class gathers a bunch of usefull tools
 */
TestsCoco.Tools = function() {};

/**
 * Generate a unique Id
 *
 * @method     generateUid
 * @return     {string}  Th uid generated
 */
TestsCoco.Tools.prototype.generateUid = function () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
      });
};

TestsCoco.Tools.prototype.pickRandomNumber = function (min,max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

TestsCoco.Tools.prototype.arrayUnique = function (array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

TestsCoco.Tools.prototype.randomDate = function (start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

TestsCoco.Tools.prototype.getMaxOfArray = function (numArray) {
  return Math.max.apply(null, numArray);
};

TestsCoco.Tools.prototype.getValuesOfObject = function (obj) {
    return Object.keys(obj).map(function (k) { return obj[k];});
};

/**
 * Generate an HTML line that allow to download a json file
 *
 * @method     downloadJson
 * @param      {string}  data_to_dl  The data to download
 * @param      {string}  container   The HTML container
 * @param      {string}  text       The description of the file
 * @param      {string}  filename    The filename of the data
 */
TestsCoco.Tools.prototype.downloadJson = function (data_to_dl,container,text,filename) {
    $(container).empty();

    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data_to_dl, null, 4));

    $('<a href="data:' + data + '" download="'+filename+'.json">'+text+'</a>').appendTo(container);
};

/**
 * Send data in localStorage for later use
 *
 * @method     sendToLocalStorage
 * @param      {Object}  data        Data to send
 * @param      {string}  local_name  Name in the localStorage
 */
TestsCoco.Tools.prototype.sendToLocalStorage = function(data,local_name) {
    localStorage.setItem(local_name, LZString.compress(JSON.stringify(data)));
};

/**
 * Make the transposition of an array
 *
 * @method     transpose
 * @param      {Array}  a
 * @return     {Array}  The tansposed array
 */
TestsCoco.Tools.prototype.transpose = function(a) {

    // Calculate the width and height of the Array
    var w = a.length ? a.length : 0,
        h = a[0] instanceof Array ? a[0].length : 0;

    // In case it is a zero matrix, no transpose routine needed.
    if(h === 0 || w === 0) { return []; }

    /**
    * @var {Number} i Counter
    * @var {Number} j Counter
    * @var {Array} t Transposed data is stored in this array.
    */
    var i, j, t = [];

    // Loop through every item in the outer array (height)
    for(i=0; i<h; i++) {

        // Insert a new row (array)
        t[i] = [];

        // Loop through every item per item in outer array (width)
        for(j=0; j<w; j++) {

          // Save transposed data.
          t[i][j] = a[j][i];
        }
    }

    return t;
};;

/**
 * Make the dot product of 2 vectors
 *
 * @method     dot
 * @param      {number[]}  v1      The first vector
 * @param      {number[]}  v2      The second vector
 * @return     {number}  The dot product
 */
TestsCoco.Tools.prototype.dot = function (v1,v2) {
    var res = 0;
    for(var i = 0;i < v1.length;i++) {
        res+= (v1[i]*v2[i]);
    }
    return res;
};

/**
 * Compute the norm of a vector
 *
 * @method     norm
 * @param      {number[]}  v       The vector
 * @return     {number}  The norm
 */
TestsCoco.Tools.prototype.norm = function (v) {
    return Math.sqrt(this.dot(v,v));
};

/**
 * Compute the cosine angle between 2 vectors
 *
 * @method     cosine
 * @param      {number[]}  v1      The first vector
 * @param      {number[]}  v2      The second vector
 * @return     {number}  { description_of_the_return_value }
 */
TestsCoco.Tools.prototype.cosine = function (v1,v2) {
    return (this.dot(v1,v2)/(this.norm(v1)*this.norm(v2)));
};

/**
 * Generate an array with the number of occurence of each value of <tt>tab</tt>
 *
 * @method     arrayWithProbability
 * @param      {Object}  tab     The array of probabilities
 * @return     {Array}   The array generated
 * @example    //Example
 * var data = {1:0.4,
 *             2:0.1,
 *             3:0.2,
 *             4:0.3};
 * var arr = arrayWithProbability(data);
 * console.log(arr); ( --> : [1,1,1,1,2,3,3,4,4,4])
 */
TestsCoco.Tools.prototype.arrayWithProbability = function (tab) {
    var arr = [];
    $.each(tab, function(index,value) {
        for(var i = 0; i < value; i++) {
            arr.push(index);
        }
    });
    return arr;
};

/**
 * Get a random value in an array
 *
 * @method     randomWithProbability
 * @param      {Array}  notRandomQuestions  The array
 * @return     {number}  The random value
 */
TestsCoco.Tools.prototype.randomWithProbability = function (notRandomQuestions) {
    var idx = Math.floor(Math.random() * notRandomQuestions.length);
    return notRandomQuestions[idx];
};

//Source : http://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
/**
 * Get the value of the query variable passed in the url
 *
 * @method     getQueryVariable
 * @param      {string}  variable  The variable searched
 * @return     {string}  The value of the variable
 */
TestsCoco.Tools.prototype.getQueryVariable = function (variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
    return undefined;
};

/**
 * Generate visualisation by types
 *
 * @method     visualize
 * @param      {DataVis}  visualizer  Instance of DataVis module
 * @param      {string}  type        Type of visualisation (student,teacher or algorithm visualisation)
 */
TestsCoco.Tools.prototype.visualize = function (visualizer,type) {

    var _this = this;
    function checkType() {
        if(type == 'student') {
            var user = _this.getQueryVariable('useruuid');
            var session = _this.getQueryVariable('session');
            visualizer.generateGraphStudent(user,session);
        }else if (type == 'teacher') {
            var media = _this.getQueryVariable('mediaId');
            visualizer.generateGraphTeacher(media);
        }else {
            visualizer.generateGraphVisuAlgo();
        }
    }

    var questions_filepath = "../Donnees_tests/analytics_data/questions_prod.json";
    var answers_filepath = "../Donnees_tests/analytics_data/answers_prod.json";

    if(localStorage.getItem("sim_question") !== null && localStorage.getItem("sim_answer") !== null) {
        var local_question = localStorage.getItem('sim_question');
        var local_answer = localStorage.getItem('sim_answer');
        visualizer.getAllData(JSON.parse(LZString.decompress(local_question)),JSON.parse(LZString.decompress(local_answer)));
        checkType();
    }else{
        $.when($.getJSON(questions_filepath),
               $.getJSON(answers_filepath))
            .done(function(questions,answers) {
                // Sanitize type info
                _.each(questions[0].annotations, function (a) {
                    if (a.type_title == 'Quiz')
                        a.type = 'Quiz';
                });
                _.each(answers[0], function (ans) {
                    if (ans.session === undefined)
                        ans.session = ans.date.slice(0, 10);
                });
                visualizer.getAllData(questions[0],answers[0]);
                checkType();
            });
    }
};

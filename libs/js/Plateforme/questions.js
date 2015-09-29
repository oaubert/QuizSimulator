/**
 * Constructor of the Question class
 *
 * @class      <Questions> This class allows the simulator to generate questions over documents
 */
TestsCoco.Simulator.Questions = function(){};

/**
 * Get all stopwords
 *
 * @method     getStopWords
 * @param      {Array}  data1   First set of stopwords
 * @param      {Array}  data2   Second set of stopwords
 * @return     {Array}  The array of stopwords
 */
TestsCoco.Simulator.Questions.prototype.getStopWords = function (data1,data2){
    return data1[0].split("\n").concat(data2[0].split("\n")).map(function(s){return s.trim()});
}

/**
 * Clean <tt>str</tt>
 *
 * @method     cleaningText
 * @param      {string}  str     The string to clean
 * @return     {string}  The cleaned string
 */
TestsCoco.Simulator.Questions.prototype.cleaningText = function (str){
    return str.toLowerCase()
                .replace(//g," ")
                .replace(/\n/g," ")
                .replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()\?@""]/g," ")
                .replace(/[\d]/g," ");
}

/**
 * Get all the data needed to construct questions
 *
 * @method     getDonnees
 * @param      {Object}  data    Raw input of data
 * @return     {Array} The data needed
 */
TestsCoco.Simulator.Questions.prototype.getDonnees = function (data){
    var _this = this;
    var ret = [];
    var annotations = data.annotations;
    annotations.forEach(function(elem,index){
        if(elem.meta["id-ref"] == "Slides"){
            var donnee = {};
            donnee.deb = elem.begin;
            donnee.fin = elem.end;
            var txt = elem.content.description;
            var mots = _this.cleaningText(txt).split(" ");
            donnee.texte = mots ;
            ret.push(donnee);
        }
    });
    return ret
}

/**
 * Get all the words contained in <tt>data</tt>
 *
 * @method     getAllWords
 * @param      {Object}  data    Set of words
 * @return     {Array}  All the words in data
 */
TestsCoco.Simulator.Questions.prototype.getAllWords = function (data){
    var words = [];
    data.forEach(function(value){
        words = words.concat(value.texte);
    });
    return _.uniq(words);
}

/**
 * Filter for stopwords
 *
 * @method     filterStopWords
 * @param      {string}  str     The string to filter
 * @return     {boolean} 
 */
TestsCoco.Simulator.Questions.prototype.filterStopWords = function (str){
    return !($.inArray(str,this) > -1);
}

/**
 * Filtering function
 *
 * @method     filtering
 * @param      {Object}  w       Set of words
 * @param      {Object}  stpw    Set of stopwords
 */
TestsCoco.Simulator.Questions.prototype.filtering = function (w,stpw){
    var _this = this;
    $.each(w,function(index,value){
        var tab_str = value.texte;
        var new_tab = tab_str.filter(_this.filterStopWords,stpw);
        value.texte=new_tab;
    });
}

TestsCoco.Simulator.Questions.prototype.getFrequencies = function (arr){
    var ret = {};
    arr.forEach(function(value){
        ret[value] = ret[value] ? ret[value]+1 : 1;
    });
    return ret;
}

/**
 * Generate a random time
 *
 * @method     generateTime
 * @param      {Object}  obj    
 * @return     {Date}  
 */
TestsCoco.Simulator.Questions.prototype.generateTime = function (obj){
    return _.random(obj.deb,obj.fin);
}

/**
 * Generate random text over a set of words
 *
 * @method     generateTxt
 * @param      {Array}  tab        The set of words
 * @param      {number}  l_min     Minimal length of the text
 * @param      {number}  l_max     Maximal length of the text
 * @param      {Array}  tab_other  Other set of words in wich we can pick words
 * @return     {string}  The text generated
 */
TestsCoco.Simulator.Questions.prototype.generateTxt = function (tab,l_min,l_max,tab_other){
    var words;
    var txt="";
    var long = _.random(l_min,l_max);
    
    if((tab_other != null || tab_other.length != 0 || tab_other != undefined) && (tab.length < long)){
        words = tab.concat(tab_other);
    }else{
        words = tab;
    }
    
    for(var i=0; i<=long; i++){
            var index = _.random(words.length);
            txt+= words[index]+" ";
    }
    return txt;
}

/**
 * Generate one question over a set of words
 *
 * @method     generateQuestion
 * @param      {Array}  tab_mots  Set of words
 * @param      {number}  longMin   Minimal length of sentences
 * @param      {number}  longMax   Maximal length of sentences
 * @param      {number}  nbRepMin  Minimum number of answers
 * @param      {number}  nbRepMax  Maximum number of answers
 * @param      {Array}  otherTab  Other set of words in wich we can pick words
 * @return     {Object}  The question generated
 */
TestsCoco.Simulator.Questions.prototype.generateQuestion = function (tab_mots,longMin,longMax,nbRepMin,nbRepMax,otherTab){
    var _this = this;
    var question = {};
    var enonce = _this.generateTxt(tab_mots,longMin,longMax,otherTab);
    var reponses = [];
    var nbRep = _.random(nbRepMin,nbRepMax);
    var correctRep = _.random(nbRep-1);
    for(var i = 0; i < nbRep; i++){
        var ans = {};
        var rep = _this.generateTxt(tab_mots,longMin,longMax,otherTab);
        ans.content = rep;
        if(i == correctRep){
            ans.correct = true;
        }
        reponses[i] = ans;
    }
    question.description = enonce;
    question.answers = reponses;
    return question;
}

/**
 * Generates all the questions for one document
 *
 * @method     generate
 * @param      {Object}  tab         Raw data for generation
 * @param      {string}  media       The media on wich we generate the questions
 * @param      {number}  nombre      The number of questions to generate
 * @param      {number}  longMin     The minimum length of sentences
 * @param      {number}  longMax     The maximum length of sentences
 * @param      {number}  nbRepMin    The minimum number of answers by questions
 * @param      {number}  nbRepMax    The maximum number of answers by questions
 * @param      {Array}  otherWords   Other set of words in wich we can pick words
 * @return     {Array}   The questions generated
 */
TestsCoco.Simulator.Questions.prototype.generate = function (tab,media,nombre,longMin,longMax,nbRepMin,nbRepMax,otherWords){
    var tool = new TestsCoco.Tools();
    var _this = this;
    var retour=[];
    for(var i = 0 ; i < nombre ; i++){
       var idx = _.random(tab.length-1);
       var obj = tab[idx];
       var obj_av = tab[idx-1];
       var obj_ap = tab[idx+1];
       var time = _this.generateTime(obj);
       var mots; 
       var t1 = obj.texte, t2, t3;
       if(idx > 0 && idx < tab.length - 1){
           t2 = tab[idx-1].texte;
           t3 = tab[idx+1].texte;
           mots = t2.concat(t1).concat(t3);
       }else if (idx == 0){
           t2 = tab[idx+1].texte;
           mots = t1.concat(t2);
       }else{
           t2=tab[idx-1].texte;
           mots = t1.concat(t2);
       }
       var quest= {};
       quest.content =  _this.generateQuestion(mots,longMin,longMax,nbRepMin,nbRepMax,otherWords);
       quest.begin = time;
       quest.end = time+3000;
       quest.type = "Quiz";
       quest.media = media;
       quest.id = tool.generateUid();
       retour[i] = quest;
    }

    return retour;
}

/**
 * The main function of the Questions class
 *
 * @method     main
 * @param      {Object}  stop_word1    First set of stopwords
 * @param      {Object}  stop_word2    Second set of stopwords
 * @param      {Array}  documents     All the documents on wich we generate questions
 * @param      {boolean}  other        Tell if we get words in other slides
 * @param      {number}  nb_questions  The number of question to generate in each document
 * @return     {Object}  The questions generated
 */
TestsCoco.Simulator.Questions.prototype.main = function (stop_word1,stop_word2,documents,other,nb_questions){
    var _this = this;
    var stopwords_fr = this.getStopWords(stop_word1,stop_word2);
    var allQuest = [];
    documents.forEach(function(elem){

        var media = elem.medias[0].id;
        var donnees = _this.getDonnees(elem);

        _this.filtering(donnees,stopwords_fr);
        
        var all_words = other ? _this.getAllWords(donnees) : [];
        
        allQuest = allQuest.concat(_this.generate(donnees,media,nb_questions,5,10,2,5,all_words));
    });
    
    return {"annotations" : allQuest};
    
}

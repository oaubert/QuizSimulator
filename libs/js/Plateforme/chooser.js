/**
 * Constructor of the Chooser class
 *
 * @class     <Chooser> This class is the base of the choosing algorithm behind the generation of questions of the simulator
 * 
 * @param      {number}  sim_threshold  The threshold of the similarity between two questions
 */
TestsCoco.Simulator.Chooser = function(sim_threshold){
    /**
     * @prop      {number} similarity_treshold Threshold of similarity between two questions
     */
    this.similarity_threshold = sim_threshold;
};

/**
 * Count the occurences of many properties
 *
 * @method    countOccurences
 * @param      {Object[]}  tab_ans    The array of answer to analyse
 * @param      {Object[]}  tab_quest  The array of questions to analyse
 *
 * @return     {Object}  The properties 
 */
TestsCoco.Simulator.Chooser.prototype.countOccurences = function (tab_ans,tab_quest){
 
    var ann = tab_quest.annotations;
    
    var shown_properties = ["right_answer","wrong_answer","skipped_answer"];
    var votted_properties = ["usefull","useless","skipped_vote"];
    
    var shown = {};
    var votted = {};
    var positive_vote = {};
    
    tab_ans.forEach(function(elem){
        if(jQuery.inArray(elem.property,shown_properties) != -1){
            if(elem.subject in shown){
                shown[elem.subject] = ++shown[elem.subject];
            }
            else{
                shown[elem.subject] = 1;
            }
        }
        if(jQuery.inArray(elem.property,votted_properties) != -1){
            if(elem.subject in votted){
                votted[elem.subject] = ++votted[elem.subject];
            }
            else{
                votted[elem.subject] = 1;
            }
        }
        if(elem.property=="usefull"){
            if(elem.subject in positive_vote){
                positive_vote[elem.subject] = ++positive_vote[elem.subject];
            }
            else{
                positive_vote[elem.subject] = 1;
            }
        }
    });
    
    tab_quest.forEach(function(elem){
        if(jQuery.inArray(elem.id,Object.keys(shown)) == -1){
            shown[elem.id] = 0;
        }
        if(jQuery.inArray(elem.id,Object.keys(votted)) == -1){
            votted[elem.id] = 0;
        }
        if(jQuery.inArray(elem.id,Object.keys(positive_vote)) == -1){
            positive_vote[elem.id] = 0;
        }
    });
    
    return {"shown":shown,"votted":votted,"positive_vote":positive_vote};
}

/**
 * Get the percentage of value of <tt>tab1</tt> by the value of <tt>tab2</tt>
 *
 * @method    percentage
 * @param      {Object}                tab1    The first Object
 * @param      {Object}                tab2    The second Object
 *
 * @return     {Object}  The object of percentages
 */
TestsCoco.Simulator.Chooser.prototype.percentage = function (tab1,tab2){
    var result = {};
    $.each(tab2, function(index, value) {
        if(!tab1[index]){
            result[index]=0;
        }else{
            result[index]=tab1[index] / value;
        }
    });
    return result;
}

/**
 * Get the time of each annotation in <tt>tab</tt>
 *
 * @method    getTime
 * @param      {Object}  tab
 * 
 * @return     {Object}  The times
 */
TestsCoco.Simulator.Chooser.prototype.getTime = function (tab){
    var ret={};
    var ann = tab.annotations;
    tab.forEach(function(elem){
        if(elem.type == "Quiz"){
            ret[elem.id] = elem.begin;
        }
    });
    return ret;
}

/**
 * Get the description of each annotation in <tt>tab</tt>
 *
 * @method     getEnonce
 * @param      {Object}  tab
 * @return     {Object}  The descriptions
 */
TestsCoco.Simulator.Chooser.prototype.getEnonce = function (tab){
    var ret={};
    var ann = tab.annotations;
    tab.forEach(function(elem){
        if(elem.type == "Quiz"){
            ret[elem.id] = elem.content.description;
        }
    });
    return ret;
}

/**
 * Get the sum of all vote of all the annotations in <tt>tab</tt>
 *
 * @method     positive
 * @param      {Object}  tab
 * @return     {Object}  The votes count
 */
TestsCoco.Simulator.Chooser.prototype.positive = function (tab){
    var votted_properties = ["usefull","useless","skipped_vote"];
    var res={};
    tab.forEach(function(elem){
        if($.inArray(elem.property,votted_properties) != -1){
             if(elem.subject in res){
                 res[elem.subject] += elem.value;
             }else {
                 res[elem.subject] = 0;
             }
        }
    });
    return res;
}

/**
 * Compute the syntax simimarity between two sentences using the natural library
 *
 * @method     syntax_similarity
 * @param      {String}              phrase1  The first sentence
 * @param      {String}              phrase2  The second sentence
 * @return     {number}  The syntax similarity score
 */
TestsCoco.Simulator.Chooser.prototype.syntax_similarity = function (phrase1,phrase2){
    var tool =  new TestsCoco.Tools();
    natural.PorterStemmerFr.attach();
    var p1=phrase1.tokenizeAndStem(),
        p2=phrase2.tokenizeAndStem();

    
    if(p1.length == 0 || p2.length == 0)
        return 0;

    var words=_.uniq(p1.concat(p2));


    var TfIdf = natural.TfIdf, tfidf = new TfIdf();
    tfidf.addDocument(p1);
    tfidf.addDocument(p2);
    var row =[];
    
    var j = 0;
    words.forEach(function(elem){
        var temp = [];
        tfidf.tfidfs(elem, function(i, measure) {
            temp[i]=measure;
        });
        row[j]=temp;
        ++j;
    })
    
    var column = tool.transpose(row);

    return tool.cosine(column[0],column[1]);
}

/**
 * Calculate the time similarity between two questions
 *
 * @method     time_similarity
 * @param      {number}  t_q1      The time of the first question
 * @param      {number}  t_q2      The time of the second question
 * @param      {number}  max_time  The max time of all questions
 * @return     {number}  The time similarity score
 */
TestsCoco.Simulator.Chooser.prototype.time_similarity = function (t_q1,t_q2,max_time){
    return 1 - (Math.abs((t_q1 - t_q2)) / max_time);
}

/**
 * Compute the similarity between two questions
 *
 * @method     QuestionSimilarity
 * @param      {Object}  q1      The first question
 * @param      {Object}  q2      The second question
 * @return     {number}  The similarity score
 */
TestsCoco.Simulator.Chooser.prototype.QuestionSimilarity = function (q1,q2){
    var tool = new TestsCoco.Tools();
    var max_time = tool.getMaxOfArray(tool.getValuesOfObject(this.time));
    var t_sim = this.time_similarity(this.time[q1],this.time[q2],max_time);
    var s_sim = this.syntax_similarity(this.enonces[q1],this.enonces[q2]);
    return t_sim * s_sim;
}

/**
 * Compute all the similarity of all questions
 *
 * @method     similarity
 * @param      {Object}  tab     The questions
 * @return     {Array}   The similarities
 */
TestsCoco.Simulator.Chooser.prototype.similarity = function (tab) {
    var _this = this,
        ret = [];
    
    $.each(tab, function(index, value) {
        ret[index] = [];
        $.each(tab, function(index2, value2) {
            ret[index][index2] = _this.QuestionSimilarity(index,index2);
        });
    });
    
    return ret;
}

/**
 * Get all the data needed for computing
 *
 * @method     getData
 * @param      {Object}  answers   Set of answers
 * @param      {Object}  questions   Set of questions
 */
TestsCoco.Simulator.Chooser.prototype.getData = function (answers,questions){
    
    //nombre de fois où la question à été vue
    /**
    * @prop      {Array} nb_show The number of times the questions were shown 
    */
    this.nb_shown = this.countOccurences(answers,questions).shown;
    
    //nombre total de vote que la question a reçue
    /**
    * @prop      {Array} nb_vote The total number of votes the questions received
    */
    this.nb_vote = this.countOccurences(answers,questions).votted;
    
    //nombre total de votes positif que la question a reçue
    /**
    * @prop      {Array} nb_positive_vote The total number of positive votes the questions received
    */
    this.nb_positive_vote = this.countOccurences(answers,questions).positive_vote;

    //somme de tous les votes
    /**
    * @prop      {number} vote_sum The sum of all the votes
    */
    this.vote_sum = this.positive(answers);

    //pourcentage de votes positif par rapport au nombre total de votes
    /**
    * @prop      {Array} popularity The percentage of positif votes over the total of votes
    */
    this.popularity = this.percentage(this.nb_positive_vote,this.nb_vote);

    //tableau contenant tous les timecode de début de question
    /**
    * @prop      {Array} time The time of all questions
    */
    this.time = this.getTime(questions);

    //tableau contenant tous les énoncés de questions
    /**
    * @prop      {Array} enonces The descriptions of all questions
    */
    this.enonces = this.getEnonce(questions);
    
};

/**
 * Get the score of one question
 *
 * @method     getScore
 * @param      {Object}  q       The question
 * @return     {number}  The score
 */
TestsCoco.Simulator.Chooser.prototype.getScore = function (q){
    var score = (this.nb_shown[q.id] < 5) ? 1 : this.popularity[q.id];
    return score;
}

/**
 * Get the score of all questions
 *
 * @method     getAllScores
 * @param      {Array}  tab     The array of questions
 * @return     {Object}  The scores
 */
TestsCoco.Simulator.Chooser.prototype.getAllScores = function (tab){
    var _this = this;
    var scores = {};
    $.each(tab, function(index,value){
        scores[value.id] = _this.getScore(value);
    });
    return scores;
}

/**
 * Get the probability of one question
 *
 * @method     getProba
 * @param      {Object}  q          The question
 * @param      {Object}  tab_score  The scores of the questions
 * @return     {number}  The probability of the question
 */
TestsCoco.Simulator.Chooser.prototype.getProba = function (q,tab_score){
    var tool = new TestsCoco.Tools();
    var array_score = tool.getValuesOfObject(tab_score);
    var score_sum = array_score.reduce(function(a, b) {
                                return a + b;
                    },0);
    return this.getScore(q) / score_sum ;
}

/**
 * Get the probability of all questions
 *
 * @method     getAllProba
 * @param      {Array}  tab_quest  The array of questions
 * @param      {Object}  tab_score  The scores of the questions
 * @return     {Object}  The probabilities
 */
TestsCoco.Simulator.Chooser.prototype.getAllProba = function (tab_quest,tab_score){
    var _this = this;
    var probas = {};
    $.each(tab_quest, function(index,value){
        probas[value.id] = _this.getProba(value,tab_score);
    });
    return probas;
}

/**
 * Choose the "best" questions in the set of questions provided in param
 *
 * @method     choose
 * @param      {Object}  answers            Set of answers
 * @param      {Object}  questions          Set of questions
 * @param      {number}  numberOfQuestions  The number of questions to choose
 * @return     {Array}   The choosen questions
 */
TestsCoco.Simulator.Chooser.prototype.choose = function (answers,questions,numberOfQuestions) {
    var _this = this;
    var tool = new TestsCoco.Tools();
    var questionsToDisplay = [];
    
    var sim = this.similarity(this.time);

    var scores = this.getAllScores(questions);
    
    var probas = this.getAllProba(questions,scores);

    var allQuestions = tool.arrayWithProbability(scores);
    
    do{
        var quest = tool.randomWithProbability(allQuestions);
       
        if (!_.any(questionsToDisplay,function(value){
                                                return sim[quest][value] > this.similarity_threshold;
                                        })
        ){
            questionsToDisplay.push(quest);
            allQuestions = _.filter(allQuestions,function(id){return id!=quest});
        }
        
    }while(questionsToDisplay.length < numberOfQuestions || !allQuestions)
    
    return questionsToDisplay;
}

/**
 * Get the choosen questions by the algorithm
 *
 * @method     getChoosenQuestions
 * @param      {Object}  answers                 Set of answers
 * @param      {Object}  questions               Set of questions
 * @param      {number}  numberOfQuestions  The number of questions to choose
 * @return     {Object}  The set of choosen questions
 */
TestsCoco.Simulator.Chooser.prototype.getChoosenQuestions = function (answers,questions,numberOfQuestions){

    var disp = this.choose(answers,questions,numberOfQuestions);

    var choosenQuestions = [];
    
    $.each(questions, function(index,value){
        if($.inArray(value.id,disp) != -1){
            choosenQuestions.push(value);
        }
    });
    
    return {annotations : choosenQuestions};
}

/**
 * The main function of the Chooser class
 *
 * @method     main
 * @param      {Object}  answers            Set of answers
 * @param      {Object}  questions          Set of questions
 * @param      {number}  numberOfQuestions  The number of questions to choose
 * @param      {string}  media              The medias on which we choose the questions
 * @return     {Object}  The set of questions choosed
 */
TestsCoco.Simulator.Chooser.prototype.main = function (answers,questions,numberOfQuestions,media){
    var _this = this;

    var medias = _.groupBy(questions.annotations,'media');

    this.getData(answers,medias[media]);
    
    return this.getChoosenQuestions(answers,medias[media],numberOfQuestions);
}

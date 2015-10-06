/**
 * Constructor of the Answers class
 *
 * @class     <Answers> This class allows the simulator to answer a set of questions, and also make votes on the questions
 *
 */
TestsCoco.Simulator.Answers = function(){
    this.dayInMillisecond = 86400000;
    this.hourInMillisecond = 3600000;
    this.minuteInMillisecond = 60000;
    this.answer_rate = 0.7;
};

/**
 * Generate the timecode of the answer
 *
 * @method    generateTime
 * @param      {Date}  session_start
 * @param      {Object}  question       The question to answer
 * @param      {String}  profile        The user profile
 *
 * @return     {Date}    The date of the answer
 */
TestsCoco.Simulator.Answers.prototype.generateTime = function (session_start,question,profile){
    var d = session_start.getTime(), d2;
    switch(profile) {
        case "regular":
            d += question.begin;
            break;
        case "random":
            d += _.random(question.begin,question.end);
            break;
        default:
            console.log('Profile not implemented');
    }
    d2 = new Date(d);
    return d2.toISOString();
}

/**
 * Generate the answer of the user
 *
 * @method    generateAnswer
 * @param      {Object}  question       The question to answer
 * @param      {Object}  user           The user who answer
 * @param      {Date}    session_start
 * @param      {number}  session_id
 *
 * @return     {Object}  The answer of the user
 */
TestsCoco.Simulator.Answers.prototype.generateAnswer = function (question,user,session_start,session_id){
    var ret = {};
    ret.username = user.name;
    ret.subject = question.id;
    ret.date = this.generateTime(session_start,question,user.profile);
    ret.sessionId = session_id;
    if(Math.random() < user.bias.answer_rate){
        if(Math.random() < user.bias.right_answer_rate){
            ret.property = "right_answer";
            ret.value = question.content.answers.indexOf(question.content.answers.filter(function(a){return a.correct})[0])+1;
        }else{
            ret.property = "wrong_answer";
            ret.value = _.sample(question.content.answers.map(function(value,index){
                                return (value.correct) ? -1 : index;
                            }).filter(function(i){return i>-1}));
        }

    }else{
        ret.property = "skipped_answer";
        ret.value = 0;
    }
    return ret;
}

/**
 * Generate the vote of the user
 *
 * @method    generateVote
 * @param      {Object}  question       The question to answer
 * @param      {Object}  user           The user who answer
 * @param      {Date}    session_start
 * @param      {number}  session_id
 *
 * @return     {Array}   The vote and the answer of the user
 */
TestsCoco.Simulator.Answers.prototype.generateVote = function (question,user,session_start,session_id){
    var retour;
    var vote = {};
    vote.username = user.name;
    vote.subject = question.id;
    vote.date = this.generateTime(session_start,question,user.profile);
    vote.sessionId = session_id;

    var ans = this.generateAnswer(question,user,session_start,session_id);
    if(ans.property != "skipped_answer"){
        if(Math.random() < user.bias.vote_rate){
            if(Math.random() < user.bias.useful_vote_rate){
                vote.property = "useful";
                vote.value = 1;
            }else{
                vote.property = "useless";
                vote.value = -1
            }
        }else{
            vote.property = "skipped_vote";
            vote.value = 0;
        }
        retour = [ans,vote];
    }else{
        retour = [ans];
    }

    return retour;
}

/**
 * Generate the answers for the set of questions
 *
 * @method    generate
 * @param      {Object}  question       The question to answer
 * @param      {Object}  user           The user who answer
 * @param      {Date}    session_start
 * @param      {number}  session_id
 *
 * @return     {Array}   All the answers of the user
 */
TestsCoco.Simulator.Answers.prototype.generate = function (questions,user,session_start,session_id){
    var _this = this;
    var reponses = [];

    $.each(questions,function(index,value){
        reponses = reponses.concat(_this.generateVote(value,user,session_start,session_id));
    });
    return reponses;
}

/**
 * The main function of the answers module
 *
 * @method    main
 * @param      {Array}    questions          The set of questions to answer
 * @param      {Object}   user               The user who answers to the questions
 * @param      {Object}   session            The session when the user answer to the questions
 *
 * @return     {Array}   The answers given to the set of questions passed in param
 */
TestsCoco.Simulator.Answers.prototype.main = function (questions,user,session){
    var _this = this;
    var ret = [];

    ret = ret.concat(_this.generate(questions.annotations,user,session.date,session.id));
    return ret;
}

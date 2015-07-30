TestsCoco.Simulator.Answers = function(){
    var tool = new TestsCoco.Tools();
    this.dayInMillisecond = 86400000;
    this.hourInMillisecond = 3600000;
    this.minuteInMillisecond = 60000;
    this.answer_rate = 0.7;
};

TestsCoco.Simulator.Answers.prototype.dates = function (session_start,question,profile){
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

TestsCoco.Simulator.Answers.prototype.generateAnswer = function (q,user,session_start,session_id){
    var ret = {};
    ret.username = user.name;
    ret.subject = q.id;
    ret.date = this.dates(session_start,q,user.profile);
    ret.sessionId = session_id;
    if(Math.random() < user.bias.answer_rate){
        if(Math.random() < user.bias.right_answer_rate){
            ret.property = "right_answer";
            ret.value = q.content.answers.indexOf(q.content.answers.filter(function(a){return a.correct})[0])+1;
        }else{
            ret.property = "wrong_answer";
            ret.value = _.sample(q.content.answers.map(function(value,index){
                                return (value.correct) ? -1 : index;
                            }).filter(function(i){return i>-1}));
        }
       
    }else{
        ret.property = "skipped_answer";
        ret.value = 0;
    }
    return ret;
}

TestsCoco.Simulator.Answers.prototype.generateVote = function (question,user,session_start,session_id){
    var retour;
    var vote = {};
    vote.username = user.name;
    vote.subject = question.id;
    vote.date = this.dates(session_start,question,user.profile);
    vote.sessionId = session_id;
    
    var ans = this.generateAnswer(question,user,session_start,session_id);
    if(ans.property != "skipped_answer"){
        if(Math.random() < user.bias.vote_rate){
            if(Math.random() < user.bias.usefull_vote_rate){
                vote.property = "usefull";
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

TestsCoco.Simulator.Answers.prototype.generate = function (questions,numberOfQuestions,user,session_start,session_id){
    var _this = this;
    var reponses = [];

    $.each(questions,function(index,value){
        reponses = reponses.concat(_this.generateVote(value,user,session_start,session_id));
    });
    return reponses;
}

TestsCoco.Simulator.Answers.prototype.main = function (questions,numberOfQuestions,user,session){
    var _this = this;
    var ret = [];

    ret = ret.concat(_this.generate(questions.annotations,numberOfQuestions,user,session.date,session.id));
    return ret;
}

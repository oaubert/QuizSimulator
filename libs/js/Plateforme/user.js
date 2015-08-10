/**
 * Constructor of the User class
 *
 * @class     <type> (User)
 *
 * @param      {String}  name           { description }
 * @param      {String}  profile        { description }
 * @param      {Date[]}  session_dates  { description }
 */
TestsCoco.User = function(name,profile,session_dates){
    this.name = name;
    this.profile = profile;
    this.session_dates = session_dates;
    this.bias = {
        answer_rate : 0.7,
        vote_rate : 0.9,
        right_answer_rate : 0.8,
        usefull_vote_rate : 0.7
    };
    this.date_property = {};
    this.date_property.dayInMillisecond = 86400000;
    this.date_property.hourInMillisecond = 3600000;
    this.date_property.minuteInMillisecond = 60000;
}

/**
 * Setter for the session date of the user
 *
 * @class     <type> (User)
 *
 * @param      {Date}  start      { The date when all the sessions starts }
 * @param      {number}  nb_tours   { The number of sessions to generate }
 * @param      {Array}   documents  { The documents on which the sessions are made }
 *
 * @return     {Array}   { The sessions date of the user }
 */
TestsCoco.User.prototype.setSessionDates = function(start,nb_tours,documents) {
    var _this = this;
    var tool = new TestsCoco.Tools();
    var dates = [];
    
    var cases = {
      "regular": function(tab) {
                    var doc = _.random(documents.length-1);
                    var media = documents[doc].medias[0].id;
                    var session_id = tool.generateUid();
                    tab.push({'id':session_id,'date':start,'media':media});
                    for(var i = 1; i < nb_tours; i++){
                        var session_id = tool.generateUid();
                        var doc = _.random(documents.length-1);
                        var media = documents[doc].medias[0].id;
                        var max_time = _.max(documents[doc].annotations,"end").end;
                        var d = new Date();
                        var offset = d.getTimezoneOffset();
                        var temp = tab[i-1].date;
                        var hours = _.random(9,20);
                        d.setTime(temp.getTime() + offset + _.random(1) * _this.date_property.dayInMillisecond + max_time + hours * _this.date_property.hourInMillisecond);
                        tab.push({'id':session_id,'date':d,'media':media});
                    }
                    return tab;
                },
      "random": function(tab) {
                    var doc = _.random(documents.length-1);
                    var media = documents[doc].medias[0].id;
                    var session_id = tool.generateUid();
                    tab.push({'id':session_id,'date':start,'media':media});
                    for(var i = 1; i < nb_tours; i++){
                        var session_id = tool.generateUid();
                        var doc = _.random(documents.length-1);
                        var media = documents[doc].medias[0].id;
                        var max_time = _.max(documents[doc].annotations,"end").end;
                        var d = new Date();
                        var offset = d.getTimezoneOffset();
                        var temp = tab[i-1].date;
                        var hours = _.random(9,20);
                        d.setTime(temp.getTime() + offset + _.random(3) * _this.date_property.dayInMillisecond + max_time + hours * _this.date_property.hourInMillisecond);
                        tab.push({'id':session_id,'date':d,'media':media});
                    }
                    return tab;
                },
      _default: function() { console.log('Profile not implemented'); }
    };

    this.session_dates = cases[ this.profile ] ? cases[ this.profile ](dates) : cases._default();
}

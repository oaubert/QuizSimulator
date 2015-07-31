var quest_sim = new TestsCoco.Simulator.Questions();
var ans_sim = new TestsCoco.Simulator.Answers();
var chooser = new TestsCoco.Simulator.Chooser(0.6);

var tool = new TestsCoco.Tools();

var alfred = new TestsCoco.User("Alfred","regular",[]);
var bernard = new TestsCoco.User("Bernard","random",[]);
var charlot = new TestsCoco.User("Charlot","regular",[]);
var daniel = new TestsCoco.User("Daniel","regular",[]);
var eric = new TestsCoco.User("Eric","random",[]);
var francky = new TestsCoco.User("Francky","regular",[]);

var users = [alfred,bernard,charlot,daniel,eric,francky];

function progressing(al,max) {
    console.log(al);
    var bar = document.getElementById('progress_bar');
    var status = document.getElementById('curr');
    status.innerHTML = ((al/max)*100)+"%";
    bar.value += al;

    if(al == max){
        status.innerHTML = "100%";
        bar.value = max;
    }
}

//TODO Add progress bar
function simulate(other_words,nb_tours,nb_question_by_tours,nb_questions){
    $.when($.get("../Donnees_tests/simulator_data/stop-words_french_1_fr.txt"),
            $.get("../Donnees_tests/simulator_data/stop-words_french_2_fr.txt"),
            $.get("../Donnees_tests/simulator_data/data_reseau.json"),
            $.get("../Donnees_tests/simulator_data/data_crypto.json"),
            $.get("../Donnees_tests/simulator_data/data_struct.json"))
        .done(function(stop_word1,stop_word2,data_res,data_crypt,data_struct){
                
                var documents = [data_res[0],data_crypt[0],data_struct[0]];
                
                var max = _.reduce(_.map(users,function(user,id){
                        user.setSessionDates(new Date(),nb_tours,documents);
                        return user.session_dates.length;
                    }),function(total,n){
                        return total + n
                    });
                var p = document.getElementById('progress_bar');
                p.setAttribute('max',max);
                var completeMessage = document.getElementById('comMes');
                completeMessage.innerHTML = "Traitement en cours ...";
                
                var questions = quest_sim.main(stop_word1,stop_word2,documents,other_words,nb_questions),
                    answers = [],
                    selection;
                var now = 0;
                progressing(now,max) ;
                users.forEach(function(user){
                    //user.setSessionDates(new Date(),nb_tours,documents);
                    user.session_dates.forEach(function(session){
                        selection = chooser.main(answers,questions,nb_question_by_tours,session.media);
                        answers = answers.concat(ans_sim.main(selection,nb_question_by_tours,user,session));
                        (function(){
                            now++;
                            var update = setTimeout(progressing(now,max),0);
                            if(now >= max){
                                clearTimeout(update);
                                completeMessage.innerHTML = "Traitement terminé";
                            }
                        })();
                    });
                });
                
                
                
                tool.downloadJson(questions,'#quest',"questions",'questions');
                tool.downloadJson(answers,'#ans',"answers",'answers');
                
                $("#loading").css("display","none");
                $("#loading").empty();
                $("#files").css("display","block");
            }
        );
}

$("#go").on("click",function(){
    var nb_questions = $("#nb_questions").val(),
        nb_tours = $("#nb_tours").val(),
        nb_questions_by_tours = $("#nb_questions_by_tour").val(),
        other = $("#other_words:checked").length;
    $("#files").css("display","none");
    $("#loading").css("display","block");
    $("#loading").append("<span id='comMes'></span><progress id='progress_bar' value='0' max=''></progress><span id='curr'></span>");
    simulate(other,nb_tours,nb_questions_by_tours,nb_questions);
    
});

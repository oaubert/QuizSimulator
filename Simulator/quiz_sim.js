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

function simulate(other_words,nb_tours,nb_question_by_tours,nb_questions){
    $.when($.get("../Donnees_tests/simulator_data/stop-words_french_1_fr.txt"),
            $.get("../Donnees_tests/simulator_data/stop-words_french_2_fr.txt"),
            $.get("../Donnees_tests/simulator_data/data_reseau.json"),
            $.get("../Donnees_tests/simulator_data/data_crypto.json"),
            $.get("../Donnees_tests/simulator_data/data_struct.json"))
        .done(function(stop_word1,stop_word2,data_res,data_crypt,data_struct){
                
                var documents = [data_res[0],data_crypt[0],data_struct[0]],
                    questions,
                    answers = [],
                    selection,
                    simulator_data = [];

                users.forEach(function(user){
                    user.setSessionDates(new Date(),nb_tours,documents);
                    user.session_dates.forEach(function(session){
                        simulator_data.push({
                            'user':user,
                            'session':session
                        });
                    });
                });

                (function(){

                    $("#loading").append("<span id='comMes'> Traitement en cours ... </span><progress id='progress_bar' value='' max=''></progress><span id='stat'></span>");

                    var max = simulator_data.length;

                    var prog = document.getElementById('progress_bar');
                    prog.setAttribute('max',max);

                    var status = document.getElementById('stat');

                    questions = quest_sim.main(stop_word1,stop_word2,documents,other_words,nb_questions);

                    var count = 0;

                    var timeout = setTimeout(doLoop, 0);

                    function doLoop() {

                        prog.value = count;

                        var obj = simulator_data[count];
                        selection = chooser.main(answers,questions,nb_question_by_tours,obj.session.media);
                        answers = answers.concat(ans_sim.main(selection,nb_question_by_tours,obj.user,obj.session));
                        
                        count++;
                        if(count < max) {
                            status.innerHTML = (Math.floor((count/max)*100))+"%";
                            var timeout = setTimeout(doLoop, 0);
                        }
                        else {
                            status.innerHTML = "100%";
                            clearTimeout(timeout);
                            tool.downloadJson(questions,'#quest',"questions",'questions');
                            tool.downloadJson(answers,'#ans',"answers",'answers');
                            $("#loading").css("display","none");
                            $("#loading").empty();
                            $("#files").css("display","block");
                        }
                    }

                })();

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
    
    simulate(other,nb_tours,nb_questions_by_tours,nb_questions);
    
});

# QuizSimulator
Ce site contient 2 parties :
  - Un simulateur de question/réponses
  - Un dashboard pour étudiant et enseignant

Le but de ce site est de fournir une base de test pour la plateforme COCo (http://comin-ocw.org/), plateforme d'annotation pour vidéo.

Pour tester le site, et avoir de plus amples informations, rendez vous sur la page suivante : http://julienouvrard.github.io/QuizSimulator/

## Le Simulateur
Il se compose de 3 parties : 
  - Un générateur de questions
  - Un générateur de réponses
  - Un module de choix de question

C'est ce 3ème élément qui est le coeur du projet.

Afin de pouvoir faire afficher les questions les plus pertinentes pour chaque quiz, nous devions implémenter un algorithme de choix. Celui réalisé se base sur l'algorithme du bandit-manchot.
Voici le premier jet :
```
La probabilité de chaque question est fonction de sa popularité et de sa base. Par exemple : 
Score[q]= If Bas[q]<5 then 1 else Pop[q]
Et Prob[q]= Score[q]/somme de tous les scores

L’algorithme tire aléatoirement sans remis des questions jusqu’à ce qu’il ne reste plus de questions
ou qu’il en ait trouvé k, sachant qu’une question est acceptée si elle n’est pas semblable aux autres.
```

Bas[q] est la base de la question q, c'est à dire, le nombre de fois où elle est apparue

Pop[q] est la popularité de la question q, autrement dit, son pourcentage de votes positifs

On teste la similarité entre 2 questions selon les critères suivants :
  - Similarité syntaxique (les 2 questions ne se ressemble pas, ne sont pas une réécriture)
  - Similarité temporelle (les 2 questions ne sont pas proche dans le temps)

## Le Dashboard
3 dashboards différents sont proposés :
  - Un dashboard pour l'enseignant
  - Un dashboard pour l'étudiant
  - Un dashboard pour visualiser l'évolution de l'algorithme

Les 2 premiers sont des prototypes de dashboards pour la plateforme COCo, le 3ème est là pour aider à l'amélioration de l'algorithme.

## Librairies utilisées
  - D3.js (Pour la visualisation)
  - nvd3 (Pour la visualisation)
  - jquery
  - jquery touchsplitter
  - jquery dataTable (Pour le choix des étudiants)
  - lodash (Pour l'aggrégation de données et divers opérations sur les objets)
  - lz-string (Pour la compression des données générées)
  - natural (Pour le traitement de la langue)
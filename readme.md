# Examinationsuppgift för javascript 2

**Uppgift **:
Inlämningsuppgift - Pokemon Application G/VG


Er uppgift är att skapa ett gränssnitt där man kan få ut information om olika Pokemon.

API Endpoint: https://pokeapi.co/api/v2/pokemon?limit=151

Del 1 - Pokedex

Skapa en dropdown-lista med samtliga dina Pokemon. Användaren ska kunna välja en Pokemon för att hämta dess data.
Skapa en klass för varje Pokemon som har följande värden:
Namn.
Bild på en Pokemon.
Vilken/Vilka typer din pokemon har (dvs “types” i API:et)
Vikt
Längd
Samtliga 6 av dess stats - HP (Hit points), Attack, Special Attack, Defense, Special Defense, Speed.
Metod för att jämföra två Pokemon med varandra.
Visa ut den valda Pokemonen med alla dess tillhörande värden.

Del 2 - Jämför Pokemon
Gör det möjligt för användaren att välja ytterligare en Pokemon. Skriv ut alla dess värden.
Användare ska kunna jämföra två Pokemon med varandra.
Markera med färg vilken Pokemon som har högst värde vid jämförelse - jämför vikt, längd samt alla dess stats. Skriv ut i DOM:en vilken Pokemon som vinner i flest kategorier.

Del 3 - Pokemon Battle (VG)
Gör det möjligt för de två valda Pokemon att slåss mot varandra och se vem som vinner. 

Hur det går till:
Bägge Pokemon turas om att attackera varandra, tills en av deras HP (Hit points) når 0.
Den Pokemon med högst speed börjar.
Namnet på en Pokemon attack är den första i dess “moves”-lista.
Damage calculation formula: 
Attackerande Pokemon (röd) - Försvarande Pokemon (blå)
(Attack+Special Attack) - (Defense+Special defense) * 0.8 = Skada
Subtrahera den försvarande Pokemons HP med den gjorda skadan.
Varje attack måste göra minst 10 i skada. T.ex om den beräknade skadan är 4, ändra det till 10.

Skriv ut i DOM:en hur kampen går till. 
T.ex “Mewtwo used Mega punch and did 45 damage. Bulbasaur remaining HP: 10.
Bulbasaur used Razor Wind and did 10 damage. Mewtwo remaining HP: 180.
Mewtwo used Mega punch and did 45 damage. Bulbasaur remaining HP: 0. Mewtwo wins!



Lycka till!

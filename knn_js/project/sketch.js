var data;
var users;

var resultP;
var resultDivs = [];

function preload() {
    data = loadJSON( 'movies.json' );
}

function setup() {
    noCanvas();
    users = {};

    var dropdowns = [];
    var titles = data.titles;
    for ( let i = 0; i < titles.length; i++ ) {
        var div = createDiv( titles[ i ] );
        var dropdown = createSelect( '' );
        dropdown.title = titles[ i ];
        dropdown.option( 'not seen' );
        dropdown.parent( div );
        dropdowns.push( dropdown );
        for ( let star = 1; star < 6; star++ ) {
            dropdown.option( star );
        }
    }

    // var dropdown1 = createSelect( '' );
    // for ( let i = 0; i < data.users.length; i++ ) {
    //     var name = data.users[ i ].name;
    //     dropdown1.option( name );
    //     users[ name ] = data.users[ i ];
    // }


    var button = createButton( 'submit' );
    button.mousePressed( predictRatings );

    resultP = createP( '' )


    function predictRatings() {
        var newUser = {};
        for ( let i = 0; i < dropdowns.length; i++ ) {
            var title = dropdowns[ i ].title;
            var rating = dropdowns[ i ].value();
            if ( rating === 'not seen' ) {
                rating = null;
            }
            newUser[ title ] = rating;
        }
        findNearestNeigbhors( newUser );
    }


    function findNearestNeigbhors( user ) {

        for ( let i = 0; i < resultDivs.length; i++ ) {
            resultDivs[ i ].remove();
        }
        resultDivs = [];

        var similarityScores = {};
        for ( let i = 0; i < data.users.length; i++ ) {
            var other = data.users[ i ];

            var similarity = euclideanDistance( user, other );
            similarityScores[ other.name ] = similarity;

        }
        data.users.sort( compareSimilarity );

        function compareSimilarity( a, b ) {
            var score1 = similarityScores[ a.name ];
            var score2 = similarityScores[ b.name ];
            return score2 - score1;
        }


        for ( let i = 0; i < data.titles.length; i++ ) {
            var title = data.titles[ i ];
            if ( user[ title ] == null ) {
                var k = 5;
                var weightedSum = 0;
                var similaritydSum = 0;
                for ( let j = 0; j < k; j++ ) {
                    var name = data.users[ j ].name;
                    var sim = similarityScores[ name ];
                    var ratings = data.users[ j ];
                    var rating = ratings[ title ];
                    if ( rating != null ) {
                        weightedSum += rating * sim;
                        similaritydSum += sim;
                    }
                }
                var stars = nf( weightedSum / similaritydSum, 1, 2 );

                var div = createDiv( title + ': ' + stars );
                resultDivs.push( div );
                div.parent( resultP );
            }
        }



        function euclideanDistance( ratings1, ratings2 ) {

            var titles = data.titles;

            var sumSquares = 0;
            for ( let i = 0; i < titles.length; i++ ) {
                var title = titles[ i ];
                var rating1 = ratings1[ title ];
                var rating2 = ratings2[ title ];
                if ( rating1 != null && rating2 != null ) {
                    var diff = rating1 - rating2;
                    sumSquares += diff * diff;
                }

            }
            var d = sqrt( sumSquares );

            var similarity = 1 / ( d + 1 );
            return similarity;
        }
    }
}
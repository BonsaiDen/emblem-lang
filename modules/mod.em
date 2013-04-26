scope {

    int l = 3 + 3 * 3;
    int hex = 0x43;

    map[int, mutable list[int]] intLists = {
        0: [1, 2],
        1: [1, 2]
    };

    intLists[0][1] = 1;
    
    -- A bunch of numbers mapped to strings
    mutable map[int, string] numberNames = {
        0: 'Zero',
        1: 'One',
        2: 'Two',
        3: 'Three',
        4: 'Four',
        5: 'Five',
        6: 'Six'
    };

    numberNames[7] = 'Seven';
    numberNames[8] = 'Eight';
    numberNames[9] = 'Nine';
    numberNames[10] = 'Ten';

    map[int, string] otherMap = {};
    --otherMap[0] = 'mutable';

    int numberNameCount = #numberNames;

    list[int] someNumbers = [0..10];

    ---
    List assignments
    inside a multi line comment
    ---
    list[int] squares = [1 ** 1, 1 ** 2, 1 ** 3, 1 ** 4, 1 ** 5];

    int first = squares[0];

    string firstName = 'Ivo';
    string lastName = 'Wetzel';
    -- firstName = 'foo';

    string initials = firstName[1] + lastName[0];

    int num = (int)'2';

    mutable list[int] numbers;
    numbers += 1;
    numbers += numbers;

    list[int] others;
    mutable list[int] some = others[0:];
    list[int] bla = (some[0:5] = others);

    `Hello \`World`;

    -- parse by changing lexer to see a string as multiple parts
    -- expands can only be expressions
    -- below would be string['Hello ', Identifier, ' ', Identifier, ...]
    string greet = 'Hello #{firstName} #{lastName}! How are you today?';

    list[int] empty = [];
    
    ---
    struct User {
        string name,
        int id
    };

    int test() {
        
    }
    ---

    import modules.x;

    string foo = x.bar;

    if true {
        int c;

    } elif false {
        int a;

    } else {
        int b;
    }

}


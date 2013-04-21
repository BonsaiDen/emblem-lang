scope {

    int l = 3 + 3 * 3;
    
    -- A bunch numbers mapped to strings
    map[int, string] numberNames = {
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

    int numberNameCount = #numberNames;

    ---
    List assignments
    inside a multi line comment
    ---
    list[int] squares = [1 ** 1, 1 ** 2, 1 ** 3, 1 ** 4, 1 ** 5];

    int first = squares[0];

    string firstName = 'Ivo';
    string lastName = 'Wetzel';

    string initials = firstName[1] + lastName[0];

    int num = (int)'2';

    list[int] numbers;
    numbers += 1;
    numbers += numbers;

    list[int] others;
    list[int] some = others[0:];
    list[int] bla = (some[0:5] = others);

    `Hello \`World`;

    --list[int] foo = [];
    
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

}


scope {

    int l = 3 + 3 * 3
    int hex = 0x43

    map[int, mutable list[int]] intLists = {
        0: [1, 2],
        1: [1, 2]
    }

    intLists[0][1] = 1
    
    -- A bunch of numbers mapped to strings
    mutable map[int, string] numberNames = {
        0: 'Zero',
        1: 'One',
        2: 'Two',
        3: 'Three',
        4: 'Four',
        5: 'Five',
        6: 'Six'
    }

    numberNames[7] = 'Seven'
    numberNames[8] = 'Eight'
    numberNames[9] = 'Nine'
    numberNames[10] = 'Ten'

    map[int, string] otherMap = {}
    --otherMap[0] = 'mutable'

    int numberNameCount = #numberNames

    list[int] someNumbers = 0..10 -- this is a list with a .. range?

    -- TODO add .. and ... operators for ints
    list[int] fooNumbers = (2 + 2)..10

    ---
    List assignments
    inside a multi line comment
    ---
    list[int] squares = [1 ** 1, 1 ** 2, 1 ** 3, 1 ** 4, 1 ** 5]

    int first = squares[0]

    string firstName = 'Ivo'
    string lastName = 'Wetzel'
    -- firstName = 'foo'

    string initials = firstName[1] + lastName[0]

    int num = (int)'2'

    mutable list[int] numbers
    -- TODO FIX broken compound assignments
    numbers += 1
    numbers += numbers

    list[int] others
    mutable list[int] some = others[0:]
    list[int] bla = (some[0:5] = others)

    `Hello \`World`

    -- parse by changing lexer to see a string as multiple parts
    -- expands can only be expressions
    -- below would be string['Hello ', Identifier, ' ', Identifier, ...]
    string greet = 'Hello #{firstName} #{lastName}! How are you today?'

    mutable list[int] empty = []

    empty = []
    
    ---
    struct User {
        string name,
        int id
    }

    int test() {
        
    }
    ---

    import modules.x

    string foo = x.bar

    if true {
        int c

    } elif false {
        int a

    } else {
        int b
    }

    -- TODO warn on unused variables
    -- add "usage" flag to resolveName and increment the counter
    -- so identifiers etc. can automatically handle this
    int e = 2


    -- support as to modify the value before running the loop?
    -- each int a in numbers as (string)a {}
    -- creates a new scope
    each int n in numbers {
        
    }

    -- TODO move the variables into the block's scope
    each int k, string v in numberNames {
        
    }

    -- TODO fix [] requirement...
    -- TODO scope needs a method for generating a unique name for one time usage
    --      this also needs support in templating syntax???
    each int i in 0..10 {
        
    }


    -- later on, see if e is primitive and warn / optimize
    -- no new scope here there isn't anything inside, ignore the body/block
    -- TODO fix line comments in match statements
    mutable int q
    match e { 

        case 0 {  -- NEW scope
            q = 3
        }
        case 1 { 
            q = 4
        }
        case 2 { 
            q = 5
        }
        case 3 { 
            q = 6
        }
    }

    -- TODO throw error when there's no possible exit path out of the loop
    -- build branch anaylizer...
    -- creates a new scope
    loop {
        
    } 

    -- creates a new scope

    -- creates a new scope
    -- TODO fail on NON boolean expression type result
    loop e {
    }

    -- TODO support python style with? Or a fixed version of the JS one?
    -- with e {} 
    -- struct e with e { memberA}

    -- ret

    ---

    try {
        
    } except e {
        
    } finally {
        
    }

    -- TODO in general, complain about expressions without side effects
    -- e.g. pure numbers / strings etc. check for class / assignments / overloaded [] . operators???
    ---
}


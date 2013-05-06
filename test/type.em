void(int, int) callback

void foo(int a, int b) {
    
}

void get(void(int error, string data) callback) {
    
}


type Class {
    int id
    public int getId() {
        ret @id
    }
}

type SubClass[Class] {
    int id
}

struct Node {
    mutable int id
    string name = 'Foo'
    -- no modifiers except mutable
}

interface aNode {
    -- no modifiers allowed, all interface data MUST be public
}

void getNodeName(aNode node) {
    
}


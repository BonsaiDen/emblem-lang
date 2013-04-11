scope {
    int l = 0
    string f

    l = 3 + 3 * 3
    f = 'foo' * 2

    bool o = true == true
    o = 2 != 2 && 'foo' == 'foo'

    string m = 'Hello World'
    int len = #m

    string q = 'foo' + 'foo'

    int i = 2
    i += 4

    int num = (int)'2'

    list[int] numbers
    numbers += 1
    numbers += numbers

    list[int] others = numbers + numbers

    list[int] some = others[0:5]
    list[int] bla = (some[0:5] = others)

    map[int, string] names

    names[1] = 'One'
    names[2] = 'Two'
    names[3] = 'Three'

    string name = names[1]

    map[int, list[int]] foo
    foo[1] = numbers

}


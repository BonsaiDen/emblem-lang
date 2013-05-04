
-- match ----------------------------------------------------------------------
bool b = true
match b {
    case true {
    }
    case false {
    }
}

-- each -----------------------------------------------------------------------
each int i in 0..10 {
    leave
}

map[string, int] m
each string k, int value in m {
    leave
}

-- loop -----------------------------------------------------------------------
loop {
    leave
}

loop true {
    leave
}


-- if -------------------------------------------------------------------------
if true {

    if true {
        
    } else {
            
        if true {
            
        } elif false {
            
        } elif false {
            
        } else {
            
        }

    }
    
}


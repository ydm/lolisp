module.exports = function(string, definitions) {
    var index = 0;
    var length = 1;
    var arrayPosition = -1;
    var _Lexer = this;
    _Lexer.tokens = [];
    _Lexer.lexemes = [];
    _Lexer.token = null;
    _Lexer.lexeme = null;
    _Lexer.bof = true;
    _Lexer.eof = false;
    _Lexer.line_number = 0;
    _Lexer.char_position = 0;

    // fill tokens and lexemes
    while ( index + length <= string.length ) {
        var small = string.substr( index, length ) ;
        var big = string.substr( index, length + 1 ) ;
        for ( var def in definitions ) {
            var smallmatch = small.match( definitions[def].regexp ) !== null;
            var bigmatch = big.match( definitions[def].regexp ) !== null;
            if ( smallmatch &&( ! bigmatch || small == big )  ) {
                // found a token
                index += length;
                length = 0;
                _Lexer.tokens.push(def);
                _Lexer.lexemes.push(small);
                break;
            }
        }
        length++;
    }

    _Lexer.next = function (count) {
        if (count == undefined) count = 1;
        while (count-- > 0) {
            arrayPosition++;
            if ( arrayPosition < _Lexer.tokens.length) {
                _Lexer.token = _Lexer.tokens[arrayPosition];
                _Lexer.lexeme = _Lexer.lexemes[arrayPosition];
                _Lexer.bof = false;
                _Lexer.char_position += _Lexer.lexeme.length;
                if (definitions[_Lexer.token].skip) {
                    if (_Lexer.token == 'newline') {
                        _Lexer.line_number++;
                        _Lexer.char_position = 0;
                    }
                    _Lexer.next();
                }
            } else {
                _Lexer.token = 'EOF';
                _Lexer.lexeme = null;
                _Lexer.eof = true;
            }
        }
    };

    _Lexer.prev = function (count) {
        if (count == undefined) count = 1;
        while (count-- > 0) {
            arrayPosition--;
            if ( arrayPosition-- > 0) {
                _Lexer.token = _Lexer.tokens[arrayPosition];
                _Lexer.lexeme = _Lexer.lexemes[arrayPosition];
                _Lexer.eof = false;
                _Lexer.char_position -= _Lexer.lexeme.length;
                if (definitions[_Lexer.token].skip) {
                    if (_Lexer.token == 'newline') {
                        _Lexer.line_number--;
                        _Lexer.char_position = 0;
                    }
                    _Lexer.prev();
                }
            } else {
                _Lexer.token = 'BOF';
                _Lexer.lexeme = null;
                _Lexer.bof = true;
                break;
            }
        }
    };
};

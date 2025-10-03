"""
"""

# IMPORTS
import re
from .thistle import Thistle
from .conditions import InCondition, IfCondition


class Token:
    """
    """
    def __init__(self, type: str, value: str, position: int = None, line: int = None):
        """
        """
        self.type = type
        self.value = value
        self.position = position
        self.line = line

    def __repr__(self):
        """
        """
        return f"Token(type={self.type}, value='{self.value}', position={self.position}, line={self.line})"
    

class ThistleInterpreter:
    """
    """
    ACTIONS = {"SELECT", "SCRAPE"}
    CONDITIONALS = {"IF", "IN"}
    KEYWORDS = {"POSITION"}
    NEGATIONS = {"NOT"}
    FLAGS = {}
    ALL = {"ALL"}
    OPERATORS = {"="}

    def __init__(self):
        """
        """
        pass

    def _tokenizer(self, query: str) -> list[Token]:
        """
        """
        tokens = []
        pattern = r"(\bSELECT\b|\bSCRAPE\b|\bIN\b|\bIF\b|\bALL\b|==|=|;|\n|\"[^\"]*\"|'[^']*'|[A-Za-z_][A-Za-z0-9_-]*|\d+)"

        for match in re.finditer(pattern, query):
            value = match.group(0)
            position = match.start()
            line = query.count('\n', 0, position) + 1

            if value in self.ACTIONS:
                token_type = "ACTION"
            elif value in self.CONDITIONALS:
                token_type = "CONDITIONAL"
            elif value in self.KEYWORDS:
                token_type = "KEYWORD"
            elif value in self.OPERATORS:
                token_type = "OPERATOR"
            elif re.match(r'^\d+$', value):
                token_type = "NUMBER"
            elif value in self.NEGATIONS:
                token_type = "NEGATION"
            elif value in self.FLAGS:
                token_type = "FLAG"
            elif value in self.ALL:
                token_type = "NUMBER"
                value = 0
            elif re.match(r'^(?:"[^"]*"|\'[^\']*\'|[A-Za-z_][A-Za-z0-9_-]*)$', value):
                token_type = "IDENTIFIER"
                if value[0] in ("'", '"'):
                    value = value[1:-1]
            elif value == ";":
                token_type = "SEMICOLON"
            else:
                token_type = "UNKNOWN"

            tokens.append(Token(token_type, value, position, line))
        return tokens
        
    def interpret(self, query: str) -> list[Thistle]:
        """
        """
        tokens = self._tokenizer(query)
        instructions = []
            
        i = 0
        while i < len(tokens):
            # Action
            token = tokens[i]
            if token.type != "ACTION":
                raise SyntaxError(f"Expected SCRAPE or SELECT at token {token}")
            action = token.value
            i += 1

            # Count
            token = tokens[i]
            if token.type != "NUMBER":
                raise SyntaxError(f"Expected number or ALL after {action} at token {token}")
            count = int(token.value)
            i += 1

            # Element
            token = tokens[i]
            if token.type != "IDENTIFIER":
                raise SyntaxError(f"Expected element after {action} {count} at token {token}")
            element = token.value
            i += 1

            # Conditions
            conditions = []
            token = tokens[i]
            while token.type != "SEMICOLON":
                negated = False
                if token.type == "NEGATION":
                    negated = True
                    i += 1
                    token = tokens[i]
                if token.type != "CONDITIONAL":
                    raise SyntaxError(f"Expected conditional after {action} {count} {element} at token {token}")
                conditional = token.value
                i += 1

                if conditional == "IN":
                    token = tokens[i]
                    if token.type == "KEYWORD" and token.value == "POSITION":
                        i += 1
                        token = tokens[i]
                        if token.type != "OPERATOR":
                            raise SyntaxError(f"Expected '=' after IN POSITION at token {token}")
                        i += 1
                        token = tokens[i]
                        if token.type != "NUMBER":
                            raise SyntaxError(f"Expected number after IN POSITION = at token {token}")
                        position = int(token.value)
                        condition = InCondition(target="POSITION", value=position, negated=negated, query_tag=element)
                    else:
                        if token.type != "IDENTIFIER":
                            raise SyntaxError(f"Expected element after IN at token {token}")
                        target = token.value
                        condition = InCondition(target=target, negated=negated, query_tag=element)

                elif conditional == "IF":
                    token = tokens[i]
                    if token.type != "IDENTIFIER":
                        raise SyntaxError(f"Expected attribute after IF at token {token}")
                    attribute = token.value
                    i += 1
                    token = tokens[i]
                    if token.type != "OPERATOR":
                        raise SyntaxError(f"Expected '=' after IF {attribute} at token {token}")
                    i += 1
                    token = tokens[i]
                    if token.type not in {"IDENTIFIER", "NUMBER"}:
                        raise SyntaxError(f"Expected value after IF {attribute} = at token {token}")
                    value = token.value
                    condition = IfCondition(attribute=attribute, value=value, negated=negated, query_tag=element)
                else:
                    raise SyntaxError(f"Unknown conditional {conditional} at token {token}")
                conditions.append(condition)
                i += 1
                token = tokens[i]
                
            instructions.append(Thistle(action=action, count=count, element=element, conditions=conditions, flags=[]))
            i += 1
            # FLAGS
            # TODO: Implement flags parsing

        return instructions
    
            


def main():
    """
    """
    pass


if __name__ == "__main__":
    main()

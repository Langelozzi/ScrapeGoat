"""
"""

# IMPORTS
import re
from enum import Enum, auto
from abc import ABC, abstractmethod

from .command import GrazeCommand, ChurnCommand, DeliverCommand
from .conditions import InCondition, IfCondition


class TokenType(Enum):
    """
    """
    ACTION = auto()
    CONDITIONAL = auto()
    KEYWORD = auto()
    OPERATOR = auto()
    NUMBER = auto()
    IDENTIFIER = auto()
    FILE_TYPE = auto()
    NEGATION = auto()
    FLAG = auto()
    SEMICOLON = auto()
    UNKNOWN = auto()


class Token:
    """
    """
    def __init__(self, type: str, value: str):
        """
        """
        self.type = type
        self.value = value

    def __repr__(self):
        """
        """
        return f"Token(type={self.type}, value='{self.value}')"
    

class Tokenizer:
    def __init__(self):
        self.ACTIONS = {"select", "scrape", "extract", "output"}
        self.CONDITIONALS = {"if", "in"}
        self.KEYWORDS = {"position"}
        self.OPERATORS = {"=", "!="}
        self.NEGATIONS = {"not"}
        self.FILE_TYPES = {"json", "csv"}
        self.FLAGS = {}

    def tokenize(self, query: str) -> list[Token]:
        """
        """
        tokens = []
        pattern = (
            r'(--[A-Za-z0-9_-]+|'
            r'\bSELECT\b|\bSCRAPE\b|\bEXTRACT\b|\bOUTPUT\b|\bIN\b|\bIF\b|'
            r'!=|==|=|;|\n|'
            r'"(?:[^"]*)"|\'(?:[^\']*)\'|'
            r'@?[A-Za-z_][A-Za-z0-9_-]*|'
            r'\d+)'
        )

        for match in re.finditer(pattern, query.replace("\n", ""), flags=re.IGNORECASE):
            raw_value = match.group(0)
            token = self._classify_token(raw_value)
            tokens.append(token)
        return tokens

    def _classify_token(self, raw_value: str) -> Token:
        """
        """
        if raw_value[0] in ('"', "'") and raw_value[-1] == raw_value[0]:
            return Token(TokenType.IDENTIFIER, raw_value[1:-1])
        val_lower = raw_value.lower()
        if val_lower.startswith("--"):
            return Token(TokenType.FLAG, val_lower[2:].replace("-", "_"))
        if val_lower in self.ACTIONS:
            return Token(TokenType.ACTION, val_lower)
        if val_lower in self.CONDITIONALS:
            return Token(TokenType.CONDITIONAL, val_lower)
        if val_lower in self.KEYWORDS:
            return Token(TokenType.KEYWORD, val_lower)
        if val_lower in self.OPERATORS:
            return Token(TokenType.OPERATOR, val_lower)
        if val_lower in self.NEGATIONS:
            return Token(TokenType.NEGATION, val_lower)
        if raw_value == ";":
            return Token(TokenType.SEMICOLON, raw_value)
        if val_lower.isdigit():
            return Token(TokenType.NUMBER, val_lower)
        if val_lower in self.FILE_TYPES:
            return Token(TokenType.FILE_TYPE, val_lower)
        return Token(TokenType.IDENTIFIER, raw_value)
    

class Parser(ABC):
    """
    """
    @abstractmethod
    def parse(self, tokens: list[Token], index) -> tuple:
        """
        """
        pass


class FlagParser(Parser):
    """
    """
    def __init__(self):
        """
        """
        pass

    def parse(self, tokens, index) -> tuple:
        """
        """
        flags = {}
        
        while tokens[index].type != TokenType.SEMICOLON:
            token = tokens[index]
            if token.type != TokenType.FLAG:
                raise SyntaxError(f"Expected flag at token {token}")
            flag_name = token.value
            index += 1
            token = tokens[index]
            if token.type != TokenType.IDENTIFIER:
                flag_value = True
            else:
                flag_value = token.value
                index += 1
            flags[flag_name] = flag_value
        return flags, index


class ConditionParser(Parser):
    """
    """
    def __init__(self):
        """
        """
        pass

    def parse(self, tokens, index, element) -> tuple:
        negated = False
        if tokens[index].type == TokenType.NEGATION:
            negated = True
            index += 1
        token = tokens[index]
        if token.type != TokenType.CONDITIONAL:
            raise SyntaxError(f"Expected conditional at {token}")
        if token.value == "if":
            return self._parse_if(tokens, index, element, negated)
        elif token.value == "in":
            return self._parse_in(tokens, index, element, negated)
        
    def _parse_if(self, tokens, index, element, negated) -> tuple:
        """
        """
        index += 1
        token = tokens[index]
        if token.type != TokenType.IDENTIFIER:
            raise SyntaxError(f"Expected key after IF at {token}")
        key = token.value
        index += 1
        token = tokens[index]
        if token.type != TokenType.OPERATOR:
            raise SyntaxError(f"Expected '=' after IF {key} at {token}")
        if token.value == "!=":
            negated = True
        index += 1
        token = tokens[index]
        if token.type not in {TokenType.IDENTIFIER, TokenType.NUMBER}:
            raise SyntaxError(f"Expected value after IF {key} = at {token}")
        value = token.value
        condition = IfCondition(key=key, value=value, negated=negated, query_tag=element)
        index += 1
        return condition, index
    
    def _parse_in(self, tokens, index, element, negated) -> tuple:
        """
        """
        index += 1
        token = tokens[index]
        if token.type == TokenType.KEYWORD:
            index += 1
            token = tokens[index]
            if token.type != TokenType.OPERATOR:
                raise SyntaxError(f"Expected '=' after IN POSITION at {token}")
            if token.value == "!=":
                negated = True
            index += 1
            token = tokens[index]
            if token.type != TokenType.NUMBER:
                raise SyntaxError(f"Expected number after IN POSITION = at {token}")
            position = int(token.value)
            condition = InCondition(target="POSITION", value=position, negated=negated, query_tag=element)
        else:
            if token.type != TokenType.IDENTIFIER:
                raise SyntaxError(f"Expected element after IN at {token}")
            target = token.value
            condition = InCondition(target=target, negated=negated, query_tag=element)
        index += 1
        return condition, index


class ScrapeSelectParser(Parser):
    """
    """
    def __init__(self, condition_parser: ConditionParser, flag_parser: FlagParser):
        """
        """
        self.condition_parser = condition_parser
        self.flag_parser = flag_parser

    def parse(self, tokens, index) -> tuple:
        """
        """
        action = tokens[index].value
        index += 1

        # count
        count = 0
        if tokens[index].type == TokenType.NUMBER:
            count = int(tokens[index].value)
            index += 1

        # element
        if tokens[index].type != TokenType.IDENTIFIER:
            raise SyntaxError(f"Expected element at token {tokens[index]}")
        element = tokens[index].value
        index += 1

        # conditions
        conditions = []
        while tokens[index].type != TokenType.SEMICOLON and tokens[index].type != TokenType.FLAG:
            condition, index = self.condition_parser.parse(tokens, index, element)
            conditions.append(condition)

        # flags
        flags = {}
        if tokens[index].type == TokenType.FLAG:
            flags, index = self.flag_parser.parse(tokens, index)

        instruction = GrazeCommand(action=action, count=count, element=element, conditions=conditions, **flags)
        return instruction, index + 1
    

class ExtractParser(Parser):
    """
    """
    def __init__(self, flag_parser: FlagParser):
        """
        """
        self.flag_parser = flag_parser

    def parse(self, tokens, index) -> tuple:
        """
        """
        fields = []

        index += 1
        
        # fields
        while tokens[index].type != TokenType.SEMICOLON and tokens[index].type != TokenType.FLAG:
            if tokens[index].type == TokenType.IDENTIFIER:
                fields.append(tokens[index].value)
            index += 1
        
        # flags
        flags = {}
        if tokens[index].type == TokenType.FLAG:
            flags, index = self.flag_parser.parse(tokens, index)

        instruction = ChurnCommand(fields=fields, **flags)
        return instruction, index + 1
    

class OutputParser(Parser):
    """
    """
    def __init__(self, flag_parser: FlagParser):
        """
        """
        self.flag_parser = flag_parser

    def parse(self, tokens, index) -> tuple:
        """
        """
        index += 1

        # file type
        if tokens[index].type != TokenType.FILE_TYPE:
            raise SyntaxError(f"Expected file type at token {tokens[index]}")
        file_type = tokens[index].value
        index += 1

        # flags
        flags = {}
        if tokens[index].type == TokenType.FLAG:
            flags, index = self.flag_parser.parse(tokens, index)

        instruction = DeliverCommand(file_type=file_type, **flags)
        return instruction, index + 1


class Interpeter:
    """
    """
    def __init__(self):
        self.tokenizer = Tokenizer()
        self.condition_parser = ConditionParser()
        self.flag_parser = FlagParser()
        self.action_parsers = {
            "scrape": ScrapeSelectParser(self.condition_parser, self.flag_parser),
            "select": ScrapeSelectParser(self.condition_parser, self.flag_parser),
            "extract": ExtractParser(self.flag_parser),
            "output": OutputParser(self.flag_parser),
        }

    def interpret(self, query: str) -> list:
        """
        """
        tokens = self.tokenizer.tokenize(query)
        instructions = []
        index = 0

        while index < len(tokens):
            token = tokens[index]
            if token.type != TokenType.ACTION:
                raise SyntaxError(f"Expected action at token {token}")
            
            parser = self.action_parsers.get(token.value)
            
            if parser is None:
                raise SyntaxError(f"Unknown action '{token.value}' at token {token}")
            
            instruction, index = parser.parse(tokens, index)
            instructions.append(instruction)

        return instructions
    
            
def main():
    """
    """
    pass


if __name__ == "__main__":
    main()

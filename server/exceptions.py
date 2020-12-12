"""
exceptions.py

Stores all API exceptions neatly for importing and usage elsewhere.
"""
from typing import Tuple

# TODO: Improve exception management to cut down needless class definitions.
# TODO: Add 'extra' message parameter to base APIException kwargs.

class APIException(Exception):
    """Exception from which all API-related exceptions are derived and formatted with"""
    MESSAGE = "A generic unhandled API Exception has occurred."

    def __init__(self, status_code: int = 500):
        self.status_code = status_code

    def json(self):
        return {
            'error': {
                'code': self.status_code,
                'message': self.MESSAGE
            }
        }


class UnspecifiedParam(APIException):
    MESSAGE = 'This API Route requires a parameter that was not satisfied in the latest request.'

    def __init__(self, status_code: int):
        super().__init__(status_code)

    def json(self):
        return {
            'error': {
                'code': self.status_code,
                'message': self.MESSAGE
            }
        }


class UnspecifiedQueryParam(APIException):
    MESSAGE = 'This API Route requires a query parameter that was not satisfied in the latest request.'

    def __init__(self, status_code: int):
        super().__init__(status_code)


class UnspecifiedURIParam(APIException):
    MESSAGE = 'This API Route requires a URI parameter that was not satisfied in the latest request.'

    def __init__(self, status_code: int):
        super().__init__(status_code)


class InvalidQueryParam(APIException):
    def __init__(self, status_code: int, query_item: Tuple[str, str]):
        super().__init__(status_code)
        self.query_item = query_item

    def json(self):
        error = super().json()
        error['error']['query'] = {'key': self.query_item[0], 'value': self.query_item[1]}
        return error


class InvalidURIParam(APIException):
    def __init__(self, status_code: int, route_param: str):
        super().__init__(status_code)
        self.route_param = route_param

    def json(self):
        error = super().json()
        error['error']['param'] = self.route_param
        return error



class InvalidQuestion(InvalidURIParam):
    MESSAGE = "A invalid question was specified in the request URI and could not be resolved."

    def __init__(self, *args, question):
        super().__init__(*args, route_param=question)


class InvalidCategory(InvalidURIParam):
    MESSAGE = "A invalid category was specified in the request URI and could not be resolved."

    def __init__(self, status_code, category: str):
        super().__init__(status_code, route_param=category)

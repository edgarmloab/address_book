from hashlib import sha256
from django.http import JsonResponse
from django.conf import settings

class BasicAuthMiddleware(object): 
    def __init__(self, get_response): 
        self.get_response = get_response

    def _unauthorized(self):
        response = JsonResponse("Unauthorized", safe=False)
        response.status_code = 401
        return response

    def __call__(self, request):
        if (("user_interface" in request.META['PATH_INFO']) or ("static" in request.META['PATH_INFO'])) :
            return self.get_response(request)
        if 'Authorization' not in request.headers:
            return self._unauthorized()
        else:
            authentication = request.headers['Authorization']
            try:
                username, password = authentication.split(':', 1)
            except ValueError:
                response = JsonResponse("Authorization header must contain username:password value", safe=False)
            if (
                username == settings.USERNAME and
                sha256(password.encode()).hexdigest() == settings.PASSWORD_HASH 
                # TODO I am aware SHA256 is not safe and would use PBKDF2_HMAC to hash in real-life setting instead
            ):
                return self.get_response(request)
            return self._unauthorized()
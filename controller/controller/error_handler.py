from django.http.response import HttpResponseServerError
from django.conf import settings

def clean_up_the_mess()-> None:
    print('fake cleanup function cleans up after program failure BEEP BOP')

def handle_error(e: Exception) -> HttpResponseServerError:
    if settings.DEBUG == True:
        raise e
    try:
        raise e
    except ValueError:
        return HttpResponseServerError('Here would be some logic to combat ValueError')
    except TypeError:
        return HttpResponseServerError('Here would be some logic to combat TypeError')
    except AttributeError:
        return HttpResponseServerError('Here would be some logic to combat AttributeError')
    except Exception as e:
        return HttpResponseServerError(f'Here would be some logic to combat {type(e).__name__}')
    finally:
        clean_up_the_mess()
from typing import Dict
from django.shortcuts import render

from django.http.request import HttpRequest
from django.http.response import JsonResponse, HttpResponse,HttpResponseNotAllowed, HttpResponseBadRequest
from rest_framework import viewsets
from controller.error_handler import handle_error

from controller.query_logger import log_query
from .models import Address
from .serializers import AddressSerializer
from uuid import uuid4
#from datetime import datetime

FIELDS_CHECKED = ['street_address', 'city', 'postal_code', 'country']

class AddressViewSet(viewsets.ViewSet):

    serializer_class = AddressSerializer

    def create(self, request: HttpRequest) -> JsonResponse:
        try:
            validate = self.serializer_class(data=request.data)
            if validate.is_valid():
                properties_to_check = {k:v for k,v in validate.validated_data.items() if k in FIELDS_CHECKED}
                duplicates = Address.objects.filter(**request.data)
                if len(duplicates) == 0:
                    create =validate.create(validated_data=properties_to_check)
                    create.save()
                    log_query(f'''INSERT INTO "address" ({','.join([f'"{k}"' for k,v in properties_to_check.items()])})
                            VALUES ({','.join([f'"{v}"' for k,v in properties_to_check.items()])})''')
                    return HttpResponse('Record created')
                else:
                    return HttpResponseBadRequest('The address you entered is a duplicate')
            else:
                return HttpResponseNotAllowed('Unable to create using the data provided')
        except Exception as e:
            return handle_error(e)



    def read_one(self, request: HttpRequest, uuid: uuid4) -> JsonResponse:
        try:
            queryset = Address.objects.filter(uuid_id=uuid)
            if len(queryset) == 0:
                return HttpResponseBadRequest(f'Could not find entry {uuid}')
            out = self.serializer_class(queryset[0])
            log_query(str(queryset.query))
            return JsonResponse(out.data, safe=False)
        except Exception as e:
            return handle_error(e)


    def read_all(self, request: HttpRequest) -> JsonResponse:
        try:
            queryset = Address.objects.all()
            log_query(str(queryset.query))
            queryset = queryset.values()
            return JsonResponse(list(queryset), safe=False)
        except Exception as e:
            return handle_error(e)


    def update(self, request: HttpRequest, uuid: uuid4) -> JsonResponse:
        try:
            queryset = Address.objects.filter(uuid_id=uuid)
            if len(queryset) == 0:
                return HttpResponseBadRequest(f'Could not find entry {uuid}')
            validate = self.serializer_class(data=request.data)
            if validate.is_valid():
                properties_to_check: Dict = {k:v for k,v in validate.validated_data.items() if k in FIELDS_CHECKED}
                duplicates = Address.objects.filter(**request.data)
                if len(duplicates) == 0:
                    update =validate.update(queryset[0], validated_data=properties_to_check)
                    update.save()
                    log_query(f'''UPDATE "address" SET {','.join([f'"{k}" = "{v}"' for k,v in properties_to_check.items()])}
                    WHERE "uuid_id" = {uuid}''')
                    return HttpResponse('Update successful')
                else:
                    return HttpResponseBadRequest('The address you entered is a duplicate or wrong uuid provided')
            else:
                return HttpResponseBadRequest(f'Could not update entry {uuid} using the data provided.')
        except Exception as e:
            return handle_error(e)
        #This is to show alternative approach
        # queryset = Address.objects.filter(uuid_id=uuid).values()
        # if len(queryset) == 0:
        #     return HttpResponseBadRequest(f'Could not find entry {uuid}')
        # if len(queryset) == 1:
        #     update_data = request.data
        #     for k,v in update_data.items():
        #         if queryset[0].get(k):
        #             queryset[0][k] = v
        #     queryset[0]['entry_updated'] = datetime.now()
        #     out = Address(**queryset[0])
        #     out.save()
        #     return HttpResponse(f'Successfully updated entry {uuid}')
        # else:
        #      return HttpResponseBadRequest(f'Could not update entry {uuid} using the data provided.')


    def remove(self, request: HttpRequest, uuid: uuid4) -> JsonResponse:
        try:
            queryset = Address.objects.filter(uuid_id=uuid)
            if len(queryset) == 1:
                queryset.delete()
                log_query(f'''DELETE FROM "address" WHERE ""uuid" = {uuid}''')
                return HttpResponse(f'Successfully removed entry {uuid} from the database')
            else:
                return HttpResponseBadRequest(f'Could not remove entry {uuid} from the database. Please check if it exists')
        except Exception as e:
            return handle_error(e)

FROM node:18.7.0-alpine
WORKDIR /AddressBook/
 
COPY ./controller ./requirements.txt ./
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools 
RUN pip install -r requirements.txt
RUN npm install
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
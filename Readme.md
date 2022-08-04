# Address Book

This is my Address Book application using django with sqlite,templated js react frontend and all the functionalities requested.

## How to run

Run `docker-compose up`

## Important notes

Due to limited amount of time and effort I could spend on the project I took some shortcuts and accepted faulty code considering  the following caveats :
- Styles and pretty css were not implemented but some code related to this was left in the project
- There may be some leftover files that I didn't catch and delete. Please ignore them
- The application is synchronous but I am well versed in async programming
- The application is not using typescript create react app which I usually would use as a separated frontend layer. I wanted to speed it up and integrate with django templates but I did leave http requests as a mode of communication between the frontend and the backend
- Authorization is hardcoded and user/pass pair passed in request headers but the mechanism is there. Normally I would have implemented django.contrib.auth or JWT auth with a session based logic. Also I would never store unhashed passwords anywhere while also removing credentials from the code (obtainable by user input or config injection)
- I have not validated the code, models and fields thoroughly but normally I would. I am user to using typing lib with Pydantic as well as using abstract classes and Protocols for code decoupling
- I have not written tests but I can use both unittest and pytest with hypothesis lib as test-input generator 
- I am aware that after creating a new entry the table will not reload automatically but had no time to fix it. Please use F5 after record creation.
- to create a new entry leave the uuid_id field empty. To update entry do not modify the uuid displayed, midify any other fields and click save.
- App is left on Debug mode which I would not do in a professional setting.leave it at that to see the errors and know the production environment is not deployable
- There is a known error with list item key not being unique after table is rendered but it should not impact the functionality.
- If I was to scale this app I would most likely divide back and front into separate containers/pods and create a load balancer or use a queue like Kafka or Rabbit MQ in order to allocate the traffic
- sql logs are saved into the csv file (query_log.csv)
- Due to lack of desired input validators and encoding/decoding please do not use any special characters.
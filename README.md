# IrisChatBot
Node js based chat bot that connects to slack and uses wit.ai NLP preocessing to respond to messages,
acts as a tutorial to microservices  architecture.

Iris uses wit.ai to parse messages on a slack channel it is registered to and responds based on the microservices that are registered 
in its registry.
currently two microservices are implemented : time------uses google maps timezone api
                                              weather-------- uses openweather api
                                              
TODO:
add authentication to add bot to multiple channels easily
add more services, maybe reporterservice similar to 

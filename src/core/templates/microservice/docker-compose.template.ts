export const template = `version: '3.8'

services:
  mongo:
    image: mongo:5.0
    container_name: mongodb
    ports:
      - "27017:27017"
    networks:
      - app-network

  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: {{resourceName.toLowerCase()}}-service
    ports:
      - "3000:3000"
    environment:
      - MONGO_URI=mongodb://mongo:27017/{{resourceName.toLowerCase()}}-service
      - PORT=3000
    depends_on:
      - mongo
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
`;
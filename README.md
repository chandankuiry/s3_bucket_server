# S3 bucket data fetch 

This app will be used for notification.This app fetch the data from s3 bucket and save in mongodb database.When it populate the data in database it will send a mail notification  to you .




If you would like to download the code and try it for yourself:

1. Clone the repo: `git clone https://gitlab.com/chandankuiry12/s3_bucket_server.git`
2. Install packages: `npm install`
3. Change out the database and aws s3 and mail id  configuration in server.js
5. Launch: `npm start`
6. Visit in your browser at: `http://localhost:3000`
7. To fetch the data from s3 bucket and populate in db : http://localhost:3000/getData


# Running in browser
Visit in your browser at: `http://localhost:3000
/getData`


# Docker build process 

I have written [Dockerfile](https://gitlab.com/chandankuiry12/s3_bucket_server/blob/master/Dockerfile) for this project .

```
#download node 
FROM node:slim
MAINTAINER Chandan kuiry

# Create app directory
WORKDIR /usr/src/s3_bucket_server
# copy the package,json file
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]
```
 

# Docker command to run the project

## to build the image from Dockerfile.We have to give the path where Dockerfile is located

```
sudo docker build -t s3_bucket_server:latest /home/chandan/Desktop/s3_bucket_server
```
## to check  the image 
```
sudo docker images
``` 

## to run container
```
sudo docker run -d -p 3000:3000  s3_bucket_server

```
## to check container is running or not
```
sudo docker ps

```
## open in browser
```
http://localhost:3000

```

# Pull the reference docker image
FROM python:3.10-alpine

# Copy the requirements file
COPY ./requirements.txt /app/requirements.txt

# Switch WD
WORKDIR /app

# Install dependencies
RUN pip install -r requirements.txt

# Copy the content of the application
COPY . /app

# Config the container
ENTRYPOINT [ "python" ]
CMD [ "app.py" ]

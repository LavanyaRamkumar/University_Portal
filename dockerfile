FROM python:3.5-jessie

RUN apt-get update -y

WORKDIR /root
RUN mkdir app
COPY . ./app/
RUN pip install -qr ./app/requirements.txt

ENTRYPOINT ["python3", "./app/mong_fin.py"]
EXPOSE 5000

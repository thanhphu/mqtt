# MQTT Server/Broker with AMQP backend
Originally from Lelylan
## Requirements

The MQTT server/broker is tested against Node 6

## Getting Started

```bash
$ npm install && npm install -g foreman
$ nf start
```

## Install with docker
Docker image: [thanhphu/mqtt-broker](https://hub.docker.com/r/thanhphu/mqtt-broker/)

### Use docker hub image
```bash
$ docker run -d -it --name mqtt thanhphu/mqtt-broker
```

### Generate local image
```bash
$ docker build --tag=mqtt .
$ docker run -d -it --name mqtt mqtt
```

When installing the service in production set [lelylan environment variables](https://github.com/lelylan/lelylan/blob/master/README.md#production).


## Resources

* [Lelylan MQTT Documentation](http://dev.lelylan.com/api#api-physical-mqtt)
* [How to Build an High Availability MQTT Cluster for the Internet of Things](https://medium.com/@lelylan/how-to-build-an-high-availability-mqtt-cluster-for-the-internet-of-things-8011a06bd000)

## Contributing

Fork the repo on github and send a pull requests with topic branches.
Do not forget to provide specs to your contribution.

### Running specs

```bash
$ npm install
$ npm test
```

## Coding guidelines

Follow [Felix](http://nodeguide.com/style.html) guidelines.

## License

Licensed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

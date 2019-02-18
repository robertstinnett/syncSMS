## Synopsis

**syncSMS** is a SMS/text messaging communications door originally designed for running under [Synchronet BBS Software](http://www.synchro.net).  It allows users to 
send text messages to the SysOp as a method of communicating with him/her without having to disclose the SysOp's cell number. It can also be used to create a SysOp page event so that the SysOp will get paged if a user intiates a chat session. 

This door requires an API key from [Twilio](https://twilio.com). 

It was originally written by Robert Stinnett aka dmxrob of [Gateway to the West BBS - bbs.dmxrob.net](telnet://bbs.dmxrob.net) as a way to get back into BBSing and learn more about Synchronet and Javascript.

The SysOp receives the message showing the username who sent it, the phone number the user provided and the message.


## Screenshots 

Door Mode:
![syncSMS Main Screen Shot](http://blog.dmxrob.net/wp-content/uploads/2019/02/syncSMS-2.0.png)

SysOp Page Event:
![sysSMS SysOp Page](http://blog.dmxrob.net/wp-content/uploads/2019/02/syncSMS-Sysop-Page-2.0.png)

## Installation

Check out [sysop.txt](https://github.com/robertstinnett/syncSMS/blob/master/sysop.txt) for full installation instructions.

## License

This project is under GNU License.
Please see the [LICENSE](https://github.com/robertstinnett/syncSMS/blob/master/LICENSE) file for the project.

## Revision History (change log)

1.00 (2019-02-17)
* First  release, here's hoping for the best!

2.00 (2019-02-18)
* Added ability for it to be used as a SysOp page event
* Changed page routine to be more modular.


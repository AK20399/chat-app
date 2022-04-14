//ignore_for_file:library_prefixes
//ignore_for_file:avoid_print
import 'dart:async';
import 'dart:developer';

import 'package:states_rebuilder/states_rebuilder.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:vato/constants/url_constants.dart';
import 'package:vato/model/message.dart';
import 'package:vato/screen/chat_screen/store/injected_messages.dart';

enum SocketConnectionState { loading, connected, disconnected, error }

final socketConnection = RM.inject<SocketConnection>(
  () => SocketConnection(),
  autoDisposeWhenNotUsed: false,
);

class SocketConnection {
  IO.Socket? socket;
  StreamController<SocketConnectionState> connectionState =
      StreamController<SocketConnectionState>()
        ..add(SocketConnectionState.disconnected);
  bool isTyping = false;

  Future<void> initSocketConnection() async {
    print('initSocketConnection');
    try {
      connectionState.add(SocketConnectionState.loading);
      socket = IO.io(
        UrlConstants.socketUrl,
        IO.OptionBuilder()
            .setTransports(['websocket'])
            .disableAutoConnect()
            .setReconnectionAttempts(3)
            .build(),
      );
      socket?.connect();
      listenSocketEvents();
    } catch (err) {
      print('SOCKET_CONNECTION > initSocketConnection');
      print(err);
    }
  }

  void listenSocketEvents() {
    socket?.onConnect(
      (_) {
        print(
            'SocketConnection > listenSocketEvents > onConnect :: socketId :${socket?.id}');
        connectionState.add(SocketConnectionState.connected);
        socket?.onAny((event, data) {
          log('EVENT : $event ,DATA : ${data.toString()}');
        });
      },
    );

    socket?.onDisconnect(
      (data) {
        print(
            'SocketConnection > listenSocketEvents > onDisconnect : data ::${data.toString()}');
        connectionState.add(SocketConnectionState.disconnected);

        if (data != 'io client disconnect') {
          //todo handle
          print('Disconnect from server');
        }
      },
    );

    socket?.onConnectError(
      (data) {
        print(
            'SocketConnection > listenSocketEvents > onConnectError : data ::${data.toString()}');
        connectionState.add(SocketConnectionState.error);
      },
    );

    socket?.onError(
      (data) {
        print(
            'SocketConnection > listenSocketEvents > onError : data ::${data.toString()}');
        connectionState.add(SocketConnectionState.error);
      },
    );
  }

  void _listenRoomEvents() {
    socket?.on('message', _handleMessageEvent);
    socket?.on('roomdata', _handleRoomDataEvent);
    socket?.on('usersTyping', _handleUserTypingEvent);
  }

  void sendJoinRoomEvent({
    required String displayName,
    required String room,
  }) {
    print('sendJoinRoomEvent :$displayName $room');
    try {
      Map<String, String> data = {
        'username': displayName,
        'room': room,
      };

      _emitEvent(
        event: 'join',
        data: data,
        callback: (error) {
          if (error != null) {
            //todo show developer error
            print(error);
          }
        },
      );
      _listenRoomEvents();
    } catch (err) {
      print('SocketConnection > sendJoinRoomEvent > error');
      print(err);
    }
  }

  //handle user messages
  void _handleMessageEvent(dynamic message) {
    print(
        'SocketConnection > _handleMessageEvent : message ::${message.toString()}');
    try {
      Map<String, dynamic> convertedMessage = {
        ...Map<String, dynamic>.from(message),
      };

      Message userMessage = Message.fromJson(convertedMessage);

      insertMessage(userMessage);
    } on FormatException {
      print('SocketConnection > _handleMessageEvent : Format Exception');
    } catch (err) {
      print('SocketConnection > _handleMessageEvent : error');
      print(err);
    }
  }

  void _handleRoomDataEvent(dynamic message) {
    print(
        'SocketConnection > _handleRoomDataEvent : message ::${message.toString()}');
    try {
      Map<String, dynamic> convertedMessage = {
        ...Map<String, dynamic>.from(message),
      };

      //todo
      print('convertedMessage.toString()');
      print(convertedMessage.toString());
    } on FormatException {
      print('SocketConnection > _handleRoomDataEvent : Format Exception');
    } catch (err) {
      print('SocketConnection > _handleRoomDataEvent : error');
      print(err);
    }
  }

  void _handleUserTypingEvent(dynamic data) {
    print(
        'SocketConnection > _handleUserTypingEvent : data ::${data.toString()}');
    try {
      List<dynamic> convertedData = List.from(data);

      List<String> users = <String>[];

      convertedData.forEach(
        (user) {
          Map<String, dynamic> userMap = {
            ...Map<String, dynamic>.from(user),
          };

          if (userMap['id'] != socket?.id) {
            users.add(userMap['username']);
          }
        },
      );

      typingUsers.setState((s) => [...users]);
    } on FormatException {
      print('SocketConnection > _handleUserTypingEvent : Format Exception');
    } catch (err) {
      print('SocketConnection > _handleUserTypingEvent : error');
      print(err);
    }
  }

  void insertMessage(
    Message message,
  ) async {
    injectedMessages.setState(
      (s) {
        List<Message> messages = [...injectedMessages.state];
        messages.insert(0, message);
        return messages;
      },
    );
  }

  void _emitEvent({
    required String event,
    dynamic data,
    Function? callback,
  }) {
    try {
      if (callback != null) {
        socket?.emitWithAck(event, data, ack: callback);
      } else {
        socket?.emit(event, data);
      }
    } catch (err) {
      print('SocketConnection > _emitEvent > error');
      print(err);
    }
  }

  void sendMessage({
    required String message,
  }) {
    print('SocketConnection > sendMessage :: Message : $message');
    try {
      _emitEvent(
        event: 'sendMessage',
        data: message,
        callback: (error) {
          if (error != null) {
            //todo show developer error
            print(error);
          }
        },
      );

      if (isTyping) {
        sendTypingEvent(isTyping: false);
      }
    } catch (err) {
      print('SocketConnection > sendMessage > error');
      print(err);
    }
  }

  void sendTypingEvent({
    required bool isTyping,
  }) {
    print('SocketConnection > sendTypingEvent :: isTyping : $isTyping');
    this.isTyping = isTyping;
    try {
      _emitEvent(
        event: 'typing',
        data: isTyping,
      );
    } catch (err) {
      print('SocketConnection > sendTypingEvent > error');
      print(err);
    }
  }

  void closeSocketConnection() {
    print('SocketConnection > closeSocketConnection');
    socket?.close();
  }
}

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:vato/constants/color_constants.dart';
import 'package:vato/screen/chat_screen/store/socket_connection.dart';
import 'package:vato/utils/extention.dart';

class ChatInput extends StatefulWidget {
  const ChatInput({Key? key}) : super(key: key);

  @override
  State<ChatInput> createState() => _ChatInputState();
}

class _ChatInputState extends State<ChatInput> {
  late TextEditingController controller;
  late FocusNode focusNode;

  @override
  void initState() {
    super.initState();
    controller = TextEditingController();
    focusNode = FocusNode();

    focusNode.addListener(_sendTypingEvent);
  }

  @override
  void dispose() {
    controller.dispose();
    focusNode.removeListener(_sendTypingEvent);
    focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: ColorConstants.black,
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(32.0),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.grey,
            blurRadius: 10,
            spreadRadius: 1,
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 24.0,
                vertical: 16.0,
              ),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(
                  top: Radius.circular(32.0),
                ),
              ),
              child: TextField(
                focusNode: focusNode,
                controller: controller,
                decoration: const InputDecoration.collapsed(
                  hintText: 'Type Message Here',
                ),
                style: GoogleFonts.raleway(
                  fontSize: 18.0,
                ),
                cursorColor: ColorConstants.purple,
              ),
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: 14.0,
              vertical: 8.0,
            ),
            decoration: const BoxDecoration(
              color: ColorConstants.black,
              borderRadius: BorderRadius.only(
                topRight: Radius.circular(32.0),
              ),
            ),
            child: const Center(
              child: Icon(
                Icons.send,
                color: Colors.white,
              ),
            ),
          ).ripple(
            sendMessage,
            borderRadius: BorderRadius.circular(42.0),
          ),
        ],
      ),
    );
  }

  void _sendTypingEvent() {
    socketConnection.state.sendTypingEvent(isTyping: focusNode.hasFocus);
  }

  void sendMessage() {
    if (controller.text.trim().isNotEmpty) {
      socketConnection.state.sendMessage(message: controller.text.trim());

      controller.clear();
      focusNode.unfocus();
    }
  }
}

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:states_rebuilder/scr/state_management/rm.dart';
import 'package:vato/screen/chat_screen/store/injected_messages.dart';
import 'package:vato/widgets/center_message_bubble/center_message_bubble.dart';
import 'package:vato/widgets/chat_input.dart';
import '../../constants/color_constants.dart';
import '../../model/message.dart';
import '../../service/app_state/app_state.dart';
import '../../widgets/chat_bubble/chat_bubble.dart';

class ChatScreen extends StatelessWidget {
  const ChatScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        FocusScope.of(context).unfocus();
      },
      child: Scaffold(
        backgroundColor: ColorConstants.lightGrey,
        appBar: AppBar(
          backgroundColor: ColorConstants.lightGrey,
          elevation: 0.0,
          centerTitle: true,
          leading: IconButton(
            onPressed: () {
              RM.navigate.back();
            },
            icon: const Icon(
              CupertinoIcons.back,
              color: ColorConstants.black,
            ),
          ),
          title: Text(
            'Mini Chat',
            style: GoogleFonts.raleway(
              fontSize: 22.0,
              color: ColorConstants.black,
            ),
          ),
        ),
        body: Column(
          children: [
            Expanded(
              child: OnBuilder<List<Message>>.orElse(
                listenTo: injectedMessages,
                orElse: (state) {
                  return Scrollbar(
                    controller: chatMessagesScroll.controller,
                    isAlwaysShown: true,
                    interactive: true,
                    radius: const Radius.circular(24.0),
                    child: ListView.builder(
                      reverse: true,
                      controller: chatMessagesScroll.controller,
                      itemCount: injectedMessages.state.length,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8.0,
                        vertical: 4.0,
                      ),
                      itemBuilder: (context, index) {
                        Message message = injectedMessages.state[index];

                        if (message.username?.toLowerCase() == 'admin') {
                          return CenterMessageBubble(text: message.text!);
                        }

                        return ChatBubble(
                          isMyMessage: injectedAppState.state.displayName ==
                              message.username!,
                          createdAt: message.createdAt!,
                          text: message.text!,
                          user: message.username!,
                        );
                      },
                    ),
                  );
                },
              ),
            ),
            OnBuilder(
              listenTo: typingUsers,
              builder: () {
                if (typingUsers.state.isEmpty) {
                  return const SizedBox();
                }

                return Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24.0,
                    vertical: 4.0,
                  ),
                  child: Row(
                    children: [
                      const SpinKitThreeBounce(
                        color: ColorConstants.black,
                        size: 12.0,
                      ),
                      const SizedBox(
                        width: 4.0,
                      ),
                      Expanded(
                        child: RichText(
                          text: TextSpan(
                            text: '',
                            style: GoogleFonts.openSans(
                              color: ColorConstants.black,
                            ),
                            children: [
                              TextSpan(
                                text: typingUsers.state.join(','),
                                style: GoogleFonts.openSans(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              TextSpan(
                                text:
                                    ' ${typingUsers.state.length > 1 ? 'are' : 'is'} typing....',
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
            const ChatInput(),
          ],
        ),
      ),
    );
  }
}

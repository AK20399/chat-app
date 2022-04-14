import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:vato/constants/color_constants.dart';

class ChatBubble extends StatelessWidget {
  final bool isMyMessage;
  final String text;
  final String user;
  final int createdAt;

  const ChatBubble({
    Key? key,
    required this.createdAt,
    required this.user,
    this.isMyMessage = false,
    required this.text,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment:
          !isMyMessage ? MainAxisAlignment.start : MainAxisAlignment.end,
      children: [
        Expanded(
          child: Stack(
            alignment: Alignment.topLeft,
            children: [
              Align(
                alignment:
                    !isMyMessage ? Alignment.centerLeft : Alignment.centerRight,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12.0,
                        vertical: 10.0,
                      ),
                      margin: !isMyMessage
                          ? const EdgeInsets.only(top: 16.0)
                          : null,
                      decoration: BoxDecoration(
                        color: !isMyMessage
                            ? Colors.white
                            : ColorConstants.darkPurple,
                        borderRadius: BorderRadius.only(
                          bottomLeft: const Radius.circular(24.0),
                          bottomRight: const Radius.circular(24.0),
                          topRight: !isMyMessage
                              ? const Radius.circular(24.0)
                              : const Radius.circular(0.0),
                          topLeft: isMyMessage
                              ? const Radius.circular(24.0)
                              : const Radius.circular(0.0),
                        ),
                      ),
                      child: Text(
                        text,
                        style: GoogleFonts.raleway(
                          color:
                              isMyMessage ? Colors.white : ColorConstants.black,
                          letterSpacing: 1.5,
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(top: 2.0, right: 2.0),
                      child: Text(
                        DateFormat.jm().format(
                          DateTime.fromMillisecondsSinceEpoch(
                            createdAt,
                          ).toLocal(),
                        ),
                        style: GoogleFonts.lato(
                          fontSize: 9.0,
                        ),
                      ),
                    )
                  ],
                ),
              ),
              if (!isMyMessage)
                Positioned(
                  top: 4.0,
                  left: 4.0,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      vertical: 2.0,
                      horizontal: 6.0,
                    ),
                    decoration: BoxDecoration(
                      color: ColorConstants.black,
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                    child: Text(
                      user,
                      style: GoogleFonts.openSans(
                        fontSize: 10.0,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}
